//假设想通过点击 <a> 标签下载某个文件，如果该文件和当前页面是同一个域名，那么直接这样写就可以
//<a href='/xx/xx/xx.xx' download='xx.xx' target="_blank" rel="noopener noreferrer"></a>

//但是如果要下载的文件来自不同的域名，就会存在跨域问题(CORS)
//此时执行的不再是下载，而是在浏览器中打开此文件

//要想解决这个问题，只能通过下面这种变相方式来实现


//不再使用 <a>，而是 <span>
//<span onClick={() => downloadFile('http://xx.xx.com/xx/xx.xx')} style={{ cursor: 'pointer', color: 'green' }} >下载</span>
//实现的逻辑：请求该文件地址、当加载完成后将该内容转换成一个临时的URL、再通过添加 <a> 的方式来实现内部下载这个文件
//这样就绕开了跨域问题

const downloadFile = (url) => {

    const fileName = url.split('/').pop().split('?')[0]

    var x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.responseType = 'blob';
    x.onload = function (e) {
        var url = window.URL.createObjectURL(x.response)
        var a = document.createElement('a');
        a.href = url
        a.download = fileName;
        a.click()
    }
    x.send();
}

export default downloadFile
