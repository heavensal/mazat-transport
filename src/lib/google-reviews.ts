import { loadPlaces, type GoogleReview } from './google-maps';

// Keep the API's original wording and attribution. Never persist reviews locally.
export function selectFiveStarReviews(reviews: GoogleReview[]) {
  return reviews
    .filter(
      (review) => review.rating === 5 && review.authorAttribution?.displayName,
    )
    .sort((a, b) => timestamp(b) - timestamp(a));
}
function timestamp(review: GoogleReview) {
  const value = review.publishTime?.getTime();
  return value && Number.isFinite(value) ? value : 0;
}
function appendLink(parent: HTMLElement, text: string, url?: string) {
  if (!url) return;
  try {
    const safe = new URL(url);
    if (safe.protocol !== 'https:') return;
    const link = document.createElement('a');
    link.href = safe.href;
    link.textContent = text;
    link.className = 'underline underline-offset-4';
    parent.append(link);
  } catch {
    /* Keep malformed third-party links out of the DOM. */
  }
}
for (const root of document.querySelectorAll<HTMLElement>(
  '[data-google-reviews]',
)) {
  const status = root.querySelector<HTMLElement>('[data-reviews-status]')!;
  const list = root.querySelector<HTMLElement>('[data-reviews-list]')!;
  const template = root.querySelector<HTMLTemplateElement>(
    '[data-review-template]',
  )!;
  async function renderReviews() {
    if (!root.dataset.apiKey) {
      status.textContent =
        'Les avis sont disponibles directement sur Google Maps.';
      return;
    }
    status.textContent = 'Chargement des avis Google…';
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const place = await Promise.race([
        (async () => {
          const { Place } = await loadPlaces(root.dataset.apiKey!);
          const result = new Place({
            id: root.dataset.placeId!,
            requestedLanguage: 'fr',
          });
          await result.fetchFields({ fields: ['reviews', 'attributions'] });
          return result;
        })(),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Reviews timeout')),
            20000,
          );
        }),
      ]);
      for (const review of selectFiveStarReviews(place.reviews || [])) {
        const card = template.content.firstElementChild!.cloneNode(
          true,
        ) as HTMLElement;
        const author = card.querySelector<HTMLElement>('[data-review-author]')!;
        author.textContent = review.authorAttribution!.displayName!;
        if (review.authorAttribution?.uri) {
          const holder = document.createElement('span');
          appendLink(
            holder,
            review.authorAttribution.displayName!,
            review.authorAttribution.uri,
          );
          if (holder.childNodes.length) author.replaceChildren(holder);
        }
        const text = card.querySelector<HTMLElement>('[data-review-text]')!;
        text.textContent = review.originalText ?? review.text ?? '';
        const language = review.originalText
          ? review.originalTextLanguageCode
          : review.textLanguageCode;
        if (language) text.lang = language;
        if (
          !review.originalText &&
          review.text &&
          review.originalTextLanguageCode &&
          review.textLanguageCode !== review.originalTextLanguageCode
        ) {
          const notice = document.createElement('p');
          notice.textContent = 'Traduit par Google';
          text.after(notice);
        }
        if (timestamp(review))
          card.querySelector('[data-review-date]')!.textContent =
            new Intl.DateTimeFormat('fr-FR', {
              dateStyle: 'long',
              timeZone: 'Europe/Paris',
            }).format(review.publishTime);
        if (review.visitDateYear && review.visitDateMonth !== undefined)
          card.querySelector('[data-review-visit]')!.textContent =
            `Visite : ${new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(review.visitDateYear, review.visitDateMonth, 1)))}`;
        const links = card.querySelector<HTMLElement>('[data-review-links]')!;
        appendLink(links, 'Voir l’avis sur Google', review.googleMapsURI);
        appendLink(links, 'Signaler cet avis', review.flagContentURI);
        list.append(card);
      }
      const attributions = root.querySelector<HTMLElement>(
        '[data-reviews-attributions]',
      )!;
      for (const attribution of place.attributions || [])
        appendLink(attributions, attribution.provider, attribution.providerURI);
      status.textContent = list.childElementCount
        ? ''
        : 'Aucun avis 5 étoiles dans la sélection retournée par Google. Consultez tous les avis sur Google Maps.';
    } catch {
      status.textContent =
        'Les avis ne peuvent pas être chargés pour le moment. Consultez-les directement sur Google Maps.';
    } finally {
      clearTimeout(timeout);
    }
  }
  void renderReviews();
}
