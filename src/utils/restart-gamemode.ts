import { NPC_ATR_HITPOINTS, NPC_ATR_HITPOINTSMAX } from 'gothic-together/union/enums'
import { GameMode } from 'src/gamemode.js'
import { UpdatePartyMemberOverlay, UpdateQuestOverlay } from 'src/overlay/updater.js'

export const RestartGamemode = (gameMode: GameMode) => {
  gameMode.state.setGamePhase('INIT')
  gameMode.state.restartWaves()
  gameMode.state.restartWaveEnemiesIndex()
  gameMode.state.restartCurrentWaveEnemiesKilled()
  gameMode.state.clearCurrentWaveEnemies()
  gameMode.state.clearNewSpawned()

  for (const p of gameMode.Players) {
    p.Npc.SetAttribute(NPC_ATR_HITPOINTS, p.Npc.GetAttribute(NPC_ATR_HITPOINTSMAX)!)
    UpdateQuestOverlay(gameMode, p)
    p.SetAttrs({ totalWavesSurvived: 0, totalDamageDealt: 0, waveDamageDealt: 0 })
  }

  const garond = gameMode.state.captainGarond
  if (garond) {
    garond.SetAttribute(NPC_ATR_HITPOINTS, garond.GetAttribute(NPC_ATR_HITPOINTSMAX)!)
  }
  for (const npc of gameMode.state.capitalGarondGuards) {
    npc.SetAttribute(NPC_ATR_HITPOINTS, npc.GetAttribute(NPC_ATR_HITPOINTSMAX)!)
  }

  gameMode.ClearCurrentWaveEnamies()
  gameMode.RoutineManager.RestartRoutines()
  UpdatePartyMemberOverlay(gameMode)
}
