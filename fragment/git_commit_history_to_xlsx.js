/**
 * 本脚本是将 git 提交历史记录导出转化为 .xlsx 文件
 * 使用方法：
 * 1、手工创建一个 package.json 文件，内容如下：
 * {
    "type": "module",
    "name": "node_xlsx",
    "version": "1.0.0",
    "description": "",
    "main": "app.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
        "node-xlsx": "^0.23.0"
    }
   }
 * 2、执行安装依赖命令：yarn
 * 3、把本js文件名 git_commit_history_to_xlsx.js 修改成 app.js
 * 4、执行命令：node app.js
 */

/**
 * 从 git 中导出提交历史：
 * 假设你的 git 用户名为 puxiao，那么在 Git Base 窗口中执行：
 * (不要在 VSCode 命令窗口，因为那样导出的文件会有中文乱码)
 * git log --author=puxiao --encoding=UTF-8 >> ~/Desktop/puxiao_commit_history.txt
 * 这样就得到了 puxiao 的提交历史，将桌面上的 puxiao_commit_history.txt 复制到本项目中
 */

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import xlsx from 'node-xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commitHistoryTxtPath = path.join(__dirname, 'puxiao_commit_history.txt')
const xlsxPath = path.join(__dirname, 'puxiao_commit_history.xlsx')

const createXlsx = async () => {

    const originTxt = fs.readFileSync(commitHistoryTxtPath, 'utf-8')

    if (originTxt) {
        const originData = originTxt.split('\n')
        const strArr = originData.filter(item => item !== '')

        const commitIndexArr = []
        for (let i = 0; i < strArr.length; i++) {
            if (strArr[i].startsWith('commit')) {
                commitIndexArr.push(i)
            }
        }

        const contentArr = commitIndexArr.map((item, index) => {
            return strArr.slice(item, index === commitIndexArr.length - 1 ? strArr.length : commitIndexArr[index + 1])
        })

        const data = [
            ['Commit', 'Author', 'Date', 'Message', 'Merge'],
        ]

        contentArr.forEach(item => {

            let commit = item.find(item => item.startsWith('commit')) || ''
            commit = commit.replace('commit ', '')

            let author = item.find(item => item.startsWith('Author')) || ''
            author = author.replace('Author: ', '')

            let date = item.find(item => item.startsWith('Date')) || ''
            date = date.replace('Date:   ', '')
            date = new Date(date).toLocaleString()

            let message = item.find(item => item.startsWith('    ')) || ''
            message = message.replace('    ', '')

            let merge = item.find(item => item.startsWith('Merge')) || ''
            merge = merge.replace('Merge: ', '')

            data.push([commit, author, date, message, merge])
        })

        const sheetOptions = { '!cols': [{ wch: 50 }, { wch: 40 }, { wch: 30 }, { wch: 60 }, { wch: 20 }] }
        const buffer = xlsx.build([{ name: 'gitHistory', data: data }], { sheetOptions });
        fs.writeFileSync(xlsxPath, buffer)
    }
}

createXlsx()
