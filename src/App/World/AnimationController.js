import App from "../App";
import * as THREE from 'three'
import { movingStore, playerMovements } from "../Utils/Store";

export default class AnimationController {
    constructor() {
        this.app = new App()
        this.scene = this.app.scene
        this.avatar = this.app.world.character.avatar
        this.character = this.app.world.character.character
        this.camera = this.app.camera.instance
        console.log();
        this.raycaster = new THREE.Raycaster();
        playerMovements.subscribe((state) => {
            this.moving(state)
        })
        this.initAnimations()
        this.initSounds()
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

    initSounds(){
    const listener = new THREE.AudioListener();
    this.camera.add( listener );

    // create a global audio source
    this.sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sounds/Largo.ogg', function( buffer ) {
    this.sound.setBuffer( buffer );
    this.sound.setLoop( true );
    this.sound.setVolume( 0.5 );
    this.sound.play();
});
console.log(audioLoader);
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
        console.log(this.character,"An");
        // Cast a ray downwards from the character's position
        this.raycaster.set(this.character.position, new THREE.Vector3(0, -1, 0));
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        const onGround = intersects.some(intersect => intersect.object.type!=='SkinnedMesh'&&intersect.distance <=10);
        // console.log(onGround);
        if (onGround) {
            
            if (state.jump) {
                this.playAnimation("Flying");
            } 
            else if ( state.forward || state.backward) {
                this.playAnimation("SlowRun");
            } else if(state.right){
                this.playAnimation("StrafeRight");
            } else if(state.left){
                this.playAnimation("StrafeLeft");
            } else if(state.dance){
                this.playAnimation("ChickenDance");
                this.sound.play();
            }   else {
                this.playAnimation("Idle");
                this.sound.stop()
            }
        } else {
            if (state.jump) {
                this.playAnimation("Flying");
            } else if (state.left || state.right || state.forward || state.backward) {
                this.playAnimation("Flying");
        }
            }}

    
    loop(deltaTime) {
        this.mixer.update(deltaTime)
    }
}