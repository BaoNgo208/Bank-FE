export const toUtcStartOfDay = (date: string | null | undefined): string | undefined => {
  if (!date) return undefined;

  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);

  return d.toISOString();
};

export const toUtcEndOfDay = (date: string | null | undefined): string | undefined => {
  if (!date) return undefined;

  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);

  return d.toISOString();
};
