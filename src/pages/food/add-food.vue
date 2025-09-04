<template>
	<view class="flex flex-col min-h-screen bg-gray-100">
		<!-- 顶部导航栏 -->
		<view class="bg-white shadow-sm py-4 px-4 flex items-center">
			<button @click="goBack" class="mr-4">
				<text class="text-xl">←</text>
			</button>
			<text class="text-xl font-semibold">添加美食</text>
		</view>
		
		<!-- 添加美食表单 -->
		<view class="flex-1 p-4">
			<view class="bg-white rounded-lg shadow-md p-6">
        <view class="mb-6">
          <text class="block text-gray-700 text-sm font-bold mb-2">美食名称</text>
          <input
              v-model="foodName"
              type="text"
              placeholder="请输入美食名称"
              class="block w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              :focusable="true"
              @focus="onFocus"
              @blur="onBlur"
          />
        </view>

				<view class="mb-6">
					<text class="block text-gray-700 text-sm font-bold mb-2">美食图片</text>
					<view 
						class="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
						@click="selectImage"
					>
						<view v-if="foodImage" class="w-full h-full flex items-center justify-center">
							<image :src="foodImage" class="w-32 h-32" mode="aspectFit" />
						</view>
						<view v-else class="flex flex-col items-center">
							<text class="text-3xl mb-2">📷</text>
							<text class="text-gray-500">点击上传图片</text>
							<text class="text-gray-400 text-sm mt-1">（可选）</text>
						</view>
					</view>
				</view>
				
				<view class="flex space-x-4 pt-4">
					<button
						class="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium"
						@click="goBack"
					>
						取消
					</button>
					<button
						class="flex-1 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg font-medium hover:opacity-90"
						@click="addFood"
						:disabled="!foodName.trim()"
					>
						保存
					</button>
				</view>
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
				foodName: '',
				foodImage: ''
			}
		},
		
		methods: {
			// 输入框获得焦点事件
			onFocus() {
				console.log('输入框获得焦点')
			},
			
			// 输入框失去焦点事件
			onBlur() {
				console.log('输入框失去焦点')
			},
			
			// 选择图片
			selectImage() {
				// 在实际应用中，这里会调用系统相册选择图片
				// 由于是演示，我们使用模拟选择
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.foodImage = res.tempFilePaths[0]
					},
					fail: () => {
						// 模拟选择图片
						const mockImages = [
							'/static/foods/burger.png',
							'/static/foods/pizza.png',
							'/static/foods/sushi.png'
						]
						this.foodImage = mockImages[Math.floor(Math.random() * mockImages.length)]
					}
				})
			},
			
			// 添加美食
			async addFood() {
				if (!this.foodName.trim()) {
					uni.showToast({
						title: '请输入美食名称',
						icon: 'none'
					})
					return
				}
				
				// 使用数据库持久化存储
				await this.foodStore.addFood(this.foodName.trim(), this.foodImage)
				
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			},
			
			// 返回
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	/* 页面特殊样式 */
</style>