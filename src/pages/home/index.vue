<template>
  <view
      class="flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-purple-50 p-4 pt-8"
      style="min-height: calc(100vh - var(--window-top) - var(--window-bottom));"
  >
    <text class="text-3xl font-bold text-gray-800 mb-2">今天吃什么？</text>

    <!-- 提示词 -->
    <text class="text-gray-500 mb-6 text-center min-h-6">
      {{ hintText }}
    </text>

    <!-- 选择按钮 -->
    <view
        class="relative w-56 h-56 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl flex items-center justify-center mb-8
			       transition-all duration-300 ease-in-out z-10 touch-manipulation"
        :class="{
				'scale-110 shadow-2xl': isPressing,
				'animate-pulse': !isPressing && !isSelecting && foodStore.foods.length > 0,
				'opacity-50 cursor-not-allowed': isSelecting
			}"
        @touchstart="handlePressStart"
        @touchend="handlePressEnd"
        @mousedown="handlePressStart"
        @mouseup="handlePressEnd"
        @mouseleave="handlePressEnd"
    >
      <!-- 充能效果 -->
      <view
          v-if="isPressing"
          class="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-70"
          :style="{
					animation: `pulse ${3 - pressProgress * 2}s infinite`
				}"
      ></view>

      <!-- 按钮文字 -->
      <text class="text-white text-lg sm:text-xl font-bold z-10 text-center px-4">
        {{ buttonLabel }}
      </text>

      <!-- 充能进度指示器 -->
      <view
          v-if="isPressing"
          class="absolute -bottom-6 w-36 h-3 bg-gray-200 rounded-full overflow-hidden"
      >
        <view
            class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-100"
            :style="{ width: `${pressProgress * 100}%` }"
        ></view>
      </view>
    </view>

    <!-- 动画展示区 -->
    <view
        class="w-full max-w-sm sm:max-w-md mb-8 flex items-center justify-center px-4"
        :class="{
				'h-80 sm:h-80': isSelecting,
				'min-h-60 sm:min-h-60': podiumFoods.length > 0 && !isSelecting,
				'hidden': !isSelecting && podiumFoods.length === 0
			}"
    >
      <!-- 滚动动画：改成4×5网格 -->
      <view v-if="isSelecting" class="grid grid-cols-4 grid-rows-5 gap-1 sm:gap-2 w-full h-full overflow-hidden mt-10">
        <view
            v-for="(food, index) in rollingFoods"
            :key="index"
            class="flex flex-col items-center transition-transform duration-100"
        >
          <view
              class="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full mb-1 flex items-center justify-center shadow-md border border-gray-100">
            <text class="text-sm sm:text-lg">🍽️</text>
          </view>
          <text class="text-xs font-medium truncate w-full text-center leading-tight">{{ food.name }}</text>
        </view>
      </view>

      <!-- 结果展示：三名颁奖台 -->
      <view
          v-if="podiumFoods.length > 0 && !isSelecting"
          class="flex flex-col items-center transition-all duration-500 py-4 w-full touch-manipulation"
          @touchstart="resetSelection"
          @mousedown="resetSelection"
      >
        <view class="w-full max-w-sm sm:max-w-md grid grid-cols-3 gap-2 sm:gap-3 items-end">
          <!-- 第二名（左） -->
          <view class="flex flex-col items-center">
            <view class="w-full flex items-end justify-center">
              <view class="bg-gray-200 rounded-t-md w-16 h-12 sm:w-20 sm:h-16"></view>
            </view>
            <view v-show="showSecond" class="-mt-8 sm:-mt-10 flex flex-col items-center transition-all duration-700">
              <view class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-4 border-gray-300 shadow-md flex items-center justify-center">
                <text class="text-lg sm:text-2xl">🍽️</text>
              </view>
              <text class="mt-2 text-xs text-gray-600">第二名</text>
              <text class="font-semibold mt-1 text-xs sm:text-sm truncate max-w-[4rem] sm:max-w-[6rem]">{{ podiumFoods[1]?.name }}</text>
            </view>
          </view>
          <!-- 第一名（中） -->
          <view class="flex flex-col items-center">
            <view class="w-full flex items-end justify-center">
              <view class="bg-yellow-300 rounded-t-md w-20 h-20 sm:w-24 sm:h-24 shadow"></view>
            </view>
            <view v-show="showFirst" class="-mt-12 sm:-mt-14 flex flex-col items-center transition-all duration-700 transform">
              <view class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border-4 border-yellow-400 shadow-lg flex items-center justify-center scale-110">
                <text class="text-2xl sm:text-3xl">🏆</text>
              </view>
              <text class="mt-2 text-xs text-yellow-700">第一名</text>
              <text class="font-bold mt-1 text-sm sm:text-base truncate max-w-[5rem] sm:max-w-[7rem]">{{ podiumFoods[0]?.name }}</text>
            </view>
          </view>
          <!-- 第三名（右） -->
          <view class="flex flex-col items-center">
            <view class="w-full flex items-end justify-center">
              <view class="bg-amber-300 rounded-t-md w-16 h-10 sm:w-20 sm:h-14"></view>
            </view>
            <view v-show="showThird" class="-mt-6 sm:-mt-8 flex flex-col items-center transition-all duration-700">
              <view class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-4 border-amber-400 shadow flex items-center justify-center">
                <text class="text-lg sm:text-xl">🍽️</text>
              </view>
              <text class="mt-2 text-xs text-amber-700">第三名</text>
              <text class="font-medium mt-1 text-xs sm:text-sm truncate max-w-[3rem] sm:max-w-[5rem]">{{ podiumFoods[2]?.name }}</text>
            </view>
          </view>
        </view>
        <text class="text-gray-500 text-xs sm:text-sm mt-4 px-4 text-center">点击屏幕可重新选择</text>
      </view>
    </view>

  </view>
