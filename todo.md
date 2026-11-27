# MAZAT TRANSPORT — Modifications à réaliser

Liste des modifications demandées ; aucune réalisation présumée.

## Page d’accueil

- [ ] Refaire le design des formules.

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
- [x] **EDIT-001** — P2 — Identité de marque. Ancienne demande « MAZAT TRANSPORT DÉMÉNAGEMENT » remplacée par la nouvelle consigne « MAZAT TRANSPORT » ci-dessous. Vérifier header et hero (`src/layouts/Layout.astro`, `src/views/home/components/Hero.astro`) ; conserver le h1 et le logo original. Traiter avec la tâche de renommage, sans doublon.
- [x] **EDIT-002** — P1 — Introduction du hero. Dans `src/views/home/components/Hero.astro`, afficher intégralement sous le h1 : « À Marseille, dans toute la région PACA, partout en France et à l’international, notre équipe vous accompagne avec méthode, protection et soin. » Vérifier le texte visible généré.
- [ ] **EDIT-003** — P2 — CTA principal. Dans le hero, remplacer « Demander mon devis gratuit » par « Obtenir mon devis gratuit », en conservant `/devis/`. Cette demande ne concerne pas tous les CTA, notamment celui de la section Échange ; elle ne prouve pas la réception du formulaire (EXT-001).
- [ ] **EDIT-004** — P1 — Présentation de l’entreprise. Ajouter une section identifiable « Qui sommes-nous ? » dans `src/views/home/Page.astro` avec les deux paragraphes client conservés en référence ci-dessous, intégralement, y compris la limite des prestations incluses au devis. Les anciens extraits de la page avis retirée ne suffisent pas.
- [ ] **EDIT-005** — P1 — Descriptions des engagements. Conserver les quatre titres de `src/views/home/components/TrustStrip.astro` et intégrer les descriptions client conservées ci-dessous, dans leurs blocs visibles, avec les réserves liées à l’offre et à la faisabilité.
- [ ] **EDIT-006** — P1 — Zones desservies. Compléter le bloc visible de `src/views/home/components/Hero.astro` : priorité Marseille, Aix-en-Provence, Aubagne, La Ciotat, Martigues et Bouches-du-Rhône (13) ; couverture régionale Toulon/Var (83), Nice/Cannes/Antibes/Alpes-Maritimes (06) et Monaco comme destination distincte ; France et international selon faisabilité. Réutiliser les liens existants, harmoniser footer/FAQ sans inventer de pages ou d’adresses.

## Export et formulaire

### Ajustements du formulaire — 27 novembre 2026

Implémentation dans `src/components/QuoteForm.astro`, `src/lib/quote-form.ts`, `src/lib/quote-schedule.ts`, `src/lib/quote-photos.ts`, `src/lib/form-forge.ts` et `src/views/quote/components/Hero.astro`.

- [x] Fil d’Ariane aux couleurs du site et progression rouge/gris ; boutons empilés pleine largeur sur mobile (code et build vérifiés).
- [x] Date souhaitée : minimum aujourd’hui en Europe/Paris, contrôle lors des étapes et avant envoi ; dates passées rejetées dans les tests.
- [x] Services multiples : cases à cocher, présélection URL conservée et toutes les valeurs transmises ensemble (test du contrôleur).
- [x] Stockage/seconde livraison : exemple explicatif ; message et questions complémentaires facultatifs.
- [x] Sélection de 3 photos maximum selon le contrat Forge confirmé par le propriétaire et le code local `contentforge-1344-rails/app/controllers/api/v1/send_form_controller.rb` / `app/services/contact_form/photos.rb`. JSON `attachments` avec filename/content_type/data base64, JPEG ≤ 1 200 000 octets côté API ; réduction navigateur à ≤ 900 Kio, entrée JPEG/PNG/WebP ≤ 25 Mio. Tests des limites et de la conversion avec canvas simulé ; traitement d’images réelles et livraison à vérifier sous EXT-001.
- [x] Rappels : aujourd’hui + 6 jours, matin/après-midi, heure de Paris, périodes terminées désactivées ; choix périmé revalidé. Tests incluant changements d’heure et d’année.
- [x] Récapitulatif détaillé réservé à l’entreprise dans le champ texte de l’envoi ; affichage brut et téléchargement client retirés. Aucun fichier TXT joint (contrat pièces jointes limité aux photos).
- [x] Écrans natifs en cours/réussite/erreur à la place du formulaire, bouton de retour après erreur conservant les saisies et photos, protection contre les doubles clics ; confirmation uniquement après HTTP réussi et `{ ok: true }`.

