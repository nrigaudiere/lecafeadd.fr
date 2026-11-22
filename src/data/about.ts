import type { TimelineItem } from '@types/Timeline.type'

export const aboutDetails = {
  title: 'A propos',
  mission: {
    intro: "L'association CAFE ASSOCIATIF DE DROUE SUR DROUETTE a pour objet de :",
    goals: [
      'Animer ce café associatif en partenariat avec les habitants et les associations de Droue et des environs.',
      'Permettre des rencontres, des échanges et des activités socio-culturelles, dans la tolérance et le respect des autres.',
      'Proposer des services répondant à la demande de la population locale, définis par l’association, en fonction des possibilités et acceptés par le Conseil d’administration, puis ratifiés par l’assemblée générale.',
      "Proposer aux associations, aux artistes… un lieu d'épanouissement, d'activités et d'initiatives.",
      'Valoriser les activités locales (artisans, commerce, agriculture…) et toute activité d’intérêt général avec des partenaires de proximité.',
    ],
  },
  imgUrl: '/assets/images/about/main.png',
  timelineItems: [
    {
      date: '22 mars 2024',
      title: 'AG Constitutive',
      description: "Création de l'association du café associatif de Droue sur Drouette",
    },
    {
      date: '2024 – 2025',
      title: 'Formalités',
      description: "Statuts, convention, assurances… puis travaux d'aménagement du lieu.",
    },
    {
      date: '22 janvier 2025',
      title: 'Début des travaux',
      description:
        'Les travaux de création du café ont démarré afin de préparer le lieu fourni par la mairie. Premier bilan : déplacement des encombrants, terrassement / aplanissement du terrain, démolition du plafond du réfectoire...',
    },
    {
      date: '05 octobre 2025',
      title: 'Journée portes ouvertes',
      description: "L'association est présentée aux adhérents ainsi qu'aux habitants du village.",
    },
  ] satisfies TimelineItem[],
  associationCards: [
    {
      title: 'Pourquoi ?',
      description:
        'Créer du lien social en favorisant les rencontres, les échanges et les activités (pétanque, fléchettes, musique, expositions, jeux de cartes, conférences, œnologie, astronomie, gastronomie…).',
    },
    {
      title: 'Quoi ?',
      description: 'Un endroit convivial pour se rencontrer et prendre une consommation.',
    },
    {
      title: 'Qui ?',
      description:
        'Une association pilotée par un conseil d’administration de 10 personnes en partenariat avec la Mairie.',
    },
  ],
  keyFigures: [
    {
      value: '110',
      title: 'Adhérents en 2026',
    },
    {
      value: '10',
      title: 'Bénévoles',
      description: 'participants aux travaux',
    },
    {
      value: '2',
      title: 'Lieux',
      description: 'selon la saison',
    },
  ],
  venueCards: [
    {
      title: 'Printemps / été',
      description: '1, rue de Chaleine : jardin et anciens ateliers municipaux… non chauffés.',
    },
    {
      title: 'Automne / hiver',
      description: 'Salle du pré aux pommes.',
    },
    {
      title: 'Fréquence d’ouverture',
      description:
        '1er samedi du mois pour commencer. Dates variables selon les évènements, en fonction du nombre de bénévoles disponibles.',
    },
  ],
  contact: {
    email: 'lecafeadd@gmail.com',
    website: 'www.lecafeadd.fr',
  },
}
