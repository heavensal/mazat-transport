/** Calendar and callback preferences use the company's timezone, including DST changes. */
export function parisDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: string) =>
    parts.find((item) => item.type === type)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function callbackSlots(now = new Date()) {
  const today = parisDate(now);
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(now),
  );
  const slots: { value: string; label: string; disabled: boolean }[] = [];
  for (let day = 0; day < 7; day++) {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + day);
    const iso = date.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'UTC',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);
    for (const [period, endHour] of [
      ['Matin', 12],
      ['Après-midi', 18],
    ] as const) {
      const disabled = day === 0 && hour >= endHour;
      slots.push({
        value: `${iso}-${period}`,
        label: `${day === 0 ? 'Aujourd’hui, ' : ''}${label} · ${period}${disabled ? ' (terminé)' : ''}`,
        disabled,
      });
    }
  }
  return slots;
}
