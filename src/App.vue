<template>
  <div id="app">
    <div class="backgroundphone xl:hidden">
      <img :src="imgSrcPhone" width="100%" height="100%" alt="" />
    </div>
    <div class="background hidden xl:block">
      <img :src="imgSrc" width="100%" height="100%" alt="" />
    </div>
    <div class="cell">
      <game></game>
    </div>
  </div>
</template>

<script>
import game from './components/game.vue';

export default {
  name: 'App',
  components: {
    game
  }, 
  data () {  
      let random = Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+10; //10~28 
      let randomPhone = Math.floor(Math.random()*10+30); //30~39
      console.log(randomPhone)
      return { 
        imgSrc:require('./assets/img/'+ random +'.jpg'),//'+ random +'
        imgSrcPhone:require('./assets/img/'+ randomPhone +'.jpg')
      }
  }, 
}
</script> 
<style>
body{
  margin:0;
  padding:0; 
  overflow: hidden; 
}
.background {
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 **/
    z-index:-1;
    position: absolute;
} 
.background img{
    width:100%; 
    margin-top:-83px;
    position: relative;
} 
.backgroundphone {
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 **/
    z-index:-1;
    position: absolute;
} 
.backgroundphone img{
    width:100%;  
    position: relative;
} 
.cell{ 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
 
</style>
