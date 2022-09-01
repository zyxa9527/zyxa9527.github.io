<template>
  <div id="app">
    <div class="background">
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
      let random = Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+10; //10~29 
      return { 
        imgSrc:require('./assets/img/'+ random +'.jpg')//'+ random +'
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
.cell{ 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
 
</style>
