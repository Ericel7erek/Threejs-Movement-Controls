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
    console.log("DownW");
    playerMovements.setState({forward: true})
    break;

    case "KeyS":
    case "ArrowDown":
    console.log("DownS");
    playerMovements.setState({backward: true})
    break;

    case "KeyA":
    case "ArrowLeft":
    console.log("DownA");
    playerMovements.setState({left: true})
    break;

    case "KeyD":
    case "ArrowRight":
      console.log("DownD");
      playerMovements.setState({right: true})
    break;
    }}
    this.keyPressed[event.code] = true

  }
  KeyUp(event){
    switch (event.code) {
    case "KeyW":
    case "ArrowUp":
    console.log("UpW");
    playerMovements.setState({forward: false})
    break;

    case "KeyS":
    case "ArrowDown":
    console.log("UpS");
    playerMovements.setState({backward: false})
    break;

    case "KeyA":
    case "ArrowLeft":
    console.log("UpA");
    playerMovements.setState({left: false})
    break;

    case "KeyD":
    case "ArrowRight":
      console.log("UpD");
      playerMovements.setState({right: false})
    break;
    }
    this.keyPressed[event.code] = false
  }
  }
