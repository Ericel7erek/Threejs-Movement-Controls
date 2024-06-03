import * as THREE from 'three';
import App from '../App.js';
import { playerMovements } from '../Utils/Store.js';
export default class Character {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;

        // Create Character and add it to the scene
        const geometry = new THREE.BoxGeometry(2,2,2);
        const material = new THREE.MeshStandardMaterial({ color: "rebeccapurple" });
        this.character = new THREE.Mesh(geometry, material);
        this.character.position.set(0, 2.5, 0);
        this.scene.add(this.character);
    }
        
}