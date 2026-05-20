export function generateSlug(person1: string, person2: string): string {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const base = `${normalize(person1)}-e-${normalize(person2)}`;
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
