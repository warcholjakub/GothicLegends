import fs from 'fs'
import superjson, { SuperJSON } from 'superjson'
// import { oCNpc } from 'gothic-together/union/classes/index'
import { createStore } from 'zustand/vanilla'
import { persist, PersistStorage } from 'zustand/middleware'
import { BaseUnionObject } from 'gothic-together/union/base-union-object'
import { JSONObject } from 'node_modules/superjson/dist/types.js'
import * as UnionClasses from 'gothic-together/union/classes/index'
import { PlayerAttributes } from './player.js'

export interface GameState {
  readonly players: Record<number, PlayerAttributes>
  initPlayerAttributes: (playerId: number) => void
  deletePlayerAttributes: (playerId: number) => void
  updatePlayerAttributes: (playerId: number, attrs: Partial<PlayerAttributes>) => void
}

SuperJSON.registerCustom<BaseUnionObject, JSONObject>(
  {
    isApplicable: (v): v is BaseUnionObject => v instanceof BaseUnionObject,
    serialize: (v) => ({ uuid: v.Uuid, type: v.constructor.name }),
    deserialize: (v) => {
      const className = v['type'] as string
      const classDefinition = (UnionClasses as any)[className]
      return new classDefinition(v['uuid'] as string)
    },
  },
  'BaseUnionObject',
)

const storage: PersistStorage<GameState> = {
  getItem: (name) => {
    if (process.env['APP_ENV'] == 'production') {
      return null
    }

    const fileContent = fs.readFileSync(`./tmp/${name}.storage`).toString()
    if (!fileContent) return null

    const state = superjson.parse(fileContent) as any
    if (!state) return null
    return state
  },
  setItem: (name, value) => {
    if (process.env['APP_ENV'] == 'production') {
      return
    }

    fs.writeFileSync(`./tmp/${name}.storage`, superjson.stringify(value))
  },
  removeItem: (name) => {
    if (process.env['APP_ENV'] == 'production') {
      return
    }

    fs.writeFileSync(`./tmp/${name}.storage`, superjson.stringify({}))
  },
}

export const store = createStore<GameState>()(
  persist(
    (set) => ({
      players: {},
      initPlayerAttributes: (playerId: number) =>
        set((state) => {
          const players = state.players
          players[playerId] = {
            role: 'player',
          }
          return {
            players,
          }
        }),
      updatePlayerAttributes: (playerId: number, attrs: Partial<PlayerAttributes>) =>
        set((state) => {
          const players = state.players
          players[playerId] = Object.assign({}, players[playerId], attrs)
          return {
            players,
          }
        }),
      deletePlayerAttributes: (playerId: number) =>
        set((state) => {
          const players = state.players
          delete players[playerId]
          return {
            players,
          }
        }),
    }),
    {
      name: 'game-store',
      storage,
    },
  ),
)
