# Electron应用打包、更新相关

<br>

先说结论

**Electron 配套的 几个 NPM 包：**

- 打包：electron-builder
- 更新：electron-updater
- Squirrel启动检测：electron-squirrel-startup
- 日志：electron-log
- 数据状态：electron-store
- 软件防盗版：systeminformation、crypto-js

<br>

## 基本代码

**先看一下基本的electron项目index.js代码：**

```
const { app, BrowserWindow, ipcMain, session } = require('electron');
const { fileURLToPath } = require('url');
const path = require('path');

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
           preload: path.join(__dirname, 'preload.js'),
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

- 本文是以打包 windows x64位 应用为讲解，不涉及打包成 苹果 或 Linux 系统应用程序。
  
- 打包的 windows 应用安装文件为 xxx.exe
  
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

- electron-builder 是负责打包的，所以仅安装在 devDependencies 依赖中。
- electron-builder 是负责应用运行时检测安装更新的，所以需要安装在 dependencies 依赖中。

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

- 设置打包项
- 设置检测应用更新的地址
- 设置安装文件.exe 配置
- 设置安装默认的目录

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
        "runAfterFinish": true, //安装完成最后一步是否显示 "启动 xxx"，默认值为 true
        "deleteAppDataOnUninstall": true, //卸载软件时是否清空用户本机数据
        "installerIcon": "icon.ico",
        "uninstallerIcon": "icon.ico",
        "installerHeaderIcon": "icon.ico"
    }
},
```

<br>

**配置项说明：**

- `"publish": [{ ... }]`：配置检测发布平台，"provider": "generic" 中 是 "通用" 的含义。
- `"url": "https://puxiao.com/download/win-x64"`：我们只需把将来构建好的 dist 目录中的文件上传至该地址就完成了手工发布的工作。
- `"include": "installer.nsh"`：给安装程序嵌入一个 installer.nsh 脚本

<br>

**installer.nsh脚本：**

> 实际上我们绝大多数时候都不需要，用不上 installer.nsh ！

> installer.nsh

```
!macro preInit
    SetRegView 64
    # 设置默认安装路径
    StrCpy $INSTDIR "$PROGRAMFILES\com.puxiao"
!macroend
```

> $PROGRAMFILES 是指：`C:\Program Files`，也就是说上述指定默认的安装目录为 `C:\Program Files\com.puxiao`
> 
> 与之对应的还有其他路径变量：
> 
> - $APPDATA：`C:\Users\用户名\AppData\Roaming`
> - $LOCALAPPDATA：`C:\Users\用户名\AppData\Local`
> - $INSTDIR：安装目录
> - $DESKTOP：桌面
> - $WINDIR：`C:\windows `
> - $PICTURES：用户图片文档目录
> 
> ...

<br>

<br>

