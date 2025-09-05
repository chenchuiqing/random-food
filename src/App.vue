<script>
  import { useFoodStore } from './stores/food.js'
  
  export default {
    async onLaunch() {
      console.log('App Launch - 应用启动')
      
      // 初始化存储
      const foodStore = useFoodStore()
      try {
        console.log('开始初始化存储...')
        await foodStore.initStorage()
        console.log('存储初始化完成')
      } catch (error) {
        console.error('存储初始化失败:', error)
        // 即使存储初始化失败，应用仍然可以运行
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