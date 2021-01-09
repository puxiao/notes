
import './index.scss'

const HexagonFrames = () => {
    return (
        <div className='hexagon'>
            <div className='box right-box'>
                <div className='box-line left-top-line'></div>
                <div className='box-line right-bottom-line'></div>
            </div>
            <div className='box left-box'>
                <div className='box-line right-top-line'></div>
                <div className='box-line left-bottom-line'></div>
            </div>
            <div className='box'>
                <div className='box-line top-line'></div>
                <div className='box-content'>Hello</div>
                <div className='box-line bottom-line'></div>
            </div>
        </div>
    )
}

export default HexagonFrames
