import { playerMovements } from "../Utils/Store";

export default class InputController {
  constructor() {
    this.keyPressed = {}
    this.startListening();
  }

  startListening() {
    window.addEventListener('keydown', (event)=>this.KeyDown(event))
    window.addEventListener('keyup', (event)=>this.KeyUp(event))

    }
  
  KeyDown(event){
    if(!this.keyPressed[event.code]) { 
    switch (event.code) {
    case "KeyW":
    case "ArrowUp":
    
    playerMovements.setState({forward: true})
    break;

    case "KeyS":
    case "ArrowDown":
    
    playerMovements.setState({backward: true})
    break;

    case "KeyA":
    case "ArrowLeft":
    
    playerMovements.setState({left: true})
    break;

    case "KeyD":
    case "ArrowRight":
      
      playerMovements.setState({right: true})
    break;
    case "Space":
      
      playerMovements.setState({jump: true})
    break;

    case "ShiftLeft":
    playerMovements.setState({super: true})
    break;

    case "ControlLeft":
    playerMovements.setState({descending: true})
    break;
    
    case "KeyF":
    playerMovements.setState({dance: true})
    break;
    }}
    this.keyPressed[event.code] = true

  }
  KeyUp(event){
    switch (event.code) {
    case "KeyW":
    case "ArrowUp":
    
    playerMovements.setState({forward: false})
    break;

    case "KeyS":
    case "ArrowDown":
    
    playerMovements.setState({backward: false})
    break;

    case "KeyA":
    case "ArrowLeft":
    
    playerMovements.setState({left: false})
    break;

    case "KeyD":
    case "ArrowRight":
      
      playerMovements.setState({right: false})
    break;

    case "Space":
    playerMovements.setState({jump: false})
    break;

    case "ShiftLeft":
    playerMovements.setState({super: false})
    break;

    case "ControlLeft":
    playerMovements.setState({descending: false})
    break;

    case "KeyF":
    playerMovements.setState({dance: false})
    break;
    }
    this.keyPressed[event.code] = false
  }
  }
