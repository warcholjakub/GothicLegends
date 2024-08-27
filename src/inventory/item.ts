import { oCItem, oCNpc, zVEC3 } from 'gothic-together/union/classes/index'

export type Item = {
  objectName: string
  category?: string
  amount: number
  isNative: boolean
  positionWorld?: zVEC3
  owner?: oCNpc
  vob?: oCItem | null
  isEquipped: boolean
}
