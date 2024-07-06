let clickTimer: number | null = null
const clickDelay = 300

const handleCanvasClick = (eve: MouseEvent) => {
  if (clickTimer === null) {
      clickTimer = window.setTimeout(() => {
          clickTimer = null
          console.log('click')
      }, clickDelay)
  } else {
      window.clearTimeout(clickTimer)
      clickTimer = null
      console.log('ignore this click')
  }
}

const handleCanvasDoubleClick = (eve: MouseEvent) => {
  if (clickTimer) {
      window.clearTimeout(clickTimer)
      clickTimer = null
  }
  console.log('double click')
}

const myEle = document.querySelector('#myDiv') as HTMLElement
myEle.addEventListener('click', handleCanvasClick)
myEle.addEventListener('dblclick', handleCanvasDoubleClick)
