import { EntityId, EntityState } from './models'

export function getInitialEntityState<V, I extends EntityId>(): EntityState<
  V,
  I
> {
  return {
    ids: [],
    entities: {}
  }
}

export function createInitialStateFactory<V, I extends EntityId>() {
  function getInitialState(): EntityState<V, I>
  function getInitialState<S extends object>(
    additionalState: S
  ): EntityState<V, I> & S
  function getInitialState(additionalState: any = {}): any {
    return Object.assign(getInitialEntityState(), additionalState)
  }

  return { getInitialState }
}
