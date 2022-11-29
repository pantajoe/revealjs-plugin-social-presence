import * as Relay from 'graphql-relay'
import { isObject } from 'lodash'
import { Connection, ConnectionArgs } from '../type'

const DEFAULT_PAGE_SIZE = 10

type PagingMeta =
  | { pagingType: 'forward'; after?: string; first: number }
  | { pagingType: 'backward'; before?: string; last: number }

function getMeta(args: ConnectionArgs): PagingMeta {
  const { first = 0, last = 0, after, before } = args
  const isForwardPaging = !!first || !!after
  const isBackwardPaging = !!last || !!before

  return isForwardPaging
    ? { pagingType: 'forward', after, first }
    : isBackwardPaging
    ? { pagingType: 'backward', before, last }
    : { pagingType: 'forward', first: DEFAULT_PAGE_SIZE }
}

/**
 * Create a 'paging parameters' object with 'limit' and 'offset' fields based on the incoming
 * cursor-paging arguments.
 */
export function getPagingParameters(args: ConnectionArgs) {
  const meta = getMeta(args)

  switch (meta.pagingType) {
    case 'forward': {
      return {
        limit: meta.first || DEFAULT_PAGE_SIZE,
        offset: meta.after ? Relay.cursorToOffset(meta.after) + 1 : 0,
      }
    }
    case 'backward': {
      const { last, before } = meta
      let limit = last
      let offset = Relay.cursorToOffset(before!) - last

      // Check to see if our before-page is underflowing past the 0th item
      if (offset < 0) {
        // Adjust the limit with the underflow value
        limit = Math.max(last + offset, 0)
        offset = 0
      }

      return { offset, limit: limit || DEFAULT_PAGE_SIZE }
    }
    default:
      return { offset: 0, limit: DEFAULT_PAGE_SIZE }
  }
}

export function isConnectionArgs(args: any): args is ConnectionArgs {
  return isObject(args) && ('first' in args || 'last' in args || 'after' in args || 'before' in args)
}

export function generateConnection<T>(
  nodes: T[],
  args: Relay.ConnectionArguments,
  more: { totalCount: number; offset?: number },
): Connection<T> {
  return {
    ...Relay.connectionFromArraySlice(nodes, args, {
      arrayLength: more.totalCount,
      sliceStart: more.offset ?? 0,
    }),
    totalCount: more.totalCount,
    nodes,
  }
}

export {
  connectionFromArray,
  connectionFromPromisedArray,
  connectionFromArraySlice,
  connectionFromPromisedArraySlice,
} from 'graphql-relay'
