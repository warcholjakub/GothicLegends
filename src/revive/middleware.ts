import { MiddlewareBase } from 'gothic-together/middleware-base'
import { NPC_ATR_HITPOINTS } from 'gothic-together/union/classes/index'
import { SetProgressBar } from 'src/utils/progress-bar.js'

export class RevivePlayerMiddleware extends MiddlewareBase {
  override OnTick() {
    for (const p of this.GameMode.Players) {
      if (p.Attrs.healTargetUuid) {
        const focusPlayer = p.Npc.GetFocusNpc()
        const revivingPlayerHP = p.Npc.GetAttribute(NPC_ATR_HITPOINTS)
        if (focusPlayer?.Uuid != p.Attrs.healTargetUuid || revivingPlayerHP! <= 0) {
          SetProgressBar(p, false)
          p.SetAttrs({ healTargetUuid: '', reviveTimeStart: -1 })
        }
      }
    }
  }
}
