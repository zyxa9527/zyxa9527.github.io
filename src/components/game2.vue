<template>
  <div :class="currentTheme.name">
    <div class="game-config">
      <button type="button" @click="init">重新開始</button> 
    </div> 
    <div class="game-score">
        <p>分數 {{ score }}</p> 
    </div>
    <div class="game-time"> 
        <p>時間 {{ time }}</p>
    </div>
    <table class="game" @click="handleClick">
      <tr :key="row" v-for="(cols, row) in cellData" > 
        <cell 
            :key="col" 
            v-for="(cell, col) in cols" 
            :isSelected="cell.isSelected" 
            :isLine="cell.isLine" 
            :lineClass="cell.lineClass" 
            :isBlank="cell.isBlank" 
            :className="cell.className"
        >
        </cell>
      </tr>
    </table>
  </div>
</template>
<script> 
import cell from './cell.vue';
import config from '../assets/config.json';
import themes from '../assets/themes.js'; 
import Utils from '../assets/utils.js';     

export default {
    name: 'game',
    components: {
        cell
    },
    data () { 
        return {
            cellData: new Array(), //  數據
            currentSelect: null, // 選中方塊 
            score:0,  
            time:null,
            timer:null
        }
    },
    computed: {
        currentTheme () { 
            return themes.filter(e => e.name === config.defaultTheme)[0]
        }, 
    },
    created () { 
        this.init();
    },
    mounted(){
        this.time = config.gameTime
        this.timer = setInterval(this.countdown, 1000);
    },
    methods :{
        init(){
            this.score = 0
            this.cellData = this.initData();
        },
        initData(){ 
            //拆解字串生成物件
            let cellGroup = this.currentTheme.classNames.map(e => {
                return {
                isBlank: false, 
                className: e,
                lineClass: '',
                isLine: false, 
                isSelected: false
                }
            }) 
            // 空白方塊
            let blankCell = {
                isBlank: true,
                className: '',
                lineClass: '',
                isLine: false,
                isSelected: false
            }
            
            //生成指定大小且成對隨機數列
            let randomCellGroup = Utils.arrayRandom(config.row * config.col , cellGroup)  ;   
            //外層加上空白方塊與生成成對隨機排列
            let result = Utils.arrayAddWhiteBlock(Utils.arrayToDyadic(randomCellGroup, config.col), blankCell)  

            // 將座標設置在方塊上
            result.forEach((cols, row) => {  
                cols.forEach((cell, col) => {  
                    cell.row = row ;
                    cell.col = col ;
                })
            }) 
            return result
        },
        //點擊代理
        handleClick(ev){ 
            //不在cell上 
            if (ev.target.nodeName !== 'TD') return
            //空白方塊 
            let col = ev.target.cellIndex;
            let row = ev.target.parentNode.rowIndex;
            let currentCell = this.cellData[row][col];
            if (currentCell.isBlank === true) return 

            this.selectCell(currentCell) 
            this.$forceUpdate()
        },
        selectCell(currCell){
            //沒有選取中則設為選中狀態
            if (!this.currentSelect) {
                this.currentSelect = currCell;
                currCell.isSelected = true ;
                return
            }
            //選取若為同一個取消選中狀態
            if (this.currentSelect === currCell) { 
                this.currentSelect = null;
                currCell.isSelected = false;
                return
            }
            let prevCell = this.currentSelect
            //不同號碼 設定後者為選中狀態
            if (prevCell.className !== currCell.className) {
                prevCell.isSelected = false;
                currCell.isSelected = true;
                this.currentSelect = currCell;
                return
            }

            // 兩方塊連結路徑陣列
            let result = this.getLine(prevCell, currCell); 

            //有阻擋物則第二個點選方塊設為選中方塊      
            //成功則兩方塊設為空白方塊
            if (result.length === 0) {  
                prevCell.isSelected = false; 
                currCell.isSelected = true;
                this.currentSelect = currCell;
            } else {
                prevCell.isBlank = true;
                prevCell.className = '';
                prevCell.isSelected = false; 
                currCell.isBlank = true;
                currCell.className = '';
                currCell.isSelected = false ;
                this.currentSelect = null;
                //添加className畫線
                this.drawLine(result);
                this.score += config.score
            }
        },
        getLine (prev, curr) { 
            let result = new Array();

            //第一個點選方塊x,y軸可連接線的陣列
            //包含第二個點選方塊則為直線
            let prevHzLine = this.getHorizontalLine(prev);
            if (prevHzLine.includes(curr)) return this.getBeeline(prev, curr)
            let prevVtLine = this.getVerticalLine(prev);
            if (prevVtLine.includes(curr)) return this.getBeeline(prev, curr)

            //第二個點選方塊x,y軸可連接線的陣列
            let currHzLine = this.getHorizontalLine(curr);
            let currVtLine = this.getVerticalLine(curr) ;
         
            //無連接線則回傳空
            if ((prevHzLine.length === 0 && prevVtLine.length === 0) || (currHzLine.length === 0 && currVtLine.length === 0)) return result

            //一個轉角情況 兩條互相垂直的連接線是否有同方塊
            let corner = this.getCorner(prevHzLine, currVtLine) || this.getCorner(prevVtLine, currHzLine);
            if (corner) return this.getBeeline(prev, corner).concat(this.getBeeline(corner, curr).slice(1))
            
            //兩個轉角情況  兩條連接平行線是否有垂直線
            let cornerArr = this.getCornerArr(prevHzLine, currHzLine, prev.row, curr.row, true) 
            if (cornerArr.length == 0) {
                cornerArr = this.getCornerArr(prevVtLine, currVtLine, prev.col, curr.col, false)
            }
            result = this.getBeeline(prev, cornerArr[0])
            .concat( this.getBeeline(cornerArr[0], cornerArr[1]).slice(1) )
            .concat( this.getBeeline(cornerArr[1], curr).slice(1) )
            
           
            return result
        },
        //直線陣列
        getBeeline (start, end) { 
            let startIndex;
            let endIndex;
            let arr;
            if (start.row === end.row) {
                startIndex = start.col;
                endIndex = end.col;
                arr = this.cellData[start.row];
            } else {
                startIndex = start.row;
                endIndex = end.row;
                arr = this.cellData.map(e => e[start.col]);
            }
            //判斷方向 
            return startIndex < endIndex ? arr.slice(startIndex, endIndex + 1) : arr.slice(endIndex, startIndex + 1).reverse()
        },
        // X轴
        getHorizontalLine (curr) { 
            return this.checkCell(this.cellData[curr.row], curr.col)
        },
        // Y轴
        getVerticalLine (curr) {
            return this.checkCell(this.cellData.map(e => e[curr.col]), curr.row)
        },
        //向前後尋找路線 回傳連接線陣列
        checkCell (arr, index) {
            let ar = new Array();
            // 向後 
            for (let i = index - 1; i >= 0; i--) {
                let cell = arr[i];
                // className相同或空白方塊
                if (cell.className === arr[index].className || cell.isBlank) { 
                    ar.push(cell);
                } 
                if (!cell.isBlank) {
                    break;
                }
            } 
            for (let i = index + 1; i < arr.length; i++) {
                let cell = arr[i]
                if (cell.className === arr[index].className || cell.isBlank) {
                    ar.push(cell);
                }
                if (!cell.isBlank) {
                    break;
                }
            }
            return ar
        },
        //回傳兩條連接線是否有交集
        getCorner (prevLine, currLine) {
            let corner = null;
            for (let cell of prevLine) {
                if (currLine.includes(cell) && cell.isBlank) {
                    corner = cell;
                    break;
                }
            }
            return corner
        },
        // 回傳兩條連接線中垂直線的交集
        getCornerArr (prev, curr, prevIndex, currIndex, isRow) {
            let result = new Array();
     
            if (prev.length === 0 || curr.length === 0) {
                return result
            }
            //row列 or col列
            let prevFullLine = isRow ? this.cellData[prevIndex] : this.cellData.map(e => e[prevIndex])
            let currFullLine = isRow ? this.cellData[currIndex] : this.cellData.map(e => e[currIndex])
             
            //判斷垂直線
            let rowKey = isRow ? 'col' : 'row' ;
            for (let prevCell of prev) {
                if (!prevCell.isBlank) continue
                   
                // target為線上目標的對點
                let target = currFullLine[prevCell[rowKey]] 
                
                //判斷是否在目標連接線上
                if (curr.includes(target)) {
                    let index = target[rowKey]
                    //判斷是否直線互通 
                    if (this.checkBeeline(prevFullLine[index], currFullLine[index])) {
                        result = [prevFullLine[index], currFullLine[index]];
                        break;
                    }
                }
            }
            return result
        }, 
        //檢查是否直線
        checkBeeline (start, end) {
            let result = true ;
            let beeline = this.getBeeline(start, end);
            for (let cell of beeline) {
                if (!cell.isBlank) {
                    result = false;
                    break
                }
            }
            return result
        },  
       drawLine (line) { 
            line.forEach((e, i) => {
                e.isLine = true ;
                e.lineClass = this.addLineClass(line[i - 1], e, line[i + 1])
            })
 
            setTimeout(() => {
                this.hideLine(line)
            }, config.lineDelay)
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
        countdown() {
            this.time --;
            if(this.time==0){
            clearInterval(this.timer)
            }
        }
    },
    watch: {
        cellData: {
            handler(value) {
                let win = new Array() 
                value.forEach(cols=>{
                    cols.forEach(cell=>{
                        win.push(cell.isBlank)
                    })
                })
                if( win.every(e=>e==true) ){
                    alert(`win 總分${this.score}分 !`)
                }
            },
            deep:true
        },
        time:{
            handler(value) {
                 if(value==0){
                     alert('時間到 結束 !')
                 }
            },
        }
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
    margin-top: 65px;
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