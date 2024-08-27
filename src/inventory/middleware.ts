import { MiddlewareBase } from 'gothic-together/middleware-base'
import { oCItem } from 'gothic-together/union/classes/index'
import { MyPlayer as Player } from 'src/player.js'
import { AddItemToInventory } from './index.js'

export class InventoryMiddleware extends MiddlewareBase {
  override OnPlayerTakeItem(player: Player, item: oCItem, itemName: string) {
    if (!item || !itemName) {
      return
    }
    const itemAmount = item.amount()

    AddItemToInventory(player, {
      isNative: true,
      objectName: itemName,
      amount: itemAmount as number,
      vob: item,
      isEquipped: false,
    })
  }
}
