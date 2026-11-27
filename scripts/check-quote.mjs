import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';

async function load(path) {
  const source = stripTypeScriptTypes(
    await readFile(new URL(path, import.meta.url), 'utf8'),
  );
  return import(
    `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
  );
}
const { parisDate, callbackSlots } = await load('../src/lib/quote-schedule.ts');
assert.equal(parisDate(new Date('2026-11-26T23:30:00Z')), '2026-11-27');
for (const instant of [
  '2026-03-28T23:30:00Z',
  '2026-10-24T23:30:00Z',
  '2026-12-31T23:30:00Z',
]) {
  const slots = callbackSlots(new Date(instant));
  assert.equal(slots.length, 14);
  const days = [...new Set(slots.map((s) => s.value.slice(0, 10)))];
  assert.equal(days.length, 7);
  assert.equal(days[0], parisDate(new Date(instant)));
  assert.equal(new Date(days[6]) - new Date(days[0]), 6 * 86400000);
}
const afternoon = callbackSlots(new Date('2026-11-27T12:00:00Z'));
assert.equal(afternoon[0].disabled, true);
assert.equal(afternoon[1].disabled, false);
const evening = callbackSlots(new Date('2026-11-27T18:00:00Z'));
assert.equal(evening[0].disabled, true);
assert.equal(evening[1].disabled, true);
assert.ok(evening.slice(2).every((s) => !s.disabled));

const { sendFormWithForge } = await load('../src/lib/form-forge.ts');
const originalFetch = globalThis.fetch;
let calls = 0;
const payload = {
  from_email: 'test@example.invalid',
  fields: { message: 'Test' },
  attachments: [
    { filename: 'photo-1.jpg', content_type: 'image/jpeg', data: '/9j/' },
  ],
};
try {
  globalThis.fetch = async (url, options) => {
    calls++;
    assert.equal(url, 'https://forge.1344.fr/api/v1/send_form');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.deepEqual(JSON.parse(options.body), payload);
    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  };
  await assert.rejects(sendFormWithForge('', payload), /configuré/);
  assert.equal(calls, 0);
  await sendFormWithForge('test-token', payload);
  assert.equal(calls, 1);
  for (const response of [
    new Response('{}', { status: 422 }),
    new Response('{"ok":false}'),
    new Response('not-json'),
  ]) {
    globalThis.fetch = async () => response;
    await assert.rejects(sendFormWithForge('test-token', payload));
  }
  globalThis.fetch = async () => {
    throw new DOMException('Timeout', 'TimeoutError');
  };
  await assert.rejects(
    sendFormWithForge('test-token', payload),
    /ne répond pas/,
  );
} finally {
  globalThis.fetch = originalFetch;
}

const photoSource = stripTypeScriptTypes(
  await readFile(
    new URL('../src/lib/quote-photos.ts', import.meta.url),
    'utf8',
  ),
).replaceAll('export ', '');
let closed = 0;
const canvas = {
  getContext: () => ({ fillRect() {}, drawImage() {} }),
  toDataURL: () => 'data:image/jpeg;base64,/9j/',
};
const context = {
  createImageBitmap: async () => ({
    width: 4000,
    height: 3000,
    close() {
      closed++;
    },
  }),
  document: { createElement: () => canvas },
};
runInNewContext(
  photoSource + '\nglobalThis.prepare = resizeContactPhotos;',
  context,
);
const photo = { size: 1024, type: 'image/png' };
const encoded = await context.prepare([photo, photo, photo]);
assert.equal(encoded.length, 3);
assert.equal(closed, 3);
assert.ok(
  encoded.every((p) => p.content_type === 'image/jpeg' && p.data === '/9j/'),
);
assert.equal(canvas.width, 1600);
assert.equal(canvas.height, 1200);
await assert.rejects(context.prepare([photo, photo, photo, photo]), /3 photos/);
await assert.rejects(
  context.prepare([{ size: 100, type: 'application/pdf' }]),
  /JPEG/,
);
await assert.rejects(
  context.prepare([{ size: 26 * 1024 * 1024, type: 'image/jpeg' }]),
  /volumineuse/,
);
context.createImageBitmap = async () => {
  throw new Error('bad image');
};
await assert.rejects(context.prepare([photo]), /illisible/);
console.log(
  'PASS: Paris calendar/DST, seven-day callback slots, expired slots, Forge payload/confirmation/errors, photo count/type/size/conversion. No network calls.',
);

// Exercise the controller without a browser or a real submission.
class Element {
  constructor() {
    this.value = '';
    this.textContent = '';
    this.hidden = false;
    this.disabled = false;
    this.dataset = {};
    this.events = {};
    this.options = [];
    this.files = [];
  }
  addEventListener(type, listener) {
    this.events[type] = listener;
  }
  setCustomValidity(message) {
    this.error = message;
  }
  checkValidity() {
    return this.disabled || !this.error;
  }
  focus() {
    this.focused = true;
  }
  replaceChildren(...children) {
    this.options = children;
  }
  append(child) {
    this.options.push(child);
  }
  querySelector() {
    return new Element();
  }
  querySelectorAll() {
    return [];
  }
}
const ids = new Map();
const element = (selector) => {
  if (!ids.has(selector)) ids.set(selector, new Element());
  return ids.get(selector);
};
const form = element('#quote-form');
const fields = [
  'project',
  'departure',
  'arrival',
  'volume',
  'export',
  'contact',
].map((step) => {
  const fieldset = new Element();
  fieldset.dataset.step = step;
  fieldset.querySelector = () => ({ textContent: step, focus() {} });
  fieldset.querySelectorAll = () =>
    step === 'project' ? [element('#moving-date')] : [];
  return fieldset;
});
const serviceChecks = ['stockage', 'acces'].map((service) => {
  const el = new Element();
  el.dataset.service = service;
  return el;
});
form.querySelector = element;
form.querySelectorAll = (selector) =>
  selector === '[data-step]'
    ? fields
    : selector === '[data-service]'
      ? serviceChecks
      : [];
form.reportValidity = () => true;
element('#project-type').value = 'particulier';
element('#volume').value = '10';
element('#submission-panel').querySelector = element;
let pendingResolve,
  pendingReject,
  submissions = [];
const fakeDocument = { querySelector: element };
const controller = stripTypeScriptTypes(
  await readFile(new URL('../src/lib/quote-form.ts', import.meta.url), 'utf8'),
).replace(/^import .*;\n/gm, '');
runInNewContext(controller, {
  document: fakeDocument,
  window: { addEventListener() {} },
  URLSearchParams,
  location: { search: '?service=stockage&service=acces' },
  Option: class {
    constructor(textContent, value) {
      this.textContent = textContent;
      this.value = value;
    }
  },
  crypto: { randomUUID: () => 'test-reference' },
  FormData: class {
    entries() {
      return [
        ['Email', 'test@example.invalid'],
        ['Services complémentaires', 'Garde-meubles / stockage'],
        ['Services complémentaires', 'Monte-meubles'],
      ][Symbol.iterator]();
    }
  },
  parisDate: () => '2026-11-27',
  callbackSlots: () => callbackSlots(new Date('2026-11-27T08:00:00Z')),
  setupValidation: () => ({
    show() {},
    validate: (scope) =>
      [...scope.querySelectorAll('input, select, textarea')].every((input) =>
        input.checkValidity(),
      ),
  }),
  setupPhotoPicker: () => ({ getFiles: () => [], reset() {} }),
  resizeContactPhotos: async () => encoded,
  sendFormWithForge: async (_, submission) => {
    submissions.push(submission);
    return new Promise((resolve, reject) => {
      pendingResolve = resolve;
      pendingReject = reject;
    });
  },
});
assert.ok(serviceChecks.every((el) => el.checked));
assert.equal(element('#moving-date').min, '2026-11-27');
element('#moving-date').value = '2026-11-26';
element('#moving-date').events.input();
assert.match(element('#moving-date').error, /aujourd’hui/);
element('#moving-date').value = '2026-11-28';
element('#moving-date').events.input();
assert.equal(element('#moving-date').error, '');
for (let i = 0; i < 5; i++) form.events.submit({ preventDefault() {} });
assert.equal(element('#quote-review').hidden, false);
assert.equal(fields[4].disabled, true); // Export omitted for a domestic request.
const firstSend = element('#send-request').events.click();
await new Promise((resolve) => setImmediate(resolve));
assert.equal(form.hidden, true);
assert.equal(element('#submission-title').textContent, 'En cours d’envoi');
await element('#send-request').events.click();
assert.equal(submissions.length, 1); // Double click cannot create a second send.
assert.equal(
  submissions[0].fields['Services complémentaires'],
  'Garde-meubles / stockage, Monte-meubles',
);
assert.equal(submissions[0].attachments.length, 3);
assert.match(submissions[0].fields.message, /DEMANDE DE DEVIS MAZAT/);
pendingReject(new Error('Test failure'));
await firstSend;
assert.equal(element('#submission-title').textContent, 'L’envoi a échoué');
assert.equal(element('#return-to-quote').hidden, false);
element('#return-to-quote').events.click();
assert.equal(form.hidden, false);
assert.equal(element('#volume').value, '10');
const retry = element('#send-request').events.click();
await new Promise((resolve) => setImmediate(resolve));
pendingResolve();
await retry;
assert.equal(element('#submission-title').textContent, 'Envoi réussi');
assert.equal(
  element('#submission-message').textContent,
  'Nous vous répondrons rapidement.',
);
assert.equal(element('#return-to-quote').hidden, true);
await element('#send-request').events.click();
assert.equal(submissions.length, 2);
console.log(
  'PASS: multi-service serialization, date validation, domestic steps, sending/error/return/retry/success, double-submit prevention. Controller DOM mocked; no browser opened.',
);

class UiElement extends Element {
  constructor() {
    super();
    this.children = [];
    this.attributes = {};
    this.validity = { valid: true };
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  getAttribute(name) {
    return this.attributes[name] ?? null;
  }
  removeAttribute(name) {
    delete this.attributes[name];
  }
  append(...children) {
    this.children.push(...children);
  }
  replaceChildren(...children) {
    this.children = children;
  }
  after(node) {
    this.errorNode = node;
  }
  matches() {
    return this.disabled;
  }
  scrollIntoView() {
    this.scrolled = true;
  }
  querySelectorAll() {
    return this.children.flatMap((child) =>
      child.children.filter((node) => node.type === 'button'),
    );
  }
}
const uiDocument = { createElement: () => new UiElement() };
const uiContext = {
  document: uiDocument,
  window: { addEventListener() {} },
  HTMLInputElement: UiElement,
  HTMLSelectElement: UiElement,
  HTMLTextAreaElement: UiElement,
  URL: {
    createObjectURL: () => `blob:test-${Math.random()}`,
    revokeObjectURL() {},
  },
};
for (const [file, exported] of [
  ['quote-validation.ts', 'setupValidation'],
  ['quote-photo-picker.ts', 'setupPhotoPicker'],
]) {
  const code = stripTypeScriptTypes(
    await readFile(new URL(`../src/lib/${file}`, import.meta.url), 'utf8'),
  ).replaceAll('export ', '');
  runInNewContext(code + `\nglobalThis.${exported} = ${exported};`, uiContext);
}
const uiForm = new UiElement();
const validator = uiContext.setupValidation(uiForm);
const email = new UiElement();
email.type = 'email';
email.validity = { valid: false, typeMismatch: true };
email.setAttribute('aria-describedby', 'email-help');
uiForm.querySelectorAll = () => [email];
assert.equal(validator.validate(uiForm), false);
assert.match(email.errorNode.textContent, /nom@exemple.fr/);
assert.ok(email.focused && email.scrolled);
assert.match(
  email.getAttribute('aria-describedby'),
  /^email-help quote-field-error-/,
);
assert.equal(email.getAttribute('aria-invalid'), 'true');
email.validity = { valid: true };
uiForm.events.input({ target: email });
assert.equal(email.errorNode.hidden, true);
assert.equal(email.getAttribute('aria-invalid'), null);
const pickerInput = new UiElement();
pickerInput.type = 'file';
const preview = new UiElement(),
  status = new UiElement(),
  clear = new UiElement();
const picker = uiContext.setupPhotoPicker(
  pickerInput,
  preview,
  status,
  clear,
  validator.show,
);
const upload = (files) => {
  pickerInput.files = files;
  pickerInput.events.change();
  uiForm.events.change({ target: pickerInput });
};
const sample = { name: 'cartons.png', type: 'image/png', size: 123 };
upload([sample, sample, sample, sample]);
assert.equal(picker.getFiles().length, 0);
assert.equal(preview.children.length, 0);
assert.match(pickerInput.errorNode.textContent, /Aucun fichier/);
assert.equal(pickerInput.value, '');
upload([sample, sample]);
assert.equal(picker.getFiles().length, 2);
assert.equal(preview.children.length, 2);
upload([sample, sample]);
assert.equal(picker.getFiles().length, 2);
assert.equal(preview.children.length, 2);
preview.querySelectorAll()[0].events.click();
assert.equal(picker.getFiles().length, 1);
assert.equal(preview.children.length, 1);
upload([sample, sample]);
assert.equal(picker.getFiles().length, 3);
assert.equal(preview.children.length, 3);
picker.reset();
assert.equal(picker.getFiles().length, 0);
assert.equal(preview.children.length, 0);
assert.equal(clear.hidden, true);
console.log(
  'PASS: inline email errors/focus/scroll/ARIA, rejected over-limit selection, incremental photos, previews, individual removal and reset (DOM mocked).',
);
