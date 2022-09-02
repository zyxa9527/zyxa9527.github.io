import Cell   from './cell.js';
import Score  from './score.js'; 
import themes from './themes.js';  
import Utils  from './utils.js';    
import config from './config.json';

class Board {
    constructor() {
        this.config = config;
        this.themes = themes.filter(e => e.name === config.defaultTheme)[0];
        this.score = new Score(); 
    }
    init(){
        this.config = config;
        if (window.screen.width < 500) {
            this.config.row += 2;
            this.config.col -= 2;
        }
        let cellGroup = this.themes.classNames.map(e => {
            return  new Cell(e,false);
        })  
        let cell =  new Cell('',true); 

        //生成指定大小且成對隨機數列
        let randomCellGroup = Utils.arrayRandom( this.config.row *  this.config.col , cellGroup);   
           let a= {}
           randomCellGroup.forEach(e=>{ 
            if(a[e.className]) a[e.className]++;
            else a[e.className] = 1;
            }) 
        //外層加上空白方塊與生成成對隨機排列
        let result = Utils.arrayAddWhiteBlocks( this.config.row,  this.config.col ,randomCellGroup, cell);  
       
        // 將座標設置在方塊上
        result.forEach((cols, row) => {  
            cols.forEach((cell, col) => {  
                cell.row = row ;
                cell.col = col ;
            })
        }) 
        return result
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
}

export default Board