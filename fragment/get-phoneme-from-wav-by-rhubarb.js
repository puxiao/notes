/**
 * 一些有用的转换命令
 * 1、将 .wav 转换成采样率 16000 单声道的 .pcm：
 * ffmpeg -i ./xx.wav -f s16le -acodec pcm_s16le -ar 16000 -ac 1 ./xx.pcm
 *
 * 2、从 .mp4 中提取采样率 16000 单声道的 .wav：
 * ffmpeg -i ./xx.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 ./xx.wav
 */

/**
 * rhubarb-lip-sync-wasm 将人类所有发音归并为 9 种嘴型：
 * X：静默/放松/闭嘴，无声或极短停顿时的自然休息状态 —— 嘴唇轻轻闭合，下颌微松。发音：不发音
 * A：双唇音，双唇完全闭合，气流在嘴内积蓄后爆破 —— 双唇紧闭，嘴角自然。发音：p b m
 * B：牙关微开，嘴唇略分，用于大多数辅音 —— 嘴微张，牙齿可见或相近。发音：t d k g s z n l r ch th sh …
 * C：嘴唇微分，中性元音发音时的默认口型 —— 嘴略张，嘴角平直。发音：EH IH IY SH ZH
 * D：嘴大张，开口元音，嘴张得最大 —— 上下颌大幅张开。发音：AA AE AH
 * E：嘴型圆张，中圆元音，嘴唇略成圆形并张开 —— 嘴唇微圆，中等开度。发音：AO OH
 * F：嘴唇收圆，高圆元音或半元音，嘴唇向前噘起 —— 嘴唇噘起成小圆孔。发音：W UW
 * G：唇齿音，上齿轻触下唇，产生摩擦气流 —— 上齿咬住下唇内侧。发音：F V
 * H：舌尖音，舌尖抵上颚或上齿，嘴微张 —— 嘴微开，舌头位置靠前靠上。发音：L
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { Rhubarb } from 'rhubarb-lip-sync-wasm'

const pcmBuffer = readFileSync('./sound.pcm')

const result = await Rhubarb.getLipSync(pcmBuffer)
const jsonStr = JSON.stringify(result.mouthCues)
writeFileSync('./phoneme.json', jsonStr)
/**
 * phoneme.json 内容为：
 * [
     { "start": 0, "end": 0.08, "value": "X" },
     { "start": 0.08, "end": 0.2, "value": "B" },
     ...
   ]
*/


// 网页JS使用示例：
// interface Phoneme {
//   start: number
//   end: number
//   value: string
// }

// const phonemeArr: Phoneme[] = [...]

// const audio = new Audio()
// audio.src = "./xx.wav"

// const onTimeUpdate = () => {
//     const t = audio.currentTime
//     const hit = phonemeArr.find((p) => t >= p.start && t < p.end)
//     console.log(`此时嘴型为：${hit?.value || 'X'}`)
// }
// audio.addEventListener('timeupdate', onTimeUpdate)
// audio.play()
