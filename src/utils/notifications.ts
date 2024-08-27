import { Client } from 'gothic-together'
import { MyPlayer as Player } from 'src/player.js'

export const ShowNotification = (
  players: Player | Player[],
  title: string,
  text: string,
  seconds: number,
) => {
  const miliseconds = seconds * 1000
  const playersArray = Array.isArray(players) ? players : [players]

  for (const p of playersArray) {
    Client.SendEventToHtmlComponents(p.Id, 'Notification', {
      title: title,
      text: text,
      time: miliseconds,
    })
  }
}
