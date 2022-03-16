//yarn add device-detector-js

import DeviceDetector from "device-detector-js"

const detector = new DeviceDetector()
const currentDevice = detector.parse(navigator.userAgent)

console.log(currentDevice)
//{client: {…}, os: {…}, device: {…}, bot: null}
