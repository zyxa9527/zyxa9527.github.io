<template>
    <!--levell-->
  <div :class="board.themes.name">
    <!--音效-->
    <audio muted  src='../assets/audio/swish1.mp3' style='display:none' id='audio'></audio>
    <audio muted loop src='../assets/audio/background.mp3' style='display:none' id='audioBackground'></audio>
    <!--資訊欄-->
    <div v-if="notStart" >
        <div  class="mt-4 xl:mt-0 flex justify-center">
            <button   
                @click="dialog"
                id="play"
                data-modal-toggle="defaultModal"
                class=" transition  w-24 xl:w-48 bg-white text-sm text-xl text-blue-500 border-4 xl:border-8 border-blue-500 hover:bg-blue-500 hover:text-white font-bold py-1 xl:py-2 px-4 rounded-full">
                Play
            </button>
        </div>
        <div  style="width:100%;height:100%;position:absolute;z-index:5"></div>
    </div> 
    <div v-else>  
        <!--手機-->
        <div class="xl:hidden"> 
            <div style="position:fixed;left:0;top:0" class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span  class="relative px-5 text-xl  py-2.5 transition-all ease-in duration-75 hover:bg-white text-white hover:text-black dark:bg-gray-900 rounded-md  ">
                    暱稱: {{name}}
                </span>
            </div>
            <div v-if="!playtime" style="position:fixed;right:0;top:0"  class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span   class="relative px-5 text-xl  py-2.5 transition-all ease-in duration-75 hover:bg-white text-white hover:text-black dark:bg-gray-900 rounded-md  ">
                    秒數 {{  endtime }} S
                </span>
            </div> 
        </div>
        <div class="flex justify-between hidden xl:block" style="padding: 0 50px 0 50px"> 
            <button  class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-3xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span   class="relative px-5 text-2xl  py-2.5 transition-all ease-in duration-75 hover:bg-white text-white hover:text-black dark:bg-gray-900 rounded-md  ">
                    暱稱: {{name}}
                </span>
            </button>
            <button v-if="!playtime"  class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-3xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span   class="relative px-5 text-2xl  py-2.5 transition-all ease-in duration-75 hover:bg-white text-white hover:text-black dark:bg-gray-900 rounded-md  ">
                    秒數 {{ endtime }} S
                </span>
            </button> 
             <button @click="reset" class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-3xl font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span   class="relative px-5 text-2xl  py-2.5 transition-all ease-in duration-75 hover:bg-white text-white hover:text-black dark:bg-gray-900 rounded-md  ">
                    重新開始
                </span>
            </button>
        </div> 
    </div>
    <!--遊戲主體-->
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
                <img :src="img(cell.className)"  alt=""> 
            </template>
        </td>
      </tr>
    </table> 
    <!--開始前-->
    <div id="defaultModal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
        <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
            <!-- Modal content -->
            <div class="mt-3 relative bg-white rounded-lg shadow dark:bg-gray-700">
             
                <div class="p-2 xl:p-6 ">
                    <div class="mb-2 xl:mt-3">
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">暱稱:</label>
                        <input  v-model="name" type="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="過關時的稱號" >
                    </div>
                    <div class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        這是一款經典怪獸連連看遊戲! <br>
                        兩個圖案一樣的方塊之間的連線不超過2個拐角即可消除,另外刷新頁面可重新開始 <br><br> 
                        你能多快完成呢!?
                    </div>
                      <div class="flex justify-center  xl:pt-2 space-x-2 rounded-b   border-gray-200 dark:border-gray-600">
                        <button  data-modal-toggle="defaultModal" @click="gameStart"  type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 xl:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">開始</button> 
                    </div>  
                </div> 
            </div>
        </div>
    </div>
    <!--排行榜-->
    <div v-if="rankboard" style=";position:absolute;top:10%;left:50%;transform:translate(-50%);max-height:80vh" id="alert-additional-content-3" class="w-full xl:w-2/5 p-4 mb-4 border border-green-300 rounded-lg bg-green-50 dark:bg-green-200" role="alert">
        <div class="flex items-center"> 
            <h3 class="text-xl xl:text-2xl font-medium text-green-700 dark:text-green-800 ">遊戲結束</h3>
        </div>
        <div v-if="rank.length > 1" class="mt-2 mb-4 xl:text-lg text-green-700 dark:text-green-800" >
            恭喜完成遊戲,花費時間 <span class="text-xl font-bold">{{ rank.find(e=>e.key == this.key).playtime}}</span> 秒, 排名第 <span class="text-xl font-bold">{{rank.findIndex(e=>e.key == key)}}</span>
        </div>
          <div class="mt-8 flex items-center"> 
            <h3 class="text-xl xl:text-2xl font-medium text-green-700 dark:text-green-800 ">排行榜</h3>
        </div>
        <div style="overflow:auto;max-height:50vh">
            <div class="mt-2 mb-4 text-sm text-green-700 dark:text-green-800" v-for="(item,index) in rank" :key="item.key">
                <div 
                v-if="index !==0 && rank.length > 1"
                :class="{'bg-orange-300':rank.findIndex(e=>e.key == key) == index,'py-1':rank.findIndex(e=>e.key == key) == index}"  
                class="flex justify-start rounded items-center" >  
                    <div class="w-8" style="position:relative;">
                        <span    
                        v-if="index == 1 || index ==2 || index ==3"
                        :style="{color : index == '1' ? '#F2B233': index == '2' ? '#E9E9E9': '#db6930'}"> 
                            <i style="font-size:35px"  class="fa-solid fa-crown"></i>
                        </span> 
                        <span 
                            v-if="index == 1 || index ==2 || index ==3"
                            class="text-xl font-bold"  
                            style="position:absolute;left:15px;top:12px">
                            {{index}}
                        </span>
                        <span
                            v-else
                            class="xl:text-xl ml-4 font-bold">
                            {{index}}
                        </span>
                    </div>
                    <div class="w-full flex justify-between items-center">
                        <div class="flex-1 w-40  text-xs xl:text-base text-center" >{{item.name}}</div> 
                        <div class="flex justify-between items-center">
                            <span class="flex-1 text-sm xl:text-base font-bold">{{item.playtime}}秒</span>
                            <span class="flex-2 text-xs xl:text-base ml-4 mr-2">{{item.datestamp}}</span>
                        </div>
                    </div>
                </div>
            </div>   
        </div>  
        <div class="flex justify-center">
            <button @click="reset" type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                再玩一次
            </button>
        </div> 
    </div>
  </div>
