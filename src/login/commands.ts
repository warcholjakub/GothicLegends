import { UpdateOverlayState } from 'src/utils/update-overlay-state.js'
import { MyPlayer as Player } from '../player.js'
import { GameMode, REACT_BASE_URL } from 'src/gamemode.js'
import { Client, zVEC3 } from 'gothic-together'

type LoginArgs = {
  username: string
  password: string
}

const LoginAttempt = (player: Player, args: LoginArgs) => {
  if (args.username === 'admin' && args.password === 'admin') {
    Client.EnableClosingOverlay(player.Id)
    Client.StopIntercept(player.Id)
    Client.CreateHtmlComponent(player.Id, 'Overlay_Main')
  }
}

export default {
  LoginAttempt,
}
