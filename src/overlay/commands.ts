import { HeroPageState } from 'react/src/Hero.js'
import { MyPlayer as Player } from '../player.js'
import { GameMode } from 'src/gamemode.js'
import {
  NPC_ATR_HITPOINTSMAX,
  NPC_ATR_MANAMAX,
  NPC_ATR_STRENGTH,
  NPC_ATR_DEXTERITY,
  NPC_ATR_HITPOINTS,
  NPC_ATR_MANA,
} from 'gothic-together/union/enums'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'
import { StatsState } from 'react/src/Stats.js'
import { CreatorState } from 'react/src/Creator.js'
import { Client } from 'gothic-together'
import { UpdatePartyMemberOverlay } from './updater.js'

const RequestStateHeroComponent = (player: Player, args: any, gamemode: GameMode) => {
  UpdateOverlayState<HeroPageState>(player, 'HeroComponent', {
    hitpoints: player.Npc.GetAttribute(NPC_ATR_HITPOINTSMAX)!,
    mana: player.Npc.GetAttribute(NPC_ATR_MANAMAX)!,
    strength: player.Npc.GetAttribute(NPC_ATR_STRENGTH)!,
    dexterity: player.Npc.GetAttribute(NPC_ATR_DEXTERITY)!,
    '1h': 10,
    '2h': 10,
    bow: 10,
    cbow: 10,
    mageCircle: 0,
  })
}

const RequestStateStatsComponent = (player: Player, args: any, gamemode: GameMode) => {
  UpdateOverlayState<StatsState>(player, 'StatsComponent', {
    playerId: player.Id,
    playerName: player.Name,
    playerLevel: player.Npc.level()!,
    playerHp: player.Npc.GetAttribute(NPC_ATR_HITPOINTS)!,
    playerMana: player.Npc.GetAttribute(NPC_ATR_MANA)!,
    partyMembers: [],
    quests: [],
  })

  UpdatePartyMemberOverlay(gamemode)
}

const RequestStateCreatorComponent = (player: Player, args: any, gamemode: GameMode) => {
  UpdateOverlayState<CreatorState>(player, 'CreatorComponent', {
    username: player.Name,
    gender: 1,
    currBodyVar: 0,
    face: 0,
    faceShape: 0,
    fatness: 0,
  })
}

const StopIntercept = (player: Player, args: any, gamemode: GameMode) => {
  Client.StopIntercept(player.Id)
}

const StartIntercept = (player: Player, args: any, gamemode: GameMode) => {
  Client.StartIntercept(player.Id)
}

export default {
  RequestStateHeroComponent,
  RequestStateStatsComponent,
  RequestStateCreatorComponent,
  StopIntercept,
  StartIntercept,
}
