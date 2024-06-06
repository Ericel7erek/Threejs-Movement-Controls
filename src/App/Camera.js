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
            20000
        );
        this.instance.position.z = 100
        this.instance.position.y = 20
    }

    setMouseControls() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseLocked = true;

        // Request pointer lock on click
        this.canvas.addEventListener('click', () => {
    
        });

        // Handle mouse movement when locked
        document.addEventListener('mousemove', (event) => {
            if (this.isMouseLocked) {
                this.mouseX += event.movementX;
                this.mouseY += event.movementY;

                // Warp the cursor back to the center when it reaches the edges
                if (Math.abs(this.mouseX) > this.sizes.width / 2 || Math.abs(this.mouseY) > this.sizes.height / 2) {
                    this.canvas.requestPointerLock();
                }
            }
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
        const cameraOffset = new THREE.Vector3(0, 2, 15); // Adjust the offset as needed
        const cameraRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(this.instance.rotation.x, this.instance.rotation.y, 0, 'XYZ'));

        cameraOffset.applyQuaternion(cameraRotation);
        cameraOffset.add(characterPosition);

        // Smoothly interpolate the camera's position to the desired position
        this.instance.position.lerp(cameraOffset, 0.08);

        // Update camera rotation based on mouse movement
        const targetRotationX = this.mouseY * 0.002;
        this.instance.rotation.x = THREE.MathUtils.lerp(this.instance.rotation.x, targetRotationX, 0.1);
        const targetRotationY = -this.mouseX * 0.006;
        this.instance.rotation.y = THREE.MathUtils.lerp(this.instance.rotation.y, targetRotationY, 0.1);

        // Only update the character's Y-axis rotation to match the camera's Y-axis rotation
        const characterQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, this.instance.rotation.y, 0));
        this.character.setRotation(characterQuaternion);
    }
}


}