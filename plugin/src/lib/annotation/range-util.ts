/**
 * Mostly inspired by https://github.com/hypothesis/client/1bf5d5da4660e27db52b0533c6c5ae559b619964/main/src/annotator
 * and slightly modified.
 *
 * Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning
 */

/**
 * Returns true if the start point of a selection occurs after the end point,
 * in document order.
 *
 * @param {Selection} selection
 */
export function isSelectionBackwards(selection: Selection) {
  if (selection.focusNode === selection.anchorNode) {
    return selection.focusOffset < selection.anchorOffset
  }

  const range = selection.getRangeAt(0)
  // Does not work correctly on iOS when selecting nodes backwards.
  // https://bugs.webkit.org/show_bug.cgi?id=220523
  return range.startContainer === selection.focusNode
}

/**
 * Returns true if any part of `node` lies within `range`.
 *
 * @param {Range} range
 * @param {Node} node
 */
export function isNodeInRange(range: Range, node: Node) {
  try {
    const length = node.nodeValue?.length ?? node.childNodes.length
    return (
      // Check start of node is before end of range.
      range.comparePoint(node, 0) <= 0 &&
      // Check end of node is after start of range.
      range.comparePoint(node, length) >= 0
    )
  } catch (e) {
    // `comparePoint` may fail if the `range` and `node` do not share a common
    // ancestor or `node` is a doctype.
    return false
  }
}

/**
 * Iterate over all Node(s) which overlap `range` in document order and invoke
 * `callback` for each of them.
 *
 * @param {Range} range
 * @param {(n: Node) => void} callback
 */
export function forEachNodeInRange(range: Range, callback: (n: Node) => void) {
  const root = range.commonAncestorContainer
  const nodeIter = (root.ownerDocument as Document).createNodeIterator(root, NodeFilter.SHOW_ALL)

  let currentNode
  // eslint-disable-next-line no-cond-assign
  while ((currentNode = nodeIter.nextNode())) {
    if (isNodeInRange(range, currentNode)) {
      callback(currentNode)
    }
  }
}

/**
 * Returns the bounding rectangles of non-whitespace text nodes in `range`.
 *
 * @param {Range} range
 * @return {Array<DOMRect>} Array of bounding rects in viewport coordinates.
 */
export function getTextBoundingBoxes(range: Range): Array<DOMRect> {
  const whitespaceOnly = /^\s*$/
  const textNodes: Text[] = []
  forEachNodeInRange(range, (node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent!.match(whitespaceOnly)) {
      textNodes.push(node as Text)
    }
  })

  /** @type {DOMRect[]} */
  let rects: DOMRect[] = []
  textNodes.forEach((node) => {
    const nodeRange = node.ownerDocument.createRange()
    nodeRange.selectNodeContents(node)
    if (node === range.startContainer) {
      nodeRange.setStart(node, range.startOffset)
    }
    if (node === range.endContainer) {
      nodeRange.setEnd(node, range.endOffset)
    }
    if (nodeRange.collapsed) {
      // If the range ends at the start of this text node or starts at the end
      // of this node then do not include it.
      return
    }

    // Measure the range and translate from viewport to document coordinates
    const viewportRects = Array.from(nodeRange.getClientRects())
    nodeRange.detach()
    rects = rects.concat(viewportRects)
  })
  return rects
}

/**
 * Returns the rectangle, in viewport coordinates, for the line of text
 * containing the focus point of a Selection.
 *
 * Returns null if the selection is empty.
 *
 * @param {Selection} selection
 * @return {DOMRect|null}
 */
export function selectionFocusRect(selection: Selection): DOMRect | null {
  if (selection.isCollapsed) {
    return null
  }
  const textBoxes = getTextBoundingBoxes(selection.getRangeAt(0))
  if (textBoxes.length === 0) {
    return null
  }

  if (isSelectionBackwards(selection)) {
    return textBoxes[0]
  } else {
    return textBoxes[textBoxes.length - 1]
  }
}

/**
 * Retrieve a set of items associated with nodes in a given range.
 *
 * An `item` can be any data that the caller wishes to compute from or associate
 * with a node. Only unique items, as determined by `Object.is`, are returned.
 *
 * @template T
 * @param {Range} range
 * @param {(n: Node) => T} itemForNode - Callback returning the item for a given node
 * @return {NonNullable<T>[]} items
 */
export function itemsForRange<T>(range: Range, itemForNode: (n: Node) => T): NonNullable<T>[] {
  /** @type {Set<Node>} */
  const checkedNodes: Set<Node> = new Set()
  /** @type {Set<NonNullable<T>>} */
  const items: Set<NonNullable<T>> = new Set()

  forEachNodeInRange(range, (node) => {
    /** @type {Node|null} */
    let current: Node | null = node
    while (current) {
      if (checkedNodes.has(current)) {
        break
      }
      checkedNodes.add(current)

      const item = /** @type {NonNullable<T>|null|undefined} */ itemForNode(current)
      if (item !== null && item !== undefined) {
        items.add(item)
      }

      current = current.parentNode
    }
  })

  return [...items]
}
