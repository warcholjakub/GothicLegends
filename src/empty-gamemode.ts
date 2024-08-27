import { GameModeBase } from 'gothic-together'
import { Player } from 'gothic-together/player'
import { oCItem, oCMobInter, oCNpc, zCVob } from 'gothic-together/union/classes/index'

export class GameMode extends GameModeBase {
  override OnInitServer() {
    console.log(`OnInitServer`)
  }

  override OnExitServer() {
    console.log(`OnExitServer`)
  }

  override OnPlayerJoinServer(player: Player) {
    console.log(`OnPlayerJoinServer ${player}`)
  }

  override OnTick() {
    console.log(`OnTick`)
  }

  override OnTime(day: number, hour: number, minute: number) {
    console.log(`OnTime ${day} ${hour} ${minute}`)
  }

  override OnDamage(
    attacker: oCNpc,
    attrackerName: string,
    targe: oCNpc,
    targetName: string,
    weaponName: string,
    damage: number,
  ) {
    console.log(
      `OnDamage ${attacker} ${attrackerName} ${targe} ${targetName} ${weaponName} ${damage}`,
    )
  }

  override OnPlayerDisconnectServer(player: Player) {
    console.log(`OnPlayerDisconnectServer ${player}`)
  }

  override OnPlayerChatMessage(player: Player, message: string) {
    console.log(`OnPlayerChatMessage ${player} ${message}`)
  }

  override OnPlayerMobInteract(player: Player, mob: oCMobInter, mobName: string) {
    console.log(`OnPlayerMobInteract ${player} ${mob} ${mobName}`)
  }

  override OnPlayerNpcInteract(player: Player, npc: oCNpc, npcName: string) {
    console.log(`OnPlayerNpcInteract ${player} ${npc} ${npcName}`)
  }

  override OnPlayerChangeFocus(player: Player, vob: zCVob, vobName: string, vobType: number) {
    console.log(`OnPlayerChangeFocus ${player} ${vob} ${vobName} ${vobType}`)
  }

  override OnPlayerChangeAttribute(
    player: Player,
    attribute: number,
    currentValue: number,
    change: number,
  ) {
    console.log(`OnPlayerChangeAttribute ${player} ${attribute} ${currentValue} ${change}`)
  }

  override OnPlayerChangeWeaponMode(player: Player, weaponMode: number) {
    console.log(`OnPlayerChangeWeaponMode ${player} ${weaponMode}`)
  }

  override OnPlayerTakeItem(player: Player, item: oCItem, itemName: string) {
    console.log(`OnPlayerTakeItem ${player} ${item} ${itemName}`)
  }

  override OnPlayerDropItem(player: Player, item: oCItem, itemName: string) {
    console.log(`OnPlayerDropItem ${player} ${item} ${itemName}`)
  }

  override OnPlayerEquipItem(player: Player, item: oCItem, itemName: string) {
    console.log(`OnPlayerEquipItem ${player} ${item} ${itemName}`)
  }

  override OnPlayerUnequipItem(player: Player, item: oCItem, itemName: string) {
    console.log(`OnPlayerUnequipItem ${player} ${item} ${itemName}`)
  }

  override OnPlayerUseItem(player: Player, item: oCItem, itemName: string) {
    console.log(`OnPlayerUseItem ${player} ${item} ${itemName}`)
  }
}
