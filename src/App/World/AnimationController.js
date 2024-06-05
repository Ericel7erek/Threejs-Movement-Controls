import App from "../App";
import * as THREE from 'three'
import { movingStore, playerMovements } from "../Utils/Store";

export default class AnimationController {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.avatar = this.app.world.character.avatar
        this.character = this.app.world.character.character
        console.log(this.character);
        this.raycaster = new THREE.Raycaster();
        playerMovements.subscribe((state) => {
            this.moving(state)
        })
        this.initAnimations()
    }

    initAnimations() {
        this.animation = new Map()
        this.mixer = new THREE.AnimationMixer(this.avatar.scene)

        this.avatar.animations.forEach((clip) => {
            this.animation.set(clip.name, this.mixer.clipAction(clip))
        })
        console.log(this.animation);
        this.currentAnimation = this.animation.get('Idle')
        this.currentAnimation.play()
    }

    playAnimation(name) {
        if (this.currentAnimation === this.animation.get(name)) return
        const action = this.animation.get(name)
        action.stop()
        action.play()
        action.crossFadeFrom(this.currentAnimation, 0.2)

        this.currentAnimation = action
    }

    moving(state) {
        // Cast a ray downwards from the character's position
        this.raycaster.set(this.character.position, new THREE.Vector3(0, -1, 0));
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.map(inter=>{
            if(inter.object.material.name === "ground") {
                if(inter.distance <=10){
            if (state.jump) {
                this.playAnimation("Flying");
            } else if (state.left || state.right || state.forward || state.backward && !state.jump) {
                this.playAnimation("SlowRun");
            } else {
                this.playAnimation("Idle");
            }
            }
            }})){
            }

    }

    loop(deltaTime) {
        this.mixer.update(deltaTime)
    }
}