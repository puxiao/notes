export interface NodeData {
    index: number,
    label: string
}

export type NodeList = NodeData[]

const countryDefault: NodeData = { index: 0, label: '请选择国家' }
const provinceDefault: NodeData = { index: 0, label: '请选择省份' }
const cityDefault: NodeData = { index: 0, label: '请选择城市' }
const districtDefault: NodeData = { index: 0, label: '请选择区县' }

const analysisData: (data: object) => [NodeList, NodeList[], NodeList[], NodeList[]] = (data) => {

    const countryArr: NodeList = [countryDefault]
    const provinceArr: NodeList[] = [[provinceDefault]]
    const cityArr: NodeList[] = [[cityDefault]]
    const districtArr: NodeList[] = [[districtDefault]]

    let countryStart = 0
    let provinceStart = 0
    let cityStart = 0
    let districtStart = 0

    for (let country in data) {
        countryStart += 1
        countryArr.push({ index: countryStart, label: country }) //添加国家

        const countryData = data[country as keyof typeof data] as object
        const provinceArrItem: NodeList = [provinceDefault]

        for (let province in countryData) {
            provinceStart += 1
            provinceArrItem.push({ index: provinceStart, label: province })

            const cityData = countryData[province as keyof typeof countryData] as object
            const cityArrItem: NodeList = [cityDefault]
            for (let city in cityData) {
                cityStart += 1
                cityArrItem.push({ index: cityStart, label: city })

                const districtData = cityData[city as keyof typeof cityData] as object
                const districtArrItem: NodeList = [districtDefault]
                for (let district in districtData) {
                    districtStart += 1
                    districtArrItem.push({ index: districtStart, label: district })
                }
                districtArr.push(districtArrItem) //添加区县
            }
            cityArr.push(cityArrItem) //添加城市
        }
        provinceArr.push(provinceArrItem) //添加省份
    }

    return [countryArr, provinceArr, cityArr, districtArr]
}

export default analysisData
