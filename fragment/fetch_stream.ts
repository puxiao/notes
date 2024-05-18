const demoRequest = async ( postData: any, signal?: AbortSignal) => {

    try {
        const response = await fetch(`${baseURL}/api/stream/xxx`, {
            ...baseOptions,
            signal,
            body: JSON.stringify(postData)
        })

        if (response.body === null) {
            console.error('网络异常，流式请求失败')
        } else {
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()

            while (true) {
                const { done, value } = await reader.read()
                if (done) {
                    console.log('流式请求完成')
                    break
                }
                if (value) {
                    let messageList: string[] = value.split('\n')

                        //下面是针对流式请求中获得的数据进行适当的预处理和过滤，需要根据实际情况来编写
                        .map(item => item.trim())
                        .filter(item => item.length > 0 && item.startsWith(': ping - 2024') === false)
                        .map(item => {
                            if (item.startsWith('data:')) {
                                return item.slice(6)
                            }
                            return item
                        })

                    //最终得到流式请求 中间过程收到的消息
                    console.log(messageList.join(''))
                }

            }
        }
    } catch (err) {

        //@ts-ignore
        if (err?.name === 'AbortError') return //排除通过 signal.abort() 主动终止流式请求而引发的错误

        console.error(err)
    }

}
