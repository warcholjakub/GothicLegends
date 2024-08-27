import fs from 'fs'
import superjson, { SuperJSON } from 'superjson'
import { oCNpc } from 'gothic-together/union/classes/index'
import { createStore } from 'zustand/vanilla'
import { persist, PersistStorage } from 'zustand/middleware'
import { BaseUnionObject } from 'gothic-together/union/base-union-object'
import { JSONObject } from 'node_modules/superjson/dist/types.js'
import * as UnionClasses from 'gothic-together/union/classes/index'
import { PlayerAttributes } from './player.js'

type TGamePhase = 'INIT' | 'PREPARE' | 'ACTIVE' | 'END'

export interface GameState {
  readonly players: Record<number, PlayerAttributes>
  initPlayerAttributes: (playerId: number) => void
  deletePlayerAttributes: (playerId: number) => void
  updatePlayerAttributes: (playerId: number, attrs: Partial<PlayerAttributes>) => void

  readonly gamePhase: TGamePhase
  setGamePhase: (value: TGamePhase) => void

  readonly waveCounter: number
  nextWave: () => void
  restartWaves: () => void

  readonly lastWaveEndTime: Date | null
  setLastWaveEndTime: (value: Date) => void

  readonly currentWaveEnemiesIndex: number
  nextWaveEnemiesIndex: () => void
  restartWaveEnemiesIndex: () => void

  readonly currentWaveEnemiesKilled: number
  addKilledEnemy: () => void
  restartCurrentWaveEnemiesKilled: () => void

  readonly enemySpawnMultiplier: number
  setEnemySpawnMultiplier: (value: number) => void

  readonly captainGarond: oCNpc | null
  setCaptainGarond: (value: oCNpc) => void

  readonly capitalGarondGuards: oCNpc[]
  addCapitalGarondGuard: (value: oCNpc) => void

  readonly newSpawned: oCNpc[]
  addNewNpc: (value: oCNpc) => void
  clearNewSpawned: () => void

  readonly spawnedNpcs: oCNpc[]
  addSpawnedNpc: (value: oCNpc) => void
  clearSpawnedNpcs: () => void

  readonly currentWaveEnemies: oCNpc[]
  addCurrentWaveEnemy: (value: oCNpc) => void
  removeCurrentWaveEnemy: (value: number) => void
  clearCurrentWaveEnemies: () => void
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
            learningPoints: 0,
            healTargetUuid: '',
            totalDamageDealt: 0,
            totalWaveEnemyKills: 0,
            totalWavesSurvived: 0,
            reviveTimeStart: -1,
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
      gamePhase: 'INIT',
      setGamePhase: (value) => set((state) => ({ gamePhase: value })),

      waveCounter: 0,
      nextWave: () => set((state) => ({ waveCounter: state.waveCounter + 1 })),
      restartWaves: () => set((state) => ({ waveCounter: 0 })),

      lastWaveEndTime: null,
      setLastWaveEndTime: (value) => set((state) => ({ lastWaveEndTime: value })),

      currentWaveEnemiesIndex: 0,
      nextWaveEnemiesIndex: () =>
        set((state) => ({ currentWaveEnemiesIndex: state.currentWaveEnemiesIndex + 1 })),
      restartWaveEnemiesIndex: () => set((state) => ({ currentWaveEnemiesIndex: 0 })),

      currentWaveEnemiesKilled: 0,
      addKilledEnemy: () =>
        set((state) => ({ currentWaveEnemiesKilled: state.currentWaveEnemiesKilled + 1 })),
      restartCurrentWaveEnemiesKilled: () => set((state) => ({ currentWaveEnemiesKilled: 0 })),

      enemySpawnMultiplier: 1,
      setEnemySpawnMultiplier: (value) => set((state) => ({ enemySpawnMultiplier: value })),

      captainGarond: null,
      setCaptainGarond: (value) => set((state) => ({ captainGarond: value })),

      capitalGarondGuards: [],
      addCapitalGarondGuard: (value) =>
        set((state) => ({ capitalGarondGuards: [...state.capitalGarondGuards, value] })),

      newSpawned: [],
      addNewNpc: (value) => set((state) => ({ newSpawned: [...state.newSpawned, value] })),
      clearNewSpawned: () => set((state) => ({ newSpawned: [] })),

      spawnedNpcs: [],
      addSpawnedNpc: (value) => set((state) => ({ spawnedNpcs: [...state.spawnedNpcs, value] })),
      clearSpawnedNpcs: () => set((state) => ({ spawnedNpcs: [] })),

      currentWaveEnemies: [],
      addCurrentWaveEnemy: (value) =>
        set((state) => ({ currentWaveEnemies: [...state.currentWaveEnemies, value] })),
      removeCurrentWaveEnemy: (value) =>
        set((state) => ({
          currentWaveEnemies: state.currentWaveEnemies.splice(value, 1) && state.currentWaveEnemies,
        })),
      clearCurrentWaveEnemies: () => set((state) => ({ currentWaveEnemies: [] })),
    }),
    {
      name: 'game-store',
      storage,
    },
  ),
)
