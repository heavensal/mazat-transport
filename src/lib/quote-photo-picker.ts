export function setupPhotoPicker(
  input: HTMLInputElement,
  preview: HTMLElement,
  status: HTMLElement,
  clear: HTMLButtonElement,
  showError: (input: HTMLInputElement, message: string) => void,
) {
  let files: File[] = [];
  let urls: string[] = [];
  function render() {
    urls.forEach((url) => URL.revokeObjectURL(url));
    urls = [];
    preview.replaceChildren();
    files.forEach((file, index) => {
      const card = document.createElement('div');
      card.className = 'relative aspect-square min-w-0';
      const image = document.createElement('img');
      const url = URL.createObjectURL(file);
      urls.push(url);
      image.src = url;
      image.alt = `Photo sélectionnée : ${file.name}`;
      image.className = 'h-full w-full rounded-md object-cover';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className =
        'absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-2xl text-red-800 shadow-sm';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Retirer la photo ${file.name}`);
      remove.addEventListener('click', () => {
        files.splice(index, 1);
        showError(input, '');
        render();
        (
          preview.querySelectorAll('button')[
            Math.min(index, files.length - 1)
          ] ?? input
        ).focus();
      });
      card.append(image, remove);
      preview.append(card);
    });
    clear.hidden = !files.length;
    status.textContent = files.length
      ? `${files.length} photo(s) sélectionnée(s) sur 3.`
      : 'Aucune photo sélectionnée.';
  }
  input.addEventListener('change', () => {
    const added = Array.from(input.files ?? []);
    input.value = '';
    if (!added.length) return;
    const error =
      files.length + added.length > 3
        ? '3 photos maximum. Aucun fichier de cette sélection n’a été ajouté.'
        : added.some(
              (file) =>
                !['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            )
          ? 'Sélection refusée : utilisez des photos JPEG, PNG ou WebP.'
          : added.some((file) => !file.size || file.size > 25 * 1024 * 1024)
            ? 'Sélection refusée : chaque photo doit contenir des données et peser au maximum 25 Mo.'
            : '';
    if (error) {
      showError(input, error);
      input.focus();
      return;
    }
    files.push(...added);
    showError(input, '');
    render();
  });
  function reset() {
    files = [];
    input.value = '';
    showError(input, '');
    render();
  }
  clear.addEventListener('click', () => {
    reset();
    input.focus();
  });
  window.addEventListener('pagehide', () => {
    urls.forEach((url) => URL.revokeObjectURL(url));
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) render();
  });
  render();
  return { getFiles: () => [...files], reset };
}
