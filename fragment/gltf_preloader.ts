/**
 * GLTF文件预加载，所谓预加载就是指通过 Web Worker 网络请求 GLTF 文件到本地浏览器缓存中，但不解析 GLTF 文件。
 * 使用示例：
 * const preloader = new Worker(new URL('@/workers/gltf_preloader.ts', import.meta.url));
 * preloader.postMessage({ type: 'loadGltf', list: ['https://xxx.glb', 'https://xxx.gltf'] });
 * 请注意：在传递的 list 中 gltf 文件 URL 必须是 http/https 这样开头的绝对路径
 */

const needLoadGltfList: string[] = []
const needLoadAssetsList: string[] = []

const finishedOne = () => {
    const curSrc = needLoadGltfList.shift()
    needLoadAssetsList.length = 0
    self.postMessage({
        type: 'loadedGltf',
        uri: curSrc
    })

    if (needLoadGltfList.length > 0) {
        preload(needLoadGltfList[0])
    }

}

const loadGltf = (fileSrc: string) => {

    fetch(fileSrc).then(res => res.json()).then(gltf => {

        const basePath = fileSrc.split('/').slice(0, -1).join('/') + '/'
        const allAssets = [...gltf.buffers, ...gltf.images].map(item => basePath + item.uri)

        needLoadAssetsList.push(...allAssets)

        Promise.all(needLoadAssetsList.map(item => fetch(item))).finally(finishedOne)

    }).catch(finishedOne)
}

const loadGlb = (fileSrc: string) => {
    fetch(fileSrc).finally(finishedOne)
}

const preload = (fileSrc: string) => {
    if (fileSrc.endsWith('.glb')) {
        loadGlb(fileSrc)
    } else if (fileSrc.endsWith('.gltf')) {
        loadGltf(fileSrc)
    } else {
        console.error(`Preloader: 不支持的 GLTF 文件格式 ${fileSrc}`)
        finishedOne()
    }
}

self.onmessage = ({ data }) => {

    const type = (data && data.type) || ''

    switch (type) {
        case 'loadGltf':
            const loading = needLoadGltfList.length > 0
            needLoadGltfList.push(...data.list)
            if (loading === false) {
                preload(needLoadGltfList[0])
            }
            break
        case 'stopLoad':
            // TODO: 取消当前的加载
            break
        default:
            break
    }

}
