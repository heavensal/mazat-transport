export const business = {
  name: 'MAZAT Transport Déménagement',
  googlePlaceId: 'ChIJ7WvR7za_yRIRddVA_CCPQcE',
  legalName: 'MAZAT TRANSPORT',
  phone: '07 62 29 88 14',
  phoneHref: 'tel:+33762298814',
  email: 'contact@mazat-transport.fr',
  address: '44 Avenue Vincent-Van-Gogh',
  postalCode: '13012',
  city: 'Marseille',
  mapsUrl: 'https://maps.app.goo.gl/jFAxmPywYyr9jbQY9',
  representative: 'Jérémy Mazari',
  legal: {
    siren: '952 688 554',
    siret: '952 688 554 00072',
    capital: '6 300 €',
    vat: 'FR56 952 688 554',
    euid: 'FR0605.952688554',
    rcs: '952 688 554 R.C.S. NICE',
    rn: 'Inscrit au RNE depuis le 24 mai 2023',
    legalForm: 'EURL',
    activity: 'Transports routiers de fret interurbains — code NAF/APE 49.41A',
  },
  hosting: {
    name: 'GitHub Pages',
    operator: 'GitHub, Inc.',
    address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, États-Unis',
  },
  developer: {
    name: '1344 Solutions',
    contact: 'Adam Lamouri',
    phone: '06 13 67 61 79',
    phoneHref: 'tel:+33613676179',
    email: 'adamlamouri@1344.fr',
    website: 'https://1344.fr',
  },
  domain: 'mazat-transport.fr',
  domainUrl: 'https://mazat-transport.fr',
  reviewsUrl:
    'https://www.demenagement24.com/demenageurs/NzWxg/mazat-transports-demenagement/',
};
export const siteUrl = import.meta.env.SITE_URL || '';
export const publicationReady =
  import.meta.env.PUBLICATION_READY === 'true' && !!siteUrl;
export const navigation = [
  { href: '/', label: 'Accueil' },
  { href: '/formules/', label: 'Nos formules' },
  { href: '/international-maritime/', label: 'International & maritime' },
  { href: '/services/', label: 'Nos services' },
  { href: '/realisations-avis/', label: 'Réalisations & avis' },
];
