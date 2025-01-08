# Electron应用打包、更新相关



<br>

先说结论

**Electron 配套的 几个 NPM 包：**

* 打包：electron-builder
* 更新：electron-updater
* 日志：electron-log
* Squirrel启动检测：electron-squirrel-startup



<br>

## 基本代码

**先看一下基本的electron项目index.js代码：**

```
const { app, BrowserWindow, ipcMain, session } = require('electron');

const restartApp = () => {
    BrowserWindow.getAllWindows().forEach((win) => {
        if (win) {
            win.close();
        }
    })
    app.relaunch({ args: process.argv.slice(1) });
    app.exit(0);
}

const createWindow = () => {

    const appVersion = app.getVersion();

    mainWindow = new BrowserWindow({
        show: false,
        resizable: true,
        devTools: false,
        minWidth: 1400,
        minHeight: 800,
        x: 0,
        y: 0,
        autoHideMenuBar: true,
        icon: './icon.ico',
        webPreferences: {
            preload: './preload.js',
        },
    });

    mainWindow.maximize();
    mainWindow.show();
    //mainWindow.webContents.openDevTools();

    mainWindow.loadURL('https://www.puxiao.com');

    mainWindow.webContents.on('page-title-updated', (_, title) => {
        mainWindow.setTitle(`${title} - ${appVersion}`)
    })

    ipcMain.on('clear-cache', () => {
        session.defaultSession.clearCache();
        // session.defaultSession.clearStorageData({
        //     storages: ['appcache', 'cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers']
        // })
        restartApp();
    })

};

app.whenReady().then(() => {
    createWindow();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
```



<br>

## 打包与更新：electron-builder、electron-updater



<br>

**electron-builder简介：**

electron-builder 是打包发布 electron 项目的一个 NPM 包。

可以打包发布成：Windows、苹果、Liunx 系统应用。



<br>

**打包安装应用程序的文件格式：**

* 本文是以打包 windows x64位 应用为讲解，不涉及打包成 苹果 或 Linux 系统应用程序。

* 打包的 windows 应用安装文件为 xxx.exe

  > 如果希望打包后的安装文件为 .msi 格式，electron-build 也是可以配置的，但是本文主要讲的是打包为 .exe 。



<br>

**electron-updater简介：**

electron-updater 是 electron-builder 的一个配套的 NPM 包，用于检测、下载、安装应用程序的更新。



<br>

**安装：**

```
yarn add -D electron-builder
```

<br>

```
yarn add electron-updater
```

注意：

* electron-builder 是负责打包的，所以仅安装在 devDependencies 依赖中。
* electron-builder 是负责应用运行时检测安装更新的，所以需要安装在 dependencies 依赖中。



<br>

**修改package.json中的命令：**

```
"scripts": {
    "start": "chcp 65001 && electron .",
    "chcp": "chcp 936",
    "build": "electron-builder build --win --publish never"
},
```

> 由于我们采用的是将打包好的应用手工上传至我们的某个服务器地址，并不是发布某些公开的第三方应用平台(例如 github)，所以上述命令中有 `-publish never` 这样的参数。
>
> 如果有一天需要上传至某些公开的应用平台，那么参数可以改为 `--publsh always`



<br>

**我们要实现的功能：**

* 设置打包项
* 设置检测应用更新的地址
* 设置安装文件.exe 配置
* 设置安装默认的目录



<br>

代码如下

**在package.json中增加打包配置选项：**

```
"scripts": {
    ....
    "build": "electron-builder build --win --publish never"
},

"build": {
    "appId": "com.puxiao",
    "productName": "puxiao",
    "publish": [
        {
            "provider": "generic",
            "url": "https://puxiao.com/download/win-x64"
        }
    ],
    "win": {
        "sign": false,
        "target": [
            {
                "target": "nsis",
                "arch": [
                    "x64"
                ]
            }
        ],
        "icon": "icon.ico"
    },
    "nsis": {
        "oneClick": false,
        "include": "installer.nsh",
        "allowToChangeInstallationDirectory": true,
        "createDesktopShortcut": true,
        "createStartMenuShortcut": true,
        "installerIcon": "icon.ico",
        "uninstallerIcon": "icon.ico",
        "installerHeaderIcon": "icon.ico"
    }
},
```



<br>

**配置项说明：**

* `"publish": [{ ... }]`：配置检测发布平台，"provider": "generic" 中 是 "通用" 的含义。
* `"url": "https://puxiao.com/download/win-x64"`：我们只需把将来构建好的 dist 目录中的文件上传至该地址就完成了手工发布的工作。
* `"include": "installer.nsh"`：给安装程序嵌入一个 installer.nsh 脚本



<br>

**installer.nsh脚本：**

> installer.nsh                                                                                                                                           

```
!macro preInit
    SetRegView 64
    # 设置默认安装路径
    StrCpy $INSTDIR "$PROGRAMFILES\com.puxiao"
!macroend
```

>$PROGRAMFILES 是指：`C:\Program Files`，也就是说上述指定默认的安装目录为 `C:\Program Files\com.puxiao`
>
>与之对应的还有其他路径变量：
>
>* $APPDATA：`C:\Users\用户名\AppData\Roaming`
>* $LOCALAPPDATA：`C:\Users\用户名\AppData\Local`
>* $INSTDIR：安装目录
>* $DESKTOP：桌面
>* $WINDIR：`C:\windows `
>* $PICTURES：用户图片文档目录
>
>...



