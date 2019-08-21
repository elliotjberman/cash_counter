const { app, Menu, Tray, BrowserWindow } = require('electron');
const { menubar } = require('menubar');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;
app.on('ready', () => {
  // mainWindow = new BrowserWindow({
  //       webPreferences: {
  //       nodeIntegration: true
  //   }
  // });
  // mainWindow.loadURL('file://' + __dirname + '/index.html');

  const mb = menubar({
    index: `file://${__dirname}/index.html`,
    browserWindow: {
      webPreferences: {
        nodeIntegration: true,
      },
      height: 600
    }
  });
});
