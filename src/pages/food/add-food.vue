<template>
	<view class="flex flex-col bg-gray-100 overflow-hidden" style="min-height: calc(100vh - var(--window-top) - var(--window-bottom));">
		<!-- 顶部导航栏 -->
		<view class="bg-white py-3 px-4 shadow-sm flex items-center justify-center">
			<text class="text-gray-600 text-sm">美食无界，分享此刻的味道</text>
		</view>
		
		<!-- 添加美食表单 -->
		<view class="flex-1 p-4 pb-28 overflow-auto">
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
				
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="fixed bottom-0 left-0 right-0 bg-white px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
			<view class="flex space-x-4">
				<button
					class="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium"
					@click="goBack"
				>
					取消
				</button>
				<button
					class="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
					@click="addFood"
					:disabled="!foodName.trim()"
				>
					保存
				</button>
			</view>
			
			<!-- 调试按钮（开发环境） -->
			<view class="mt-2">
				<button
					class="w-full py-2 bg-blue-100 text-blue-600 rounded-lg text-sm"
					@click="testStorage"
				>
					测试存储功能
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { useFoodStore } from '../../stores/food.js'
	import StorageTest from '../../utils/storage-test.js'
	
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
						// 失败占位：使用已存在的静态资源
						this.foodImage = '/static/logo.png'
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
					icon: 'none',
					position: 'center',
					mask: true,
					duration: 1500
				})
				
				// 返回上一页
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			},
			
			// 返回
			goBack() {
				uni.navigateBack()
			},
			
			// 测试存储功能
			async testStorage() {
				uni.showLoading({
					title: '测试中...'
				})
				
				try {
					// 检查存储环境
					const environment = StorageTest.checkStorageEnvironment()
					console.log('存储环境:', environment)
					
					// 测试本地存储
					const localTest = StorageTest.testLocalStorage()
					console.log('本地存储测试结果:', localTest)
					
					// 测试数据库存储
					const dbTest = await StorageTest.testStorage()
					console.log('数据库存储测试结果:', dbTest)
					
					uni.hideLoading()
					
					uni.showModal({
						title: '测试结果',
						content: `存储环境: ${environment.hasPlus ? 'App环境' : 'H5环境'}\nSQLite: ${environment.hasSqlite ? '可用' : '不可用'}\n本地存储: ${localTest ? '正常' : '异常'}\n数据库: ${dbTest ? '正常' : '异常'}`,
						showCancel: false
					})
					
				} catch (error) {
					uni.hideLoading()
					console.error('存储测试失败:', error)
					uni.showToast({
						title: '测试失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style>
	/* 页面特殊样式 */
</style>