const {BrowserWindow, Menu} = require("@electron/remote");
const Electron = require('electron');

// @ts-ignore
export function useMouseOptions(menus: Electron.MenuItemConstructorOptions[]) {
    return Menu.buildFromTemplate(menus);
}

// @ts-ignore
export function popup(menu: Menu) {
    menu.popup({
        // @ts-ignore
        window: BrowserWindow.getFocusedWindow()
    })
}

