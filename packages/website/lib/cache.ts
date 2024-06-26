const cache: Record<string, Record<'srcMd'|'exampleMd', string>> = {}

export function getCache() {
  return cache
}
