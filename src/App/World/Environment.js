import * as THREE from "three";
import { gsap } from "gsap";
import App from "../App.js";
import assetStore from "../Utils/AssetStore.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.asset = assetStore.getState().assetsToLoad[1];
    this.assetStore = assetStore.getState();
    this.cinema = this.assetStore.loadedAssets.Cinema;
    this.pointer = new THREE.Vector2();
    this.posters = []; // Array to store poster objects
    document.addEventListener('mousemove', this.onPointerMove.bind(this)); // Bind this context
    this.loadEnvironment();
    this.addBackground();
    this.addCinema();
  }

  onPointerMove(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

  addBackground() {
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath(this.asset.path);
    const backgroundCubemap = cubeTextureLoader.load(this.asset.faces);

    this.scene.background = backgroundCubemap;
  }

  addCinema() {
    this.cinema = this.cinema.scene;
    this.scene.add(this.cinema);

    this.cinema.traverse((obj) => {
      if (obj.name === "7ala") {
        obj.add(this.pointLight);
      }
      // Posters
      if (obj.isGroup) {
        if (obj.children.length === 2) {
          this.posters.push(obj.children[1]); // Store poster object
        }
      }

      if (obj.name.includes("Lamp")) {
        console.log(obj.children[1], "dada");
        obj.position.y += -0.7;

        this.pointLight = new THREE.PointLight(0xffd4af37, 2, 5);
        this.pointLight.lookAt(this.posters);

        obj.children[1].add(this.pointLight);
      }

      if (obj.isMesh) {
        // console.log(obj);
        if (obj.name === "Corn") {
          for (let i = 0; i <= 10; i++) {
            const cloneGLTF = clone(obj);
            cloneGLTF.position.set(
              (Math.random() - 0.5) * 10,
              (Math.random() + 5) * 10,
              (Math.random() - 0.5) * 10
            );
            this.pointLight = new THREE.PointLight(0xffd4af37, 2, 5);
            cloneGLTF.add(this.pointLight);
            cloneGLTF.scale.setScalar(1.2);
            this.scene.add(cloneGLTF);
            this.physics.add(cloneGLTF, "dynamic", "ball");
          }
        } else {
          this.physics.add(obj, "fixed", "cuboid");
        }
      }
    });
  }

  loop() {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.setFromCamera(this.pointer, this.app.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // Reset scale of posters
    this.posters.forEach(poster => {
      gsap.to(poster.scale, { x: 1, y: 1, z: 1, duration: 1.5 });
    });

    // Scale intersected posters
    intersects.forEach(intersect => {
      if (this.posters.includes(intersect.object)) {
        this.clone =clone(intersect.object)
        const timeline = gsap.timeline()
        timeline.to(this.clone.scale, { z:5, duration: 1 });
      }
    });

    console.log(intersects);
  }
}
