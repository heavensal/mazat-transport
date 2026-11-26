# MAZAT TRANSPORT — Modifications à réaliser

Liste des modifications demandées ; aucune réalisation présumée.

## Page d’accueil

- [ ] Refaire le design des formules.
- [ ] Ajouter une image de fond avec des cartons pour la section « Nos formules ».
- [ ] Centrer le bouton « Étudier mon export maritime ».
- [ ] Uniformiser la taille des cartes d’avis Google.
- [ ] Limiter les avis à 5 lignes de texte.
- [ ] Ajouter un bouton « Voir + » ouvrant une modale avec l’avis complet.
- [ ] Transformer les avis en carrousel horizontal avec `scroll-snap-x`, en laissant dépasser l’avis suivant.
- [ ] Ajouter le lien et le logo de Déménagement24.
- [ ] Centrer le bouton « Demander mon devis gratuit » dans la section « Échange ».
- [ ] Transformer le tableau de prise en charge en carrousel avec des icônes indiquant les prestations incluses ou non incluses.

## Footer

- [x] Intégrer les liens légaux au même niveau que les autres liens du footer, notamment le plan du site.
- [x] Uniformiser leur positionnement et leur présentation.

## Formulaire de devis

- [ ] Modifier la couleur du breadcrumb.
- [ ] Empêcher la sélection d’une date souhaitée dans le passé.
- [ ] Autoriser la sélection de plusieurs services complémentaires.
- [ ] Ajouter un placeholder explicatif pour « Stockage intermédiaire ou seconde livraison ».
- [ ] Ajouter un champ d’envoi de photos ; prise en charge API indiquée par le client.
- [ ] Proposer des plages de rappel par jour, matin et après-midi, en incluant aujourd’hui.
- [ ] Rendre le message facultatif et proposer un champ « Questions complémentaires ».
- [ ] Générer le récapitulatif au format PDF.
- [ ] Faire occuper toute la largeur disponible aux boutons.
- [ ] Utiliser SweetAlert pour afficher l’état d’envoi puis la confirmation, à la place de la carte de devis.

## Finitions générales

- [ ] Corriger toutes les coquilles du site.
- [ ] Supprimer les notes de développement visibles sur le site.


# Suivi antérieur — tâches ouvertes

Traduction et nettoyage du suivi existant ; états techniques issus des notes du 24 novembre 2026, sans nouvel audit ni test. Les tâches cochées sont retirées ; les tâches implémentées mais encore à vérifier restent ouvertes. Les nouvelles demandes priment en cas de conflit, notamment pour le nom « MAZAT TRANSPORT ».

## Informations déjà confirmées — ne pas redemander

MAZAT TRANSPORT — EURL ; SIREN 952 688 554 ; SIRET 952 688 554 00072 ; RCS 952 688 554 R.C.S. NICE ; TVA FR56 952 688 554 ; capital 6 300 € ; NAF/APE 49.41A. Contact : Jérémy Mazari, 44 Avenue Vincent-Van-Gogh, 13012 Marseille, 07 62 29 88 14, contact@mazat-transport.fr. Domaine mazat-transport.fr, GitHub Pages, registrar LWS. Développeur : 1344 Solutions — Adam Lamouri, 06 13 67 61 79, adamlamouri@1344.fr, 1344.fr. Les rôles juridiques et le statut précis de l’adresse restent à confirmer ci-dessous. Conserver le logo original ; ne pas publier les documents ni tarifs internes. Site français uniquement, anglais et blog en phase ultérieure.

## Routes et corrections éditoriales

