import { Player as CorePlayer } from 'gothic-together/player'
import { store } from './store.js'

export type PlayerAttributes = {
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
