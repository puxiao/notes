const closeWechatPage = () => {
    setTimeout(function () {
        //安卓手机
        document.addEventListener(
            "WeixinJSBridgeReady",
            function () {
                WeixinJSBridge.call("closeWindow");
            },
            false
        );
        //ios手机
        WeixinJSBridge.call("closeWindow");
    }, 100)
};

const handleBindBtClick = () => {
    if (confirm("您想关闭本页吗？")) {
        closeWechatPage();
    }
}


//<button onclick="handleBindBtClick()">关闭</button>
