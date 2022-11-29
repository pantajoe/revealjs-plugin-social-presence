/**
 * Mostly inspired by https://github.com/hypothesis/client/1bf5d5da4660e27db52b0533c6c5ae559b619964/main/src/annotator
 * and slightly modified.
 *
 * Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning
 */

import type { Selector } from './annotation-types'
import { highlightRange, removeHighlights } from './highlighter'
import { describe, anchor as htmlAnchor } from './html'
import { generateHexString } from './random'
import { TextRange } from './text-range'

/**
 * Object representing a region of a document that an annotation
 * has been anchored to.
 *
 * This representation of anchor ranges allows for certain document mutations
 * in between anchoring an annotation and later making use of the anchored range,
 * such as inserting highlights for other anchors. Compared to the initial
 * anchoring of serialized selectors, resolving these ranges should be a
 * cheap operation.
 */
export interface AbstractRange {
  /**
   * Resolve the abstract range to a concrete live `Range`. The implementation
   * may or may not return the same `Range` each time.
   */
  toRange(): Range
}

export interface AnnotationData {
  /**
   * identifier for an annotation highlight
   */
  tag: string

  selectors: Selector[]
}

/**
 * An object representing the location in a document that an annotation is
 * associated with.
 */
export interface Anchor {
  annotation: AnnotationData
  /** The HTML elements that create the highlight for this annotation. */
  highlights?: HTMLElement[]
  /** Region of the document that this annotation's selectors were resolved to. */
  range?: AbstractRange
}

/**
 * Resolve an anchor's associated document region to a concrete `Range`.
 *
 * This may fail if anchoring failed or if the document has been mutated since
 * the anchor was created in a way that invalidates the anchor.
 */
function resolveAnchor(anchor: Anchor): Range | null {
  if (!anchor.range) {
    return null
  }
  try {
    return anchor.range.toRange()
  } catch {
    return null
  }
}

/**
 * Anchor an annotation's selectors in the document.
 *
 * _Anchoring_ resolves a set of selectors to a concrete region of the document
 * which is then highlighted.
 *
 * Any existing anchors associated with `annotation` will be removed before
 * re-anchoring the annotation.
 */
export async function anchor(annotations: AnnotationData[]): Promise<Anchor[]> {
  /**
   * Resolve an annotation's selectors to a concrete range.
   */
  const locate = async (annotation: AnnotationData): Promise<Anchor> => {
    // Only annotations with an associated quote can currently be anchored.
    // This is because the quote is used to verify anchoring with other selector
    // types.
    if (!annotation.selectors.some((s) => s.type === 'TextQuoteSelector')) {
      return { annotation }
    }

    const range = await htmlAnchor(document.body, annotation.selectors)
    // Convert the `Range` to a `TextRange` which can be converted back to
    // a `Range` later. The `TextRange` representation allows for highlights
    // to be inserted during anchoring other annotations without "breaking"
    // this anchor.
    const textRange = TextRange.fromRange(range)
    const anchor: Anchor = { annotation, range: textRange }
    return anchor
  }

  /**
   * Highlight the text range that `anchor` refers to.
   */
  const highlight = (anchor: Anchor) => {
    const range = resolveAnchor(anchor)
    if (!range) {
      return
    }

    const highlights = highlightRange(range, anchor.annotation.tag)
    anchor.highlights = highlights
  }

  const anchor = await Promise.all(annotations.map(locate))

  anchor.forEach(highlight)

  return anchor
}

/**
 * Create a new annotation that is associated with the selected region of
 * the current document.
 *
 * @return The new annotation
 */
export async function createAnnotation(range: Range, tag?: string): Promise<Anchor[]> {
  const root = document.body
  const rangeSelectors = describe(root, range)
  const annotation: AnnotationData = {
    selectors: rangeSelectors,
    tag: tag ?? `a:${generateHexString(8)}`,
  }
  return anchor([annotation])
}

/**
 * Remove the anchors and associated highlights for an annotation from the document.
 */
export function detach(allAnchors: Anchor[], tag: string) {
  const remainingAnchors: Anchor[] = []
  for (const anchor of allAnchors) {
    if (anchor.annotation.tag !== tag) {
      remainingAnchors.push(anchor)
    } else if (anchor.highlights) {
      removeHighlights(anchor.highlights)
    }
  }

  return remainingAnchors
}

export function detachAll(anchors: Anchor[]) {
  for (const anchor of anchors) {
    if (anchor.highlights) {
      removeHighlights(anchor.highlights)
    }
  }
}