<br>

关于package.json 讲解到此，接下来去看一下 JS 代码部分。



<br>

在这之前，我们再安装一下 electron-squirrel-startup。

**安装 electron-squirrel-startup**

```
yarn add electron-squirrel-startup
```



<br>

## 代码部分



<br>

**更新相关：**

我们封装一下更新相关代码。

> update.js

```
const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

let isCheckingForUpdate = false;

autoUpdater.autoInstallOnAppQuit = false; //autoUpdater.autoInstallOnAppQuit 默认值为 true，设置 false 则禁止当应用退出时自动安装

// autoUpdater.autoDownload = false; //autoUpdater.autoDownload 默认值为 true ，即自动下载更新安装文件
// autoUpdater.on('update-available', () => {
//     dialog.showMessageBox({
//         type: 'info',
//         title: '发现更新',
//         message: '发现新版本,是否更新?',
//         buttons: ['立即更新', '稍后再说'],
//     }).then((result) => {
//         if (result.response === 0) {
//             autoUpdater.downloadUpdate();
//         }
//     });
// })

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: '发现更新',
        message: '更新已下载完成，请选择是否立即重启更新',
        buttons: ['立即重启应用', '稍后再说'],
    }).then((result) => {
        if (result.response === 0) {
            autoUpdater.quitAndInstall(false, true); //弹出对话窗口安装，下一步下一步方式安装，安装后自动打开应用
            //autoUpdater.quitAndInstall(true, true); //静默自动安装，安装后自动打开应用
        }
    });
})

autoUpdater.on('error', (_) => {
    dialog.showErrorBox('检测更新发生错误', '忽略本次错误');
})

const checkForUpdates = async () => {

    if (isCheckingForUpdate) resolve(false);
    isCheckingForUpdate = true;

    try {
        await autoUpdater.checkForUpdates()
    } catch (err) {
        //console.log('Update check failed:', err);
    } finally {
        isCheckingForUpdate = false;
    }

}

module.exports = { checkForUpdates }
```

对外导出一个 checkForUpdates 的函数，用于开始检测应用是否有更新，以后后续操作。



<br>

**修改主文件 index.js**

我们新增以下功能：

* 通过 electron-squirrel-startup 增加对安装过程中可能触发运行应用的忽略处理。
* 给应用设置为单例模式，即禁止同时打开多份应用程序，也就是说无论双击多少次应用图标 都仅仅打开一个应用窗口。

```
const { app, BrowserWindow, ipcMain, session } = require('electron');

const squirrelStartup = require('electron-squirrel-startup');
const { checkForUpdates } = require('./update.js');

let mainWindow = null;

//如果当前为 Squirrel 安装器安装过程中触发的启动，则立即退出，无需执行
if (squirrelStartup) {
    app.quit();
    return;
}

const restartApp = () => {
    BrowserWindow.getAllWindows().forEach((win) => {
        if (win) {
            win.close();
        }
    })
    app.relaunch({ args: process.argv.slice(1) });
    app.exit(0);
}

const createWindow = () => {

    const appVersion = app.getVersion();

    mainWindow = new BrowserWindow({
        show: false,
        resizable: true,
        devTools: false,
        minWidth: 1400,
        minHeight: 800,
        x: 0,
        y: 0,
        autoHideMenuBar: true,
        icon: './icon.ico',
        webPreferences: {
            preload: './preload.js',
        },
    });

    mainWindow.maximize();
    mainWindow.show();
    //mainWindow.setResizable(false);
    //mainWindow.webContents.openDevTools();

    mainWindow.loadURL('https://www.puxiao.com');

    mainWindow.webContents.on('page-title-updated', (_, title) => {
        mainWindow.setTitle(`${title} - ${appVersion}`)
    })

    ipcMain.on('clear-cache', () => {
        session.defaultSession.clearCache();
        // session.defaultSession.clearStorageData({
        //     storages: ['appcache', 'cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers']
        // })
        restartApp();
    })

};

//请求锁定当前应用为单例模式
const instanceLocked = app.requestSingleInstanceLock();

if (instanceLocked) {

    //如果已锁定单例模式，那么可以开始创建窗口
    app.whenReady().then(() => {
        checkForUpdates(); //启动更新检测
        createWindow(); //启动应用窗口
    });

} else {

    //如果当前应用单例模式锁定失败，则直接退出，不再继续执行
    app.quit();

}

//如果当前应用已锁定为单例模式，但此时又尝试启动了新的应用，则触发 second-instance 事件
app.on('second-instance', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
```





<br>

## 日志：electron-log



<br>

**安装：**

```
yarn add electron-log
```



<br>

**使用：**

```
const log = require('electron-log/node');

log.info('Log from the nw.js or node.js');
```



<br>

**保存目录：**

* Linux: ~/.config/{app name}/logs/main.log
* macOS: ~/Library/Logs/{app name}/main.log
* Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\main.log



<br>

**日志类型(级别)：**

```
error, warn, info, verbose, debug, silly
```



<br>

**覆盖console.log：**

```
console.log = log.log
```
