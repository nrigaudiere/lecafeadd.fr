import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  MantineProvider,
  NumberInput,
  Paper,
  Radio,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  VisuallyHidden,
  createTheme,
} from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { useState } from 'react'

import '@mantine/core/styles.css'
import './MembershipForm.css'

const CHEQUE_ORDER = 'Association Café associatif de Droue sur Drouette'
const IBAN = 'FR76 1440 6001 3590 0300 4190 842'
const BIC = 'AGRIFRPP844'
const HELLOASSO_URL =
  'https://www.helloasso.com/associations/association-cafe-associatif-de-droue-sur-drouette/adhesions/adhesion-2026'
const PDF_URL = '/assets/documents/BULLETIN%20ADHESION%20-%202026.pdf'

const PAYMENT_LABELS = {
  cash: 'Espèces',
  cheque: 'Chèque bancaire',
  transfer: 'Virement bancaire',
  card: 'Carte bancaire',
} as const

interface MembershipValues {
  firstName: string
  lastName: string
  address: string
  phone: string
  email: string
  membershipType: 'new' | 'renewal' | ''
  donation: number | string
  paymentMethod: keyof typeof PAYMENT_LABELS | ''
  photoConsent: 'yes' | 'no' | ''
  rgpd: boolean
  signature: boolean
  website: string
}

const theme = createTheme({
  colors: {
    cafe: [
      '#ecf2f8',
      '#c4d3f7',
      '#96b5e1',
      '#6993cd',
      '#3f74c6',
      '#1556ac',
      '#124b97',
      '#0d3a77',
      '#0a2b57',
      '#071c3a',
    ],
  },
  primaryColor: 'cafe',
  fontFamily: 'var(--theme-font-family-sans)',
})

function PaymentInfo({ method }: { method: MembershipValues['paymentMethod'] }) {
  if (method === 'cash') {
    return <Text c="dimmed">À remettre en main propre au café lors de votre prochaine visite.</Text>
  }
  if (method === 'cheque') {
    return (
      <Text c="dimmed" size="sm">
        Chèque à l'ordre de « {CHEQUE_ORDER} », à déposer au café ou dans la boîte à lettres au 1, rue de Chaleine à
        Droue.
      </Text>
    )
  }
  if (method === 'transfer') {
    return (
      <Stack gap={2}>
        <Text size="sm" c="dimmed">
          Virement au profit de l'association :
        </Text>
        <Text size="sm" fw={500} style={{ fontFamily: 'var(--mantine-font-family-monospace)' }}>
          IBAN : {IBAN}
        </Text>
        <Text size="sm" fw={500} style={{ fontFamily: 'var(--mantine-font-family-monospace)' }}>
          BIC : {BIC}
        </Text>
        <Text size="sm" c="dimmed">
          Indiquez vos nom et prénom dans le libellé du virement.
        </Text>
      </Stack>
    )
  }
  if (method === 'card') {
    return (
      <Text size="sm">
        Paiement en ligne sur{' '}
        <Anchor href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer">
          HelloAsso
        </Anchor>
      </Text>
    )
  }
  return null
}
function SuccessView({ values }: { values: MembershipValues }) {
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  return (
    <Stack align="center" ta="center" py="xl" gap="sm">
      <Text fz={34} fw={700} c="green.5">
        ✓
      </Text>
      <Text size="lg" fw={700}>
        Merci {values.firstName} !
      </Text>
      <Text c="dimmed" size="sm">
        Votre bulletin d'adhésion a été transmis au bureau de l'association le {date}.
      </Text>
      <Divider w="100%" my="xs" label="Pour finaliser votre adhésion" labelPosition="center" />
      <PaymentInfo method={values.paymentMethod} />
      <Anchor href={PDF_URL} target="_blank" rel="noopener noreferrer" size="sm">
        Télécharger le bulletin papier (PDF)
      </Anchor>
      <Text c="dimmed" size="sm">
        Un membre du bureau validera votre bulletin dès réception.
      </Text>
    </Stack>
  )
}

