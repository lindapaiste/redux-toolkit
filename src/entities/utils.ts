import { EntityState, IdSelector, Update, EntityId } from './models'

export function selectIdValue<T, I extends EntityId>(
  entity: T,
  selectId: IdSelector<T, I>
) {
  const key = selectId(entity)

  if (process.env.NODE_ENV !== 'production' && key === undefined) {
    console.warn(
      'The entity passed to the `selectId` implementation returned undefined.',
      'You should probably provide your own `selectId` implementation.',
      'The entity that was passed:',
      entity,
      'The `selectId` implementation:',
      selectId.toString()
    )
  }

  return key
}

export function ensureEntitiesArray<T, I extends EntityId>(
  entities: T[] | Record<I, T>
): T[] {
  if (!Array.isArray(entities)) {
    entities = Object.values(entities)
  }

  return entities
}

export function splitAddedUpdatedEntities<T, I extends EntityId>(
  newEntities: T[] | Record<I, T>,
  selectId: IdSelector<T, I>,
  state: EntityState<T, I>
): [T[], Update<T, I>[]] {
  newEntities = ensureEntitiesArray(newEntities)

  const added: T[] = []
  const updated: Update<T, I>[] = []

  for (const entity of newEntities) {
    const id = selectIdValue(entity, selectId)
    if (id in state.entities) {
      updated.push({ id, changes: entity })
    } else {
      added.push(entity)
    }
  }
  return [added, updated]
}
