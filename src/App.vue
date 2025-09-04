<script>
  import { useFoodStore } from './stores/food.js'
  
  export default {
    onLaunch: function() {
      console.log('App Launch')
      // 初始化数据库
      const foodStore = useFoodStore()
      foodStore.initDatabase()
    },
    onShow: function() {
      console.log('App Show')
    },
    onHide: function() {
      console.log('App Hide')
    }
  }
</script>

<style>
  /* 每个页面公共css */
  @import "./styles/tailwind.css";
</style>