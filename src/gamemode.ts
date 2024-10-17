// import { ShowNotification } from './utils/notifications.js'
import { Server, Client, GameModeBase, zVEC3 } from 'gothic-together'
import { BindCommandType } from 'gothic-together/client-commands'
import {
  // NPC_ATR_HITPOINTS,
  // TMovementSubType,
  // oCItem,
  // oCMsgMovement,
  oCNpc,
  // NPC_ATR_HITPOINTSMAX,
  // NPC_ATR_MANA,
  // NPC_ATR_MANAMAX,
} from 'gothic-together/union/classes/index'
import { CallCommand } from './utils/commands-handler.js'
import { AddItemToInventory, InitPlayerInventory, UseItemFromInventory } from './inventory/index.js'
import { MyPlayer as Player } from 'src/player.js'
import { GameState, store } from './store.js'
import { UpdateOverlayState } from './utils/update-overlay-state.js'
import { StatsState } from 'react/src/Stats.js'
import { UpdatePartyMemberOverlay, UpdateQuestOverlay } from './overlay/updater.js'

export const REACT_BASE_URL = process.env['FRONTEND_URL']

export class GameMode extends GameModeBase {
  override OnInitServer() {
    store.setState(store.getInitialState())
    Server.CreateObject('orc_squareplanks_2x3m.3DS', new zVEC3([-2045, 248, -830]))
  }

  override OnPlayerJoinServer(player: Player) {
    this.state.initPlayerAttributes(player.Id)
    player.SetAttrs({
      role: player.Id == 0 ? 'admin' : 'player',
    })

    UpdatePartyMemberOverlay(this)
    UpdateQuestOverlay(this, player)

    Client.BindCommandToKeyPress(player.Id, 0x70, 'menu', BindCommandType.OVERLAY_TOGGLE)

    InitPlayerInventory(player)
    AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITMI_GOLD',
      amount: 1000,
      isEquipped: false,
    })
    const armor = AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITAR_PAL_H',
      amount: 1,
      isEquipped: false,
    })
    const weapon = AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITMW_1H_PAL_SWORD',
      amount: 1,
      isEquipped: false,
    })
    AddItemToInventory(player, {
      isNative: true,
      objectName: 'ITPO_MEGADRINK',
      amount: 1,
      isEquipped: false,
    })

    player.Npc.SetAttribute(0, 2000)
    player.Npc.SetAttribute(1, 2000)
    player.Npc.SetAttribute(2, 2000)
    player.Npc.SetAttribute(3, 2000)
    player.Npc.SetAttribute(4, 300)
    player.Npc.SetAttribute(5, 300)
    player.Npc.SetGuild(1)

    // if (armor) {
    //   UseItemFromInventory(player, armor.objectName)
    // }
    // if (weapon) {
    //   UseItemFromInventory(player, weapon.objectName)
    // }

    Client.LoadHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#chat`)
    Client.CreateHtmlComponent(player.Id, 'Main')
    Client.NavigateHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#chat`)
    Client.DisableClosingOverlay(player.Id)

    // Client.LoadHtmlComponent(player.Id, 'Overlay_Main', `${REACT_BASE_URL}#stats`)
    // Client.CreateHtmlComponent(player.Id, 'Overlay_Main')
    // Client.StopIntercept(player.Id)
  }

  override OnPlayerDisconnectServer(player: Player): void {
    this.state.deletePlayerAttributes(player.Id)

    UpdatePartyMemberOverlay(this)
  }

  override OnPlayerCommand(player: Player, commandName: string, args: any) {
    if (CallCommand(commandName, player, args, this)) {
      return
    }

    switch (commandName) {
      case 'menu': {
        Client.NavigateHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#`)
        break
      }

      case 'performance': {
        const start = Date.now()
        for (let i = 0; i < 10000; i++) {
          this.HostNpc.GetAttribute(0)
        }
        console.log(Date.now() - start)
        break
      }

      default:
        return
    }
  }

  override OnTick() {}

  override OnPlayerChangeAttribute(
    player: Player,
    attribute: number,
    currentValue: number,
    change: number,
  ): void {}

  override OnDamage(
    attacker: oCNpc,
    attrackerName: string,
    target: oCNpc,
    targetName: string,
    weaponName: string,
    damage: number,
  ) {}

  get state() {
    return store.getState()
  }

  update(
    change: GameState | Partial<GameState> | ((state: GameState) => GameState | Partial<GameState>),
  ) {
    store.setState(change)
  }
}
