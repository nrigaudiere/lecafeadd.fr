import type { TimelineItem } from '@types/Timeline.type'

export const aboutDetails = {
  title: 'A propos',
  description: `L'association CAFE ASSOCIATIF DE DROUE SUR DROUETTE a pour objet de :

  - Animer ce café associatif en partenariat avec les habitants et les associations de Droue et des environs.
  - Permettre des rencontres, des échanges et des activités socio-culturelles, dans la tolérance et le respect des autres.
  - Proposer des services répondant à la demande de la population locale, définis par l’association, en fonction des possibilités et acceptés par le Conseil d’administration, puis ratifiés par l’assemblée générale.
  - Proposer aux associations, aux artistes, …un lieu d'épanouissement, d'activités et d'initiatives.
  - Valoriser les activités locales (artisans, commerce, agriculture…) et toute activité d’intérêt général avec des partenaires de proximité.`,
  imgUrl: '/assets/images/about.png',
  timelineItems: [
    {
      date: '22 mars 2024',
      title: 'AG Constitutive',
      description: "Création de l'association du café associatif de Droue sur Drouette",
    },
    {
      date: '22 janvier 2025',
      title: 'Début des travaux',
      description: 'Les travaux de création du café sont démarrés afin de préparer le lieu fourni par la mairie.',
    },
    {
      date: '05 octobre 2025',
      title: 'Journée portes ouvertes',
      description: "L'association est présentée aux adhérents ainsi qu'aux habitants du village.",
    },
  ] satisfies TimelineItem[],
}
