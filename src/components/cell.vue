<template>
  <td :class="classNames">
    <div v-if="isLine" :class="lineClass"></div>
    <template v-if="img">
      <img :src="img" alt="">
    </template>
    <template v-else>
    </template>
  </td>
</template>
<script>
  export default {
    name: 'cell',
    props: ['isSelected', 'isBlank', 'className', 'lineClass', 'isLine'],
    computed: {
      classNames () {
        return {
          'selected': this.isSelected, // 選中方塊
          'blank': this.isBlank // 空白方塊
        }
      }, 
      img(){
        if(!this.className) return
        return require('../assets/img/'+ this.className + '.png')
      }
    }, 
  }
</script>
