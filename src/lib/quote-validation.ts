type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function setupValidation(form: HTMLFormElement) {
  const errors = new Map<Field, HTMLElement>();
  let count = 0;
  function show(field: Field, message?: string) {
    const text =
      message ??
      (field.validity.valid || field.matches(':disabled')
        ? ''
        : field.validity.customError
          ? field.validationMessage
          : field.validity.valueMissing
            ? 'Veuillez renseigner ce champ.'
            : field.type === 'tel' && field.id === 'contact-phone'
              ? 'Saisissez 10 chiffres commençant par 0, ou 9 chiffres sans le 0 (ex. 0612345678). Le +33 est déjà ajouté.'
              : field.validity.typeMismatch && field.type === 'email'
                ? 'Saisissez une adresse email valide, par exemple nom@exemple.fr.'
                : field.validity.stepMismatch
                  ? 'Saisissez un nombre entier.'
                  : field.validationMessage || 'Vérifiez la valeur saisie.');
    let error = errors.get(field);
    if (!error && text) {
      error = document.createElement('p');
      error.id = `quote-field-error-${++count}`;
      error.className = 'mt-2 text-sm font-normal text-red-800';
      error.setAttribute('aria-live', 'polite');
      if (field.type === 'checkbox')
        (field.closest('label') ?? field).after(error);
      else if (field.id === 'contact-phone') field.parentElement!.after(error);
      else field.after(error);
      errors.set(field, error);
      field.setAttribute(
        'aria-describedby',
        [field.getAttribute('aria-describedby'), error.id]
          .filter(Boolean)
          .join(' '),
      );
    }
    if (error) {
      error.textContent = text;
      error.hidden = !text;
    }
    if (text) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }
  function focus(field: Field) {
    field.focus({ preventScroll: true });
    field.scrollIntoView({ block: 'center', behavior: 'auto' });
  }
  function validate(scope: HTMLElement) {
    let first: Field | undefined;
    for (const field of scope.querySelectorAll<Field>(
      'input, select, textarea',
    )) {
      show(field);
      if (!field.matches(':disabled') && !field.validity.valid && !first)
        first = field;
    }
    if (first) focus(first);
    return !first;
  }
  for (const type of ['input', 'change', 'focusout']) {
    form.addEventListener(type, (event) => {
      const field = event.target;
      if (!(
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ))
        return;
      if (field.type === 'file') return;
      if (type === 'focusout' || errors.has(field)) show(field);
    });
  }
  return { show, focus, validate };
}
