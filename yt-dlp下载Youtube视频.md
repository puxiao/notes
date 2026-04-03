# yt-dlp下载Youtube视频

<br>

**下载yt-dlp程序：**

下载最新版 yt-dlp 程序：

https://github.com/yt-dlp/yt-dlp/releases/latest

对于 windows 64 位电脑，找到并下载 `yt-dlp.exe`

下载之后，将该文件存放到某个目录下，例如：D:\yt-dlp\yt-dlp.exe

<br>

**下载视频：**

假设要下载的 Youtube 视频地址为：`https://www.youtube.com/watch?v=yMv7NSFPaxQ`

在命令窗口中切换到 yt-dlp.exe 目录下，然后执行下面命令：

`./yt-dlp.exe -f bestvideo+bestaudio --merge-output-format mp4 "https://www.youtube.com/watch?v=yMv7NSFPaxQ"`

> 如果把 D:\yt-dlp\ 已加入系统环境变量中了，那么上面的 `./yt-dlp.exe` 可以直接简写成 `yt-dlp`
