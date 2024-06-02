import * as THREE from 'three';
import App from '../App.js';
import { playerMovements } from '../Utils/Store.js';
export default class Character {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.physics = this.app.world.physics;

        playerMovements.subscribe((state)=>{
        this.forward = state.forward
        this.backward = state.backward
        this.left = state.left
        this.right = state.right
        })

        this.instantiateCharacter();

    }

    instantiateCharacter() {
        const geometry = new THREE.BoxGeometry(2,2,2);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.character = new THREE.Mesh(geometry, material);
        this.character.position.set(0, 2.5, 0);
        this.scene.add(this.character);
        this.character.rigidBody= this.physics.add(this.character,'dynamic','cuboid');
        console.log(this.character.rigidBody);
    }

    loop() {
        if (this.forward) {
            // this.character.position.z +=-1
            this.character.rigidBody.applyImpulse({
                x:0,y:0,z:-3
            },true)
        }
        if (this.backward) {
            // this.character.position.z +=1
            this.character.rigidBody.applyImpulse({
                x:0,y:0,z:3
            },true)
        }
        if (this.left) {
            // this.character.position.x +=-1
            this.character.rigidBody.applyImpulse({
                x:-3,y:0,z:0
            },true)
        }
        if (this.right) {
            // this.character.position.x +=1
            this.character.rigidBody.applyImpulse({
                x:3,y:0,z:0
            },true)
        }
    }


        
}