interface Env {
  BREVO_API_KEY: string
}

interface JoinPayload {
  firstName: string
  lastName: string
  address: string
  phone: string
  email: string
  membershipType: string
  donation: string | number
  paymentMethod: string
  photoConsent: string
  rgpd: boolean
  signature: boolean
  website: string
}

const TO_EMAIL = 'lecafeadd@gmail.com'
const MAX_BODY_BYTES = 8 * 1024

const MEMBERSHIP_LABELS: Record<string, string> = {
  new: 'Nouveau membre',
  renewal: "Renouvellement d'adhésion",
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Espèces',
  cheque: 'Chèque bancaire',
  transfer: 'Virement bancaire',
  card: 'Carte bancaire',
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&' + 'amp;',
  '<': '&' + 'lt;',
  '>': '&' + 'gt;',
  '"': '&' + 'quot;',
  "'": '&' + '#39;',
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => HTML_ESCAPES[char] ?? char)
}

function validationErrors(payload: JoinPayload): string[] {
  const errors: string[] = []
  const stringField = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

  if (stringField(payload.firstName).length < 2 || stringField(payload.firstName).length > 100) {
    errors.push('Prénom invalide')
  }
  if (stringField(payload.lastName).length < 2 || stringField(payload.lastName).length > 100) {
    errors.push('Nom invalide')
  }
  if (stringField(payload.address).length < 5 || stringField(payload.address).length > 500) {
    errors.push('Adresse invalide')
  }
  if (!/^[+0-9][\d\s()./-]{6,}$/.test(stringField(payload.phone)) || stringField(payload.phone).length > 30) {
    errors.push('Téléphone invalide')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringField(payload.email)) || stringField(payload.email).length > 254) {
    errors.push('Email invalide')
  }
  if (!(payload.membershipType in MEMBERSHIP_LABELS)) {
    errors.push("Type d'adhésion invalide")
  }
  if (!(payload.paymentMethod in PAYMENT_LABELS)) {
    errors.push('Mode de règlement invalide')
  }
  if (payload.photoConsent !== 'yes' && payload.photoConsent !== 'no') {
    errors.push('Consentement photo invalide')
  }
  if (!payload.rgpd) {
    errors.push('Consentement RGPD requis')
  }
  if (!payload.signature) {
    errors.push('Signature requise')
  }
  const donation = payload.donation === undefined || payload.donation === null ? '' : payload.donation
  if (donation !== '' && !(Number.isFinite(Number(donation)) && Number(donation) > 0)) {
    errors.push('Montant du don invalide')
  }
  return errors
}
async function sendBrevoEmail(apiKey: string, payload: JoinPayload): Promise<Response> {
  const fullName = `${payload.firstName} ${payload.lastName}`.trim()
  const donation =
    payload.donation === undefined || payload.donation === null || payload.donation === ''
      ? null
      : `${Number(payload.donation)} €`
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  })

  const rows: Array<[string, string]> = [
    ['Nom', payload.lastName],
    ['Prénom', payload.firstName],
    ['Adresse', payload.address],
    ['Téléphone', payload.phone],
    ['Email', payload.email],
    ['Adhésion', MEMBERSHIP_LABELS[payload.membershipType]],
    ['Cotisation annuelle', '10 €'],
    ['Don', donation ?? '—'],
    ['Règlement', PAYMENT_LABELS[payload.paymentMethod]],
    ['Photo sur les supports de communication', payload.photoConsent === 'yes' ? 'OUI' : 'NON'],
    ['Consentement RGPD', 'Accepté'],
    ['Signature électronique', 'Lu et approuvé'],
    ['Reçu le', date],
  ]

  const htmlRows = rows
    .map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`)
    .join('')
  const htmlContent = `<h2>Bulletin d'adhésion 2025-2026</h2><p>Association Café Associatif de Droue sur Drouette — N° RNA : W281010322</p><table border="1" cellpadding="6" cellspacing="0">${htmlRows}</table>`
  const textContent = rows.map(([label, value]) => `${label} : ${value}`).join('\n')

  return fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Site Le Café ADD', email: TO_EMAIL },
      to: [{ email: TO_EMAIL, name: 'Le Café ADD' }],
      replyTo: { email: payload.email, name: fullName },
      subject: `Adhésion en ligne — ${fullName}`,
      htmlContent,
      textContent,
    }),
    signal: AbortSignal.timeout(10_000),
  })
}

export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  const { request, env } = context

  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'Requête trop volumineuse' }, 413)
  }

  let payload: JoinPayload
  try {
    payload = JSON.parse(raw) as JoinPayload
  } catch {
    return json({ ok: false, error: 'Requête invalide' }, 400)
  }

  // Honeypot: a filled hidden field means a bot, answer success without sending anything.
  if (typeof payload.website === 'string' && payload.website !== '') {
    return json({ ok: true }, 200)
  }

  const errors = validationErrors(payload)
  if (errors.length > 0) {
    return json({ ok: false, errors }, 400)
  }

  if (!env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured on the /api/join function')
    return json({ ok: false, error: 'Service non configuré' }, 500)
  }

  try {
    const response = await sendBrevoEmail(env.BREVO_API_KEY, payload)
    if (!response.ok) {
      console.error(`Brevo request failed with status ${response.status}: ${await response.text()}`)
      return json({ ok: false, error: "Échec de l'envoi de l'email" }, 502)
    }
  } catch (error) {
    console.error(`Brevo request error: ${error instanceof Error ? error.message : error}`)
    return json({ ok: false, error: "Échec de l'envoi de l'email" }, 502)
  }

  return json({ ok: true }, 200)
}
