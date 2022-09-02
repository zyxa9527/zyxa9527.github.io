<template>
  <div :class="board.themes.name">
    <audio src='../assets/audio/swish1.mp3' style='display:none' id='audio'></audio>
    <!-- <div class="game-config">
      <button type="button" @click="init">重新開始</button> 
    </div> 
    <div class="game-score">
        <p class="text-4xl">分數 {{ board.score.score }}</p> 
    </div>  -->
    <table class="game"  >
        <!-- <button type="button" @click="init">重新開始</button> 
        <p >分數 {{ board.score.score }}</p>  -->
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
            this.board.init();  
            this.boardContent = this.board.boardData;  
        },  
        handleClick(x,y){   
            this.playAudio();
             if (this.selected) {
                 this.select2 =this.boardContent[x][y];    
                if (!this.select2.isBlank) this.select2.isSelected = true;
                else return;
                 //值是否相同
                if (this.board.hasSameValue(this.select1, this.select2)) {   
                    let path = new Path(this.select1, this.select2 ,this.boardContent);  
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
                this.board.clearboder(this.select1);
                this.board.clearboder(this.select2);
                this.selected = false;
             } else {
                 this.select1 = this.boardContent[x][y];  
                 if (!this.select1.isBlank) {
                    this.select1.isSelected = true;
                    this.selected = true; 
                 }
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
            return require('../assets/img/card/'+ className + '.png')
        },
        playAudio() {  
             document.getElementById('audio').play();
        }
    },
    watch: {
        boardContent: {
            handler() {    
                this.timer = setTimeout(()=>{
                    for(let i = 0; i < 5;i++){ 
                        //判斷還有沒有路走  
                        if(this.board.gameRoundEnd()){
                            alert("恭喜完成遊戲!");
                            this.init();
                            return;
                        }else if(this.board.getFirstExistPath() == undefined){ 
                            alert('無連線')
                            this.board.rearrangeBoard();//重整盤面    
                            continue;
                        }else{
                            break;
                        } 
                    }
                },50)
               
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
    border-spacing: 0;
    border-collapse: separate;
    user-select: none;
    text-align: center; 
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
  /* theme level1 */
  @import '../../src/assets/css/level1.css';
  
</style>