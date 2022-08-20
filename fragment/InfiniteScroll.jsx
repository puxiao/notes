import React, { useRef } from 'react'

const InfiniteScroll = ({ children, loadMore, hasMore, isFetching, className = '', style = {}, direction = 'y' }) => {

    const containerRef = useRef(null)

    const isScrollEnd = () => {
        const container = containerRef.current
        if (container === null) return
        if (direction === 'y') {
            return container.clientHeight === container.scrollHeight - container.scrollTop
        } else {
            return container.clientWidth === container.scrollWidth - container.scrollLeft
        }
    }

    const handleScroll = () => {
        if (isScrollEnd() && isFetching === false && hasMore === true) {
            loadMore()
        }
    }

    return (
        <div ref={containerRef} className={className} style={{ ...style }} onScroll={handleScroll} >
            {children}
        </div>
    )
}

export default InfiniteScroll
