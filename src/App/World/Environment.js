import * as THREE from "three";

import App from "../App.js";
import assetStore from "../Utils/AssetStore.js";
import { Pane } from "tweakpane";

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.asset=assetStore.getState().assetsToLoad[1]
    // this.texture=assetStore.getState().loadedAssets.texture
    this.assetStore = assetStore.getState()
    this.cinema = this.assetStore.loadedAssets.Cinema
    this.pane = new Pane()
    this.loadEnvironment();
    // this.addGround();
    // this.addWalls();
    // this.addStairs();
    // this.addMeshes();
    this.addBackground();
    this.addCinema()
  }

  loadEnvironment() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(1, 1, 1);
    this.directionalLight.castShadow = true;
    // this.directionalLight.target = this.posters
    // this.scene.add(this.directionalLight);
  }
  addBackground(){
    const cubeTextureLoader = new THREE.CubeTextureLoader()
    cubeTextureLoader.setPath(this.asset.path)
    const backgroundCubemap = cubeTextureLoader
    .load(this.asset.faces);

  this.scene.background = backgroundCubemap
  }
  addGround() {
    const groundGeometry = new THREE.BoxGeometry(100, 1, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      name: "ground"
    });
    this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    this.scene.add(this.groundMesh);
    this.physics.add(this.groundMesh, "fixed", "cuboid");
    
  }


  addWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: "orange",
    });

    const wallGeometry = new THREE.BoxGeometry(100, 10, 1);

    const wallPositions = [
      { x: 0, y: 5, z: 50 },
      { x: 0, y: 5, z: -50 },
      { x: 50, y: 5, z: 0, rotation: { y: Math.PI / 2 } },
      { x: -50, y: 5, z: 0, rotation: { y: Math.PI / 2 } },
    ];

    wallPositions.forEach((position) => {
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
      wallMesh.position.set(position.x, position.y, position.z);
      if (position.rotation)
        wallMesh.rotation.set(
          position.rotation.x || 0,
          position.rotation.y || 0,
          position.rotation.z || 0
        );
      this.scene.add(wallMesh);
      this.physics.add(wallMesh, "fixed", "cuboid");
    });
  }

  addStairs() {
    const stairMaterial = new THREE.MeshStandardMaterial({
      color: "grey",
    });

    const stairGeometry = new THREE.BoxGeometry(10, 1, 100);

    const stairPositions = [
      { x: 5, y: 1, z: 0 },
      { x: 15, y: 2, z: 0 },
      { x: 25, y: 3, z: 0 },
      { x: 35, y: 4, z: 0 },
      { x: 45, y: 5, z: 0 },
    ];

    stairPositions.forEach((position) => {
      const stairMesh = new THREE.Mesh(stairGeometry, stairMaterial);
      stairMesh.position.set(position.x, position.y, position.z);
      this.scene.add(stairMesh);
      this.physics.add(stairMesh, "fixed", "cuboid");
    });
  }
  addCinema(){
    this.cinema = this.cinema.scene
    // this.cinema.position.y = 20
    this.scene.add(this.cinema)

    this.cinema.traverse((obj)=>{
      if(obj.isGroup){
        if(obj.children.length===2){
          this.posters = obj.children[1]
          // console.log(obj, "obj");
        }
      }
      if(obj.name.includes("Lamp")){
        console.log(obj.children[1],"dada");
        obj.position.y +=-0.8
        // obj.children[1].position.y +=-0.8
      this.pointLight = new THREE.PointLight(0xffd4af37,2,5)
      this.pointLight.lookAt(this.posters)
        
        obj.children[1].add(this.pointLight)
        // obj.children[1].lookAt(this.posters)
        // obj.children[1].position.x = 10
      }
      if(obj.isMesh){
        // console.log(obj);
        if(obj.name === "Stairs"){
        this.physics.add(obj, "fixed", "trimesh")

        } else {

          this.physics.add(obj, "fixed", "cuboid")
        }
      }
    })
  }

  addMeshes() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: "white",
    });

    for (let i = 0; i < 100; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() + 5) * 10,
        (Math.random() - 0.5) * 10
      );
      mesh.scale.setScalar(Math.random() + 0.5);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      this.scene.add(mesh);
      this.physics.add(mesh, "dynamic", "ball");
    }
  }
}
