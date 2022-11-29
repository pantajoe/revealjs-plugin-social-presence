import type { Cache, FieldInfo, Variables } from '@urql/exchange-graphcache'

export const getAllQueries = (cache: Cache, fieldName: string | ((field: FieldInfo) => boolean)) => {
  return cache
    .inspectFields({ __typename: 'Query' })
    .filter(typeof fieldName === 'function' ? fieldName : (field) => field.fieldName === fieldName)
}

export const getLastQueryArgs = <T = Variables>(
  cache: Cache,
  fieldName: string | ((field: FieldInfo) => boolean),
): T | null => {
  const lastQueries = getAllQueries(cache, fieldName)
  const lastQuery = lastQueries[lastQueries.length - 1]
  if (!lastQuery) return null
  const { arguments: variables } = lastQuery
  return variables as unknown as T
}
