import { useState, useEffect } from 'react'
import myData from './data'
import analysisData from './analysis'

import './index.scss'

const [countryArr, provinceArr, cityArr, districtArr] = analysisData(myData)

console.log(countryArr, provinceArr, cityArr, districtArr)

interface TestBFSProp {
    country?: number,
    province?: number,
    city?: number,
    district?: number
}

const TestSelect: React.FC<TestBFSProp> = ({ country = 0, province = 0, city = 0, district = 0 }) => {

    const [relCountryIndex, setRelCountryIndex] = useState<number>(country)
    const [relProvinceIndex, setRelProvinceIndex] = useState<number>(province)
    const [relCityIndex, setRelCityIndex] = useState<number>(city)
    const [relDistrictIndex, setRelDistrictIndex] = useState<number>(district)

    const [absProvinceIndex, setAbsProvinceIndex] = useState<number>(0)
    const [absCityIndex, setAbsCityIndex] = useState<number>(0)
    const [absDistrictIndex, setAbsDistrictIndex] = useState<number>(0)

    useEffect(() => {
        if (country) {
            setRelCountryIndex(country)

            const nowCountry = countryArr[country]
            const nowProvince = provinceArr[nowCountry.index][province]
            setAbsProvinceIndex(nowCountry.index)

            if (province) {
                const nowCity = cityArr[nowProvince.index][city]
                setAbsCityIndex(nowProvince.index)

                if (city) {
                    setAbsDistrictIndex(nowCity.index)
                }
            }
        }
    }, [country, province, city, district])

    const getResult = () => {
        let result = ''
        if (relCountryIndex) {

            const nowCountry = countryArr[relCountryIndex]
            result += nowCountry.label

            if (relProvinceIndex) {
                const nowProvince = provinceArr[nowCountry.index][relProvinceIndex]
                result += ' ' + nowProvince.label

                if (relCityIndex) {
                    const nowCity = cityArr[nowProvince.index][relCityIndex]
                    result += ' ' + nowCity.label
                    if (relDistrictIndex) {
                        const nowDistrict = districtArr[nowCity.index][relDistrictIndex]
                        result += ' ' + nowDistrict.label
                    } else {
                        result += ' null'
                    }
                } else {
                    result += ' null'
                }
            } else {
                result += ' null'
            }
        } else {
            result += 'null'
        }

        return result
    }

    const countryOnChange = (eve: React.ChangeEvent<HTMLSelectElement>) => {
        setRelCountryIndex(eve.target.selectedIndex)
        setRelProvinceIndex(0)
        setRelCityIndex(0)
        setRelDistrictIndex(0)

        setAbsProvinceIndex(eve.target.selectedIndex)
        setAbsCityIndex(0)
        setAbsDistrictIndex(0)
    }

    const provinceOnChange = (eve: React.ChangeEvent<HTMLSelectElement>) => {
        setRelProvinceIndex(eve.target.selectedIndex)
        setRelCityIndex(0)
        setRelDistrictIndex(0)

        const nowCity = provinceArr[absProvinceIndex][eve.target.selectedIndex]
        setAbsCityIndex(nowCity.index)
        setAbsDistrictIndex(0)
    }

    const cityOnChange = (eve: React.ChangeEvent<HTMLSelectElement>) => {
        setRelCityIndex(eve.target.selectedIndex)
        setRelDistrictIndex(0)

        const nowDistrict = cityArr[absCityIndex][eve.target.selectedIndex]
        setAbsDistrictIndex(nowDistrict.index)
    }

    const districtOnChange = (eve: React.ChangeEvent<HTMLSelectElement>) => {
        setRelDistrictIndex(eve.target.selectedIndex)
    }

    return (
        <div>
            <select onChange={countryOnChange} value={relCountryIndex}>
                {
                    countryArr.map((item, index) => {
                        return <option value={index} key={`country${index}`}>{item.label}</option>
                    })
                }
            </select>
            <select onChange={provinceOnChange} value={relProvinceIndex}>
                {
                    provinceArr[absProvinceIndex].map((item, index) => {
                        return <option value={index} key={`province${index}`}>{item.label}</option>
                    })
                }
            </select>
            <select onChange={cityOnChange} value={relCityIndex}>
                {
                    cityArr[absCityIndex].map((item, index) => {
                        return <option value={index} key={`city${index}`}>{item.label}</option>
                    })
                }
            </select>
            <select onChange={districtOnChange} value={relDistrictIndex}>
                {
                    districtArr[absDistrictIndex].map((item, index) => {
                        return <option value={index} key={`district${index}`}>{item.label}</option>
                    })
                }
            </select>
            <h5>当前相对下拉框 已选编号为：{relCountryIndex} {relProvinceIndex} {relCityIndex} {relDistrictIndex}</h5>
            <h5>当前下拉框数据 绝对编号为：{relCountryIndex} {absProvinceIndex} {absCityIndex} {absDistrictIndex}</h5>
            <h5>当前选择项为：{getResult()}</h5>
        </div>
    )
}

export default TestSelect
