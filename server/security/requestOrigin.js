function normalizeOrigin(value) {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export function isTrustedRequestOrigin({
  origin,
  protocol,
  host,
  configuredOrigins = [],
}) {
  if (!origin) return true

  const normalizedOrigin = normalizeOrigin(origin)
  if (!normalizedOrigin) return false

  const servedOrigin = normalizeOrigin(`${protocol}://${host}`)
  if (servedOrigin === normalizedOrigin) return true

  return configuredOrigins.some((candidate) => (
    normalizeOrigin(candidate) === normalizedOrigin
  ))
}
