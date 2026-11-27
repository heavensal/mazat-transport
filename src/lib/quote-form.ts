import { sendFormWithForge } from './form-forge';
import { resizeContactPhotos } from './quote-photos';
import { parisDate, callbackSlots } from './quote-schedule';
import { setupValidation } from './quote-validation';
import { setupPhotoPicker } from './quote-photo-picker';

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
  const sendButton = form.querySelector<HTMLButtonElement>('#send-request')!;
  const confirmation = form.querySelector<HTMLElement>('#quote-confirmation')!;
  const photos = form.querySelector<HTMLInputElement>('#quote-photos')!;
  const photoSelection = form.querySelector<HTMLElement>('#photos-selection')!;
  const clearPhotos = form.querySelector<HTMLButtonElement>('#clear-photos')!;
  const callback = form.querySelector<HTMLSelectElement>('#callback-slot')!;
  const panel = document.querySelector<HTMLElement>('#submission-panel')!;
  const panelTitle = panel.querySelector<HTMLElement>('#submission-title')!;
  const panelMessage = panel.querySelector<HTMLElement>('#submission-message')!;
  const panelIcon = panel.querySelector<HTMLElement>('#submission-icon')!;
  const returnButton =
    panel.querySelector<HTMLButtonElement>('#return-to-quote')!;
  let sending = false;
  let sent = false;
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
  for (const checkbox of form.querySelectorAll<HTMLInputElement>(
    '[data-service]',
  )) {
    checkbox.checked = params
      .getAll('service')
      .includes(checkbox.dataset.service!);
  }
  function refreshSchedule() {
    date.min = parisDate();
    date.setCustomValidity(
      date.value && date.value < date.min
        ? 'Choisissez une date à partir d’aujourd’hui.'
        : '',
    );
    const selected = callback.value;
    const options = callbackSlots();
    callback.replaceChildren(new Option('Sans préférence', ''));
    for (const slot of options) {
      const option = new Option(slot.label, slot.value);
      option.disabled = slot.disabled;
      callback.append(option);
    }
    if (
      selected &&
      !options.some((slot) => slot.value === selected && !slot.disabled)
    ) {
      const expired = new Option(
        'Créneau passé — choisissez une autre plage',
        selected,
      );
      expired.disabled = true;
      callback.append(expired);
      callback.setCustomValidity(
        'Ce créneau est passé. Choisissez une autre plage ou « Sans préférence ».',
      );
    } else {
      callback.setCustomValidity('');
    }
    callback.value = selected;
  }
  const validation = setupValidation(form);
  const photoPicker = setupPhotoPicker(
    photos,
    form.querySelector<HTMLElement>('#photos-preview')!,
    photoSelection,
    clearPhotos,
    validation.show,
  );
  date.addEventListener('input', refreshSchedule);
  callback.addEventListener('change', refreshSchedule);
  window.addEventListener('focus', refreshSchedule);
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
    refreshSchedule();
    const isReview = step === active.length;
    review.hidden = !isReview;
    next.hidden = isReview;
    previous.hidden = step === 0;
    progress.max = active.length + 1;
    progress.value = step + 1;
    label.textContent = `Étape ${step + 1} sur ${active.length + 1} · ${isReview ? 'Confirmation' : active[step].querySelector('legend')!.textContent}`;
    next.textContent =
      step === active.length - 1 ? 'Préparer l’envoi' : 'Continuer';
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
        ([name, value]) =>
          [
            name,
            name === 'Téléphone'
              ? `+33${value.trim().replace(/^0/, '')}`
              : selectLabels.get(name) || value.trim(),
          ] as const,
      );
    formFields = {};
    for (const [name, value] of entries) {
      formFields[name] = formFields[name]
        ? `${formFields[name]}, ${value}`
        : value;
    }
    formFields['Photos jointes'] = String(photoPicker.getFiles().length);
    recap = `DEMANDE DE DEVIS MAZAT\nRéférence locale de préparation : ${requestReference}\nPréparée le : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}\n\n${Object.entries(
      formFields,
    )
      .map(([name, value]) => `${name} : ${value}`)
      .join(
        '\n',
      )}\n\nCette demande n’est pas un devis contractuel. Aucun prix n’est calculé.`;
    confirmation.textContent = `${photoPicker.getFiles().length} photo(s) accompagneront votre demande. Nous vous recontacterons aux coordonnées indiquées.`;
  }
  form.noValidate = true;
  progress.hidden = false;
  form.querySelector<HTMLElement>('.form-buttons')!.hidden = false;
  form.addEventListener('change', () => {
    conditionals();
  });
  [volume, inventory].forEach((input) =>
    input.addEventListener('input', () => {
      volume.setCustomValidity('');
      if (volume.getAttribute('aria-invalid')) validation.show(volume);
    }),
  );
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (sending || sent) return;
    refreshSchedule();
    const active = steps();
    const fieldset = active[step];
    if (!fieldset) return;
    if (fieldset.dataset.step === 'volume')
      volume.setCustomValidity(
        !volume.value && !inventory.value.trim()
          ? 'Indiquez un volume estimé ou décrivez votre inventaire.'
          : '',
      );
    if (!validation.validate(fieldset)) return;
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
  function showSubmission(state: 'sending' | 'success' | 'error', detail = '') {
    form!.hidden = true;
    panel.hidden = false;
    returnButton.hidden = state !== 'error';
    panelIcon.textContent =
      state === 'sending' ? '…' : state === 'success' ? '✓' : '!';
    panelIcon.className = `mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${state === 'error' ? 'bg-red-100 text-red-800' : state === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800 motion-safe:animate-pulse'}`;
    panelTitle.textContent =
      state === 'sending'
        ? 'En cours d’envoi'
        : state === 'success'
          ? 'Envoi réussi'
          : 'L’envoi a échoué';
    panelMessage.textContent =
      state === 'sending'
        ? 'Préparation des photos et transmission de votre demande…'
        : state === 'success'
          ? 'Nous vous répondrons rapidement.'
          : `${detail} Vos réponses et vos photos sont conservées. Revenez à votre demande pour les vérifier ou réessayer.`;
    panelTitle.focus();
  }
  returnButton.addEventListener('click', () => {
    panel.hidden = true;
    form!.hidden = false;
    render();
  });
  sendButton.addEventListener('click', async () => {
    if (sending || sent) return;
    refreshSchedule();
    const active = steps();
    // Revalidate every relevant step before sending, including dates after midnight.
    fieldsets.forEach((fieldset) => {
      fieldset.disabled = !active.includes(fieldset);
    });
    conditionals();
    volume.setCustomValidity(
      !volume.value && !inventory.value.trim()
        ? 'Indiquez un volume estimé ou décrivez votre inventaire.'
        : '',
    );
    const invalid = active.find((fieldset) =>
      [
        ...fieldset.querySelectorAll<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >('input, select, textarea'),
      ].some((input) => !input.checkValidity()),
    );
    if (invalid) {
      step = active.indexOf(invalid);
      render();
      validation.validate(invalid);
      return;
    }
    buildSummary();
    render(false);
    sending = true;
    sendButton.disabled = true;
    showSubmission('sending');
    try {
      const email = formFields['Email']?.trim();
      if (!email) throw new Error('Votre adresse email est manquante.');
      const attachments = await resizeContactPhotos(photoPicker.getFiles());
      await sendFormWithForge(form!.dataset.forgeFormToken ?? '', {
        from_email: email,
        fields: {
          ...formFields,
          nom: [formFields['Prénom'], formFields['Nom']]
            .filter(Boolean)
            .join(' '),
          email,
          phone: formFields['Téléphone'] ?? '',
          message: recap,
        },
        attachments,
      });
      sent = true;
      showSubmission('success');
      photoPicker.reset();
    } catch (error) {
      showSubmission(
        'error',
        error instanceof Error
          ? error.message
          : 'Une erreur inattendue est survenue.',
      );
    } finally {
      sending = false;
      sendButton.disabled = sent;
    }
  });
  render(false);
}
