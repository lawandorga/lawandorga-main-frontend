export function getNextQuery(nextPath: string, query = {}) {
  if (!nextPath.includes("login")) query = { ...query, next: nextPath };
  return query;
}
