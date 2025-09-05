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
              :class="[
                'block w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2',
                nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              ]"
              :focusable="true"
              @focus="onFocus"
              @blur="onBlur"
          />
          <!-- 错误提示 -->
          <view v-if="nameError" class="mt-1 text-red-500 text-sm">
            {{ nameError }}
          </view>
          <!-- 检查状态提示 -->
          <view v-if="isCheckingName" class="mt-1 text-blue-500 text-sm">
            正在检查名称...
          </view>
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
					:disabled="!foodName.trim() || nameError || isCheckingName"
				>
					{{ isCheckingName ? '检查中...' : '保存' }}
				</button>
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
				foodImage: '',
				nameError: '', // 名称错误提示
				isCheckingName: false // 是否正在检查名称
			}
		},
		
		methods: {
			// 输入框获得焦点事件
			onFocus() {
				console.log('输入框获得焦点')
				// 清除错误状态
				this.nameError = ''
			},
			
			// 输入框失去焦点事件
			async onBlur() {
				console.log('输入框失去焦点')
				// 检查名称是否重复
				await this.checkNameDuplicate()
			},
			
			// 检查名称是否重复
			async checkNameDuplicate() {
				if (!this.foodName.trim() || this.isCheckingName) {
					return
				}
				
				this.isCheckingName = true
				this.nameError = ''
				
				try {
					const nameExists = await this.foodStore.checkFoodNameExists(this.foodName.trim())
					if (nameExists) {
						this.nameError = '该美食名称已存在，请使用其他名称'
					}
				} catch (error) {
					console.error('检查名称重复失败:', error)
					// 检查失败时不显示错误，避免影响用户体验
				} finally {
					this.isCheckingName = false
				}
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
						this.foodImage = '/static/foods/default.png'
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
				
				try {
					// 显示加载状态
					uni.showLoading({
						title: '添加中...'
					})
					
					// 使用数据库持久化存储
					await this.foodStore.addFood(this.foodName.trim(), this.foodImage)
					
					uni.hideLoading()
					
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
					
				} catch (error) {
					uni.hideLoading()
					console.error('添加美食失败:', error)
					
					// 根据错误类型显示不同的提示
					if (error.message && error.message.includes('已存在')) {
						uni.showModal({
							title: '名称重复',
							content: error.message,
							showCancel: false,
							confirmText: '我知道了'
						})
					} else {
						uni.showToast({
							title: '添加失败，请重试',
							icon: 'none',
							duration: 2000
						})
					}
				}
			},
			
			// 返回
			goBack() {
				uni.navigateBack()
			},
			
		}
	}
</script>

<style>
	/* 页面特殊样式 */
</style>