import {
  NPC_ATR_HITPOINTS,
  NPC_ATR_HITPOINTSMAX,
  NPC_ATR_MANA,
  NPC_ATR_MANAMAX,
} from 'gothic-together/union/enums'
import { StatsState } from 'react/src/Stats.js'
import { GameMode, WaveEnemies } from 'src/gamemode.js'
import { MyPlayer as Player } from 'src/player.js'
import { QuestStatus } from 'src/utils/quest-status-type.js'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'

export const UpdateQuestOverlay = (gameMode: GameMode, player: Player) => {
  const totalEnemies =
    WaveEnemies[gameMode.state.waveCounter > 0 ? gameMode.state.waveCounter - 1 : 0]?.length
  const killedEnemies = gameMode.state.currentWaveEnemiesKilled

  let captainGarondAliveStatus: QuestStatus = 'inprogress'
  let killWaveEnemiesStatus: QuestStatus = 'inprogress'
  let playerAliveStatus: QuestStatus = 'inprogress'

  if (gameMode.state.captainGarond?.GetAttribute(NPC_ATR_HITPOINTS) == 0) {
    captainGarondAliveStatus = 'failed'
  }

  if (killedEnemies == totalEnemies) {
    killWaveEnemiesStatus = 'done'
  }

  if (player.Npc.GetAttribute(NPC_ATR_HITPOINTS) == 0) {
    playerAliveStatus = 'failed'
  }

  UpdateOverlayState<StatsState>(player, 'StatsComponent', {
    quests: [
      {
        id: 'garond-alive',
        title: 'Kapitan Garond musi przeżyć',
        status: captainGarondAliveStatus,
      },
      {
        id: 'kill-wave-enemies',
        title: `Pokonaj przeciwników ${killedEnemies}/${totalEnemies}`,
        status: killWaveEnemiesStatus,
      },
      {
        id: 'dont-die',
        title: 'Nie zgiń ani razu',
        status: playerAliveStatus,
      },
    ],
  })
}

export const UpdatePartyMemberOverlay = (gameMode: GameMode) => {
  const garondHp = gameMode.state.captainGarond!.GetAttribute(NPC_ATR_HITPOINTS)
  const garondMaxHp = gameMode.state.captainGarond!.GetAttribute(NPC_ATR_HITPOINTSMAX)
  const garondHpPercentage = (garondHp! / garondMaxHp!) * 100

  const partyMemberMap = gameMode.Players.map((p) => {
    const currentMana = p.Npc.GetAttribute(NPC_ATR_MANA)
    const currentMaxMana = p.Npc.GetAttribute(NPC_ATR_MANAMAX)
    const manaPercentage = (currentMana! / currentMaxMana!) * 100
    const currentHp = p.Npc.GetAttribute(NPC_ATR_HITPOINTS)
    const currentMaxHp = p.Npc.GetAttribute(NPC_ATR_HITPOINTSMAX)
    const hpPercentage = (currentHp! / currentMaxHp!) * 100

    return {
      id: p.Id,
      name: p.Name,
      currentMana: manaPercentage,
      level: p.Npc.level()!,
      currentHp: hpPercentage,
    }
  })

  for (const player of gameMode.Players) {
    UpdateOverlayState<StatsState>(player, 'StatsComponent', {
      partyMembers: [
        {
          id: -1,
          name: 'Kapitan Garond',
          currentMana: 0,
          level: 40,
          currentHp: garondHpPercentage,
        },
        ...partyMemberMap,
      ],
    })
  }
}
