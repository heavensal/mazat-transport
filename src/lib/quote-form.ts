const form = document.querySelector<HTMLFormElement>('#quote-form');
if (form) {
  const project = form.querySelector<HTMLSelectElement>('#project-type')!;
  const fieldsets = [
    ...form.querySelectorAll<HTMLFieldSetElement>('[data-step]'),
  ];
  const review = form.querySelector<HTMLElement>('#quote-review')!;
  const previous = form.querySelector<HTMLButtonElement>('#previous')!;
  const next = form.querySelector<HTMLButtonElement>('#next')!;
  const progress = form.querySelector<HTMLProgressElement>('#step-progress')!;
  const label = form.querySelector<HTMLElement>('#step-label')!;
  const summary = form.querySelector<HTMLElement>('#quote-summary')!;
  const status = form.querySelector<HTMLElement>('#draft-status')!;
  const volume = form.querySelector<HTMLInputElement>('#volume')!;
  const inventory = form.querySelector<HTMLTextAreaElement>('#inventory')!;
  const date = form.querySelector<HTMLInputElement>('#moving-date')!;
  const flexibility = form.querySelector<HTMLSelectElement>('#flexibility')!;
  let step = 0;
  let recap = '';
  let requestReference = '';
  const params = new URLSearchParams(location.search);
  function selectParam(id: string, param: string) {
    const select = form!.querySelector<HTMLSelectElement>(id)!;
    const value = params.get(param);
    if (value && [...select.options].some((o) => o.value === value))
      select.value = value;
  }
  selectParam('#project-type', 'type');
  selectParam('#offer', 'formule');
  selectParam('#additional-service', 'service');
  const steps = () =>
    fieldsets.filter(
      (f) => f.dataset.step !== 'export' || project.value === 'export',
    );
  function conditionals() {
    for (const select of form!.querySelectorAll<HTMLSelectElement>(
      '[data-elevator]',
    )) {
      const container = form!.querySelector<HTMLElement>(
        `[data-elevator-details="${select.dataset.elevator}"]`,
      )!;
      const input = container.querySelector<HTMLInputElement>('input')!;
      container.hidden = select.value !== 'oui';
      input.disabled = container.hidden;
      input.required = !container.hidden;
    }
    const company = form!.querySelector<HTMLElement>('[data-business]')!;
    company.hidden = project.value !== 'entreprise';
    for (const input of company.querySelectorAll<HTMLInputElement>('input'))
      input.disabled = company.hidden;
    date.required =
      flexibility.value === 'date-fixe' || flexibility.value === 'flexible';
  }
  function render(focus = true) {
    const active = steps();
    fieldsets.forEach((f) => {
      const current = active[step] === f;
      f.hidden = !current;
      f.disabled = !current;
    });
    conditionals();
    const isReview = step === active.length;
    review.hidden = !isReview;
    next.hidden = isReview;
    previous.hidden = step === 0;
    progress.max = active.length + 1;
    progress.value = step + 1;
    label.textContent = `Étape ${step + 1} sur ${active.length + 1} · ${isReview ? 'Récapitulatif' : active[step].querySelector('legend')!.textContent}`;
    next.textContent =
      step === active.length - 1 ? 'Vérifier ma demande' : 'Continuer';
    if (focus)
      (isReview
        ? review.querySelector<HTMLElement>('h2')
        : active[step].querySelector<HTMLElement>('legend')
      )?.focus();
  }
  function buildSummary() {
    // Read only active paths. Re-enable fields briefly for FormData, then restore the view.
    const active = steps();
    fieldsets.forEach((f) => (f.disabled = !active.includes(f)));
    conditionals();
    if (!requestReference) requestReference = `PREPA-${crypto.randomUUID()}`;
    const entries = [...new FormData(form).entries()].filter(
      ([, value]) => typeof value === 'string' && value.trim(),
    );
    const selectLabels = new Map(
      [...form!.querySelectorAll<HTMLSelectElement>('select')].map((s) => [
        s.name,
        s.selectedOptions[0]?.textContent || s.value,
      ]),
    );
    recap = `DEMANDE DE DEVIS MAZAT — NON ENVOYÉE\nRéférence locale de préparation : ${requestReference}\nPréparée le : ${new Date().toLocaleString('fr-FR')}\n\n${entries.map(([name, value]) => `${name} : ${selectLabels.get(name) || value}`).join('\n')}\n\nCette demande n’est pas un devis contractuel. Aucun prix n’est calculé. Référence de préparation uniquement : la date de dépôt et le numéro de dossier seront attribués à réception par MAZAT.`;
    summary.textContent = recap;
    status.hidden = true;
  }
  form.noValidate = true;
  progress.hidden = false;
  form.querySelector<HTMLElement>('.form-buttons')!.hidden = false;
  form.addEventListener('change', () => {
    conditionals();
  });
  [volume, inventory].forEach((input) =>
    input.addEventListener('input', () => volume.setCustomValidity('')),
  );
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const active = steps();
    const fieldset = active[step];
    if (!fieldset) return;
    if (fieldset.dataset.step === 'volume')
      volume.setCustomValidity(
        !volume.value && !inventory.value.trim()
          ? 'Indiquez un volume estimé ou décrivez votre inventaire.'
          : '',
      );
    if (!form.reportValidity()) return;
    step++;
    if (step === active.length) buildSummary();
    render();
  });
  previous.addEventListener('click', () => {
    if (step > 0) {
      step--;
      render();
    }
  });
  form.querySelector('#email-draft')!.addEventListener('click', () => {
    const subject = 'Demande de devis MAZAT';
    // Keep mailto short for mail clients with limited URI length. The text attachment is the reliable full copy.
    const short = recap.length > 1600;
    const body = short
      ? `Bonjour,\n\nJe souhaite recevoir un devis de déménagement.\nRéférence de préparation : ${requestReference}\n\nJe joins le récapitulatif téléchargé depuis le site ainsi que mes éventuelles photos.\n\nMerci.`
      : recap;
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.hidden = false;
    status.textContent = short
      ? 'Votre messagerie a été sollicitée. Téléchargez et joignez le récapitulatif complet avant l’envoi. Le site ne peut pas confirmer l’envoi ni la réception.'
      : 'Votre messagerie a été sollicitée. Vérifiez le contenu, ajoutez vos pièces jointes puis envoyez le message. Le site ne peut pas confirmer l’envoi ni la réception.';
  });
  form.querySelector('#download-summary')!.addEventListener('click', () => {
    const url = URL.createObjectURL(
      new Blob([recap], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'demande-devis-mazat.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  render(false);
}