- [ ] **INV-001** — P1 — Vérification des routes statiques, en attente. Après la séparation entre `src/pages/*.astro` et `src/views/`, construire sans pnpm selon la consigne de cette tâche et comparer les routes et le sitemap à `src/site/pages.ts`. Chaque slug, dont `/devis/`, doit être généré une seule fois ; aucun chemin de composant/vue ne doit devenir une route. Interaction : EXPORT-006.
- [ ] **EDIT-001** — P2 — Identité de marque. Ancienne demande « MAZAT TRANSPORT DÉMÉNAGEMENT » remplacée par la nouvelle consigne « MAZAT TRANSPORT » ci-dessous. Vérifier header et hero (`src/layouts/Layout.astro`, `src/views/home/components/Hero.astro`) ; conserver le h1 et le logo original. Traiter avec la tâche de renommage, sans doublon.
- [ ] **EDIT-002** — P1 — Introduction du hero. Dans `src/views/home/components/Hero.astro`, afficher intégralement sous le h1 : « À Marseille, dans toute la région PACA, partout en France et à l’international, notre équipe vous accompagne avec méthode, protection et soin. » Vérifier le texte visible généré.
- [ ] **EDIT-003** — P2 — CTA principal. Dans le hero, remplacer « Demander mon devis gratuit » par « Obtenir mon devis gratuit », en conservant `/devis/`. Cette demande ne concerne pas tous les CTA, notamment celui de la section Échange ; elle ne prouve pas la réception du formulaire (EXT-001).
- [ ] **EDIT-004** — P1 — Présentation de l’entreprise. Ajouter une section identifiable « Qui sommes-nous ? » dans `src/views/home/Page.astro` avec les deux paragraphes client conservés en référence ci-dessous, intégralement, y compris la limite des prestations incluses au devis. Les anciens extraits de la page avis retirée ne suffisent pas.
- [ ] **EDIT-005** — P1 — Descriptions des engagements. Conserver les quatre titres de `src/views/home/components/TrustStrip.astro` et intégrer les descriptions client conservées ci-dessous, dans leurs blocs visibles, avec les réserves liées à l’offre et à la faisabilité.
- [ ] **EDIT-006** — P1 — Zones desservies. Compléter le bloc visible de `src/views/home/components/Hero.astro` : priorité Marseille, Aix-en-Provence, Aubagne, La Ciotat, Martigues et Bouches-du-Rhône (13) ; couverture régionale Toulon/Var (83), Nice/Cannes/Antibes/Alpes-Maritimes (06) et Monaco comme destination distincte ; France et international selon faisabilité. Réutiliser les liens existants, harmoniser footer/FAQ sans inventer de pages ou d’adresses.

## Export et formulaire

- [ ] **EXPORT-001** — P1 — Introduction export déplacée, build à revérifier. Contrôler `/international-maritime/`, `src/views/international/Page.astro` et `components/Introduction.astro` après déplacement des vues. Le build du 24 novembre précédait ce déplacement. Conserver intégralement le paragraphe client ci-dessous, la signature, les départs métropolitains, DOM, LCL/FCL et partenaires, sans étendre le périmètre contractuel.
- [ ] **EXPORT-003** — P1 — Coordonnées des deux parties : code présent, interactions à vérifier. Dans `src/components/QuoteForm.astro` et `src/lib/quote-form.ts`, vérifier association expéditeur/destinataire aux adresses existantes, réutilisation du demandeur, état « À confirmer », champs nom/téléphone/email obligatoires pour les autres contacts, validation conditionnelle, retour et récapitulatif. Build et assertions statiques réussis le 24 novembre ; aucune validation navigateur complète. Ne pas dupliquer les adresses.
- [ ] **EXPORT-005** — P1 — Incoterm : code présent, interactions à vérifier. Vérifier les choix explicites « à définir »/« déjà défini », le champ conditionnel et le récapitulatif dans QuoteForm et la page maritime. Le build du 24 novembre ne valide pas ces interactions. Répartition réelle des frais : contrat validé sous EXT-002 et LEGAL-006.
- [ ] **EXPORT-006** — P0 — Initialisation du devis : hook restauré, parcours à vérifier. `.form-buttons` est présent dans QuoteForm et le HTML généré ; build réussi le 24 novembre. Tester visibilité de navigation, présélection export, parcours national/export, validation, retour, récapitulatif et téléchargement. Ne pas utiliser les anciens tests de `docs/validation.md` comme preuve actuelle. Réception serveur : EXT-001.

