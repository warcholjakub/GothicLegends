import { GameMode } from 'src/gamemode.js'
import { ShowNotification } from './notifications.js'
import { MyPlayer as Player } from 'src/player.js'

export const ShowScoreboard = function (
  gamemode: GameMode,
  notifiedPlayers: Player | Player[] = gamemode.Players,
) {
  const sortedPlayers = gamemode.Players.sort(
    (a, b) => b.Attrs.totalDamageDealt - a.Attrs.totalDamageDealt,
  ).map(
    (p, index) =>
      `${index + 1}. ${p.Name}: ${p.Attrs.totalDamageDealt} zadanych obrażeń (${p.Attrs.waveDamageDealt} tej fali)`,
  )
  ShowNotification(notifiedPlayers, 'Podsumowanie fali', sortedPlayers.join('\n'), 5)
}
