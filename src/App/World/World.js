import * as THREE from "three";

import App from "../App.js";
import Physics from "./Physics.js";
import Environment from "./Environment.js";
import Character from "./Character.js";
import CharacterController from "./CharacterController.js";
import { appStateStore } from "../Utils/Store.js";
import AnimationController from "./AnimationController.js";

export default class World {
  constructor() {
    this.app = new App();

    this.scene = this.app.scene;

    this.physics = new Physics();

    // create world classes
    appStateStore.subscribe((state) => {
      if (state.physicsReady && state.appReady) {
        this.environment = new Environment();
        this.character = new Character();
        this.characterController = new CharacterController()
        this.animationController = new AnimationController()
      }
    });

    this.loop();
  }

  loop(deltaTime, elapsedTime) {
    this.physics.loop();
    if(this.characterController) this.characterController.loop(deltaTime)
    if(this.animationController) this.animationController.loop(deltaTime)
    if(this.environment) this.environment.loop(deltaTime)
  }
}
