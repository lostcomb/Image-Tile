const electron = require("electron");
const {app, BrowserWindow} = electron;

function _create_window () {
  const window = new BrowserWindow({
    ..._get_window_size(),
    icon: __dirname + "/icons/icon.ico",
    webPreferences: {nodeIntegration: true}
  });
  window.loadFile("index.html");

  window.on("close", function () {
    window.webContents.executeJavaScript("window.saveState();");
  });
}

function _get_window_size() {
  const display_size = electron.screen.getPrimaryDisplay().size;
  const width = display_size.width * 0.6;
  return {
    width: width,
    height: Math.min(width * (10/16), display_size.height)
  };
}

app.on("ready", _create_window);
