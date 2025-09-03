<template>
	<view class="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 pt-10">
		<text class="text-3xl font-bold text-gray-800 mb-2">今天吃什么？</text>
		
		<!-- 提示词 -->
		<text class="text-gray-500 mb-6 text-center min-h-6">
			{{ hintText }}
		</text>
		
		<!-- 选择按钮 -->
		<view 
			class="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl flex items-center justify-center mb-8
			       transition-all duration-300 ease-in-out z-10"
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
			<text class="text-white text-xl font-bold z-10 text-center">
				{{ buttonLabel }}
			</text>
			
			<!-- 充能进度指示器 -->
			<view 
				v-if="isPressing" 
				class="absolute -bottom-8 w-32 h-2 bg-gray-200 rounded-full overflow-hidden"
			>
				<view 
					class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-100"
					:style="{ width: `${pressProgress * 100}%` }"
				></view>
			</view>
		</view>
		
		<!-- 动画展示区 -->
		<view 
			class="w-full max-w-md h-40 mb-8 flex items-center justify-center overflow-hidden"
			:class="{
				'z-0': isSelecting || selectedFoods.length > 0,
				'hidden': !isSelecting && selectedFoods.length === 0
			}"
		>
			<!-- 滚动动画 -->
			<view v-if="isSelecting" class="flex">
				<view 
					v-for="(food, index) in rollingFoods" 
					:key="index"
					class="flex flex-col items-center mx-2 transition-transform duration-100"
				>
					<view class="w-20 h-20 bg-white rounded-full mb-2 flex items-center justify-center shadow-md border-2 border-gray-100">
						<text class="text-3xl">🍽️</text>
					</view>
					<text class="text-sm font-medium">{{ food.name }}</text>
				</view>
			</view>
			
			<!-- 结果展示 -->
			<view 
				v-if="selectedFoods.length > 0 && !isSelecting" 
				class="flex flex-col items-center transition-all duration-500"
				@touchstart="resetSelection"
				@mousedown="resetSelection"
			>
				<view class="flex space-x-4 mb-4">
					<view 
						v-for="food in selectedFoods" 
						:key="food.id"
						class="flex flex-col items-center"
					>
						<view class="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-3 flex items-center justify-center border-4 border-yellow-300 shadow-lg transform scale-110">
							<text class="text-4xl">🍽️</text>
						</view>
						<text class="font-bold text-xl">{{ food.name }}</text>
					</view>
				</view>
				<text class="text-gray-500 text-sm mt-2">点击美食可重新选择</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { useFoodStore } from '../../stores/food.js'
	
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
				hintText: '长按按钮抽取美食...'
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
			handlePressStart() {
				// 如果正在选择中，则不允许再次点击
				if (this.isSelecting) return
				
				if (this.foodStore.foods.length === 0) {
					uni.showToast({
						title: '请先添加美食',
						icon: 'none'
					})
					return
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
			handlePressEnd() {
				if (!this.isPressing) return
				
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
						this.selectedFoods = this.foodStore.randomSelect(1)
						this.hintText = '今天就吃这个吧！'
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
				// 生成10组随机食物用于滚动效果
				for (let i = 0; i < 10; i++) {
					const randomFood = this.foodStore.foods[Math.floor(Math.random() * this.foodStore.foods.length)]
					this.rollingFoods.push(randomFood)
				}
			},
			
			// 重置选择
			resetSelection() {
				this.selectedFoods = []
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
		0% { transform: scale(1); opacity: 0.7; }
		50% { transform: scale(1.05); opacity: 0.9; }
		100% { transform: scale(1); opacity: 0.7; }
	}
</style>