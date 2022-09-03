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
import './indexCss.css';
export default {
  name: 'App',
  components: {
    game
  }, 
  data () {  
      let random = Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+10; //10~28 
      let randomPhone = Math.floor(Math.random()*10)+ Math.floor(Math.random()*10) +30; //30~48 
      return { 
        imgSrc:require('./assets/img/background/'+ random +'.jpg'),
        imgSrcPhone:require('./assets/img/backgroundPhone/'+ randomPhone +'.jpg')
      }
  }, 
}
</script> 