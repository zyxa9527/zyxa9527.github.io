import { BeelinePath,CornerlinePath,CornerArrPath } from '../assets/pathState.js';

class BoardState{
    constructor() { 
        this.beelinePath = new BeelinePath();
        this.cornerlinePath = new CornerlinePath();
        this.cornerArrPath = new CornerArrPath();
    }  
    pathApplication(path){
        this.beelinePath.setSuperior(this.cornerlinePath);
        this.cornerlinePath.setSuperior(this.cornerArrPath);
        return this.beelinePath.pathApplication(path)
    }
}

export default BoardState