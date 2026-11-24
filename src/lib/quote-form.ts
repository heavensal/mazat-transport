import { sendFormWithForge } from './form-forge';

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
  const reviewTitle = form.querySelector<HTMLElement>('#quote-heading')!;
  const sendButton = form.querySelector<HTMLButtonElement>('#send-request')!;
  const sendStatus = form.querySelector<HTMLElement>('#send-status')!;
  const sendError = form.querySelector<HTMLElement>('#send-error')!;
  const downloadButton =
    form.querySelector<HTMLButtonElement>('#download-summary')!;
  const formButtons = form.querySelector<HTMLElement>('.form-buttons')!;
  const volume = form.querySelector<HTMLInputElement>('#volume')!;
  const inventory = form.querySelector<HTMLTextAreaElement>('#inventory')!;
  const date = form.querySelector<HTMLInputElement>('#moving-date')!;
  const flexibility = form.querySelector<HTMLSelectElement>('#flexibility')!;
  const senderContactStatus = form.querySelector<HTMLSelectElement>(
    '#sender-contact-status',
  )!;
  const senderContactFields = form.querySelector<HTMLElement>(
    '#sender-contact-fields',
  )!;
  const recipientContactStatus = form.querySelector<HTMLSelectElement>(
    '#recipient-contact-status',
  )!;
  const recipientContactFields = form.querySelector<HTMLElement>(
    '#recipient-contact-fields',
  )!;
  const incotermStatus =
    form.querySelector<HTMLSelectElement>('#incoterm-status')!;
  const incotermDetails = form.querySelector<HTMLElement>('#incoterm-details')!;
  const incotermValue =
    form.querySelector<HTMLInputElement>('#incoterm-value')!;
  let step = 0;
  let recap = '';
  let requestReference = '';
  let formFields: Record<string, string> = {};
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
    const senderIsOther = senderContactStatus.value === 'autre';
    senderContactFields.hidden = !senderIsOther;
    for (const input of senderContactFields.querySelectorAll<HTMLInputElement>(
      'input',
    )) {
      input.disabled = !senderIsOther;
      input.required = senderIsOther;
    }
    const recipientIsOther = recipientContactStatus.value === 'autre';
    recipientContactFields.hidden = !recipientIsOther;
    for (const input of recipientContactFields.querySelectorAll<HTMLInputElement>(
      'input',
    )) {
      input.disabled = !recipientIsOther;
      input.required = recipientIsOther;
    }
    const incotermIsDefined = incotermStatus.value === 'defini';
    incotermDetails.hidden = !incotermIsDefined;
    incotermValue.disabled = !incotermIsDefined;
    incotermValue.required = incotermIsDefined;
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
    const selectLabels = new Map(
      [...form!.querySelectorAll<HTMLSelectElement>('select')].map((s) => [
        s.name,
        s.selectedOptions[0]?.textContent || s.value,
      ]),
    );
    const entries = [...new FormData(form).entries()]
      .filter(
        (entry): entry is [string, string] =>
          typeof entry[1] === 'string' && entry[1].trim().length > 0,
      )
      .map(
        ([name, value]) => [name, selectLabels.get(name) || value.trim()] as const,
      );
    formFields = Object.fromEntries(entries);
    recap = `DEMANDE DE DEVIS MAZAT\nRéférence locale de préparation : ${requestReference}\nPréparée le : ${new Date().toLocaleString('fr-FR')}\n\n${entries.map(([name, value]) => `${name} : ${value}`).join('\n')}\n\nCette demande n’est pas un devis contractuel. Aucun prix n’est calculé. Référence de préparation uniquement : la date de dépôt et le numéro de dossier seront attribués à réception par MAZAT.`;
    summary.textContent = recap;
    sendStatus.hidden = true;
    sendError.hidden = true;
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
      sendStatus.hidden = true;
      sendError.hidden = true;
      step--;
      render();
    }
  });
  sendButton.addEventListener('click', async () => {
    sendButton.disabled = true;
    previous.disabled = true;
    downloadButton.disabled = true;
    sendButton.textContent = 'Envoi en cours…';
    sendError.hidden = true;
    sendStatus.hidden = false;
    sendStatus.textContent = 'Envoi de votre demande en cours…';
    form.setAttribute('aria-busy', 'true');

    try {
      const email = formFields.Email?.trim();
      if (!email) throw new Error('Votre adresse email est manquante.');
      await sendFormWithForge(form.dataset.forgeFormToken ?? '', {
        from_email: email,
        fields: {
          ...formFields,
          nom: [formFields['Prénom'], formFields.Nom].filter(Boolean).join(' '),
          email,
          phone: formFields.Téléphone ?? '',
          message: recap,
        },
      });
      reviewTitle.textContent = 'Demande envoyée';
      sendStatus.textContent =
        'Forge a accepté votre demande pour envoi à MAZAT. Cela ne garantit pas sa réception finale par email.';
      sendButton.hidden = true;
      formButtons.hidden = true;
      reviewTitle.focus();
    } catch (error) {
      console.error('[Demande de devis] Échec de l’envoi Forge.', error);
      sendStatus.hidden = true;
      sendError.textContent = `L’envoi a échoué. ${error instanceof Error ? error.message : 'Une erreur inattendue est survenue.'} Vos réponses sont conservées sur cette page : vous pouvez réessayer ou contacter MAZAT par email.`;
      sendError.hidden = false;
      sendButton.disabled = false;
      sendButton.textContent = 'Réessayer l’envoi';
    } finally {
      previous.disabled = false;
      downloadButton.disabled = false;
      form.removeAttribute('aria-busy');
    }
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
