interface AlphaVideoConfig {
    videoSrc: string;
    width: number;
    height: number;
    container: HTMLDivElement;
    bgClearColor: string;
}

//绿幕视频背景透明播放显示
class AlphaVideo {
    private video: HTMLVideoElement;
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private config: AlphaVideoConfig;
    private program: WebGLProgram | null = null;
    private animationId: number | null = null;
    private keyColor: [number, number, number] = [0, 1, 0];
    private threshold: number = 0.2;
    private smoothing: number = 0.02;

    constructor(config: AlphaVideoConfig) {
        this.config = config;
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');

        this.setupCanvas();
        this.setupVideo();

        const gl = this.canvas.getContext('webgl');
        if (!gl) {
            throw new Error('WebGL not supported');
        }
        this.gl = gl;

        this.parseColor(config.bgClearColor);
        this.initWebGL();
    }

    private setupCanvas (): void {
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.config.container.appendChild(this.canvas);
    }

    private setupVideo (): void {
        this.video.src = this.config.videoSrc;
        this.video.crossOrigin = 'anonymous';
        this.video.loop = true;
        //this.video.muted = true;
        this.video.playsInline = true;
        this.video.style.display = 'none';
    }

    private parseColor (colorStr: string): void {
        let r = 0, g = 0, b = 0;

        if (colorStr.startsWith('#')) {
            const hex = colorStr.substring(1);
            r = parseInt(hex.substring(0, 2), 16) / 255;
            g = parseInt(hex.substring(2, 4), 16) / 255;
            b = parseInt(hex.substring(4, 6), 16) / 255;
        } else if (colorStr.startsWith('rgb')) {
            const matches = colorStr.match(/\d+/g);
            if (matches && matches.length >= 3) {
                r = parseInt(matches[0]) / 255;
                //@ts-ignore
                g = parseInt(matches[1]) / 255;
                //@ts-ignore
                b = parseInt(matches[2]) / 255;
            }
        }

        this.keyColor = [r, g, b];
    }

    private initWebGL (): void {
        const gl = this.gl;

        // 顶点着色器
        const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

        // 片段着色器 - 色度键抠像 + 边缘透明处理
        const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture;
      uniform vec3 u_keyColor;
      uniform float u_threshold;
      uniform float u_smoothing;
      uniform vec2 u_resolution;
      
      void main() {
        vec4 color = texture2D(u_texture, v_texCoord);
        
        // 计算当前像素的实际坐标
        vec2 pixelCoord = v_texCoord * u_resolution;
        
        // 检查是否在边缘2像素内
        float borderWidth = 2.0;
        bool isNearEdge = pixelCoord.x < borderWidth || 
                         pixelCoord.x > u_resolution.x - borderWidth ||
                         pixelCoord.y < borderWidth || 
                         pixelCoord.y > u_resolution.y - borderWidth;
        
        // 如果在边缘2像素内，直接设置为完全透明
        if (isNearEdge) {
          gl_FragColor = vec4(color.rgb, 0.0);
          return;
        }
        
        // 计算当前像素与键控颜色的距离
        float dist = distance(color.rgb, u_keyColor);
        
        // 使用平滑过渡计算透明度
        float alpha = smoothstep(u_threshold, u_threshold + u_smoothing, dist);
        
        gl_FragColor = vec4(color.rgb, color.a * alpha);
      }
    `;

        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) {
            throw new Error('Failed to create shaders');
        }

        this.program = this.createProgram(gl, vertexShader, fragmentShader);
        if (!this.program) {
            throw new Error('Failed to create program');
        }

        // 设置几何体（两个三角形组成矩形）
        const positions = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1,
        ]);

        const texCoords = new Float32Array([
            0, 1,
            1, 1,
            0, 0,
            1, 0,
        ]);

        this.setupBuffer(gl, this.program, 'a_position', positions, 2);
        this.setupBuffer(gl, this.program, 'a_texCoord', texCoords, 2);

        // 创建纹理
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // 启用混合以支持透明度
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    private createShader (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
        const shader = gl.createShader(type);
        if (!shader) return null;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    private createProgram (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        const program = gl.createProgram();
        if (!program) return null;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    private setupBuffer (gl: WebGLRenderingContext, program: WebGLProgram, attributeName: string, data: Float32Array, size: number): void {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        const location = gl.getAttribLocation(program, attributeName);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    }

    private render (): void {
        if (!this.program || this.video.readyState < this.video.HAVE_CURRENT_DATA) {
            this.animationId = requestAnimationFrame(() => this.render());
            return;
        }

        const gl = this.gl;

        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(this.program);

        // 更新视频纹理
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);

        // 设置 uniforms
        const keyColorLocation = gl.getUniformLocation(this.program, 'u_keyColor');
        const thresholdLocation = gl.getUniformLocation(this.program, 'u_threshold');
        const smoothingLocation = gl.getUniformLocation(this.program, 'u_smoothing');
        const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');

        gl.uniform3fv(keyColorLocation, this.keyColor);
        gl.uniform1f(thresholdLocation, this.threshold);
        gl.uniform1f(smoothingLocation, this.smoothing);
        gl.uniform2f(resolutionLocation, this.video.videoWidth, this.video.videoHeight);

        // 绘制
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        this.animationId = requestAnimationFrame(() => this.render());
    }

    // 公共方法
    public play (): Promise<void> {
        return this.video.play().then(() => {
            if (!this.animationId) {
                this.render();
            }
        });
    }

    public pause (): void {
        this.video.pause();
    }

    public stop (): void {
        this.video.pause();
        this.video.currentTime = 0;
    }

    public setThreshold (value: number): void {
        this.threshold = Math.max(0, Math.min(1, value));
    }

    public setSmoothing (value: number): void {
        this.smoothing = Math.max(0, Math.min(1, value));
    }

    public seek (time: number): void {
        this.video.currentTime = time;
    }

    public getCurrentTime (): number {
        return this.video.currentTime;
    }

    public getDuration (): number {
        return this.video.duration;
    }

    public setVolume (volume: number): void {
        this.video.volume = Math.max(0, Math.min(1, volume));
    }

    public mute (): void {
        this.video.muted = true;
    }

    public unmute (): void {
        this.video.muted = false;
    }

    public destroy (): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.video.pause();
        this.video.src = '';
        this.config.container.removeChild(this.canvas);

        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program);
        }
    }
}

/** 使用示例 */
// const container = document.getElementById('video-container') as HTMLDivElement;

// alphaVideo.value = new AlphaVideo({
//   container,
//       videoSrc: '/video.mp4',
//       width: 630,
//       height: 1200,
//       bgClearColor: '#6da047', // 需要扣除的绿幕颜色
//   })
// alphaVideo.value.setThreshold(0.24);
// alphaVideo.value.setSmoothing(0);

// 若像缩小显示尺寸，可让视频保持原尺寸，然后使用 CSS 通过 canvas 进行缩放
// #video-container canvas {
//     transform-origin: left top;
//     transform: scale(0.355556);
// }

export default AlphaVideo;