更多配置项，请查阅：[NSIS - electron-builder](https://www.electron.build/nsis.html)

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

- 通过 electron-squirrel-startup 增加对安装过程中可能触发运行应用的忽略处理。
- 给应用设置为单例模式，即禁止同时打开多份应用程序，也就是说无论双击多少次应用图标 都仅仅打开一个应用窗口。

```
const { app, BrowserWindow, ipcMain, session } = require('electron');
const { fileURLToPath } = require('url');
const path = require('path');

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename

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
           preload: path.join(__dirname, 'preload.js')
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

- Linux: ~/.config/{app name}/logs/main.log
- macOS: ~/Library/Logs/{app name}/main.log
- Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\main.log

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

<br>

## 数据状态：electron-store

**安装：**

```
yarn add electron-store
```

<br>

**初始化：**

```
import Store from 'electron-store'
const store = new Store() 
```

> 默认情况下会把数据存储在 `c:\用户\xxx\AppData\Roaming\your-app`

<br>

**自定义数据存储位置：**

```
const store = new Store({
    cwd: process.resourcesPath,//将数据存储在软件安装后的 "resources" 目录下
    name: 'locales', //文件名称，默认为 config
}) 
```

> 上述配置后，最终数据存储在程序安装目录的 `resources/locales.json` 中。

<br>

注意事项：

- 如果软件默认安装到了 C 盘，那么上述配置后，需要以管理员身份才可以有写入权限。
  
  > 读文件则不需要管理员权限
  
- 这样做相当于把应用程序做成了 "绿色版"，随意拷贝随意携带数据使用。
  

<br>

**使用：**

```
import Store from 'electron-store'
const store = new Store({ ... }) 

//检测是否存在
store.has('xxx')

//写入
store.set('xxx', xxx)

//读取
store.get('xxx')

//删除
store.delete('xxx')

//获取所有
store.store()

//清空所有
store.clear()
```

**注意事项1：尽管 const store = new Store() 看上去好像是新创建了一个数据状态实例，但实际上无论在多个地方执行多次，new Store() 获取到的是同一个数据状态实例。**

<br>

**注意事项2：electron-store 最新版仅支持 ModuleJS 类型的 import 引入方式，不支持 require('xxx') 引入方式。**

**因此，我们需要做的调整有：**

1. 修改或添加 packge.json 中 "type": "module"
  
2. 其他所有 .js 代码引入方式由 require() 改为 import
  
3. **但是 preload.js 是一个特例**，preload.js 内容不变，但是文件名改为 preload.cjs，同时记得修改相关引入文件的路径。
  
  ```
  new BrowserWindow({ 
  webPreferences: { 
    preload: path.join(__dirname, 'preload.cjs') 
  }, 
  })
  ```
  
4. 由于 ModuleJS 的严格模式下不允许在顶级 JS 作用域中使用 return，所以要检查我们的代码，删掉顶级 JS 作用域中的 return，否则 electron 程序会报错。
  
  例如本文上面讲解 electron-squirrel-startup 时提到的这段代码：
  
  ```
  if (squirrelStartup) {
    app.quit();
    //return; //若此行代码不删除则程序运行会报错
  }
  ```
  

<br>

## 软件防盗版：systeminformation、crypto-js

假设我们不希望别人可以轻易复制拷贝我们的应用软件，那么可以做一些简单的防盗版策略。

<br>

**策略如下：**

1. 软件安装成功第一次启动时，需要输入一个验证授权码(一个固定的字符串)
  
2. 若授权码与软件内置的密码字符串相同，此时则将当前电脑系统的 `硬件+网卡` 组合成唯一的 "机器身份ID" 写入到本地数据中
  
3. 后续每次启动应用程序时，都会获取一次当前电脑的 `硬件+网卡` 信息与之前写入的信息进行对比，若一致则跳转到正式的网页中，若不一致则跳转至 版本信息页。
  

这样做就会启到一定的防盗版效果：

- 如果别人拿到了我们的应用安装包，但是他不知道授权码，仅可以进入到安装授权界面，无法正常运行软件。
  
- 如果已经安装成功了 ，别人通过整体拷贝安装目录到其他电脑上，由于另外一台电脑 `硬件+网卡` 信息与软件安装目录中已存在的信息不一致，也无法正常运行软件。
  

<br>

接下来讲一下实现中的几个关键技术点。

<br>

**信息加密：**

我们使用 crypto-js、js-base64、js-md5 来对授权码和机器码进行加密，让别人看不出、无法手工修改。

> 即使知道 加密前 和 加密后 的字符串，但是别人也无法反推加密过程。

<br>

**不同的界面：授权页、版权页**

我们在项目中创建 2 个 html 页面：config.html、copyright.html

**config.html 授权页：**

里面有输入 授权码 的输入框，点击确认后将授权码发送给 electron 主程序。

```
if (window.electronAPI) {
    window.electronAPI.saveConfig({ xxx });
}
```

electron 主程序接收到授权码后进行加密，然后与 JS 中定义的授权码(已加密)进行对比。

若不一致，则告诉前端页面：

```
 mainWindow.webContents.executeJavaScript(`alert('安装授权码错误')`)
```

若一致，则开始尝试获取硬盘和网卡信息组成的当前电脑唯一机器标识。

<br>

**获取当前电脑唯一机器标识：**

我们使用 `systeminformation` 这个 NPM 包。

<br>

获取硬盘唯一编号：

```
const getDiskNum = () => {
    return new Promise((resolve, _) => {
        si.diskLayout().then((originDisks) => {
            const disks = originDisks.filter(d => d.serialNum && d.serialNum.trim() !== '')
                .sort((a, b) => a.device.localeCompare(b.device));
            if (disks.length === 0) {
                resolve('');
            };
            resolve(disks[0].serialNum);
        }).catch((err) => {
            console.error(err);
            resolve('');
        });
    })
}
```

<br>

获取网卡号：

```
const getMac = () => {
    return new Promise((resolve, _) => {
        si.networkInterfaces().then((originNetworkInterfaces) => {
            const list = Array.isArray(originNetworkInterfaces) ? originNetworkInterfaces : [originNetworkInterfaces];
            const networkInterfaces = list.filter(n => n.mac && n.mac !== '00:00:00:00:00:00' && !n.internal)
                .sort((a, b) => a.iface.localeCompare(b.iface));
            if (networkInterfaces.length === 0) {
                resolve('');
            };
            resolve(networkInterfaces[0].mac);
        }).catch((err) => {
            console.error(err);
            resolve('');
        });
    })
}
```

<br>

整合得到唯一的自定义的机器 ID 字符串：

```
//我们设定一个加密强度 encStrength：0=无加密;1=硬盘加密;2=网卡加密;3=硬盘+网卡

const getDiskInfo = async (encStrength) => {

    let serialNum = 'disk';
    let mac = 'network';

    try {
        switch (encStrength) {
            case 0:
                break
            case 1:
                serialNum = await getDiskNum();
                break
            case 2:
                mac = await getMac();
                break
            case 3:
                serialNum = await getDiskNum();
                mac = await getMac();
                break
            default:
                throw new Error('不支持的加密强度');
        }
    } catch (err) {
        console.error(err);
        throw new Error('获取硬盘/网卡信息失败：', }

    return `${orgName}-${serialNum}-${mac}-${encStrength}`

}
```

> 请注意我们将加密强度也写入到了机器ID 里。

接下来我们就将得到的唯一机器 ID 通过 `crypto-js` 加密，然后通过前面讲的 `electron-store` 写入到本地中。

```
const str = encryptoData(machineUUID, Base64.encode(md5(key)))
store.set('machineUUID', str)
```

写入完成后，我们可以自动重启应用程序。

<br>

**核心点：每一次启动应用时进行校验**

当软件刚启动时，我们先通过 `store.get('machineUUID')` 尝试读取。

- 若不存在则将跳转至 config.html 页面进行授权配置
  
- 若存在则读取并进行解密，并从解密后的字符串中提取到加密强度 encStrengt，然后调用 `getDiskInfo(encStrengt)` 获取当前电脑的机器 ID ，接下来将 2 者进行对比，若一致则 electron 程序跳转至正式内容页，若不一致则跳转至版权页。
  

<br>

**copyright.html 版权页：**

静态页面，就显示 "软件授权信息异常，请联系 xxx 。"

<br>

**上述操作对于不懂编程的人来说，起到了防盗版效果。**

但是对于懂 electron 编程的人来说，他们可以通过去分析你的 app.asar 来获取你的全部 JS 代码，自然就知道如何破解了。
