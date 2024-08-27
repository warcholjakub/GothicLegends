import { NPC_ATR_HITPOINTS } from 'gothic-together/union/enums'
import { SetProgressBar } from 'src/utils/progress-bar.js'
import { MyPlayer as Player } from 'src/player.js'
import { GameMode } from 'src/gamemode.js'

const Revive = (player: Player, args: any, gameMode: GameMode) => {
  const focusedNpc = player.Npc.GetFocusNpc()
  const revivingPlayerHP = player.Npc.GetAttribute(NPC_ATR_HITPOINTS)
  if (!focusedNpc || revivingPlayerHP == 0) {
    return
  }

  const startTime = new Date().getTime()
  player.SetAttrs({ reviveTimeStart: startTime })

  const focusedPlayer = gameMode.GetPlayerFromNpc(focusedNpc)
  if (focusedPlayer) {
    const targetCurrentHP = focusedPlayer.Npc.GetAttribute(NPC_ATR_HITPOINTS)

    if (targetCurrentHP == 0) {
      player.SetAttrs({ healTargetUuid: focusedNpc.Uuid })
      SetProgressBar(player, true, 'WSKRZESZENIE')
    }
  }
}

const ReviveSuccess = (player: Player, args: any, gameMode: GameMode) => {
  const currentTime = new Date().getTime()

  if (player.Attrs.reviveTimeStart + 4500 > currentTime) {
    return
  }

  const focusedPlayer = player.Npc.GetFocusNpc()
  if (focusedPlayer?.Uuid != player.Attrs.healTargetUuid) {
    return
  }
  focusedPlayer.SetAttribute(NPC_ATR_HITPOINTS, 100)
  SetProgressBar(player, false)
  player.SetAttrs({ reviveTimeStart: -1 })
}

export default {
  Revive,
  ReviveSuccess,
}
