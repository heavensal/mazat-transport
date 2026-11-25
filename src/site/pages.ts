export const pages = [
  {
    id: 'offers',
    slug: 'formules',
    title: 'Formules de déménagement Éco, Standard, Premium & Luxe | MAZAT',
    heading: 'Votre déménagement.\nVotre formule.',
    description:
      'Comparez les cinq formules MAZAT : Économique, Éco+, Standard, Premium et Luxe / VIP. Des prestations définies dans votre devis personnalisé.',
    intro:
      'Du transport de cartons déjà préparés à la remise en place de vos placards : choisissez le niveau d’accompagnement qui vous ressemble.',
    eyebrow: 'Cinq façons de vous accompagner',
  },
  {
    id: 'export',
    slug: 'international-maritime',
    title: 'Déménagement maritime international & conteneur | MAZAT',
    heading: 'Un nouvel horizon.\nLa même exigence.',
    description:
      'MAZAT Export Maritime : groupage, conteneur dédié et service porte-à-porte selon contrat. Étude personnalisée du volume et de la destination.',
    intro:
      'Vos effets personnels voyagent loin. Notre exigence reste la même. Préparons votre expédition maritime vers l’étranger ou les DOM, selon la faisabilité de votre projet.',
    eyebrow: 'MAZAT Export Maritime',
  },
  {
    id: 'services',
    slug: 'services',
    title: 'Services de déménagement, stockage & manutention | MAZAT',
    heading: 'À chaque besoin,\nune solution étudiée.',
    description:
      'Stockage, monte-meubles, piano, emballage, cartons et nettoyage sur demande : les services MAZAT adaptés à votre déménagement.',
    intro:
      'Un accès difficile, un meuble particulier, un intervalle entre deux adresses ? Nous étudions les moyens et les options adaptés à votre situation.',
    eyebrow: 'Services à la carte',
  },
  {
    id: 'business',
    slug: 'entreprises',
    title: 'Déménagement de bureaux et entreprises | MAZAT',
    heading: 'Votre activité change\nd’adresse.',
    description:
      'MAZAT accompagne les transferts de bureaux, équipements informatiques et archives. Organisation, protection et étiquetage selon votre devis.',
    intro:
      'Préparez votre transfert avec une organisation adaptée aux locaux, au mobilier, aux archives et au matériel à déplacer.',
    eyebrow: 'Entreprises & professionnels',
  },
  {
    id: 'marseille',
    slug: 'demenagement-marseille',
    title: 'Déménagement à Marseille – devis sur mesure | MAZAT',
    heading: 'Votre prochain départ,\nà Marseille.',
    description:
      'Déménagement à Marseille, Aix-en-Provence, Aubagne, La Ciotat et Martigues. MAZAT étudie vos accès, votre volume et votre formule.',
    intro:
      'Au départ ou à destination de Marseille et des Bouches-du-Rhône, préparez votre déménagement avec une prestation adaptée à vos accès et à votre budget.',
    eyebrow: 'Marseille & Bouches-du-Rhône',
  },
  {
    id: 'nice',
    slug: 'demenagement-nice',
    title: 'Déménageur Nice et Alpes-Maritimes | MAZAT',
    heading: 'Un nouveau départ\nsur la Côte d’Azur.',
    description:
      'Déménagement à Nice, Cannes, Antibes et dans les Alpes-Maritimes. MAZAT accompagne vos trajets locaux, nationaux et internationaux selon faisabilité.',
    intro:
      'Un appartement à Nice, un départ depuis Antibes ou un emménagement à Cannes : nous étudions votre parcours dans les Alpes-Maritimes et au-delà.',
    eyebrow: 'Nice & Alpes-Maritimes',
  },
  {
    id: 'quote',
    slug: 'devis',
    title: 'Demander un devis de déménagement gratuit | MAZAT',
    heading: 'Parlons de votre\nprochain départ.',
    description:
      'Préparez votre demande de devis MAZAT : formule, adresses, accès, volume et coordonnées. Devis personnalisé pour la France et l’export.',
    intro:
      'Quelques informations pour comprendre votre besoin et préparer une étude personnalisée. Aucun tarif automatique : chaque projet mérite son devis.',
    eyebrow: 'Votre demande de devis gratuit',
  },
  {
    id: 'legal',
    slug: 'mentions-legales',
    title: 'Mentions légales | MAZAT Transport',
    heading: 'Mentions légales',
    description:
      'Identité de l’éditeur, informations légales, hébergement et coordonnées de MAZAT Transport.',
    intro:
      'Informations légales relatives à l’exploitation du site mazat-transport.fr.',
    eyebrow: 'Informations du site',
  },
  {
    id: 'privacy',
    slug: 'confidentialite',
    title: 'Confidentialité des données | MAZAT',
    heading: 'Vos données personnelles.',
    description:
      'Fonctionnement du formulaire de préparation de demande MAZAT et informations sur les données saisies.',
    intro:
      'Comprendre ce que fait cette version du site avec les informations que vous saisissez.',
    eyebrow: 'Confidentialité',
  },
  {
    id: 'cookies',
    slug: 'cookies',
    title: 'Cookies et traceurs | MAZAT',
    heading: 'Cookies et services externes.',
    description:
      'Informations sur la navigation MAZAT et la suggestions d’adresse Google.',
    intro:
      'Le site n’ajoute pas de mesure d’audience ou de publicité. Les suggestions Google se chargent pendant la saisie d’une adresse ; les avis Google sont chargés sur l’accueil.',
    eyebrow: 'Cookies',
  },
  {
    id: 'terms',
    slug: 'conditions',
    title: 'Conditions & médiation — préparation | MAZAT',
    heading: 'Un périmètre clair,\nconsigné au devis.',
    description:
      'Informations sur la demande et le devis MAZAT. CGV, assurance et médiation à confirmer avant publication.',
    intro:
      'Une demande d’étude ne constitue ni une réservation ni un devis contractuel.',
    eyebrow: 'Conditions & médiation',
  },
] as const;

export type RegisteredContentPage = (typeof pages)[number];
export type RegisteredPageId = RegisteredContentPage['id'];

export function getPage(id: RegisteredPageId): RegisteredContentPage {
  const page = pages.find((candidate) => candidate.id === id);
  if (!page) {
    throw new Error(`Unknown registered page: ${id}`);
  }
  return page;
}

export const homePage = {
  id: 'home',
  title: 'Déménageur Marseille, PACA & International | MAZAT',
  description:
    'MAZAT accompagne votre déménagement à Marseille, en PACA, en France et à l’international. Cinq formules, protection soignée et devis personnalisé.',
} as const;

export const notFoundPage = {
  id: 'not-found',
  title: 'Page introuvable | MAZAT',
  description:
    'Cette page n’existe pas. Retrouvez les services et les formules de déménagement MAZAT.',
  noindex: true,
} as const;
