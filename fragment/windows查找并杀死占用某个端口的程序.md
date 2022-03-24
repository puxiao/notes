第一步：查找占用某个端口的程序，例如端口：8022

```
netstat -ano | findstr 8022
```

<br>

第二步：根据查询结果，得知占用该端口的程序的 PID(进程识别号)，然后杀死该 PID，假设该PID为：15238

```
taskkill /f /pid 15238 /t
```


<br>

在 nodejs 环境中，自动杀死占用某个端口的程序

```
const exec = require('child_process').exec

const killPort = (port) => {
    exec(`netstat -ano | findstr ${port}`, (err, stdout, stderr) => {
        if (err) {
            console.log(`No open port ${port}`)
        } else {
            let arr = stdout.split('\r\n')
            arr.pop()
            arr = arr.map(item => {
                const pid = item.split(' ').pop()
                return pid
            }).map(item => Number(item)).filter(item => isNaN(item) === false && item > 0)
            const pids = [...new Set(arr)]

            exec(`chcp 936`) //将命令窗口编码改为 简体中文 ，为的是可以正确显示输出包含有中文的信息
            pids.forEach(pid => {
                exec(`taskkill /pid ${pid} /f`, (err, stdout, stderr) => {
                    if (err) {
                        console.log(err)
                        console.log(`kill ${pid} happen error!`)
                    } else {
                        console.log(stdout)
                    }
                })
            })
            exec(`chcp 65001`) //将命令窗口编码恢复成 UTF-8
        }
    })
}

killPort(8022)


```
