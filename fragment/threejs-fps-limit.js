this._frameCount: number = 0; //帧频计数器
this._lastSecondTime: number = 0; //用于记录上一秒时间戳

this._suggestFPS: number = 20; //期望限制的帧频
this._fpsInterval: number = 1000 / suggestFPS; //计算出理论上每一帧间隔毫秒数
this._lastRenderTime: number = 0; //用于记录上一次渲染的时间戳

//下面为伪代码，假定 this._clock、this._cameraControls 和 this._composer 都已初始化完成

const render = () => {

        //相机控制器我们不做任何限制
        const delta = this._clock.getDelta()
        this._cameraControls.update(delta)

        const nowTime = performance.now()

        //帧频限制：若当前时间戳 减去 上一次渲染时间戳 的值大于 理论上每帧间隔毫秒，则可以进行渲染
        if (nowTime - this._lastRenderTime >= this._fpsInterval) {

            this._frameCount++

            //实际帧频：判定本次渲染是否在上一个渲染周期(1秒)内
            if (nowTime - this._lastSecondTime >= 1000) {
                this._fpsStats.fps = Math.round((this._frameCount * 1000) / (nowTime - this._lastSecondTime))
                this._frameCount = 0
                this._lastSecondTime = nowTime
            }

            this._lastRenderTime = nowTime

            this._composer.render() //执行一次渲染

        }

    }
