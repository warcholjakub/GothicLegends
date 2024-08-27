import { Item } from './item.js'

export const isItemActive = (item: Item) => {
  return item.vob?.HasFlag(1073741824) == 1
}
