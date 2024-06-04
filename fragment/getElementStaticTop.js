function getElementStaticTop(element) {
    let offsetTop = 0
    while (element) {
        offsetTop += element.offsetTop
        element = element.offsetParent
    }
    return offsetTop
}

const ele = document.getElementById('myDiv')
console.log(getElementStaticTop(ele))