## Tarification privée

- [ ] **PRICE-001** — P1 — Phrase tarifaire déplacée, build à revérifier. Contrôler dans `/international-maritime/` : « Export maritime : prix personnalisé après étude du volume, de la destination et du mode de transport. » Source : `src/views/international/components/Introduction.astro`. L’assertion HTML du 24 novembre précédait le déplacement ; aucun tarif concurrent ou fret garanti à ajouter.
- [ ] **PRICE-002** — P1 — Comparaison tarifaire à revérifier extérieurement (MAZAT/Adam). Consulter les quatre sources SRC-PRICE-01–04, dater consultation et publication disponible, documenter les six scénarios : sens du trajet, ports, volume, prestation, inclusions/exclusions, devise et régime fiscal. Préciser mois IFTL et validité du premier m³. Chaque valeur historique doit être corroborée ou marquée obsolète/non vérifiée ; ne pas remplacer silencieusement le tableau du 05/11/2026 ni déduire HT/TTC.
- [ ] **PRICE-003** — P1 — Modèle privé de chiffrage export manquant. Prévoir séparément : enlèvement/emballage, préacheminement, emballage caisse, groupage/conteneur, manutention portuaire, assurance, livraison et douanes. Pour chaque poste : montant, inclusions/exclusions, offre partenaire et périmètre contractuel ; distinguer zéro, non applicable et inconnu. Validation MAZAT, dépendances EXT-002/EXPORT-005. Jamais dans les assets publics ou le navigateur ; ne rien présumer d’un tableur externe.
- [ ] **PRICE-004** — P1 — Achats et rentabilité à valider. Avant chaque proposition, obtenir les prix d’achat actuels auprès des transitaires/partenaires, avec identité, date/validité, trajet, périmètre, montant et devise. Faire valider marge, aléas et conditions de paiement par MAZAT, avec ventilation coût/prix de vente. Aucune valeur par défaut ni déduction depuis Sirelo/IFTL autorisée. Dépendances PRICE-003, EXT-002 et LEGAL-003/006.
- [ ] **PRICE-005** — P2 — Cas chiffrés facultatifs, non bloquants pour le lancement. Uniquement si MAZAT en demande et valide sens, ports/adresses, destination, volume, mode, date/validité, prestations, inclusions/exclusions, prix et présentation fiscale. Les présenter comme exemples, pas devis garantis ; sinon les laisser absents. Les fourchettes historiques ne suffisent pas. Dépendances PRICE-002–004 ; distinct du PDF contractuel EXT-002.

## Dépendances client et infrastructure

