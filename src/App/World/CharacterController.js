import App from "../App"
import { playerMovements } from "../Utils/Store"
import * as THREE from 'three'
export default class CharacterController{
    constructor(){
        this.app = new App()
        this.character = this.app.world.character.character
        this.camera = this.app.camera.instance
        console.log(this.camera);
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
    this.colliderType = this.physics.rapier.ColliderDesc.cuboid(1.5, 3, 1.5);
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
    this.characterController.enableAutostep(3,0.1,false)
    this.characterController.enableSnapToGround(1)
    //     this.colliders = this.rigidBody.colliderSet.map.data.map((name)=>{
    //     if(name){
    //         console.log(name._shape);
    //     }
    // });

    }

loop(deltaTime) {

    // Initialize the movement vector
    const movement = new THREE.Vector3();

    // Determine rotation angles based on input
    if (this.left) {
        movement.x -= 1; // Rotate left (A key)
    }
    if (this.right) {
        movement.x += 1; // Rotate right (D key)
    }
    // Forward and backward movement
    if (this.forward) {
        movement.z -= 1
    }
    if (this.backward) {
        movement.z += 1
    }

    // Jumping and gravity
    if (this.jump) {
        movement.y += 1;
    } else {
    movement.y = -1;

    }
    movement.applyQuaternion(this.camera.quaternion)
    if(movement.length()>1){
        console.log(movement.length());
        const angle = Math.atan2(movement.x,movement.z) + Math.PI
        const characterRotation= new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0,1,0),
            angle
            )
            this.character.quaternion.slerp(this.camera.quaternion,0.1)
            // this.camera.quaternion.slerp(characterRotation,0.1)
            // console.log(this.camera.quaternion);
        }
    // Normalize and scale movement vector and set y component to -1
    movement.normalize().multiplyScalar(0.3);

    // Update collider movement and get new position of rigid body
    this.characterController.computeColliderMovement(this.collider, movement);
    const newPosition = new THREE.Vector3()
      .copy(this.rigidBody.translation())
      .add(this.characterController.computedMovement());
    
    // Set next kinematic translation of rigid body and update character position
    this.rigidBody.setNextKinematicTranslation(newPosition);
    this.character.position.lerp(this.rigidBody.translation(),0.1);
}
}