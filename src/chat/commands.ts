import { MyPlayer as Player } from 'src/player.js'
import { GameMode } from 'src/gamemode.js'
import { Client, zVEC3, Server } from 'gothic-together'
import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'

const normalRange: number = 3500

type message = {
  content: string
  type: string
  sender: string
}

const calculateDistance = (player1: Player, player2: Player) => {
  const cords1 = player1.Npc.GetPositionWorld()
  const cords2 = player2.Npc.GetPositionWorld()
  if (!cords1 || !cords2) {
    throw new Error('Player coordinates are not available')
  }
  const distance = Math.sqrt(
    (cords1.X - cords2.X) ** 2 + (cords1.Y - cords2.Y) ** 2 + (cords1.Z - cords2.Z) ** 2,
  )
  return distance
}

const sendMessage = (player: Player, args: message | string, gameMode: GameMode) => {
  if (typeof args === 'string') {
    args = { content: args, type: 'chat', sender: '' }
  }
  console.log(args.content)
  args.sender = player.Name
  gameMode.Players.forEach((p) => {
    if (calculateDistance(player, p) < normalRange)
      UpdateOverlayState<message>(p, 'newMessage', args)
  })
}

export default {
  sendMessage,
}