- [ ] **EXT-001** — P0 — Réception partielle, à vérifier. Le navigateur appelle Forge `send_form` avec `FORGE_FORM_TOKEN`, public dans le HTML. Vérifier envoi et livraison réels avec le jeton configuré. Fichiers : QuoteForm, `src/lib/form-forge.ts`, `src/lib/quote-form.ts`, `src/pages/devis.astro`, `src/views/quote/Page.astro`. Restent à valider : stockage serveur horodaté/identifié, anti-spam, accusé au prospect, statuts administratifs, conservation des pièces jointes et réception de tests local/national/export. Confidentialité : EXT-003.
- [ ] **EXT-002** — P0 — PDF de devis contractuel bloqué. MAZAT fournit « Devis parfait (5).pdf », identité validée, CGV, assurance, déclaration de valeur, règles TVA/paiement, médiation et signature. Valider modèle, calculs taxes/totaux, contrôle métier manuel, annexe inventaire, signature et PDF test. Aucun PDF contractuel automatique réalisé ; distinguer le nouveau PDF de récapitulatif demandé.
- [ ] **EXT-003** — P0 — Publication/juridique bloquée. Vérifier les éléments encore manquants sans redemander les faits déjà confirmés ci-dessous : hébergeur, directeur, Kbis/RNE actuel, médiateur, bases/conservation/sous-traitants et autorisations export. Fichiers : `src/site/config.ts`, `src/site/pages.ts`, vues legal/privacy/terms et `.env.example`. Pages validées et origine canonique configurée avant PUBLICATION_READY.
- [ ] **EXT-004** — P1 — Photos/avis à fournir ou confirmer : équipe, chantiers, transport/export, droits, témoignages approuvés et URL des avis Google. Sources : `public/images`, accueil et Reviews ; l’ancienne vue avis a été retirée. Galerie/hero authentiques et optimisés sans identifier de client non autorisé. Lien Déménagement24 déjà signalé comme présent : vérifier avec la nouvelle demande de logo/lien, sans copier de note.
- [ ] **EXT-005** — P1 — Configurer le jeton Website MAZAT et vérifier le contrat actuel FAQ/avis Forge dans `src/lib/forge.ts` et `.env.example` : 0/N éléments, français, absence de fusion du fallback et rebuild. Aucun secret Laure réutilisé. Distinguer les avis Google chargés côté navigateur à la demande du propriétaire.
- [ ] **EXT-006** — P1 — Choisir statistiques et consentement, vérifier la propriété Search Console puis configurer les événements appel/email/export/formulaire après réception réelle. Aucun traceur installé selon le suivi antérieur.
- [ ] **LEGAL-001** — P0 — Confirmer si Jérémy Mazari est gérant et si l’adresse marseillaise est l’adresse administrative complète ou celle d’un établissement ; préciser une éventuelle adresse de facturation/correspondance distincte.
- [ ] **LEGAL-002** — P0 — Confirmer Jérémy Mazari comme directeur de publication ou fournir nom et fonction exacts.
- [ ] **LEGAL-003** — P0 — Fournir CGV approuvées, paiement, annulation, assurance, déclaration de valeur, TVA, médiateur, litiges et modèle de devis contractuel.
- [ ] **LEGAL-004** — P0 — Confirmer responsable de traitement, finalités/bases légales, destinataires/sous-traitants, conservation, sécurité, transferts et exercice des droits.
- [ ] **LEGAL-005** — P0 — Valider le canal de réception retenu (Forge/email, CRM ou backend), stockage, accès, anti-spam, accusé, pièces jointes et suppression.
- [ ] **LEGAL-006** — P1 — Confirmer assureur/police, autorisations de transport, pays, partenaires, responsabilités douanières et exclusions de marchandises.
- [ ] **LEGAL-007** — P1 — Confirmer cookies, statistiques, pixels publicitaires, cartes, vidéos et services tiers réellement présents avant publication.

## SEO / GEO / Accessibilité — Corrections dans le dépôt

- [ ] **SGA-001** — P1 — SEO/juridique, dépend de EXT-003. Remplacer les textes préparatoires, configurer SITE_URL, vérifier canonical/OG/sitemap et retirer le noindex approprié seulement après validation. Critère : domaine et pages juridiques corrects dans le HTML généré et en production.
- [ ] **SGA-002** — P1 — Accessibilité à vérifier : lecteur d’écran, zoom 200 %, appareils iOS/Android après contenus définitifs. Parcours critiques utilisables sans focus masqué ni perte de contenu. Des tests partiels ne prouvent pas une conformité WCAG.

## Vérifications Google Maps et avis

