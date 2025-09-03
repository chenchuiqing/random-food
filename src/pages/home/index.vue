<template>
	<view class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
		<text class="text-3xl font-bold text-gray-800 mb-2">今天吃什么？</text>
		<text class="text-gray-500 mb-12">长按按钮开始选择</text>
		
		<!-- 选择按钮 -->
		<view 
			class="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl flex items-center justify-center mb-12
			       transition-all duration-300 ease-in-out"
			:class="{
				'scale-110 shadow-2xl': isPressing,
				'animate-pulse': !isPressing && foodStore.foods.length > 0
			}"
			@touchstart="handlePressStart"
			@touchend="handlePressEnd"
			@mousedown="handlePressStart"
			@mouseup="handlePressEnd"
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
				{{ isPressing ? '松开选择' : '选择美食' }}
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
			v-if="isSelecting" 
			class="w-full max-w-md h-32 mb-12 flex items-center justify-center overflow-hidden"
		>
			<view class="flex space-x-4">
				<view 
					v-for="(food, index) in rollingFoods" 
					:key="index"
					class="flex flex-col items-center transition-transform duration-100"
				>
					<view class="w-16 h-16 bg-white rounded-full mb-2 flex items-center justify-center shadow-md border-2 border-gray-100">
						<text class="text-2xl">🍽️</text>
					</view>
					<text class="text-sm font-medium">{{ food.name }}</text>
				</view>
			</view>
		</view>
		
		<!-- 结果展示区 -->
		<view 
			v-if="selectedFoods.length > 0 && !isSelecting" 
			class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mb-8 transition-all duration-500"
		>
			<text class="text-xl font-bold text-center mb-4 text-gray-800">选中美食</text>
			<view class="flex flex-col items-center">
				<view class="flex space-x-4 mb-4">
					<view 
						v-for="food in selectedFoods" 
						:key="food.id"
						class="flex flex-col items-center"
					>
						<view class="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-2 flex items-center justify-center border-2 border-yellow-300 shadow-md">
							<text class="text-3xl">🍽️</text>
						</view>
						<text class="font-bold text-lg">{{ food.name }}</text>
					</view>
				</view>
				<text class="text-gray-600 italic mb-4">"{{ getRandomMessage() }}"</text>
			</view>
		</view>
		
		<!-- 再来一次按钮 -->
		<button 
			v-if="selectedFoods.length > 0 && !isSelecting && !isPressing"
			class="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
			@click="resetSelection"
		>
			再来一次
		</button>
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
				pressTimer: null,
				isSelecting: false,
				selectedFoods: [],
				rollingFoods: [],
				pressInterval: null
			}
		},
		
		methods: {
			// 开始长按
			handlePressStart() {
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
				
				// 开始充能进度更新
				this.pressInterval = setInterval(() => {
					const elapsed = (Date.now() - this.pressStartTime) / 1000
					this.pressProgress = Math.min(elapsed / 2, 1) // 2秒充满
				}, 50)
			},
			
			// 结束长按
			handlePressEnd() {
				if (!this.isPressing) return
				
				clearInterval(this.pressInterval)
				this.isPressing = false
				
				// 至少需要按住0.5秒才触发选择
				const pressDuration = (Date.now() - this.pressStartTime) / 1000
				if (pressDuration < 0.5) {
					return
				}
				
				// 开始选择动画
				this.startSelection()
			},
			
			// 开始选择动画
			startSelection() {
				this.isSelecting = true
				
				// 生成滚动数据
				this.generateRollingFoods()
				
				// 根据按压时间确定动画时长（0.5秒到2秒之间）
				const pressDuration = Math.min(Math.max((Date.now() - this.pressStartTime) / 1000, 0.5), 2)
				const animationDuration = 2000 + (2 - pressDuration) * 1000
				
				// 动画结束后停止并显示结果
				setTimeout(() => {
					this.isSelecting = false
					this.selectedFoods = this.foodStore.randomSelect(1)
				}, animationDuration)
			},
			
			// 生成滚动数据
			generateRollingFoods() {
				this.rollingFoods = []
				// 生成20组随机食物用于滚动效果
				for (let i = 0; i < 20; i++) {
					const randomFood = this.foodStore.foods[Math.floor(Math.random() * this.foodStore.foods.length)]
					this.rollingFoods.push(randomFood)
				}
			},
			
			// 重置选择
			resetSelection() {
				this.selectedFoods = []
			},
			
			// 获取随机提示语
			getRandomMessage() {
				const messages = [
					'就是它了！',
					'今天就吃这个吧！',
					'美味的选择！',
					'享受美食时光！',
					'让味蕾去旅行！',
					'满足你的胃！'
				]
				return messages[Math.floor(Math.random() * messages.length)]
			}
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