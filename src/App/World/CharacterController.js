import App from "../App"
import { playerMovements } from "../Utils/Store"
import * as THREE from 'three'
export default class CharacterController{
    constructor(){
        this.app = new App()
        this.character = this.app.world.character.character
        console.log(this.character);
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

    this.rigidBodyType = this.physics.rapier.RigidBodyDesc.kinematicPositionBased();
    this.rigidBody = this.physics.world.createRigidBody(this.rigidBodyType);

    // create a collider
    this.colliderType = this.physics.rapier.ColliderDesc.cuboid(1, 1, 1);
    this.collider = this.physics.world.createCollider(
    this.colliderType,
    this.rigidBody
    );

    // set rigid body position to character position
    const worldPosition = this.character.getWorldPosition(new THREE.Vector3());
    const worldRotation = this.character.getWorldQuaternion(new THREE.Quaternion())
    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);

    // Create Character Controller
    this.characterController= this.physics.world.createCharacterController(0.1)
    this.characterController.setApplyImpulsesToDynamicBodies(true)
    console.log(this.characterController);
    this.characterController.enableAutostep(3,0.1,false)
    this.characterController.enableSnapToGround(1)


    }

loop(deltaTime) {
    // Initialize the movement vector
    const movement = new THREE.Vector3();

    // Determine rotation angles based on input
    if (this.left) {
        this.character.rotation.y += deltaTime * 2; // Rotate left (A key)
    }
    if (this.right) {
        this.character.rotation.y -= deltaTime * 2; // Rotate right (D key)
    }

    // Calculate the direction vector based on the character's rotation
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(this.character.quaternion);

    // Forward and backward movement
    if (this.forward) {
        movement.add(direction);
    }
    if (this.backward) {
        movement.sub(direction);
    }

    // Jumping and gravity
    if (this.jump) {
        movement.y += 1;
    } else {
        // Apply gravity when not jumping
        movement.y -= 1;
    }

    // Normalize and scale the movement vector
    if (movement.length() > 0) {
        movement.normalize().multiplyScalar(deltaTime * 25);
    }

    // Apply movement
    this.characterController.computeColliderMovement(this.collider, movement);
    this.characterController.computedMovement();

    const newPosition = new THREE.Vector3()
        .copy(this.rigidBody.translation())
        .add(this.characterController.computedMovement());

    this.rigidBody.setNextKinematicTranslation(newPosition);

    this.character.position.copy(this.rigidBody.translation());
    this.rigidBody.setRotation(this.character.rotation);
}
}