/**
 * Mostly inspired by https://github.com/hypothesis/client/1bf5d5da4660e27db52b0533c6c5ae559b619964/main/src/annotator
 * and slightly modified.
 *
 * Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning
 */

/** @param {number} val */
function byteToHex(val: number) {
  const str = val.toString(16)
  return str.length === 1 ? `0${str}` : str
}

/**
 * Generate a random hex string of `len` chars.
 *
 * @param {number} len - An even-numbered length string to generate.
 * @return {string}
 */
export function generateHexString(len: number): string {
  const bytes = new Uint8Array(len / 2)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes).map(byteToHex).join('')
}
