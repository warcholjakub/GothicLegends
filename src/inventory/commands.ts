import { MyPlayer as Player } from 'src/player.js'
import { GameMode, REACT_BASE_URL } from 'src/gamemode.js'
import { DropItemFromInventory, SerializeInventory, UseItemFromInventory } from './index.js'
import { Client } from 'gothic-together'

const Eq = (player: Player, args: any, gameMode: GameMode) => {
  Client.NavigateHtmlComponent(player.Id, 'Main', `${REACT_BASE_URL}#eq`)
  Client.SendEventToHtmlComponents(player.Id, 'EqUpdate', SerializeInventory(player))
}

const UseItem = (player: Player, args: any, gameMode: GameMode) => {
  UseItemFromInventory(player, args)
}
const DropItem = (player: Player, args: any, gameMode: GameMode) => {
  DropItemFromInventory(player, args)
}

export default {
  Eq,
  UseItem,
  DropItem,
}
