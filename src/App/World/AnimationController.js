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
    this.sounds = new Map();
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    // create a global audio source
    const soundFiles = {
    background: './sounds/Largo.ogg',
    chickenDance: './sounds/ChickenDance.ogg',
    flying: './sounds/flying.ogg',
    // Add more sounds as needed
    };

    const audioLoader = new THREE.AudioLoader();

    Object.keys(soundFiles).forEach((key) => {
    const sound = new THREE.Audio(listener);
    audioLoader.load(soundFiles[key], (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(key); // Only loop background sound
        sound.setVolume(0.5);
        this.sounds.set(key, sound);
    });
    });
    }
    playSound(name) {
    const sound = this.sounds.get(name);
    if (sound && !sound.isPlaying) {
        sound.play();
    }
    }

    stopSound(name) {
    const sound = this.sounds.get(name);
    if (sound && sound.isPlaying) {
        sound.stop();
    }
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
    console.log(this.character, "An");
    // Cast a ray downwards from the character's position
    this.raycaster.set(this.character.position, new THREE.Vector3(0, -1, 0));
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    const onGround = intersects.some(intersect => intersect.object.type !== 'SkinnedMesh' && intersect.distance <= 10);
    
    if (onGround) {
        if (state.jump) {
            this.playAnimation("Flying");
        } 
        else if (state.forward || state.backward) {
            this.playAnimation("SlowRun");
        } else if (state.right) {
            this.playAnimation("StrafeRight");
        } else if (state.left) {
            this.playAnimation("StrafeLeft");
        } else if (state.dance) {
            this.playAnimation("ChickenDance");
            this.playSound('chickenDance');
        } else {
            this.playAnimation("Idle");
            if (this.sounds.get('chickenDance')?.isPlaying) {
                this.stopSound('chickenDance');
            }
            // this.playSound('background');

        }
    } else {
        if (state.jump) {
            this.playAnimation("Flying");
        } else if (state.left || state.right || state.forward || state.backward) {
            this.playAnimation("Flying");
        }
    }
}


    
    loop(deltaTime) {
        this.mixer.update(deltaTime)
    }
}