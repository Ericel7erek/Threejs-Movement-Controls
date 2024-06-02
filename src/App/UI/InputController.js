import { playerMovements } from "../Utils/Store";

export default class InputController {
  constructor() {
    
    this.startListening();
  }

  startListening() {
    window.addEventListener('keydown', (event)=>this.KeyDown(event))
    window.addEventListener('keyup', (event)=>this.KeyUp(event))

    }
  
  KeyDown(event){
    switch (event.code) {
    case "KeyW":
    console.log("DownW");
    playerMovements.setState({forward: true})
    break;

    case "KeyS":
    console.log("DownS");
    playerMovements.setState({backward: true})
    break;

    case "KeyA":
    console.log("DownA");
    playerMovements.setState({left: true})
    break;

    case "KeyD":
      console.log("DownD");
      playerMovements.setState({right: true})
    break;
    }
  }
  KeyUp(event){
    switch (event.code) {
    case "KeyW":
    console.log("UpW");
    playerMovements.setState({forward: false})
    break;

    case "KeyS":
    console.log("UpS");
    playerMovements.setState({backward: false})
    break;

    case "KeyA":
    console.log("UpA");
    playerMovements.setState({left: false})
    break;

    case "KeyD":
      console.log("UpD");
      playerMovements.setState({right: false})
    break;
    }
  }
  }
