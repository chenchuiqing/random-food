<template>
	<view class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
		<text class="text-3xl font-bold text-blue-600 mb-4">今天吃什么？</text>
		
		<!-- 美食展示区 -->
		<view class="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6">
			<text class="text-xl font-semibold mb-4 text-center">美食库</text>
			<view class="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
				<view 
					v-for="food in foodStore.foods" 
					:key="food.id"
					class="flex flex-col items-center p-2 border border-gray-200 rounded"
				>
					<view class="w-12 h-12 bg-gray-200 rounded-full mb-1 flex items-center justify-center">
						<text class="text-lg">🍽️</text>
					</view>
					<text class="text-sm text-center">{{ food.name }}</text>
				</view>
				
				<view 
					class="flex flex-col items-center p-2 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400"
					@click="goToAddFood"
				>
					<view class="w-12 h-12 rounded-full mb-1 flex items-center justify-center">
						<text class="text-2xl text-gray-400">+</text>
					</view>
					<text class="text-sm text-center text-gray-500">添加</text>
				</view>
			</view>
		</view>
		
		<!-- 动画展示区 -->
		<view 
			v-if="isSelecting" 
			class="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col items-center justify-center h-48"
		>
			<view class="flex space-x-4 mb-4">
				<view 
					v-for="(foods, index) in rollingFoods" 
					:key="index"
					class="flex flex-col items-center"
				>
					<view class="w-16 h-16 bg-gray-200 rounded-full mb-2 flex items-center justify-center" 
						  :class="{'animate-bounce': isSelecting}"
						  :style="{ animationDelay: `${index * 0.1}s` }">
						<text class="text-2xl">🍽️</text>
					</view>
					<text class="text-sm">{{ foods[Math.floor(Math.random() * foods.length)].name }}</text>
				</view>
			</view>
			<text class="text-lg">正在为你选择...</text>
		</view>
		
		<!-- 结果展示区 -->
		<view 
			v-if="selectedFoods.length > 0 && !isSelecting" 
			class="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-6"
		>
			<text class="text-xl font-semibold mb-4 text-center">选中美食</text>
			<view class="flex flex-col items-center">
				<view class="flex space-x-4 mb-4">
					<view 
						v-for="food in selectedFoods" 
						:key="food.id"
						class="flex flex-col items-center"
					>
						<view class="w-20 h-20 bg-yellow-100 rounded-full mb-2 flex items-center justify-center border-2 border-yellow-400">
							<text class="text-3xl">🍽️</text>
						</view>
						<text class="font-semibold">{{ food.name }}</text>
					</view>
				</view>
				<text class="text-gray-600 mb-4">就是它了！</text>
			</view>
		</view>
		
		<!-- 操作按钮区 -->
		<view class="flex flex-col w-full max-w-md space-y-4">
			<button 
				class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-lg font-medium"
				@click="startSelection"
				:disabled="isSelecting || foodStore.foods.length === 0"
			>
				{{ isSelecting ? '选择中...' : '开始选择' }}
			</button>
			
			<button 
				class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-lg font-medium"
				@click="goToAddFood"
			>
				添加美食
			</button>
			
			<button 
				v-if="selectedFoods.length > 0 && !isSelecting"
				class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-lg font-medium"
				@click="startSelection"
			>
				再来一次
			</button>
		</view>
	</view>
</template>

<script>
	import { useFoodStore } from '../../stores/food.js'
	
	export default {
		data() {
			return {
				foodStore: useFoodStore(),
				isSelecting: false,
				selectedFoods: [],
				rollingFoods: []
			}
		},
		
		methods: {
			// 开始选择
			startSelection() {
				if (this.foodStore.foods.length === 0) {
					uni.showToast({
						title: '请先添加美食',
						icon: 'none'
					})
					return
				}
				
				this.isSelecting = true
				this.selectedFoods = []
				
				// 生成滚动数据
				this.generateRollingFoods()
				
				// 2.5秒后停止动画并显示结果
				setTimeout(() => {
					this.isSelecting = false
					this.selectedFoods = this.foodStore.randomSelect(1)
				}, 2500)
			},
			
			// 生成滚动数据
			generateRollingFoods() {
				// 创建多个随机食物数组用于滚动效果
				this.rollingFoods = []
				for (let i = 0; i < 10; i++) {
					this.rollingFoods.push(this.foodStore.randomSelect(3))
				}
			},
			
			// 跳转到添加美食页面
			goToAddFood() {
				uni.navigateTo({
					url: '/pages/index/add-food'
				})
			}
		}
	}
</script>

<style>
	/* 可以在这里添加特殊样式 */
</style>