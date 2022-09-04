import Cell   from './cell.js';
import Score  from './score.js'; 
import themes from './themes.js';  
import Utils  from './utils.js';    
import BoardState from '../boardState.js'; 
import Path from '../path.js'; 
import { configL1 , configPhoneL1 } from './config.js';

class Board {
    constructor() {
        this.config = {};
        this.themes = {};
        this.score = new Score(); 
        this.boardData = {};
    }
    init(){
        
        if (window.screen.width < 500) {
            this.config = configPhoneL1;
        }else{
            this.config = configL1;
        }
        this.themes = themes.filter(e => e.name === configL1.defaultTheme)[0];

        let cellGroup = this.themes.classNames.map(e => {
            return  new Cell(e,false);
        })   
        let cell =  new Cell('',true); 

        //生成指定大小且成對隨機數列
        let randomCellGroup = Utils.arrayRandom( this.config.row *  this.config.col , cellGroup);   
      
        //外層加上空白方塊與生成成對隨機排列
        let result = Utils.arrayAddWhiteBlocks( this.config.row,  this.config.col ,randomCellGroup, cell);  
       
        // 將座標設置在方塊上
        result.forEach((cols, row) => {  
            cols.forEach((cell, col) => {  
                cell.row = row ;
                cell.col = col ;
            })
        })  
        this.boardData = result;
    }  
    hasSameValue(prev, curr) {   
        if(prev.col === curr.col && prev.row === curr.row) return;
        return prev.className === curr.className;
    } 
    clearPoint(point) {
        setTimeout(() => {
            point.isBlank = true;  
        }, 500) 
    }
    addScore(){
        this.score.addScore();
    }
    clearboder(point){
        setTimeout(() => {
            point.isSelected = false;  
        }, 500) 
    }
    //判斷死局
    getFirstExistPath(){
        let searchedValue = [];//用以紀錄已搜尋過符號
        
        for (let i =0;i<this.boardData.length;i++){
            for (let j = 0; j<this.boardData[i].length;j++){
                let cell = this.boardData[i][j]; 
                if(!cell.isBlank && searchedValue.indexOf(cell) == -1){
                    searchedValue.push(cell); 
                    let positionsArr = this.getPositionByValue(cell.className); //取得盤面上所有相同className   
                    for(let i = 0; i < positionsArr.length - 1;i++){
                        let select1 = positionsArr[i];
                        let select2 = positionsArr[i+1];
                        if(this.hasSameValue(select1, select2)){ //判斷連線
                            let path = new Path(select1, select2 ,this.boardData);  
                            let boardState = new BoardState();
                            let result = boardState.pathApplication(path);  
                            if(result.length > 0){ 
                                return result; 
                            }
                            
                            
                        }
                    } 
                }
            } 
        } 
        return null;
    }
    getPositionByValue(value){
        let arr = []; 
        for (let i =0;i<this.boardData.length;i++){
            for (let j = 0; j<this.boardData[i].length;j++){
                if (this.boardData[i][j].className == value){
                    arr.push(this.boardData[i][j]);
                } 
            } 
        } 
        return arr;
    }
    rearrangeBoard(){
        let a = this.getAllValueInBoard(); 
        let values = a.sort(() => Math.random()>.5 ? -1 : 1 );   
    
        for (let i =0;i<this.boardData.length;i++){
            for (let j = 0; j<this.boardData[i].length;j++){
                if(!this.boardData[i][j].isBlank){  
                    let val = values.pop();   
                    this.boardData[i][j].className = val; 
                }
            }
        }   
    }
    getAllValueInBoard(){
        let values = [];   
        for (let i =0;i<this.boardData.length;i++){
            for (let j = 0; j<this.boardData[i].length;j++){
                if(!this.boardData[i][j].isBlank){   
                    values.push(this.boardData[i][j].className); 
                }
            }
        } 
        return values;
    }
    gameRoundEnd(){
        for (let i =0;i<this.boardData.length;i++){
            for (let j = 0; j<this.boardData[i].length;j++){
                if(!this.boardData[i][j].isBlank){   
                    return false
                }
            }
        } 
        return true;
    }
}

export default Board