import { Client } from 'gothic-together'
import { MyPlayer as Player } from 'src/player.js'

export const SetProgressBar = (players: Player | Player[], isVisible: boolean, label?: string) => {
  const playersArray = Array.isArray(players) ? players : [players]
  for (const p of playersArray) {
    Client.SendEventToHtmlComponents(p.Id, 'ProgressBar', {
      isVisible: isVisible,
      label: label,
    })
  }
}
