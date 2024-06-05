import * as THREE from 'three'
import { sizesStore } from './Utils/Store.js';
import App from './App.js'

export default class Camera {
    constructor() {
        this.app = new App()

        this.canvas = this.app.canvas

        this.sizesStore = sizesStore

        this.sizes = this.sizesStore.getState()

        this.setInstance()
        this.setMouseControls()
        this.setResizeLister()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            1,
            600
        );
        this.instance.position.z = 100
        this.instance.position.y = 20
    }

    setMouseControls() {
        this.mouseX = 0;
        this.mouseY = 0;

        this.canvas.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - this.sizes.width / 2;
            this.mouseY = event.clientY - this.sizes.height / 2;
        });
    }

    setResizeLister() {
        this.sizesStore.subscribe((sizes) => {
            this.instance.aspect = sizes.width / sizes.height
            this.instance.updateProjectionMatrix()
        })
    }

    loop() {
        this.character = this.app.world.characterController?.rigidBody;

        if (this.character) {
            const characterPosition = this.character.translation();
            const cameraOffset = new THREE.Vector3(0, 2, 5); // Adjust the offset as needed
            cameraOffset.applyQuaternion(this.instance.quaternion);
            cameraOffset.add(characterPosition);

            this.instance.position.lerp(cameraOffset,0.1);

            // Update camera rotation based on mouse movement
            this.instance.rotation.y = -this.mouseX * 0.01;
            // this.instance.rotation.x = -this.mouseY * 0.002;

            // Update character rotation to match camera rotation
            // this.character.setRotation(this.instance.quaternion);
        }
    }
}
