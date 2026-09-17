/**
 * The lock on the tailor's cabinet.
 *
 * What this is: a door lock. It stops a customer who taps «Кабинет швеи» on the
 * profile screen, or types /cabinet into the address bar, from editing stock and
 * moving orders along.
 *
 * What this is not: real authentication. Everything runs in the browser, so the
 * stored hash is readable by anyone who opens the developer tools, and a short
 * numeric code is quick to try exhaustively. Real access control needs the
 * server — see the note in README.md. Until then this is the honest amount of
 * protection a fully client-side app can offer.
 */

const PIN_LENGTH = 4

export function isValidPin(pin: string): boolean {
  // Length and digits checked separately: a template literal would swallow the
  // backslash of a `\d` escape and quietly match the letter "d" instead.
  return pin.length === PIN_LENGTH && /^[0-9]+$/.test(pin)
}

export { PIN_LENGTH }

/** Hashes a code for storage, so the code itself is never written down. */
export async function hashPin(pin: string): Promise<string> {
  const salted = `ikrima:${pin}`
  const subtle = globalThis.crypto?.subtle
  if (!subtle) {
    // crypto.subtle needs a secure context. Served over https or from
    // localhost it is always there; this covers opening the built files
    // straight from disk, where the weaker digest is still enough for a lock
    // that only has to survive idle curiosity.
    return `weak:${weakDigest(salted)}`
  }
  const bytes = await subtle.digest('SHA-256', new TextEncoder().encode(salted))
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPin(pin: string, stored: string): Promise<boolean> {
  return (await hashPin(pin)) === stored
}

/** FNV-1a, for the no-crypto fallback above. Not a security primitive. */
function weakDigest(input: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}
