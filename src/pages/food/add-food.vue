<template>
	<view class="flex flex-col bg-gray-100 overflow-hidden" style="min-height: calc(100vh - var(--window-top) - var(--window-bottom));">
		<!-- 顶部导航栏 -->
		<view class="bg-white py-3 px-4 shadow-sm flex items-center justify-center">
			<text class="text-gray-600 text-sm">美食无界，分享此刻的味道</text>
		</view>
		
		<!-- 添加美食表单 -->
		<view class="flex-1 p-4 pb-28 overflow-auto">
			<view class="bg-white rounded-lg shadow-md p-6">
				<!-- 模式切换：单个 / 批量 -->
				<view class="mb-6">
					<view class="grid grid-cols-2 gap-2">
						<button
							class="py-3 rounded-lg text-sm font-medium border transition-colors"
							:class="!isBatchMode ? 'bg-yellow-500 text-white border-yellow-500 active:opacity-90' : 'bg-white text-gray-700 border-gray-200 active:bg-gray-50'"
							@click="switchMode(false)"
						>
							单个添加
						</button>
						<button
							class="py-3 rounded-lg text-sm font-medium border transition-colors"
							:class="isBatchMode ? 'bg-yellow-500 text-white border-yellow-500 active:opacity-90' : 'bg-white text-gray-700 border-gray-200 active:bg-gray-50'"
							@click="switchMode(true)"
						>
							批量添加
						</button>
					</view>
				</view>
        <view class="mb-6" v-if="!isBatchMode">
          <text class="block text-gray-700 text-sm font-bold mb-2">美食名称</text>
          <input
              v-model="foodName"
              type="text"
              placeholder="请输入美食名称"
              maxlength="8"
              :class="[
                'block w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 text-base',
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
          <!-- 字符计数提示 -->
          <view class="mt-1 text-sm text-right" :class="foodName.length >= 6 ? 'text-red-500' : 'text-gray-400'">
            {{ foodName.length }}/8
          </view>
        </view>

        <!-- 批量添加表单 -->
        <view class="mb-6" v-if="isBatchMode">
          <text class="block text-gray-700 text-sm font-bold mb-2">批量美食名称</text>
          <textarea
            v-model="batchInput"
            class="block w-full h-36 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-base border-gray-300 focus:ring-blue-500"
            placeholder="每行一个名称，或使用逗号分隔（,，）。每个名称最多8个字符。"
          />
          <view class="mt-2 text-xs text-gray-500">
            示例：汉堡\n披萨\n寿司，火锅
          </view>
        </view>

				<view class="mb-6">
					<text class="block text-gray-700 text-sm font-bold mb-2">美食图片</text>
					<view 
						class="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center active:border-blue-400 active:bg-blue-50 transition-colors touch-manipulation"
						@click="selectImage"
					>
						<view v-if="foodImage" class="w-full h-full flex items-center justify-center">
							<image :src="foodImage" class="w-32 h-32 rounded-lg" mode="aspectFit" />
						</view>
						<view v-else class="flex flex-col items-center">
							<text class="text-4xl mb-2">📷</text>
							<text class="text-gray-500 text-base">点击上传图片</text>
							<text class="text-gray-400 text-sm mt-1">（可选）</text>
						</view>
					</view>
				</view>
				
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] safe-area-inset-bottom">
			<view class="flex space-x-4">
				<button
					class="flex-1 py-4 bg-gray-200 text-gray-800 rounded-lg font-medium active:bg-gray-300 touch-manipulation"
					@click="goBack"
				>
					取消
				</button>
				<button
					class="flex-1 py-4 bg-yellow-500 active:bg-yellow-600 text-white rounded-lg font-medium active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
					@click="isBatchMode ? addFoodsBatch() : addFood()"
					:disabled="isBatchMode ? batchValidCount === 0 : (!foodName.trim() || nameError || isCheckingName)"
				>
					{{ isBatchMode ? `批量保存(${batchValidCount})` : (isCheckingName ? '检查中...' : '保存') }}
				</button>
			</view>
			
		</view>
	</view>
</template>

<script>
	import { useFoodStore } from '../../stores/food.js'
	
	export default {
		computed: {
			batchValidCount() {
				if (!this.isBatchMode) return 0
				const names = (this.batchInput || '')
					.replace(/\r/g, '\n')
					.split(/\n|,|，|、/)
					.map(s => s.trim())
					.filter(s => s.length > 0 && s.length <= 8)
				const seen = new Set()
				let count = 0
				for (const n of names) {
					const k = n.toLowerCase()
					if (!seen.has(k)) { seen.add(k); count++ }
				}
				return count
			}
		},
		data() {
			return {
				foodStore: useFoodStore(),
				foodName: '',
				foodImage: '',
				nameError: '', // 名称错误提示
				isCheckingName: false, // 是否正在检查名称
				// 批量添加
				isBatchMode: false,
				batchInput: ''
			}
		},
		
		methods: {
			// 模式切换
			switchMode(toBatch) {
				this.isBatchMode = !!toBatch
			},
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

			// 批量添加
			async addFoodsBatch() {
				const names = (this.batchInput || '')
					.replace(/\r/g, '\n')
					.split(/\n|,|，|、/)
					.map(s => s.trim())
					.filter(s => s.length > 0)
					.slice(0, 200)
				const within = []
				const tooLong = []
				for (const n of names) {
					if (n.length > 8) tooLong.push(n); else within.push(n)
				}
				// 去重（不区分大小写）
				const seen = new Set()
				const unique = []
				for (const n of within) {
					const k = n.toLowerCase()
					if (!seen.has(k)) { seen.add(k); unique.push(n) }
				}
				if (unique.length === 0) {
					uni.showToast({ title: '请输入至少一个有效名称', icon: 'none' })
					return
				}
				uni.showLoading({ title: '批量添加中...' })
				try {
					const success = []
					const exists = []
					for (const n of unique) {
						const dup = await this.foodStore.checkFoodNameExists(n)
						if (dup) { exists.push(n); continue }
						await this.foodStore.addFood(n, this.foodImage)
						success.push(n)
					}
					uni.hideLoading()
					const msg = `成功 ${success.length} 项` + (exists.length ? `，已存在 ${exists.length} 项` : '') + (tooLong.length ? `，超长忽略 ${tooLong.length} 项` : '')
					uni.showToast({ title: msg, icon: 'none', duration: 1800 })
					if (success.length > 0) {
						setTimeout(() => { uni.navigateBack() }, 1000)
					}
				} catch (e) {
					uni.hideLoading()
					console.error('批量添加失败:', e)
					uni.showToast({ title: '批量添加失败，请重试', icon: 'none' })
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