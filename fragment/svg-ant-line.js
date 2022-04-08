// css

@keyframes svg-stroke-animation {
    to {
        stroke-dashoffset: 100%;
    }
}

polygon {
    stroke-width: 3px;
    stroke-dasharray: 6px;
    stroke-dashoffset: 2px;

    fill: none;
    animation: svg-stroke-animation 50s linear infinite;
}


// html

<svg width={2064} height={720} >
    <g>
        <polygon style={{stroke: '#85b4ff'}} points="2,284 896,284 896,444 1552,444 1552,2 2062,2 2062,718 2,718 "/>
    </g>
</svg>
