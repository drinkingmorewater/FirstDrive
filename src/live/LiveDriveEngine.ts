import type { LiveDriveContext, ProactiveEvent } from '../types'
import { advanceDemoContext } from './DemoStreamProvider'
import { findNewEvents } from './eventRules'

type Listener = (context: LiveDriveContext, events: ProactiveEvent[]) => void

export class LiveDriveEngine {
  private timer?: number
  private context: LiveDriveContext
  private listener: Listener

  constructor(initial: LiveDriveContext, listener: Listener) {
    this.context = initial
    this.listener = listener
  }

  start() {
    this.stop()
    this.timer = window.setInterval(() => {
      const previous = this.context.progress
      this.context = advanceDemoContext(this.context)
      this.listener(this.context, findNewEvents(previous, this.context))
      if (this.context.progress >= 100) this.stop()
    }, 2000)
  }

  setPaused(paused: boolean) {
    this.context = { ...this.context, paused }
    this.listener(this.context, [])
  }

  stop() {
    if (this.timer) window.clearInterval(this.timer)
  }
}
