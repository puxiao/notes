// yarn add clipboard

import ClipboardJS from 'clipboard';

{
  
  const clipboard = new ClipboardJS('#xxx');
  
  clipboard.on('success', () => {
      message.success('复制成功');
  });
  clipboard.on('error', () => {
      message.error('复制失败');
  });
  
  //....
  
  //<button> or <a>
  <a id='xxx' data-clipboard-text={'这里是要被复制到剪切板中的文字内容'}>点击复制</a>
  
}