</template>

<script>
import {useFoodStore} from '../../stores/food.js'

export default {
  data() {
    return {
      foodStore: useFoodStore(),
      isPressing: false,
      pressStartTime: 0,
      pressProgress: 0,
      isSelecting: false,
      selectedFoods: [],
      rollingFoods: [],
      pressTimer: null,
      rollingTimer: null,
      hintText: '长按按钮抽取美食...',
      podiumFoods: [],
      showFirst: false,
      showSecond: false,
      showThird: false,
      touchStartX: 0,
      touchStartY: 0
    }
  },

  computed: {
    buttonLabel() {
      if (this.isSelecting) return '选择中...'
      if (this.isPressing) return '松开选择'
      return '选择美食'
    }
  },

  methods: {
    // 开始长按
    handlePressStart(event) {
      // 如果正在选择中，则不允许再次点击
      if (this.isSelecting) return

      if (this.foodStore.foods.length === 0) {
        uni.showToast({
          title: '请先添加美食',
          icon: 'none'
        })
        return
      }

      // 记录触摸起始位置，用于防误触
      if (event.touches && event.touches[0]) {
        this.touchStartX = event.touches[0].clientX
        this.touchStartY = event.touches[0].clientY
      }

      this.isPressing = true
      this.pressStartTime = Date.now()
      this.pressProgress = 0
      this.selectedFoods = []
      this.hintText = '长按抽取美食...'

      // 开始充能进度更新
      this.clearPressTimer()
      this.pressTimer = setInterval(() => {
        const elapsed = (Date.now() - this.pressStartTime) / 1000
        this.pressProgress = Math.min(elapsed / 2, 1) // 2秒充满
      }, 50)

      // 立即开始动画
      this.startSelectionAnimation()

      // 每200ms更新一次滚动数据，创造持续滚动效果
      this.rollingTimer = setInterval(() => {
        this.generateRollingFoods()
      }, 200)
    },

    // 结束长按
    handlePressEnd(event) {
      if (!this.isPressing) return

      // 防误触：检查触摸移动距离
      if (event.changedTouches && event.changedTouches[0]) {
        const touchEndX = event.changedTouches[0].clientX
        const touchEndY = event.changedTouches[0].clientY
        const moveDistance = Math.sqrt(
          Math.pow(touchEndX - this.touchStartX, 2) + 
          Math.pow(touchEndY - this.touchStartY, 2)
        )
        
        // 如果移动距离超过50px，认为是滑动操作，取消长按
        if (moveDistance > 50) {
          this.clearPressTimer()
          this.isPressing = false
          this.isSelecting = false
          this.hintText = '长按按钮抽取美食...'
          return
        }
      }

      this.clearPressTimer()
      this.isPressing = false

      // 至少需要按住0.5秒才触发选择
      const pressDuration = (Date.now() - this.pressStartTime) / 1000
      if (pressDuration < 0.5) {
        this.isSelecting = false
        this.hintText = '长按按钮抽取美食...'
        return
      }

      this.hintText = '随机选择中...'
      this.animationStartTime = Date.now()

      // 根据按压时间确定动画时长（1秒到3秒之间）
      const baseDuration = 1000 + Math.min(Math.max(pressDuration, 1), 3) * 500

      // 使用缓动函数来实现减速效果
      this.performEasingAnimation(baseDuration)
    },

    // 执行缓动动画
    performEasingAnimation(totalDuration) {
      const startTime = Date.now()
      const updateRolling = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / totalDuration, 1)

        // 使用缓动函数实现减速效果
        const easeOutProgress = 1 - Math.pow(1 - progress, 3)

        // 更新提示文本
        if (progress >= 0.8) {
          this.hintText = '即将揭晓...'
        }

        // 更新滚动速度（随着进度变慢）
        this.generateRollingFoods()

        if (progress < 1) {
          // 根据进度调整更新频率，实现减速效果
          const timeout = 50 + Math.pow(progress, 4) * 300
          this.rollingTimer = setTimeout(updateRolling, timeout)
        } else {
          // 动画结束
          this.isSelecting = false
          const results = this.foodStore.randomSelect(3)
          this.podiumFoods = [results[0], results[1], results[2]].filter(Boolean)
          this.showThird = false
          this.showSecond = false
          this.showFirst = false
          setTimeout(() => {
            this.showThird = true
            setTimeout(() => {
              this.showSecond = true
              setTimeout(() => {
                this.showFirst = true
                this.hintText = '最推荐在中间高台！'
              }, 700)
            }, 700)
          }, 500)
        }
      }

      updateRolling()
    },

    // 开始选择动画
    startSelectionAnimation() {
      this.isSelecting = true
      this.hintText = '正在快速切换美食...'

      // 生成初始滚动数据
      this.generateRollingFoods()
    },

    // 生成滚动数据
    generateRollingFoods() {
      this.rollingFoods = []
      // 生成20个随机食物用于滚动效果（4列×5行）
      for (let i = 0; i < 20; i++) {
        const randomFood = this.foodStore.foods[Math.floor(Math.random() * this.foodStore.foods.length)]
        this.rollingFoods.push(randomFood)
      }
    },

    // 重置选择
    resetSelection() {
      this.selectedFoods = []
      this.podiumFoods = []
      this.showFirst = false
      this.showSecond = false
      this.showThird = false
      this.hintText = '长按按钮抽取美食...'
    },

    // 清理按压定时器
    clearPressTimer() {
      if (this.pressTimer) {
        clearInterval(this.pressTimer)
        this.pressTimer = null
      }
    },

    // 清理滚动定时器
    clearRollingTimer() {
      if (this.rollingTimer) {
        clearTimeout(this.rollingTimer)
        this.rollingTimer = null
      }
    }
  },

  beforeDestroy() {
    // 清理所有定时器
    this.clearPressTimer()
    this.clearRollingTimer()
  }
}
</script>

<style>
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}
</style>