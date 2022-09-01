<template>
  <div :class="board.themes.name">
    <div class="game-config">
      <button type="button" @click="init">重新開始1</button> 
    </div> 
    <div class="game-score">
        <p>分數 {{ board.score.score }}</p> 
    </div> 
    <table class="game"  >
      <tr :key="row" v-for="(cols, row) in boardContent" >  
         <td  
            :key="col"  
            v-for="(cell, col) in cols"  
            @click="handleClick(row,col)" 
            :class="{'selected':cell.isSelected===true,'blank':cell.isBlank===true}"
        >
            <div v-if="cell.isLine" :class="cell.lineClass"></div> 
             <template v-if="img">
                 <img :src="img(cell.className)" alt="">
            </template>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>   
import Board from '../assets/board/index.js';   
import BoardState from '../assets/boardState.js'; 
import Path from '../assets/path.js'; 

export default {
    name: 'game', 
    data () { 
        return {
            select1 : null,
            select2 : null,
            selected:null,  
            board:null,
            boardContent:null,   
        }
    }, 
    created () { 
        this.init();
    }, 
    methods :{
        init(){ 
            this.select1 = null;
            this.select2 = null;

            this.board = new Board();    
            this.boardContent = this.board.init();
            
        },  
        handleClick(x,y){   
             if (this.selected) {
                 this.select2 =this.boardContent[x][y];  
                 //值是否相同
                if (this.board.hasSameValue(this.select1, this.select2)) {     
                    let path = new Path(this.select1, this.select2 ,this.boardContent);

                    // 狀態class要裝進board ?
                    let boardState = new BoardState();
                    let result = boardState.pathApplication(path);
                  
                    if(result.length>0){
                        console.log('消除',result)
                        this.board.clearPoint(this.select1);
                        this.board.clearPoint(this.select2);
                        this.board.addScore();
                        this.drawLine(result)
                    }else{
                        console.log('不可連線')
                    } 
                }
                this.selected = false;
             } else {
                 this.select1 = this.boardContent[x][y];  
                 this.selected = true; 
             }

        }, 
       drawLine (line) { 
            line.forEach((e, i) => {
                e.isLine = true ;
                e.lineClass = this.addLineClass(line[i - 1], e, line[i + 1])
            })
 
            setTimeout(() => {
                this.hideLine(line)
            }, 500)
        },
        addLineClass (prev, curr, next) {
            let result;
            if (!prev) {
                result = 'line-start line-' + this.getDirection(curr, next)
            } else if (!next) {
                result = 'line-end line-' + this.getDirection(curr, prev)
            } else {
                result = 'line-' + this.getDirection(curr, prev) + ' line-' + this.getDirection(curr, next)
            }
            return 'line ' + result;
        },
        //判斷方向
        getDirection (curr, next) {
            return curr.row === next.row ? (curr.col > next.col ? 'l' : 'r') : (curr.row > next.row ? 't' : 'b')
        },
        //清除
        hideLine (line) {
            line.forEach((e) => {
                e.isLine = false;
                e.lineClass = '';
            })
        },
        img(className){
            if(!className) return
            return require('../assets/img/'+ className + '.png')
        }
    },
    watch: {
        boardContent: {
            handler(value) {
                let win = new Array() 
                value.forEach(cols=>{
                    cols.forEach(cell=>{
                        win.push(cell.isBlank)
                    })
                })
                if( win.every(e=>e==true) ){
                    alert(`win 總分${this.board.score.score}分 !`)
                }
            },
            deep:true
        },
         
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
}
</script> 
<style>
  .game{
    margin: 0 auto;
    border-spacing: 0;
    border-collapse: separate;
    user-select: none;
    text-align: center;
    margin-top: 125px;
    border-spacing: 2px;
  }
  .game-config{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    background-color: #fff;
    flex-wrap: wrap;
  }
    .game-score{
    position: fixed;
    left: 0;
    right: 0;
    top: 30px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0; 
    flex-wrap: wrap;
    font-size: 18px;
  } 
    .game-time{
    position: fixed;
    left: 520px;
    right: 0;
    top: -20px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0; 
    flex-wrap: wrap;
    font-size: 18px;
  } 
  /* theme test */
  @import '../../src/assets/css/test.css';
  
</style>