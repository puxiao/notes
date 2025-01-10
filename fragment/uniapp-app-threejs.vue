<template>
	<view id="threeView"></view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		onLoad() {

		},
		methods: {

		}
	};
</script>

<script module="three" lang="renderjs">
	import * as THREE from 'three';

	export default {

		mounted() {
			this.initThree();
		},

		methods: {

			initThree() {

				const canvasHeight = 300; //这里相当于 300px

				const scene = new THREE.Scene();

				const camera = new THREE.PerspectiveCamera(75, window.innerWidth / canvasHeight, 0.1, 100);
				camera.position.set(0, 0, 3);

				const renderer = new THREE.WebGLRenderer({
					antialias: true
				});
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(window.innerWidth, canvasHeight);

				const element = document.getElementById('threeView')
				const canvas = renderer.domElement;
				element.appendChild(canvas);

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
				};

				renderer.setAnimationLoop(this.render)

			},

			render() {

				this.threeData.cube.rotation.x += 0.01;
				this.threeData.cube.rotation.y += 0.01;
				this.threeData.renderer.render(this.threeData.scene, this.threeData.camera);

			},

		}
	}
</script>

<style></style>
