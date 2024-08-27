import { Server, zVEC3 } from 'gothic-together'
import { oCNpc } from 'gothic-together/union/classes/oCNpc'
import { GameMode } from 'src/gamemode.js'

export const GAROND_SPAWN_VECTOR = new zVEC3([-2054.679, 177.803, -787.782])

export const SpawnGarondAndGuards = (gamemode: GameMode) => {
  const routineFunc = Server.ParserGetIndex('ZS_STAND_GUARDING') as number

  const garondNpc = Server.CreateNpc('Pal_250_Garond', GAROND_SPAWN_VECTOR) as oCNpc
  garondNpc.set_variousFlags(0)
  const state = garondNpc.state()
  gamemode.RoutineManager.RemoveRoutine(garondNpc)
  state?.InsertRoutine(8, 0, 23, 0, routineFunc, 'OC_EBR_GUARDPASSAGE_02', 0)
  state?.InsertRoutine(23, 0, 8, 0, routineFunc, 'OC_EBR_GUARDPASSAGE_02', 0)
  garondNpc.set_daily_routine(routineFunc)
  gamemode.update({ captainGarond: garondNpc })

  for (let i = 0; i < 2; i++) {
    const npc = Server.CreateNpc('pal_265_ritter', GAROND_SPAWN_VECTOR!) as oCNpc
    gamemode.state.addCapitalGarondGuard(npc)
    const state = npc.state()
    gamemode.RoutineManager.RemoveRoutine(npc)
    state?.InsertRoutine(8, 0, 23, 0, routineFunc, 'OC_EBR_GUARDPASSAGE_01', 0)
    state?.InsertRoutine(23, 0, 8, 0, routineFunc, 'OC_EBR_GUARDPASSAGE_01', 0)
    npc.set_daily_routine(routineFunc)
  }

  gamemode.RoutineManager.RestartRoutines()
}
