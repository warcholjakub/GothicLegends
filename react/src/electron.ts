declare global {
  interface Window {
    electron: any
  }
}

const ConfigureBrowserIfNotInsideGame = (): boolean => {
  if (window.electron) {
    return false
  }

  window.electron = {
    ipcRenderer: {
      sendMessage: (args: any) => {
        console.log(`[Electron] ipcRenderer.sendMessage: ${args}`)
      },
    },
    commands: {
      send: (commandName: string, args: any) => {
        console.log(`[Electron] commands.send: ${commandName} ${JSON.stringify(args || {})}`)
      },
    },
    events: {
      on: (args: any) => {
        console.log(`[Electron] events.on: ${args}`)
      },
    },
  }

  return true
}

export { ConfigureBrowserIfNotInsideGame }
