import { PayloadAction } from '../createAction'
import { IsAny } from '../tsHelpers'

/**
 * @public
 */
export type EntityId = number | string

/**
 * @public
 */
export type Comparer<T> = (a: T, b: T) => number

/**
 * @public
 */
export type IdSelector<T, I extends EntityId> = (model: T) => I

/**
 * @public
 */
export interface DictionaryNum<T> {
  [id: number]: T | undefined
}

/**
 * @public
 */
export interface Dictionary<T> extends DictionaryNum<T> {
  [id: string]: T | undefined
}

/**
 * @public
 */
export type Update<T, I extends EntityId> = { id: I; changes: Partial<T> }

/**
 * @public
 */
export interface EntityState<T, I extends EntityId> {
  ids: I[]
  entities: Dictionary<T>
}

/**
 * @public
 */
export interface EntityDefinition<T, I extends EntityId> {
  selectId: IdSelector<T, I>
  sortComparer: false | Comparer<T>
}

export type PreventAny<S, T> = IsAny<S, EntityState<T>, S>

/**
 * @public
 */
export interface EntityStateAdapter<T, I extends EntityId> {
  addOne<S extends EntityState<T, I>>(state: PreventAny<S, T>, entity: T): S
  addOne<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    action: PayloadAction<T>
  ): S

  addMany<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    entities: T[] | Record<I, T>
  ): S
  addMany<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    entities: PayloadAction<T[] | Record<I, T>>
  ): S

  setAll<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    entities: T[] | Record<I, T>
  ): S
  setAll<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    entities: PayloadAction<T[] | Record<I, T>>
  ): S

  removeOne<S extends EntityState<T, I>>(state: PreventAny<S, T>, key: I): S
  removeOne<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    key: PayloadAction<I>
  ): S

  removeMany<S extends EntityState<T, I>>(state: PreventAny<S, T>, keys: I[]): S
  removeMany<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    keys: PayloadAction<I[]>
  ): S

  removeAll<S extends EntityState<T, I>>(state: PreventAny<S, T>): S

  updateOne<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    update: Update<T, I>
  ): S
  updateOne<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    update: PayloadAction<Update<T, I>>
  ): S

  updateMany<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    updates: Update<T, I>[]
  ): S
  updateMany<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    updates: PayloadAction<Update<T, I>[]>
  ): S

  upsertOne<S extends EntityState<T, I>>(state: PreventAny<S, T>, entity: T): S
  upsertOne<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    entity: PayloadAction<T>
  ): S

  upsertMany<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    entities: T[] | Record<I, T>
  ): S
  upsertMany<S extends EntityState<T, I>>(
    state: PreventAny<S, T>,
    entities: PayloadAction<T[] | Record<I, T>>
  ): S
}

/**
 * @public
 */
export interface EntitySelectors<T, V, I extends EntityId> {
  selectIds: (state: V) => I[]
  selectEntities: (state: V) => Dictionary<T>
  selectAll: (state: V) => T[]
  selectTotal: (state: V) => number
  selectById: (state: V, id: I) => T | undefined
}

/**
 * @public
 */
export interface EntityAdapter<T, I extends EntityId>
  extends EntityStateAdapter<T, I> {
  selectId: IdSelector<T, I>
  sortComparer: false | Comparer<T>
  getInitialState(): EntityState<T, I>
  getInitialState<S extends object>(state: S): EntityState<T, I> & S
  getSelectors(): EntitySelectors<T, EntityState<T, I>, I>
  getSelectors<V>(
    selectState: (state: V) => EntityState<T, I>
  ): EntitySelectors<T, V, I>
}
