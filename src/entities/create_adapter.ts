import {
  EntityDefinition,
  Comparer,
  IdSelector,
  EntityAdapter,
  EntityId
} from './models'
import { createInitialStateFactory } from './entity_state'
import { createSelectorsFactory } from './state_selectors'
import { createSortedStateAdapter } from './sorted_state_adapter'
import { createUnsortedStateAdapter } from './unsorted_state_adapter'

/**
 *
 * @param options
 *
 * @public
 */
export function createEntityAdapter<T, I extends EntityId>(
  options: {
    selectId?: IdSelector<T, I>
    sortComparer?: false | Comparer<T>
  } = {}
): EntityAdapter<T, I> {
  const { selectId, sortComparer }: EntityDefinition<T, I> = {
    sortComparer: false,
    selectId: (instance: any) => instance.id,
    ...options
  }

  const stateFactory = createInitialStateFactory<T, I>()
  const selectorsFactory = createSelectorsFactory<T, I>()
  const stateAdapter = sortComparer
    ? createSortedStateAdapter(selectId, sortComparer)
    : createUnsortedStateAdapter(selectId)

  return {
    selectId,
    sortComparer,
    ...stateFactory,
    ...selectorsFactory,
    ...stateAdapter
  }
}
