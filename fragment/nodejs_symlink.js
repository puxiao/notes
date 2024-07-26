// 特别说明：在 Windows 的 VSCode 或 Powershell 命令窗口中执行 nodejs 创建或删除软链接，需要你使用 管理员权限
// 运行方式 1：以管理员身份运行 Powershell 命令，再执行下面脚本

// 运行方式 2：修改当前用户权限
// 具体方式为：
// 1：Windows 开始运行，输入 gpedit.msc 按确定
// 2："计算机配置" > "Windows 设置" > "安全设置" > "本地策略" > "用户权限分配" > "创建符号链接"
// 3：添加你的用户账户到这个策略中：输入自己当前用户名，点击 "名称检查"，找到完整的用户组和用户名，点击 "确定"
// (如果不知道自己当前用户名，可在 Powershell 命令中执行：$env:USERNAME)
// 4：重启计算机 (很重要！)
// 重启之后，再在 VSCode 或 Powershell 中就可以顺利执行了

// 使用场景：你可以在前端 Vite 项目 package.json 中添加下面的调试命令
// "scripts": { "dev:xxx": node nodejs_symlink.js your-target-dir && vite }
// 这样每次调试前会创建软连接，一套程序可以编写多个调试命令 用来调试 多个配置文件资源，无需手动修改或复制
// (在下面代码示例中是将 /public/webfiles 映射到不同的资源配置目录)

import { existsSync, lstatSync, symlinkSync, unlinkSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 如果你希望目标目录名称是靠命令参数传递进来，那么可以采用下面注释中的代码
// 最终执行命令为：node nodejs_symlink.js your-target-dir
// const targetDir = process.argv[2]
// if (!targetDir) {
//     console.error('缺少指定目录名称的参数，无法创建软连接')
//     process.exit(1)
// }
// const targetPath = path.resolve(__dirname, '../xxxxx/', targetDir)

const targetPath = path.resolve(__dirname, '../xxxxx/your-target-dir')
const linkPath = path.resolve(__dirname, '../public/webfiles')

if (existsSync(linkPath) && lstatSync(linkPath).isSymbolicLink()) {
    unlinkSync(linkPath, (err) => {
        if (err) console.log(err)
    })
}

symlinkSync(targetPath, linkPath, 'dir', (err) => {
    if (err) console.log(err)
})
