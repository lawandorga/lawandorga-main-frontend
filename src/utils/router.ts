export function getNextQuery(nextPath: string, query = {}) {
  if (!nextPath.includes("login")) query = { next: nextPath };
  return query;
}
