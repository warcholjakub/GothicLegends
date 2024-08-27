import { Player as CorePlayer } from 'gothic-together/player'
import { store } from './store.js'

export type PlayerAttributes = {
  readonly learningPoints: number
  readonly healTargetUuid: string
  readonly totalDamageDealt: number
  readonly waveDamageDealt: number
  readonly totalWaveEnemyKills: number
  readonly totalWavesSurvived: number
  readonly reviveTimeStart: number
  readonly role: 'player' | 'admin'
}

export class MyPlayer extends CorePlayer {
  override get Attrs() {
    return store.getState().players[this.Id] as PlayerAttributes
  }

  override SetAttrs(attr: Partial<PlayerAttributes>) {
    return store.getState().updatePlayerAttributes(this.Id, attr)
  }
}
