import './env.js'
import { SetGameMode, StartGameMode, SetPlayerClass, SetMiddlewares } from 'gothic-together'
import { GameMode } from './src/gamemode.js'
import { MyPlayer } from 'src/player.js'
import { AddCommandHandlers } from 'src/utils/commands-handler.js'
import { InventoryMiddleware } from 'src/inventory/middleware.js'
import AdminCommands from 'src/admin/commands.js'
import HeroCommands from 'src/hero/commands.js'
import InventoryCommands from 'src/inventory/commands.js'
import CreatorCommands from 'src/creator/commands.js'
import OverlayCommands from 'src/overlay/commands.js'
import LoginCommands from 'src/login/commands.js'
import ChatCommands from 'src/chat/commands.js'

console.log(`Node started in ${process.env['APP_ENV']} mode.`)

const gameMode = new GameMode()
const inventoryMiddleware = new InventoryMiddleware(gameMode)

SetGameMode(gameMode)
SetPlayerClass(MyPlayer)
SetMiddlewares([inventoryMiddleware])

AddCommandHandlers({
  ...AdminCommands,
  ...HeroCommands,
  ...InventoryCommands,
  ...CreatorCommands,
  ...OverlayCommands,
  ...LoginCommands,
  ...ChatCommands,
})

StartGameMode()
