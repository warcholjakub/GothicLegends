import { Client, Server } from 'gothic-together'
import { Player } from 'gothic-together/player'
import {
  NPC_WEAPON_NONE,
  oCMsgManipulate,
  TManipulateSubType,
} from 'gothic-together/union/classes/index'
import { Item } from './item.js'
import { isItemActive } from './utils.js'

const PlayerInventory: Record<number, Item[]> = {}

export const InitPlayerInventory = (player: Player): void => {
  PlayerInventory[player.Id] = []
}

export const AddItemToInventory = (player: Player, item: Item): Item | null => {
  if (!item) {
    return null
  }
  if (!PlayerInventory[player.Id]) {
    InitPlayerInventory(player)
  }
  const searchedItem = FindItemInInventory(player, item.objectName)

  if (!searchedItem) {
    item.owner = player.Npc
    item.category = item.objectName.substring(0, 4)

    if (!item.vob && item.isNative) {
      item.vob = Server.PutInInventory(item.objectName, item.owner, item.amount)
    }
    PlayerInventory[player.Id]!.push(item)
  } else {
    searchedItem.amount += item.amount
    PlayerInventory[player.Id] = PlayerInventory[player.Id]!.map((item) =>
      item.objectName == searchedItem.objectName ? searchedItem : item,
    )
  }
  Client.SendEventToHtmlComponents(player.Id, 'EqUpdate', SerializeInventory(player))

  return item
}

export const FindItemInInventory = (player: Player, itemName: string): Item | null => {
  const item = PlayerInventory[player.Id]?.find((i) => i.objectName == itemName)
  return item || null
}

export const RemoveItemFromInventory = (player: Player, itemName: string): void => {
  const item: Item | null = FindItemInInventory(player, itemName)

  if (!item) {
    return
  }

  if (PlayerInventory) {
    PlayerInventory[player.Id] = PlayerInventory[player.Id]!.filter((i) => i.objectName != itemName)
  }
}

export const SerializeInventory = (player: Player) => {
  if (!PlayerInventory[player.Id]) {
    return {}
  }
  return PlayerInventory[player.Id]
}

export const UseItemFromInventory = (player: Player, objectName: string) => {
  const item: Item | null = FindItemInInventory(player, objectName!)
  if (!item || player.Npc.GetWeaponMode() != NPC_WEAPON_NONE) {
    return
  }

  if (
    item.category == 'ITRI' ||
    item.category == 'ITBE' ||
    item.category == 'ITAM' ||
    item.category == 'ITAR' ||
    item.category == 'ITMW' ||
    item.category == 'ITSC' ||
    item.category == 'ITRU'
  ) {
    if (player.Npc.CanUse(item.vob!)) {
      player.Npc.Equip(item.vob!)
      item.isEquipped = isItemActive(item)
      PlayerInventory[player.Id]?.forEach((i) => {
        if (i.isEquipped && i.category == item.category && item != i) {
          i.isEquipped = isItemActive(i)
        }
      })
    }
  } else if (item.category == 'ITPL' || item.category == 'ITFO' || item.category == 'ITPO') {
    const message = oCMsgManipulate.oCMsgManipulate_OnInit6(
      TManipulateSubType.EV_USEITEMTOSTATE,
      item.vob!,
      1,
    )

    const eventMan = player.Npc!.eventManager()
    eventMan!.OnMessage(message!, player.Npc!)

    if (item.amount! > 1) {
      item.amount -= 1
    } else {
      RemoveItemFromInventory(player, objectName)
    }
  }

  Client.SendEventToHtmlComponents(player.Id, 'EqUpdate', SerializeInventory(player))
}

export const DropItemFromInventory = (player: Player, objectName: string) => {
  const item: Item | null = FindItemInInventory(player, objectName!)
  if (!item || player.Npc.GetWeaponMode() != NPC_WEAPON_NONE) {
    return
  }
  RemoveItemFromInventory(player, objectName!)
  const message = oCMsgManipulate.oCMsgManipulate_OnInit6(
    TManipulateSubType.EV_DROPVOB,
    item.vob!,
    1,
  )
  if (item.isEquipped) {
    item.isEquipped = false
  }
  if (!message) {
    return
  }

  const eventMan = player.Npc.eventManager()
  eventMan!.OnMessage(message!, player.Npc)

  Client.SendEventToHtmlComponents(player.Id, 'EqUpdate', SerializeInventory(player))
}
