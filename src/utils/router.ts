export function getNextQuery(nextPath: string) {
  let query = {};
  if (!nextPath.includes("login")) query = { next: nextPath };
  return query;
}
