import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { sizesStore } from './Utils/Store.js';


import App from './App.js'

export default class Camera{
    constructor() {
        this.app = new App()
        
        this.canvas = this.app.canvas
        
        this.sizesStore = sizesStore

        this.sizes = this.sizesStore.getState()

        this.setInstance()
        this.setControls()
        this.setResizeLister()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            1,
            600
          );
          this.instance.position.z = 100
        this.instance.position.y = 20
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;

    }

    setResizeLister() {
        this.sizesStore.subscribe((sizes)=>{
            this.instance.aspect = sizes.width / sizes.height
            this.instance.updateProjectionMatrix()
        })
    }


    loop() {
        this.controls.update()
        this.character = this.app.world.characterController?.rigidBody

        if (this.character){
            // Old way to set position directly
            // const cameraPosition = this.character.translation()
            // cameraPosition.z += 15
            // cameraPosition.y += 30
            // this.instance.position.copy(cameraPosition)     
            const characterPosition = this.character.translation()
            const characterRotation = this.character.rotation()
            const cameraOffset = new THREE.Vector3(0,30,50)
            cameraOffset.applyQuaternion(characterRotation)
            cameraOffset.add(characterPosition)
            
            const targetOffset = new THREE.Vector3(0,10,0)
            targetOffset.applyQuaternion(characterRotation)
            targetOffset.add(characterPosition)

            // this.instance.lookAt(LookAt)
            this.instance.position.lerp(cameraOffset,0.1)
            this.controls.target.lerp(targetOffset,0.1)

        }
    }
}