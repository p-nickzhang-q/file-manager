const {BrowserWindow, Menu} = require("@electron/remote");
const Electron = require('electron');

// @ts-ignore
export function buildMenu(menus: Electron.MenuItemConstructorOptions[]) {
    const menu = Menu.buildFromTemplate(menus);
    menu.popup({
        // @ts-ignore
        window: BrowserWindow.getFocusedWindow()
    })
}

