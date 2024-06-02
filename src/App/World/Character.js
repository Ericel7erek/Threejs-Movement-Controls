import * as THREE from 'three';
import App from '../App.js';
import { playerMovements } from '../Utils/Store.js';
export default class Character {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.physics = this.app.world.physics;

        playerMovements.subscribe((state)=>{
        this.forward = state.forward
        this.backward = state.backward
        this.left = state.left
        this.right = state.right
        this.jump = state.jump
        })

        this.instantiateCharacter();

    }

    instantiateCharacter() {
    const geometry = new THREE.BoxGeometry(2,2,2);
    const material = new THREE.MeshStandardMaterial({ color: "rebeccapurple" });
    this.character = new THREE.Mesh(geometry, material);
    this.character.position.set(0, 2.5, 0);
    this.scene.add(this.character);
    this.rigidBodyType =
    this.physics.rapier.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = this.physics.world.createRigidBody(this.rigidBodyType);

    // create a collider
    this.colliderType = this.physics.rapier.ColliderDesc.cuboid(1, 1, 1);
    this.collider = this.physics.world.createCollider(
    this.colliderType,
    this.rigidBody
    );

    // set rigid body position to character position
    const worldPosition = this.character.getWorldPosition(new THREE.Vector3());
    const worldRotation = this.character.getWorldQuaternion(
    new THREE.Quaternion()
    );
    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);

    // Create Character Controller
    this.characterController= this.physics.world.createCharacterController(0.1)
    this.characterController.setApplyImpulsesToDynamicBodies(true)
    console.log(this.characterController);
    this.characterController.enableAutostep(3,0.1,false)
    this.characterController.enableSnapToGround(1)
    // this.characterController.characterMass = 10

    }

    loop(deltaTime) {
        const movement = new THREE.Vector3()
        if (this.forward) {
            movement.z -= 1
        }
        if (this.backward) {
            movement.z = 1
        }
        if (this.left) {
            movement.x -= 1
        }
        if (this.right) {
            movement.x = 1
        }
        if (this.jump) {
            movement.y = 1
        }
        if (!this.jump) {
            movement.y = -1
        }

        movement.normalize().multiplyScalar(deltaTime *25)
        // movement.y = -1
        
        this.characterController.computeColliderMovement(this.collider, movement)
        this.characterController.computedMovement()
        
        const newPosition = new THREE.Vector3()
        .copy(this.rigidBody.translation())
        .add(this.characterController.computedMovement())
        


        this.rigidBody.setNextKinematicTranslation(newPosition)

        this.character.position.copy(this.rigidBody.translation())
    }
        
}