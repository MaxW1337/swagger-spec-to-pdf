"use strict"

var electron = require('electron')
var app = electron.app
var BrowserWindow = electron.BrowserWindow

console.log("CLI Parameters: " + process.argv)

app.commandLine.appendSwitch('--disable-http-cache')
app.on('ready', function() {
  var win = new BrowserWindow({ width: 800, height: 600, webPreferences: { nodeIntegration: false }})
  win.loadURL('http://127.0.0.1:19849/?url=http://127.0.0.1:19849/default.yaml&docExpansion=full', { "extraHeaders" : "pragma: no-cache\n" })
  win.webContents.on("did-finish-load", function() {
    console.log('Swagger editor loaded')
    setTimeout(function() {
      win.webContents.printToPDF({ pageSize: 'A4', landscape: false, printBackground: true }).then((data)=> {
        console.log("PDF printed")
        require('fs').writeFile(require('path').join(process.argv[2], 'api.pdf'), data, function(error) {
          if (error) throw error
          win.destroy()
        })
      }).catch((error) => {
        console.log(error)
        throw error
      })
    }, 2500)
  })
})