Preuves : `pnpm test:quote` couvre helpers, requête HTTP et contrôleur avec DOM/canvas/réseau simulés. Build et contrôles du site exécutés ; aucun navigateur ouvert, aucun envoi réel, aucune livraison email attestée. Les cases ci-dessus concernent l’implémentation et les contrôles automatisés, pas une recette navigateur ou production. EXT-001/EXT-003 restent ouverts pour livraison réelle, stockage, conservation et traitement des photos. README et confidentialité actualisés pour décrire le nouveau comportement.


- [ ] **EXPORT-001** — P1 — Introduction export déplacée, build à revérifier. Contrôler `/international-maritime/`, `src/views/international/Page.astro` et `components/Introduction.astro` après déplacement des vues. Le build du 24 novembre précédait ce déplacement. Conserver intégralement le paragraphe client ci-dessous, la signature, les départs métropolitains, DOM, LCL/FCL et partenaires, sans étendre le périmètre contractuel.
- [ ] **EXPORT-003** — P1 — Coordonnées des deux parties : code présent, interactions à vérifier. Dans `src/components/QuoteForm.astro` et `src/lib/quote-form.ts`, vérifier association expéditeur/destinataire aux adresses existantes, réutilisation du demandeur, état « À confirmer », champs nom/téléphone/email obligatoires pour les autres contacts, validation conditionnelle, retour et récapitulatif. Build et assertions statiques réussis le 24 novembre ; aucune validation navigateur complète. Ne pas dupliquer les adresses.
- [ ] **EXPORT-005** — P1 — Incoterm : code présent, interactions à vérifier. Vérifier les choix explicites « à définir »/« déjà défini », le champ conditionnel et le récapitulatif dans QuoteForm et la page maritime. Le build du 24 novembre ne valide pas ces interactions. Répartition réelle des frais : contrat validé sous EXT-002 et LEGAL-006.
- [ ] **EXPORT-006** — P0 — Initialisation du devis : hook restauré, parcours à vérifier. `.form-buttons` est présent dans QuoteForm et le HTML généré ; build réussi le 24 novembre. Tester visibilité de navigation, présélection export, parcours national/export, validation, retour, récapitulatif et téléchargement. Ne pas utiliser les anciens tests de `docs/validation.md` comme preuve actuelle. Réception serveur : EXT-001.

## Tarification privée

### Comparaison publique demandée le 26 novembre 2026

La demande explicite du propriétaire autorise désormais une section de repères publics sourcés sur `/international-maritime/`, sans publication de la grille tarifaire privée du PDF. Implémentation : `src/views/international/components/MarketPrices.astro`, appelée en dernier dans `src/views/international/Page.astro`. Les anciennes références ci-dessous restent conservées comme historique interne ; elles ne sont pas recopiées telles quelles dans la page.

- **PRICE-002 — vérification documentaire partielle (26/11/2026)** : SRC-PRICE-01 affiche désormais LCL 1 700–5 000 €, 20 pieds 3 000–8 000 €, 40 pieds 6 000–12 000 €, estimations porte-à-porte depuis la région parisienne, mise à jour novembre 2026. Les trois anciennes fourchettes ne sont plus corroborées par cette page. Assurance, inspection éventuelle et stockage généralement exclus. SRC-PRICE-02 confirme les deux repères de groupage USA fournis, mise à jour octobre 2026. SRC-PRICE-04 affiche bien 500 € pour le premier m³ Réunion/Guadeloupe/Martinique et 600 € Guyane, sous « prix du mois », sans mois explicite ; cela ne prouve pas leur validité pour un projet. SRC-PRICE-03 consultée pour contexte, chiffres de janvier 2026 non mélangés aux autres tableaux. Restent à confirmer par offre : ports/adresses, inclusions exactes, fiscalité et validité. Les tâches d’achats et de prix MAZAT Transport restent ouvertes.
- **PRICE-005 — périmètre actualisé** : la section demandée présente des repères tiers, sans estimation automatique ni engagement tarifaire MAZAT Transport. Montants en euros, dates et réserves visibles ; liens sources en nouvel onglet, tableaux à défilement horizontal clavier sur mobile. Aucun déploiement autorisé ou effectué. Validation de cette intervention : build et contrôles du HTML à consigner après exécution ; rendu navigateur non vérifié.

