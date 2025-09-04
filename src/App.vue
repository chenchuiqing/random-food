<script>
  import { useFoodStore } from './stores/food.js'
  
  export default {
    async onLaunch() {
      console.log('App Launch')
      // 初始化数据库
      const foodStore = useFoodStore()
      try {
        await foodStore.initDatabase()
        console.log('数据库初始化完成')
      } catch (error) {
        console.error('数据库初始化失败:', error)
      }
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