export const business = {
  name: 'MAZAT Transport Déménagement',
  phone: '07 62 29 88 14', phoneHref: 'tel:+33762298814',
  email: 'mazat.transports.demenagement@gmail.com',
  reviewsUrl: 'https://www.demenagement24.com/demenageurs/NzWxg/mazat-transports-demenagement/',
};
export const siteUrl = import.meta.env.SITE_URL || '';
export const publicationReady = import.meta.env.PUBLICATION_READY === 'true' && !!siteUrl;
export const navigation = [
  { href: '/', label: 'Accueil' }, { href: '/formules/', label: 'Nos formules' },
  { href: '/export-maritime/', label: 'International & maritime' },
  { href: '/services/', label: 'Nos services' }, { href: '/realisations-avis/', label: 'Réalisations & avis' },
];