- [ ] **PRICE-001** — P1 — Phrase tarifaire déplacée, build à revérifier. Contrôler dans `/international-maritime/` : « Export maritime : prix personnalisé après étude du volume, de la destination et du mode de transport. » Source : `src/views/international/components/Introduction.astro`. L’assertion HTML du 24 novembre précédait le déplacement ; aucun tarif concurrent ou fret garanti à ajouter.
- [ ] **PRICE-002** — P1 — Comparaison tarifaire à revérifier extérieurement (MAZAT/Adam). Consulter les quatre sources SRC-PRICE-01–04, dater consultation et publication disponible, documenter les six scénarios : sens du trajet, ports, volume, prestation, inclusions/exclusions, devise et régime fiscal. Préciser mois IFTL et validité du premier m³. Chaque valeur historique doit être corroborée ou marquée obsolète/non vérifiée ; ne pas remplacer silencieusement le tableau du 05/11/2026 ni déduire HT/TTC.
- [ ] **PRICE-003** — P1 — Modèle privé de chiffrage export manquant. Prévoir séparément : enlèvement/emballage, préacheminement, emballage caisse, groupage/conteneur, manutention portuaire, assurance, livraison et douanes. Pour chaque poste : montant, inclusions/exclusions, offre partenaire et périmètre contractuel ; distinguer zéro, non applicable et inconnu. Validation MAZAT, dépendances EXT-002/EXPORT-005. Jamais dans les assets publics ou le navigateur ; ne rien présumer d’un tableur externe.
- [ ] **PRICE-004** — P1 — Achats et rentabilité à valider. Avant chaque proposition, obtenir les prix d’achat actuels auprès des transitaires/partenaires, avec identité, date/validité, trajet, périmètre, montant et devise. Faire valider marge, aléas et conditions de paiement par MAZAT, avec ventilation coût/prix de vente. Aucune valeur par défaut ni déduction depuis Sirelo/IFTL autorisée. Dépendances PRICE-003, EXT-002 et LEGAL-003/006.
- [ ] **PRICE-005** — P2 — Cas chiffrés facultatifs, non bloquants pour le lancement. Uniquement si MAZAT Transport en demande et valide sens, ports/adresses, destination, volume, mode, date/validité, prestations, inclusions/exclusions, prix et présentation fiscale. Les présenter comme exemples, pas devis garantis ; sinon les laisser absents. Les fourchettes historiques ne suffisent pas. Dépendances PRICE-002–004 ; distinct du PDF contractuel EXT-002.

## Dépendances client et infrastructure

- [ ] **EXT-001** — P0 — Réception partielle, à vérifier. Le navigateur appelle Forge `send_form` avec `FORGE_FORM_TOKEN`, public dans le HTML. Vérifier envoi et livraison réels avec le jeton configuré. Fichiers : QuoteForm, `src/lib/form-forge.ts`, `src/lib/quote-form.ts`, `src/pages/devis.astro`, `src/views/quote/Page.astro`. Restent à valider : stockage serveur horodaté/identifié, anti-spam, accusé au prospect, statuts administratifs, conservation des pièces jointes et réception de tests local/national/export. Confidentialité : EXT-003.
- [ ] **EXT-002** — P0 — PDF de devis contractuel bloqué. MAZAT Transport fournit « Devis parfait (5).pdf », identité validée, CGV, assurance, déclaration de valeur, règles TVA/paiement, médiation et signature. Valider modèle, calculs taxes/totaux, contrôle métier manuel, annexe inventaire, signature et PDF test. Aucun PDF contractuel automatique réalisé ; distinguer le nouveau PDF de récapitulatif demandé.
- [ ] **EXT-003** — P0 — Publication/juridique bloquée. Vérifier les éléments encore manquants sans redemander les faits déjà confirmés ci-dessous : hébergeur, directeur, Kbis/RNE actuel, médiateur, bases/conservation/sous-traitants et autorisations export. Fichiers : `src/site/config.ts`, `src/site/pages.ts`, vues legal/privacy/terms et `.env.example`. Pages validées et origine canonique configurée avant PUBLICATION_READY.
- [ ] **EXT-004** — P1 — Photos/avis à fournir ou confirmer : équipe, chantiers, transport/export, droits, témoignages approuvés et URL des avis Google. Sources : `public/images`, accueil et Reviews ; l’ancienne vue avis a été retirée. Galerie/hero authentiques et optimisés sans identifier de client non autorisé. Lien Déménagement24 déjà signalé comme présent : vérifier avec la nouvelle demande de logo/lien, sans copier de note.
- [ ] **EXT-005** — P1 — Configurer le jeton Website MAZAT Transport et vérifier le contrat actuel FAQ/avis Forge dans `src/lib/forge.ts` et `.env.example` : 0/N éléments, français, absence de fusion du fallback et rebuild. Aucun secret Laure réutilisé. Distinguer les avis Google chargés côté navigateur à la demande du propriétaire.
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

## SEO / GEO / Accessibilité — Intervention du propriétaire

Référencer les tâches EXT-001 à EXT-006 et LEGAL ci-dessus ; ne pas les dupliquer. Aucun déploiement, audit juridique, configuration Search Console ou envoi réel n’est déclaré réalisé ici.