- [ ] **MAPS-002** — P1 — Vérification réelle par le propriétaire. Configurer GOOGLE_MAPS_API_KEY localement et dans les secrets Actions (clé visible au navigateur), Maps JavaScript API/Places API (New), facturation et quotas. Restreindre API et référents à https://mazat-transport.fr/* et aux autres origines réellement utilisées ; clé distincte pour localhost. Vérifier suggestions France/international, clavier/lecteur d’écran, 320 px, deux adresses indépendantes, corrections, code postal absent, retour/suivant/récapitulatif et modes hors ligne/clé refusée. Build antérieur réussi (14 pages), saisie manuelle et ancien widget vérifiés sur localhost:4322 ; ces essais ne valident pas la nouvelle saisie directe après 3 caractères (300 ms). Le propriétaire a demandé de vérifier lui-même cette révision, sans nouveaux tests localhost/navigateur. Vérifier encore remplissage, attribution Google et confidentialité. Références : https://developers.google.com/maps/documentation/javascript/place-autocomplete-new ; https://developers.google.com/maps/api-security-best-practices .
- [ ] **REV-GOOGLE-002** — P1 — Vérification réelle par le propriétaire. Vérifier clé, Maps JavaScript API/Places API (New), champ avis/facturation et domaine de production ; contrôler établissement pour Place ID ChIJ7WvR7za_yRIRddVA_CCPQcE, auteurs/textes/dates/liens, mobile/clavier et états vide/erreur. Avis sur l’accueil uniquement depuis le retrait de la page avis. Pas de localhost à la demande du propriétaire. Limite du suivi existant : cinq avis au plus sélectionnés par pertinence ; trier ce sous-ensemble ne garantit pas les derniers avis cinq étoiles. Actualisation à l’ouverture, pas de push/polling. Si tous les avis récents sont nécessaires, étudier une intégration Business Profile authentifiée côté serveur, sans OAuth dans le navigateur. Références : https://developers.google.com/maps/documentation/javascript/place-reviews ; https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places ; https://developers.google.com/maps/documentation/places/web-service/policies .

## SEO / GEO / Accessibilité — Intervention du propriétaire

Référencer les tâches EXT-001 à EXT-006 et LEGAL ci-dessus ; ne pas les dupliquer. Aucun déploiement, audit juridique, configuration Search Console ou envoi réel n’est déclaré réalisé ici.

## Phases ultérieures

- [ ] Anglais pour l’export et blog/conseils — P2, facultatifs, non activés.
- [ ] Pages villes supplémentaires — uniquement avec contenu original utile et photos réelles.

## Textes client conservés — EDIT-004 et EXPORT-001

  > MAZAT Transport Déménagement accompagne les particuliers et les professionnels dans leurs changements de vie et leurs transferts d’activité. Notre approche associe organisation, manutention maîtrisée, protection du mobilier et suivi de chaque étape. Nous intervenons au départ ou à destination de Marseille et de la Côte d’Azur, sur les trajets nationaux et, selon les projets, sur les opérations internationales.
  >
  > Notre savoir-faire est particulièrement orienté vers l’emballage soigné : housses de literie, couvertures professionnelles, protections renforcées, démontage et remontage selon la formule, mise en place du mobilier, et préparations spécifiques pour l’export. L’objectif : adapter la prestation aux biens, aux accès et au budget, sans promettre ce qui n’est pas inclus au devis.
  > Vous déménagez à l’étranger, vers les DOM ou depuis la France métropolitaine ? MAZAT vous accompagne dans la préparation et l’organisation de votre expédition maritime, de l’étude du volume à la remise à destination, selon le périmètre retenu. Nous étudions les solutions de groupage maritime (LCL) pour les petits et moyens volumes et de conteneur dédié (FCL) pour les projets plus importants, avec des partenaires de transport et de destination lorsque nécessaire.

## Descriptions client — EDIT-005

| Engagement | Description |
| --- | --- |
| Protection maîtrisée | Emballages adaptés, housses et couvertures ; protection renforcée et export selon l’offre souscrite. |
| Devis personnalisé | Cubage, adresses, étages, ascenseurs, portage, kilomètres et prestations détaillés. |
| Savoir-faire terrain | Déménagements particuliers, bureaux, manutentions complexes et longues distances. |
| France & international | Déménagements régionaux, nationaux et projets d’expédition à l’étranger selon faisabilité. |

## Référence export fournie — à conserver lors des changements

Solutions : groupage maritime pour petits/moyens volumes avec calendrier variable et inventaire détaillé ; conteneur 20/40 pieds selon volume, trajet, faisabilité et chargement ; porte-à-porte selon contrat avec partenaires de destination.

Ordre : évaluation → visite/vidéo et inventaire numéroté → emballage export/caisses si nécessaire → consolidation/port → fret et formalités partenaires → réception, dédouanement éventuel et livraison selon offre.

