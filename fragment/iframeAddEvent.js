//在React中使用 <iframe> 标签，如果想给它添加一些交互事件，例如 onToucheCancel 或 onPointerUp 事件，下面的这种写法是无效的

<iframe src='xx' title='xxx' onTouchDown={handleTouchXxxx} onPointerUp={handlePointerXxxx} />
  
//正确有效的添加方式为：得到 iframe 中的内容，并向其添加各种交互事件
//特别强调，下面的代码并未使用 useRef，而是直接获取 DOM 元素，如果使用 useRef 勾住 iframe 也是可以的
useEffect(()=>{
    const iframe = document.body.querySelector("iframe");
    iframe.onload = () => {
        iframe.contentDocument.body.ontouchcancel = handleTouchXxxx;
        iframe.contentDocument.body.onpointerup = handlePointerXxxx;
    };
},[])
