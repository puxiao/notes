chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        //此处用于自定义检查请求资源，然后替换成自己指定的替换资源
        if (details.url.endsWith('xxxx.js')) {
            return { redirectUrl: 'https://example.com/custom.js' };
        }
    },
    {
        urls: ["*://*.example.com/*.js"],
        types: ["script"]
    },
    ["blocking"]
);