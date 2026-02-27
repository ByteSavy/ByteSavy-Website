export function projectSlugFromTitle(title) {
  if (!title) return '';
  return title
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

