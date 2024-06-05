import App from "../App";
import * as THREE from 'three'
import { movingStore, playerMovements } from "../Utils/Store";


export default class AnimationController{
    constructor(){
        this.app = new App()
        this.scene = this.app.scene
        this.avatar = this.app.world.character.avatar
            playerMovements.subscribe((state) => {
                console.log(state);
            this.moving(state)
            })
        this.initAnimations()
    }
    initAnimations(){
        this.animation = new Map()
        this.mixer =  new THREE.AnimationMixer(this.avatar.scene)

        this.avatar.animations.forEach((clip)=>{
            this.animation.set(clip.name,this.mixer.clipAction(clip))
        })
        this.currentAnimation = this.animation.get('WarmingUp')
        this.currentAnimation.play()
    }  

    playAnimation(name){
        if(this.currentAnimation === this.animation.get(name))return
        const action = this.animation.get(name)
        action.stop()
        action.play()
        action.crossFadeFrom(this.currentAnimation, 0.2)

        this.currentAnimation = action
    }
    moving(state){
        if (state.left|state.right|state.forward|state.backward){
        this.playAnimation("JumpingJacks")

        } else{
        this.playAnimation("WarmingUp")
        }
    }
    loop(deltaTime){
        this.mixer.update(deltaTime)
    }
} 