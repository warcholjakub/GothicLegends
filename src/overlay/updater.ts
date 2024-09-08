import { StatsState } from 'react/src/Stats.js'
import { GameMode } from 'src/gamemode.js'
import { MyPlayer as Player } from 'src/player.js'
// import { QuestStatus } from 'src/utils/quest-status-type.js'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'

export const UpdateQuestOverlay = (gameMode: GameMode, player: Player) => {
  UpdateOverlayState<StatsState>(player, 'StatsComponent', {})
}

export const UpdatePartyMemberOverlay = (gameMode: GameMode) => {}
