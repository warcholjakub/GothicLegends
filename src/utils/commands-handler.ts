import { MyPlayer as Player } from '../player.js'
import { GameMode } from '../gamemode.js'

type CommandFunction = (player: Player, args: any, gamemode: GameMode) => void
const CommandHandlers: Record<string, CommandFunction> = {}

export const AddCommandHandler = (name: string, handler: CommandFunction): void => {
  CommandHandlers[name.toLocaleLowerCase()] = handler
}

export const AddCommandHandlers = (handlers: Record<string, CommandFunction>): void => {
  Object.keys(handlers).forEach((key) => {
    AddCommandHandler(key, handlers[key]!)
  })
}

export const RemoveCommandHandler = (name: string): void => {
  delete CommandHandlers[name]
}

export const CallCommand = (
  name: string,
  player: Player,
  args: any,
  gamemode: GameMode,
): boolean => {
  const handlerFunction = CommandHandlers[name]
  if (handlerFunction) {
    handlerFunction(player, args, gamemode)
    return true
  }

  return false
}