Conserver dans les champs et le récapitulatif : pays/ville/code postal et adresses des deux côtés ; résidence fiscale/statut d’importation ; date ou état à définir ; contacts expéditeur/destinataire ; disponibilité et langue de la liste de colisage ; volume ou inventaire (non équivalent à un cubage vérifié) ; poids et inventaire valorisé ; biens particuliers/réglementés ; Incoterm et périmètre ; frais port/manutention/stockage/douane inclus, exclus ou à confirmer. Aucune allocation contractuelle ni réception réelle ne se déduit de la présence des champs. Références : EXPORT-003/005/006, EXT-001/002, LEGAL-004/006.

## Comparaison historique client — référence interne uniquement

Étude fournie datée du 05/11/2026. Les montants dépendent du sens du trajet, des ports, du volume, de la prestation et des exclusions. Ni tarifs MAZAT, ni coûts d’achat, ni devis porte-à-porte ; non revérifiés lors de cette mise à jour. Ne pas copier dans src/, public/, métadonnées, JSON-LD, estimateur ou page commerciale. Conserver toutes les réserves avec les chiffres.

| Référence fournie par le client                   | Scénario                 | Ordre de grandeur historique fourni             | Réserve à conserver                                                                                                  | Identifiant source    |
| ---------------------------------------------- | ------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ |
| Sirelo France–Canada (2026)                    | Groupage maritime / LCL  | 1 400 à 3 400 €                                                 | Périmètre d’inclusion à vérifier.                                                                                 | SRC-PRICE-01 |
| Sirelo France–Canada (2026)                    | Conteneur dédié 20 pieds | 3 200 à 5 900 €                                                 | Fret/transport maritime, hors plusieurs frais possibles.                                                          | SRC-PRICE-01 |
| Sirelo France–Canada (2026)                    | Conteneur dédié 40 pieds | 5 900 à 8 500 €                                                 | Exclusions selon prestation.                                                                                      | SRC-PRICE-01 |
| Sirelo France–USA (octobre 2026)               | Petit groupage 3 à 5 m³  | À partir d’environ 2 000 €.                                     | Prix d’appel approximatif ; périmètre à vérifier, pas un forfait MAZAT.                                           | SRC-PRICE-02 |
| Sirelo France–USA (octobre 2026)               | Groupage 5 à 15 m³       | Environ 3 000 à 5 500 €.                                        | Fourchette indicative ; conditions et exclusions à vérifier.                                                      | SRC-PRICE-02 |
| IFTL – DOM (prix du mois dans l’étude fournie) | 1er m³ en groupage       | Dès 500 € Réunion / Guadeloupe / Martinique ; dès 600 € Guyane. | Prix d’appel du premier m³, pas un prix total d’expédition ; mois exact, sens du trajet et périmètre à revalider. | SRC-PRICE-04 |

### Sources de comparaison à conserver pour Adam

| ID           | Nom de la source                         | URL fournie                                                    | Utilisation / état de vérification                                                                                                                  |
| ------------ | ----------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| SRC-PRICE-01 | Sirelo — France–Canada              | https://sirelo.fr/demenagement-par-container/container-france-canada/ | Source des trois cas Canada ; non revérifiée lors de cette revue.                                                          |
| SRC-PRICE-02 | Sirelo — Déménager aux États-Unis   | https://sirelo.fr/demenager-a-etranger/demenager-aux-etats-unis/      | Source des deux cas États-Unis ; non revérifiée lors de cette revue.                                                               |
| SRC-PRICE-03 | Sirelo — Déménagement par conteneur | https://sirelo.fr/demenagement-par-container/                         | Source générale de comparaison ; aucune ligne chiffrée distincte attribuée à cette URL.                             |
| SRC-PRICE-04 | IFTL — Outre-mer / contact          | https://www.iftl.fr/contact                                           | Référence fournie pour le premier m³ vers les DOM ; cette URL ne prouve pas un tarif actuel. Obtenir une offre datée si nécessaire. |
