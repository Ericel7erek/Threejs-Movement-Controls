import App from "../App";
import * as THREE from 'three'

export default class AnimationController{
    constructor(){
        this.app = new App()
        this.scene = this.app.scene
        this.avatar = this.app.world.character.avatar
        this.initAnimations()
    }
    initAnimations(){
        const idle =this.avatar.animations[0]
        const warmingUp =this.avatar.animations[1]
        this.mixer =  new THREE.AnimationMixer(this.avatar.scene)
        const idleAction = this.mixer.clipAction(idle)
        const warmUpAction = this.mixer.clipAction(warmingUp)
        // warmUpAction.play()
        idleAction.play()
        
    }
    loop(deltaTime){
        this.mixer.update(deltaTime)
    }
} 