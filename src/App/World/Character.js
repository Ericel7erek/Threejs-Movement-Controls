import * as THREE from 'three';
import App from '../App.js';
import { playerMovements } from '../Utils/Store.js';
import assetStore from '../Utils/AssetStore.js';
export default class Character {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.assetStore = assetStore.getState()
        this.avatar = this.assetStore.loadedAssets.avatar

        
        // Create Character and add it to the scene
        const geometry = new THREE.BoxGeometry(3,6,3);
        const material = new THREE.MeshStandardMaterial({ color: "rebeccapurple",wireframe:true,visible:false });
        this.character = new THREE.Mesh(geometry, material);
        this.character.position.set(0, 8, 0);
        this.scene.add(this.character);

        const avatar = this.avatar.scene
        avatar.scale.setScalar(3)
        avatar.position.y = -3
        avatar.rotation.y = Math.PI
        console.log(avatar);
        this.character.add(avatar)
        // const pointLight = new THREE.PointLight('gold', 1,2000)
        // const sphGeo= new THREE.SphereGeometry(1,32,16)
        // const sphMat= new THREE.MeshStandardMaterial({color:"white"})
        // this.sphere= new THREE.Mesh(sphGeo,sphMat)
        // this.sphere.scale.setScalar(10)
        // this.scene.add(this.sphere)
        // this.sphere.add(pointLight)
    }
        
}