/**
 * Mostly inspired by https://github.com/hypothesis/client/1bf5d5da4660e27db52b0533c6c5ae559b619964/main/src/annotator
 * and slightly modified.
 *
 * Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning
 */

import { matchQuote } from './match-quote'
import { TextPosition, TextRange } from './text-range'
import { nodeFromXPath, xpathFromNode } from './xpath'

/**
 * Selector which identifies a document region using the selected text plus
 * the surrounding context.
 */
export interface TextQuoteSelector {
  type: 'TextQuoteSelector'
  exact: string
  prefix?: string
  suffix?: string
}

/**
 * Selector which identifies a document region using UTF-16 character offsets
 * in the document body's `textContent`.
 */
export interface TextPositionSelector {
  type: 'TextPositionSelector'
  start: number
  end: number
}

/**
 * Selector which identifies a document region using XPaths and character offsets.
 */
export interface RangeSelector {
  type: 'RangeSelector'
  startContainer: string
  endContainer: string
  startOffset: number
  endOffset: number
}

/**
 * Serialized representation of a region of a document which an annotation
 * pertains to.
 */
export type Selector = TextQuoteSelector | TextPositionSelector | RangeSelector

/**
 * Converts between `RangeSelector` selectors and `Range` objects.
 */
export class RangeAnchor {
  root: Node
  range: Range

  /**
   * @param {Node} root - A root element from which to anchor.
   * @param {Range} range -  A range describing the anchor.
   */
  constructor(root: Node, range: Range) {
    this.root = root
    this.range = range
  }

  /**
   * @param {Node} root -  A root element from which to anchor.
   * @param {Range} range -  A range describing the anchor.
   */
  static fromRange(root: Node, range: Range) {
    return new RangeAnchor(root, range)
  }

  /**
   * Create an anchor from a serialized `RangeSelector` selector.
   *
   * @param {Element} root -  A root element from which to anchor.
   * @param {RangeSelector} selector
   */
  static fromSelector(root: Element, selector: RangeSelector) {
    const startContainer = nodeFromXPath(selector.startContainer, root)
    if (!startContainer) {
      throw new Error('Failed to resolve startContainer XPath')
    }

    const endContainer = nodeFromXPath(selector.endContainer, root)
    if (!endContainer) {
      throw new Error('Failed to resolve endContainer XPath')
    }

    const startPos = TextPosition.fromCharOffset(startContainer, selector.startOffset)
    const endPos = TextPosition.fromCharOffset(endContainer, selector.endOffset)

    const range = new TextRange(startPos, endPos).toRange()
    return new RangeAnchor(root, range)
  }

  toRange() {
    return this.range
  }

  /**
   * @return {RangeSelector}
   */
  toSelector(): RangeSelector {
    // "Shrink" the range so that it tightly wraps its text. This ensures more
    // predictable output for a given text selection.
    const normalizedRange = TextRange.fromRange(this.range).toRange()

    const textRange = TextRange.fromRange(normalizedRange)
    const startContainer = xpathFromNode(textRange.start.element, this.root)
    const endContainer = xpathFromNode(textRange.end.element, this.root)

    return {
      type: 'RangeSelector',
      startContainer,
      startOffset: textRange.start.offset,
      endContainer,
      endOffset: textRange.end.offset,
    }
  }
}

/**
 * Converts between `TextPositionSelector` selectors and `Range` objects.
 */
export class TextPositionAnchor {
  root: Element
  start: number
  end: number

  /**
   * @param {Element} root
   * @param {number} start
   * @param {number} end
   */
  constructor(root: Element, start: number, end: number) {
    this.root = root
    this.start = start
    this.end = end
  }

  /**
   * @param {Element} root
   * @param {Range} range
   */
  static fromRange(root: Element, range: Range) {
    const textRange = TextRange.fromRange(range).relativeTo(root)
    return new TextPositionAnchor(root, textRange.start.offset, textRange.end.offset)
  }

  /**
   * @param {Element} root
   * @param {TextPositionSelector} selector
   */
  static fromSelector(root: Element, selector: TextPositionSelector) {
    return new TextPositionAnchor(root, selector.start, selector.end)
  }

  /**
   * @return {TextPositionSelector}
   */
  toSelector(): TextPositionSelector {
    return {
      type: 'TextPositionSelector',
      start: this.start,
      end: this.end,
    }
  }

  toRange() {
    return TextRange.fromOffsets(this.root, this.start, this.end).toRange()
  }
}

export interface QuoteMatchOptions {
  /** Expected position of match in text. See `matchQuote`. */
  hint?: number
}

/**
 * Converts between `TextQuoteSelector` selectors and `Range` objects.
 */
export class TextQuoteAnchor {
  root: Element
  exact: string
  context: { prefix?: string; suffix?: string }

  /**
   * @param root - A root element from which to anchor.
   */
  constructor(root: Element, exact: string, context: { prefix?: string; suffix?: string } = {}) {
    this.root = root
    this.exact = exact
    this.context = context
  }

  static fromRange(root: Element, range: Range) {
    const text = root.textContent!
    const textRange = TextRange.fromRange(range).relativeTo(root)

    const start = textRange.start.offset
    const end = textRange.end.offset

    // Number of characters around the quote to capture as context. We currently
    // always use a fixed amount, but it would be better if this code was aware
    // of logical boundaries in the document (paragraph, article etc.) to avoid
    // capturing text unrelated to the quote.
    //
    // In regular prose the ideal content would often be the surrounding sentence.
    // This is a natural unit of meaning which enables displaying quotes in
    // context even when the document is not available. We could use `Intl.Segmenter`
    // for this when available.
    const contextLen = 32

    return new TextQuoteAnchor(root, text.slice(start, end), {
      prefix: text.slice(Math.max(0, start - contextLen), start),
      suffix: text.slice(end, Math.min(text.length, end + contextLen)),
    })
  }

  static fromSelector(root: Element, selector: TextQuoteSelector) {
    const { prefix, suffix } = selector
    return new TextQuoteAnchor(root, selector.exact, { prefix, suffix })
  }

  /**
   * @return {TextQuoteSelector}
   */
  toSelector(): TextQuoteSelector {
    return {
      type: 'TextQuoteSelector',
      exact: this.exact,
      prefix: this.context.prefix,
      suffix: this.context.suffix,
    }
  }

  /**
   * @param {QuoteMatchOptions} [options]
   */
  toRange(options: QuoteMatchOptions = {}) {
    return this.toPositionAnchor(options).toRange()
  }

  /**
   * @param {QuoteMatchOptions} [options]
   */
  toPositionAnchor(options: QuoteMatchOptions = {}) {
    const text = this.root.textContent!
    const match = matchQuote(text, this.exact, {
      ...this.context,
      hint: options.hint,
    })
    if (!match) {
      throw new Error('Quote not found')
    }
    return new TextPositionAnchor(this.root, match.start, match.end)
  }
}
