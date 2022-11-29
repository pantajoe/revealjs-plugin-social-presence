/**
 * Mostly inspired by https://github.com/hypothesis/client/1bf5d5da4660e27db52b0533c6c5ae559b619964/main/src/annotator
 * and slightly modified.
 *
 * Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning
 */

import type { RangeSelector, Selector, TextPositionSelector, TextQuoteSelector } from './annotation-types'
import { RangeAnchor, TextPositionAnchor, TextQuoteAnchor } from './annotation-types'

/**
 * @param {RangeAnchor|TextPositionAnchor|TextQuoteAnchor} anchor
 * @param {object} [options]
 *  @param {number} [options.hint]
 */
async function querySelector(
  anchor: RangeAnchor | TextPositionAnchor | TextQuoteAnchor,
  options: { hint?: number } = {},
) {
  return anchor.toRange(options)
}

/**
 * Anchor a set of selectors.
 *
 * This function converts a set of selectors into a document range.
 * It encapsulates the core anchoring algorithm, using the selectors alone or
 * in combination to establish the best anchor within the document.
 *
 * @param {Element} root - The root element of the anchoring context.
 * @param {Selector[]} selectors - The selectors to try.
 * @param {object} [options]
 *   @param {number} [options.hint]
 */
export function anchor(root: Element, selectors: Selector[], options: { hint?: number } = {}) {
  let position: TextPositionSelector | null = null
  let quote: TextQuoteSelector | null = null
  let range: RangeSelector | null = null

  // Collect all the selectors
  for (const selector of selectors) {
    switch (selector.type) {
      case 'TextPositionSelector':
        position = selector
        options.hint = position.start // TextQuoteAnchor hint
        break
      case 'TextQuoteSelector':
        quote = selector
        break
      case 'RangeSelector':
        range = selector
        break
    }
  }

  /**
   * Assert the quote matches the stored quote, if applicable
   * @param {Range} range
   */
  const maybeAssertQuote = (range: Range) => {
    if (quote?.exact && range.toString() !== quote.exact) {
      throw new Error('quote mismatch')
    } else {
      return range
    }
  }

  // From a default of failure, we build up catch clauses to try selectors in
  // order, from simple to complex.
  /** @type {Promise<Range>} */
  let promise: Promise<Range> = Promise.reject(new Error('unable to anchor'))

  if (range) {
    // Const binding assures TS that it won't be re-assigned when callback runs.
    const range_ = range
    promise = promise.catch(() => {
      const anchor = RangeAnchor.fromSelector(root, range_)
      return querySelector(anchor, options).then(maybeAssertQuote)
    })
  }

  if (position) {
    const position_ = position
    promise = promise.catch(() => {
      const anchor = TextPositionAnchor.fromSelector(root, position_)
      return querySelector(anchor, options).then(maybeAssertQuote)
    })
  }

  if (quote) {
    const quote_ = quote
    promise = promise.catch(() => {
      const anchor = TextQuoteAnchor.fromSelector(root, quote_)
      return querySelector(anchor, options)
    })
  }

  return promise
}

/**
 * @param {Element} root
 * @param {Range} range
 */
export function describe(root: Element, range: Range) {
  const types = [RangeAnchor, TextPositionAnchor, TextQuoteAnchor]
  const result = []
  for (const type of types) {
    try {
      const anchor = type.fromRange(root, range)
      result.push(anchor.toSelector())
    } catch (error) {
      continue
    }
  }
  return result
}