export default function MembershipForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const form = useForm<MembershipValues>({
    mode: 'controlled',
    initialValues: {
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      email: '',
      membershipType: '',
      donation: '',
      paymentMethod: '',
      photoConsent: '',
      rgpd: false,
      signature: false,
      website: '',
    },
    validate: {
      firstName: value => (value.trim().length >= 2 ? null : 'Veuillez saisir votre prénom'),
      lastName: value => (value.trim().length >= 2 ? null : 'Veuillez saisir votre nom'),
      address: value => (value.trim().length >= 5 ? null : 'Veuillez saisir votre adresse'),
      phone: value => (/^[+0-9][\d\s()./-]{6,}$/.test(value.trim()) ? null : 'Numéro de téléphone invalide'),
      email: isEmail('Adresse email invalide'),
      membershipType: value => (value ? null : 'Veuillez choisir une option'),
      donation: value =>
        value === '' || (Number.isFinite(Number(value)) && Number(value) > 0) ? null : 'Montant du don invalide',
      paymentMethod: value => (value ? null : 'Veuillez choisir un mode de règlement'),
      photoConsent: value => (value ? null : 'Veuillez choisir une option'),
      rgpd: value => (value ? null : 'Votre consentement est requis'),
      signature: value => (value ? null : 'Votre signature est requise'),
    },
  })

  const handleSubmit = form.onSubmit(async values => {
    setStatus('sending')
    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  })

  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <Paper withBorder shadow="sm" radius="lg" p={{ base: 'md', sm: 'xl' }}>
        {status === 'success' ? (
          <SuccessView values={form.values} />
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Stack gap="md">
              <Stack gap={2}>
                <Text fw={700} c="var(--theme-primary)">
                  Bulletin d'adhésion 2025-2026
                </Text>
                <Text size="sm" c="dimmed">
                  Association Café Associatif de Droue sur Drouette
                </Text>
                <Text size="sm" c="dimmed">
                  N° RNA : W281010322
                </Text>
              </Stack>

              <Divider label="Vos coordonnées" labelPosition="left" />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput label="Prénom" placeholder="Jean" withAsterisk {...form.getInputProps('firstName')} />
                <TextInput label="Nom" placeholder="Dupont" withAsterisk {...form.getInputProps('lastName')} />
              </SimpleGrid>
              <Textarea
                label="Adresse"
                placeholder="1 rue de Chaleine, 28230 Droue sur Drouette"
                autosize
                minRows={2}
                withAsterisk
                {...form.getInputProps('address')}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  type="tel"
                  label="Téléphone"
                  placeholder="02 37 18 08 25"
                  withAsterisk
                  {...form.getInputProps('phone')}
                />
                <TextInput
                  type="email"
                  label="Email"
                  placeholder="jean.dupont@example.com"
                  withAsterisk
                  {...form.getInputProps('email')}
                />
              </SimpleGrid>
              <Divider label="Votre adhésion" labelPosition="left" />
              <Radio.Group label="Type d'adhésion" withAsterisk {...form.getInputProps('membershipType')}>
                <Stack gap={4} mt="xs">
                  <Radio value="new" label="Je suis un nouveau membre" />
                  <Radio value="renewal" label="Je renouvelle mon adhésion" />
                </Stack>
              </Radio.Group>
              <Group justify="space-between" px="md" py="xs" bg="gray.0">
                <Text size="sm">Cotisation annuelle</Text>
                <Text fw={700}>10 €</Text>
              </Group>
              <NumberInput
                label="Don en soutien de l'association"
                description="Facultatif mais bienvenu"
                placeholder="5"
                suffix=" €"
                min={1}
                step={1}
                allowDecimal={false}
                clampBehavior="strict"
                {...form.getInputProps('donation')}
              />

              <Divider label="Votre règlement" labelPosition="left" />
              <Radio.Group label="Mode de règlement" withAsterisk {...form.getInputProps('paymentMethod')}>
                <Stack gap={4} mt="xs">
                  {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                    <Radio key={value} value={value} label={label} />
                  ))}
                </Stack>
              </Radio.Group>
              <PaymentInfo method={form.values.paymentMethod} />

              <Divider label="Communication et confidentialité" labelPosition="left" />
              <Radio.Group
                label="J'accepte que ma photo puisse paraître sur les supports de communication de l'association"
                withAsterisk
                {...form.getInputProps('photoConsent')}
              >
                <Group mt="xs" gap="xl">
                  <Radio value="yes" label="Oui" />
                  <Radio value="no" label="Non" />
                </Group>
              </Radio.Group>
              <Checkbox
                label="J'autorise l'association « Le Café ADD » à utiliser les informations de ce formulaire dans l'unique but de communiquer avec moi par courrier postal ou par email (RGPD n° 2016/679)."
                {...form.getInputProps('rgpd', { type: 'checkbox' })}
              />

              <Divider label="Date et signature" labelPosition="left" />
              <Checkbox
                label="Je certifie avoir lu et approuvé le présent bulletin d'adhésion."
                {...form.getInputProps('signature', { type: 'checkbox' })}
              />

              <VisuallyHidden>
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.values.website}
                  onChange={event => form.setFieldValue('website', event.currentTarget.value)}
                />
              </VisuallyHidden>

              <Button type="submit" fullWidth size="md" loading={status === 'sending'}>
                Envoyer mon adhésion
              </Button>

              {status === 'error' && (
                <Alert color="red" variant="light" title="Envoi impossible">
                  Une erreur est survenue lors de l'envoi du bulletin. Veuillez réessayer dans quelques instants.
                </Alert>
              )}
            </Stack>
          </form>
        )}
      </Paper>
    </MantineProvider>
  )
}
