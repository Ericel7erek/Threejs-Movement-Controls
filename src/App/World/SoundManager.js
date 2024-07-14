import * as THREE from 'three';
import App from "../App"; // import App to access the camera

class SoundManager {
    constructor() {
        this.app = new App();
        this.camera = this.app.camera.instance; // access the camera instance

        this.sounds = new Map();
        const listener = new THREE.AudioListener();
        this.camera.add(listener);

        // create a global audio source
        const soundFiles = {
            chickenDance: './sounds/ChickenDance.ogg',
            flying: './sounds/Flying.ogg',
            walking: './sounds/indoor-footsteps-6385.mp3',
            click: './sounds/click.mp3'
            // Add more sounds as needed
        };

        const audioLoader = new THREE.AudioLoader();

        Object.keys(soundFiles).forEach((key) => {
            const sound = new THREE.Audio(listener);
            audioLoader.load(soundFiles[key], (buffer) => {
                sound.setBuffer(buffer);
                sound.setLoop(key === 'background'); // Only loop background sound
                sound.setVolume(1);
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
}

export default SoundManager;
