import { NPC_ATR_HITPOINTS, NPC_ATR_HITPOINTSMAX } from 'gothic-together/union/enums'
import { MyPlayer as Player } from 'src/player.js'
import { GameMode } from 'src/gamemode.js'
import { Client, zVEC3 } from 'gothic-together'
import { RestartGamemode } from 'src/utils/restart-gamemode.js'

const Op = (player: Player, args: any, gameMode: GameMode) => {
  if (player.Attrs.role != 'admin') return

  const cmdArgs = args.split(/(\s+)/).filter((e: string) => e.trim().length > 0)
  const focusedNpc = player.Npc.GetFocusNpc()
  if (cmdArgs.length != 1 && !focusedNpc) {
    return
  }

  const uuid = cmdArgs.length == 1 ? cmdArgs[0] : focusedNpc?.Uuid
  let chosenPlayer = null
  for (const p of gameMode.Players) {
    if (p.Npc.Uuid == uuid) {
      chosenPlayer = p
      break
    }
  }

  if (chosenPlayer) {
    chosenPlayer.SetAttrs({ role: 'admin' })
  }
}

const Deop = (player: Player, args: any, gameMode: GameMode) => {
  if (player.Attrs.role != 'admin') return

  const cmdArgs = args.split(/(\s+)/).filter((e: string) => e.trim().length > 0)
  const focusedNpc = player.Npc.GetFocusNpc()
  if (cmdArgs.length != 1 && !focusedNpc) {
    return
  }

  const uuid = cmdArgs.length == 1 ? cmdArgs[0] : focusedNpc?.Uuid
  let chosenPlayer = null
  for (const p of gameMode.Players) {
    if (p.Npc.Uuid == uuid) {
      chosenPlayer = p
      break
    }
  }
  if (chosenPlayer) {
    chosenPlayer.SetAttrs({ role: 'player' })
  }
}

const Kill = (player: Player, args: any, gameMode: GameMode) => {
  if (player.Attrs.role != 'admin') return

  const cmdArgs = args.split(/(\s+)/).filter((e: string) => e.trim().length > 0)
  const focusedNpc = player.Npc.GetFocusNpc()
  if (cmdArgs.length != 1 && !focusedNpc) {
    return
  }

  const uuid = cmdArgs.length == 1 ? cmdArgs[0] : focusedNpc?.Uuid
  let chosenPlayer = null
  for (const p of gameMode.Players) {
    if (p.Npc.Uuid == uuid) {
      chosenPlayer = p
      break
    }
  }
  if (chosenPlayer) chosenPlayer.Npc.SetAttribute(NPC_ATR_HITPOINTS, 0)
}

const Heal = (player: Player, args: any, gameMode: GameMode) => {
  if (player.Attrs.role != 'admin') return

  const cmdArgs = args.split(/(\s+)/).filter((e: string) => e.trim().length > 0)
  const focusedNpc = player.Npc.GetFocusNpc()
  if (cmdArgs.length != 1 && !focusedNpc) {
    return
  }
  const uuid = cmdArgs.length == 1 ? cmdArgs[0] : focusedNpc?.Uuid
  let chosenPlayer = null
  for (const p of gameMode.Players) {
    if (p.Npc.Uuid == uuid) {
      chosenPlayer = p
      break
    }
  }
  if (chosenPlayer) {
    chosenPlayer.Npc.SetAttribute(NPC_ATR_HITPOINTS, NPC_ATR_HITPOINTSMAX)
  }
}

const Tp = (player: Player, args: any, gameMode: GameMode) => {
  if (player.Attrs.role != 'admin') return

  const cmdArgs = args.split(/(\s+)/).filter((e: string) => e.trim().length > 0)
  if (cmdArgs.length == 1) {
    let chosenPlayer = null
    for (const p of gameMode.Players) {
      if (p.Npc.Uuid == cmdArgs[0]) {
        chosenPlayer = p
        break
      }
    }
    if (chosenPlayer) {
      const playerPos = chosenPlayer.Npc.GetPositionWorld()
      if (playerPos) {
        playerPos.X += 200
        player.Npc.SetPositionWorld(playerPos)
      }
    }
  } else if (cmdArgs.length == 3) {
    if (isNaN(Number(cmdArgs[0])) || isNaN(Number(cmdArgs[1])) || isNaN(Number(cmdArgs[2]))) {
      return
    }
    player.Npc.SetPositionWorld(
      new zVEC3([Number(cmdArgs[0]), Number(cmdArgs[1]), Number(cmdArgs[2])]),
    )
  }
}

const Restart = (player: Player, args: any, gameMode: GameMode) => {
  if (player.Attrs.role != 'admin') return
  RestartGamemode(gameMode)
}

const Whoami = (player: Player, args: any, gameMode: GameMode) => {
  if (player.Attrs.role != 'admin') return
  console.log(player.Npc.Uuid)
}

const CamCastle = (player: Player, args: any, gamemode: GameMode) => {
  if (player.Attrs.role != 'admin') return
  Client.EnableStaticCamera(player.Id, new zVEC3([0, 1000, 0]), new zVEC3([0, 0, 0]))
}

const CamPlayer = (player: Player, args: any, gamemode: GameMode) => {
  if (player.Attrs.role != 'admin') return
  Client.DisableStaticCamera(player.Id)
}

const CurrentPos = (player: Player, args: any, gamemode: GameMode) => {
  if (player.Attrs.role != 'admin') return
  const myPos = player.Npc.GetPositionWorld()
  console.log(myPos)
}

export default {
  Op,
  Deop,
  Kill,
  Heal,
  Tp,
  Whoami,
  CamCastle,
  CamPlayer,
  Restart,
  CurrentPos,
}
