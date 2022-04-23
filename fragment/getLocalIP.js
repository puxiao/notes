import os from 'os'

const getLocalIP = () => {
    const ipsObj = os.networkInterfaces()
    const ipsArr = Object.values(ipsObj).flat()
    const ipv4 = ipsArr.find(item => item?.family === 'IPv4' && item.internal === false)
    const ip = ipv4?.address  // '192.168.3.8'
    return ip
}

export default getLocalIP
