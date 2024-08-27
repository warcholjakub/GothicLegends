import { Client } from 'gothic-together'
import { Player } from 'gothic-together/player'

export const UpdateOverlayState = <T>(player: Player, name: string, state: Partial<T>) => {
  Client.SendEventToHtmlComponents(player.Id, `STATE_${name}`, state)
}
