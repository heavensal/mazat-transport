import { loadPlaces, type Prediction } from './google-maps';

for (const root of document.querySelectorAll<HTMLElement>(
  '[data-address-autocomplete]',
)) {
  if (!root.dataset.apiKey) continue;
  const street = root.querySelector<HTMLInputElement>(
    '[data-address-field="street"]',
  )!;
  const status = root.querySelector<HTMLElement>('[data-search-status]')!;
  const panel = root.querySelector<HTMLElement>('[data-suggestions-panel]')!;
  const list = root.querySelector<HTMLUListElement>('[data-suggestions]')!;
  const manualInputs = [
    ...root.querySelectorAll<HTMLInputElement>('[data-address-field]'),
  ];
  let revision = 0;
  let timer: ReturnType<typeof setTimeout>;
  let predictions: Prediction[] = [];
  let active = -1;
  let token: object | undefined;
  street.setAttribute('role', 'combobox');
  street.setAttribute('aria-autocomplete', 'list');
  street.setAttribute('aria-controls', list.id);
  street.setAttribute('aria-expanded', 'false');
  street.autocomplete = 'off';
  function close() {
    panel.hidden = true;
    active = -1;
    street.setAttribute('aria-expanded', 'false');
    street.removeAttribute('aria-activedescendant');
  }
  function cancel() {
    revision++;
    clearTimeout(timer);
    close();
  }
  function failure() {
    close();
    status.textContent =
      'Suggestions indisponibles. Vous pouvez saisir votre adresse, code postal, ville et pays manuellement.';
  }
  async function select(prediction: Prediction) {
    cancel();
    const selected = revision;
    status.textContent = 'Chargement de l’adresse…';
    try {
      const place = prediction.toPlace();
      token = undefined;
      await place.fetchFields({
        fields: ['addressComponents', 'formattedAddress'],
      });
      if (selected !== revision) return;
      const component = (...types: string[]) => {
        for (const type of types) {
          const match = place.addressComponents?.find((item) =>
            item.types.includes(type),
          );
          if (match) return match.longText || match.shortText || '';
        }
        return '';
      };
      const values: Record<string, string> = {
        street:
          [component('street_number'), component('route')]
            .filter(Boolean)
            .join(' ') ||
          place.formattedAddress ||
          '',
        postal: [component('postal_code'), component('postal_code_suffix')]
          .filter(Boolean)
          .join('-'),
        city: component(
          'locality',
          'postal_town',
          'sublocality_level_1',
          'administrative_area_level_3',
        ),
        country: component('country'),
      };
      // Clear unavailable values to avoid keeping a postcode from an old address.
      for (const input of manualInputs) {
        input.value = values[input.dataset.addressField!] || '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      status.textContent =
        'Adresse renseignée. Vérifiez les champs ci-dessous et complétez les informations manquantes.';
    } catch {
      if (selected === revision) failure();
    }
  }
  async function search(query: string, requested: number) {
    try {
      const library = await loadPlaces(root.dataset.apiKey!);
      if (requested !== revision) return;
      token ??= new library.AutocompleteSessionToken();
      const result =
        await library.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query,
          sessionToken: token,
          language: 'fr',
          region: 'fr',
        });
      if (requested !== revision || document.activeElement !== street) return;
      predictions = result.suggestions.flatMap((item) =>
        item.placePrediction ? [item.placePrediction] : [],
      );
      list.replaceChildren();
      predictions.forEach((prediction, index) => {
        const option = document.createElement('li');
        option.id = `${list.id}-${index}`;
        option.role = 'option';
        option.setAttribute('aria-selected', 'false');
        option.className =
          'cursor-pointer px-4 py-3 text-sm text-slate-900 hover:bg-sky-50';
        option.textContent = prediction.text.toString();
        option.addEventListener('pointerdown', (event) =>
          event.preventDefault(),
        );
        option.addEventListener('click', () => {
          void select(prediction);
        });
        list.append(option);
      });
      panel.hidden = !predictions.length;
      street.setAttribute('aria-expanded', String(predictions.length > 0));
      status.textContent = predictions.length
        ? `${predictions.length} adresses proposées. Utilisez les flèches puis Entrée, ou sélectionnez une proposition.`
        : 'Aucune suggestion. Complétez votre adresse manuellement.';
    } catch {
      if (requested === revision) failure();
    }
  }
  street.addEventListener('input', (event) => {
    cancel();
    status.textContent = '';
    if ((event as InputEvent).isComposing) return;
    const query = street.value.trim();
    if (query.length < 3) return;
    const requested = revision;
    timer = setTimeout(() => {
      void search(query, requested);
    }, 300);
  });
  street.addEventListener('compositionend', () =>
    street.dispatchEvent(new Event('input')),
  );
  manualInputs
    .filter((input) => input !== street)
    .forEach((input) => input.addEventListener('input', cancel));
  street.addEventListener('blur', cancel);
  street.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      cancel();
      return;
    }
    if (event.isComposing || panel.hidden) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active =
        (active + (event.key === 'ArrowDown' ? 1 : -1) + predictions.length) %
        predictions.length;
      [...list.children].forEach((option, index) => {
        option.setAttribute('aria-selected', String(index === active));
        (option as HTMLElement).style.backgroundColor =
          index === active ? '#e0f2fe' : '';
      });
      street.setAttribute('aria-activedescendant', `${list.id}-${active}`);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (active >= 0) void select(predictions[active]);
    }
  });
}
