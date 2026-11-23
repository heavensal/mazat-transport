// Build-only transport. Missing credentials and failed requests are not empty lists.
export async function fetchResource(
  resource: 'faqs' | 'reviews',
): Promise<Record<string, unknown>[] | null> {
  const enabled =
    resource === 'faqs'
      ? import.meta.env.FORGE_FAQ_ENABLED
      : import.meta.env.FORGE_REVIEWS_ENABLED;
  if ((enabled ?? 'true') !== 'true') return null;
  const token = import.meta.env.FORGE_API_TOKEN;
  if (!token) {
    console.warn(
      `[Forge ${resource}] Missing credentials; using approved local content only.`,
    );
    return null;
  }
  try {
    const base = import.meta.env.FORGE_URL || 'https://forge.1344.fr/api/v1';
    const response = await fetch(
      `${base.replace(/\/$/, '')}/${resource}?locale=fr`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (
      !Array.isArray(payload.data) ||
      (payload.locale && payload.locale !== 'fr')
    )
      throw new Error('Invalid response');
    if (
      !payload.data.every(
        (item: unknown) =>
          item &&
          typeof item === 'object' &&
          (!('locale' in item) || item.locale === 'fr'),
      )
    )
      throw new Error('Invalid item or locale');
    return payload.data;
  } catch (error) {
    console.warn(
      `[Forge ${resource}] Import unavailable: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
    return null;
  }
}