</template>
<script>   
import Board from '../assets/board/index.js';   
import BoardState from '../assets/boardState.js'; 
import Path from '../assets/path.js'; 
import { db } from  '../database.js';

export default {
    name: 'game', 
    data () { 
        return {
            name:'',
            select1 : null,
            select2 : null,
            selected:null,  
            board:null,
            boardContent:null,    
            notStart:true, 
            endtime:0,
            playtime:0,
            rankboard:false,
            rank:[{
                key:0,
                playtim:0
                }],
            key:''
        }
    }, 
    created () { 
        this.init(); 
  
        //this.completeGame()
    }, 
    mounted(){ 
        //firebase 連結及時資料庫ranke
        const msgRef = db.ref("ranke");
        msgRef.orderByChild('playtime').on("value", (snapshot) => { 
            let vm = this;
            //初始化 不然update key會報錯
            vm.rank = [{
                key:0,
                playtime:0
            }];

             snapshot.forEach(function (item) {   
                let {key ,name , playtime ,date} = item.val()
                //轉換時間格式
                let dt = new Date(date);  
                let datestamp = dt.getFullYear()+
                    "/"+((dt.getMonth()+1).toString().length == 1? '0'+ (dt.getMonth()+1) : (dt.getMonth()+1))+
                    "/"+(dt.getDate().toString().length == 1? '0'+ dt.getDate() : dt.getDate())+
                    " "+(dt.getHours().toString().length == 1? '0'+ dt.getHours() : dt.getHours())+
                    ":"+(dt.getMinutes().toString().length == 1? '0'+ dt.getMinutes() : dt.getMinutes())
                
                vm.rank.push({
                    key ,
                    name , 
                    playtime, 
                    datestamp
                }) 
                //過關後呼叫
                if(vm.playtime) vm.rankboard = true; 
               
            }) 
        }); 
        //ios沒聲音解法 監聽綁定touchstartHandle事件後呼叫
        document.getElementById('play').addEventListener('touchstart', function(e) {
            document.getElementById('audioBackground').load();
            document.getElementById('audio').load();
            console.log(e);
        }, false);
    },
    methods :{
        init(){ 
            this.select1 = null;
            this.select2 = null; 
            this.board = new Board();     
            this.board.init();  
            this.boardContent = this.board.boardData;  
            this.endtime = 0; 
            this.playtime = 0;
            this.key = ''; 
        },  
        //遊戲開始
        gameStart(){
            this.notStart = false; 
            //計算遊玩時間
            this.pretime = new Date().getTime();
            //預設name
            if(this.name == '') this.name = '路人';
            //計時器
            this.endtimer = setInterval(()=>{
                this.endtime++; 
            },1000);
        },
        dialog(){
            //背景音效
            document.getElementById('audioBackground').currentTime = 0;
            document.getElementById('audioBackground').play();

            document.getElementById('play').addEventListener('touchend', function(e) {
                document.getElementById('audioBackground').play();
                document.getElementById('audio').play();
                  console.log(e);
            }, false);
        },
        handleClick(x,y){   
            //牌音效
            this.playAudio();
             if (this.selected) {
                 this.select2 =this.boardContent[x][y];    
                if (!this.select2.isBlank) this.select2.isSelected = true;
                else return;
                 //值是否相同
                if (this.board.hasSameValue(this.select1, this.select2)) {   
                    //中間連接的牌
                    let path = new Path(this.select1, this.select2 ,this.boardContent);  
                    let boardState = new BoardState();
                    //尋找可能路徑
                    let result = boardState.pathApplication(path);   
                    if(result.length>0){ 
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
                //第一個牌
                 this.select1 = this.boardContent[x][y];  
                 if (!this.select1.isBlank) {
                    this.select1.isSelected = true;
                    this.selected = true; 
                 }
             }

        }, 
        //可連接時畫線
       drawLine (line) { 
            line.forEach((e, i) => {
                e.isLine = true ;
                e.lineClass = this.addLineClass(line[i - 1], e, line[i + 1])
            })
            //時間後消除
            setTimeout(() => {
                this.hideLine(line)
            }, 500)
        },
        //判斷畫線種類
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
        //牌的圖片
        img(className){
            if(!className) return  
            return require('../assets/img/card/'+ className + '.png')
        },
        //牌音效
        playAudio() {   
            document.getElementById('audio').play();
        },
        //完成遊戲
        completeGame(){ 
            this.playtime = this.endtime;  
            //計算完成秒數
            let now =  new Date().getTime();
            let during = parseFloat(((now - this.pretime) / 1000).toFixed(1));  
 
            //name格式
            if(this.name.length > 27) this.name =  this.name.substring(0,27) + '...'; 
            //add 資料
            const msgRef = db.ref("ranke"); 
            this.key = msgRef.push().key;
            // 這邊是把數據推到 realtime 資料庫中的 message 這個資料集合(不確定這詞有沒有用錯)裡面
            msgRef.child(this.key).set({
                name:this.name, 
                playtime : during,
                date: Date.now(), // 這是獲取現在的時間
                key:this.key // 這個等同於 key: key
            })
        },
        reset(){
            this.init();
            document.getElementById('audioBackground').currentTime = 0;
            document.getElementById('audioBackground').play();
            this.board.score.score = 0;
            this.endtime = 0;
            this.rankboard = false;
            //計算遊玩時間
            this.pretime = new Date().getTime();
        },
    },
    watch: {
        boardContent: {
            handler() {    
                this.timer = setTimeout(()=>{
                    for(let i = 0; i < 5;i++){ 
                        //判斷還有沒有路走  
                        if(this.board.gameRoundEnd()){
                            if(!this.playtime) this.completeGame();  
                            return;
                        }else if(this.board.getFirstExistPath() == undefined){ //可能的路徑
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
      clearInterval(this.endtimer);
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
    max-width:1154px;
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