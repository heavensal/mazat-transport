import type { ContactPhoto } from './quote-photos';

export interface ForgeFormSubmission {
  from_email: string;
  fields: Record<string, string>;
  attachments?: ContactPhoto[];
}

export async function sendFormWithForge(
  token: string,
  submission: ForgeFormSubmission,
): Promise<void> {
  if (!token.trim()) {
    throw new Error(
      'Le formulaire d’envoi n’est pas configuré. Contactez MAZAT Transport.',
    );
  }

  let response: Response;
  try {
    response = await fetch('https://forge.1344.fr/api/v1/send_form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(submission),
      signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error('Le service d’envoi ne répond pas. Réessayez.');
    }
    throw new Error(
      'Le service d’envoi est inaccessible. Vérifiez votre connexion ou contactez MAZAT Transport.',
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new Error(
      `Le service d’envoi a refusé la demande (HTTP ${response.status}).`,
    );
  }
  const result = await response.json().catch(() => null);
  if (result?.ok !== true) {
    throw new Error('Le service n’a pas confirmé l’envoi. Veuillez réessayer.');
  }
}
