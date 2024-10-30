import App from "../App";
import * as THREE from 'three';
import { playerMovements } from "../Utils/Store";

export default class AnimationController {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.avatar = this.app.world.character.avatar;
        this.character = this.app.world.character.character;
        this.camera = this.app.camera.instance;
        this.raycaster = new THREE.Raycaster();
        this.soundManager = this.app.soundManager
        console.log(this.soundManager);

        playerMovements.subscribe((state) => {
            this.moving(state);
        });

        this.initAnimations();
    }

    initAnimations() {
        this.animation = new Map();
        this.mixer = new THREE.AnimationMixer(this.avatar.scene);
        this.avatar.animations.forEach((clip) => {
            this.animation.set(clip.name, this.mixer.clipAction(clip));
        });
        console.log(this.animation);
        this.currentAnimation = this.animation.get('Idle');
        this.currentAnimation.play();
    }

    playAnimation(name) {
        if (this.currentAnimation === this.animation.get(name)) return;
        const action = this.animation.get(name);
        action.stop();
        action.play();
        action.crossFadeFrom(this.currentAnimation, 0.2);
        this.currentAnimation = action;
    }

    moving(state) {
        // Cast a ray downwards from the character's position
        this.raycaster.set(this.character.position, new THREE.Vector3(0, -1, 0));
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        const onGround = intersects.some(intersect => intersect.object.type !== 'SkinnedMesh' && intersect.distance <= 10);

        if (onGround) {
            if (state.jump) {
                // this.playAnimation("Flying");
                // this.soundManager.playSound('flying');
            } else if (state.forward || state.backward) {
                this.playAnimation("SlowRun");
                // this.soundManager.stopSound('flying');
                this.soundManager.playSound('walking');
            } else if (state.right) {
                this.playAnimation("StrafeRight");
                // this.soundManager.stopSound('flying');
            } else if (state.left) {
                this.playAnimation("StrafeLeft");
                // this.soundManager.stopSound('flying');
            } else if (state.dance) {
                this.playAnimation("ChickenDance");
                this.soundManager.playSound('chickenDance');
                // this.soundManager.stopSound('flying');
            } else {
                this.playAnimation("Idle");
                if (this.soundManager.sounds.get('chickenDance')?.isPlaying) {
                    this.soundManager.stopSound('chickenDance');
                    this.soundManager.stopSound('walking');
                }
                // this.soundManager.stopSound('flying');
                this.soundManager.stopSound('walking');
                // this.soundManager.playSound('background');
            }
        } else {
            if (state.jump) {
                // this.playAnimation("Flying");
                // this.soundManager.playSound('flying');
            } else if (state.left || state.right || state.forward || state.backward) {
                // this.playAnimation("Flying");
                // this.soundManager.playSound('flying');
            }
        }
    }

    loop(deltaTime) {
        this.mixer.update(deltaTime);
    }
}
