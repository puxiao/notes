<template>
	<view id="canvas-container"></view>
</template>

<script>
	import * as THREE from 'three';

	export default {
		data() {
			return {} //此处千万不要定义 threeData，因为如果在此处定义 threeData 则其属性(例如 threeData.scene) 就会变成 代理对象，threejs 使用 threeData.scene 就会报各种属性缺失的错误
		},

		onReady() {

			const canvasHeight = 300; //这里相当于 300px

			const renderer = new THREE.WebGLRenderer({
				antialias: true
			});
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, canvasHeight);

			const canvas = renderer.domElement;

			const query = uni.createSelectorQuery();
			query.select('#canvas-container')
				.boundingClientRect(data => {
					const container = document.getElementById('canvas-container');
					if (container) {
						container.appendChild(canvas);
					}
				})
				.exec();

			const scene = new THREE.Scene();

			const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
			camera.position.set(0, 0, 2);

			const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
				color: 0xff0000
			}));
			scene.add(cube);

			this.threeData = {
				canvas,
				renderer,
				scene,
				camera,
				cube
			}

			renderer.setAnimationLoop(this.render)

		},

		methods: {

			render() {

				this.threeData.cube.rotation.x += 0.01;
				this.threeData.cube.rotation.y += 0.01;
				this.threeData.renderer.render(this.threeData.scene, this.threeData.camera);

			},

		},

		onUnmounted() {

			const {
				renderer,
				cube
			} = this.threeData;

			if (cube) {
				cube.geometry.dispose();
				cube.material.dispose();
			}

			if (renderer) {
				renderer.setAnimationLoop(null);
				renderer.dispose();
			}

		}
	}
</script>

<style></style>
