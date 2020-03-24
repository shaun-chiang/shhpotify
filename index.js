// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require('electron');
const { exec, spawn } = require('child_process');
const path = require('path');

const assetsDirectory = path.join(__dirname, 'assets');

let tray;

function backgroundProcess() {
  var child = spawn('./watch.sh');
  child.stdout.on('data', function(data) {
    const dataStr = data.toString();
    if (dataStr.includes('Track: Advertisement')) {
      exec('spotify quit', (error, stdout, stderr) => {
        exec(
          'open -a Spotify -gj && spotify play',
          (error, stdout, stderr) => {}
        );
      });
    }
  });
}

function createTrayAndListen() {
  tray = new Tray(path.join(assetsDirectory, 'sunTemplate.png'));
  tray.setContextMenu(Menu.buildFromTemplate([{ role: 'quit' }]));
  tray.setToolTip('shhpotify');
  backgroundProcess();
}

// Don't show the app in the dock
app.dock.hide();

app.on('ready', createTrayAndListen);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
