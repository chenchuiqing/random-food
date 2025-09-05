<template>
	<view class="flex flex-col min-h-screen bg-gray-50"
		style="min-height: calc(100vh - var(--window-top) - var(--window-bottom));"
	>
		<!-- 页面标题 -->
		<view class="bg-white py-3 px-4 shadow-sm flex items-center justify-center">
			<text class="text-gray-600 text-sm">{{ currentSlogan }}</text>
		</view>
		
		<!-- 美食列表 -->
		<view class="flex-1 p-4">
			<!-- 添加美食按钮 -->
			<view class="mb-6">
				<button 
					class="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center"
					@click="goToAddFood"
				>
					<text class="mr-2">+</text>
					添加美食
				</button>
			</view>
					
			<!-- 美食列表 -->
			<scroll-view 
				class="bg-white rounded-lg shadow-md flex-1"
				scroll-y="true"
				:enable-back-to-top="true"
				:scroll-with-animation="true"
				:show-scrollbar="false"
			>
				<view 
					v-for="(food, index) in foodStore.foods" 
					:key="food.id"
					class="flex items-center p-4 border-b border-gray-100 last:border-b-0"
					:class="{ 'bg-gray-50': index % 2 === 0 }"
				>
					<!-- 美食图片 -->
					<view class="w-12 h-12 rounded-full flex items-center justify-center mr-4 overflow-hidden shadow-sm"
						:class="getFoodImageBgClass(index)"
					>
						<image
							v-if="food.image"
							:src="food.image"
							class="w-12 h-12"
							mode="aspectFill"
						/>
						<text v-else class="text-xl">🍽️</text>
					</view>
					
					<!-- 美食名称 -->
					<view class="flex-1">
						<text class="font-medium text-gray-800">{{ food.name }}</text>
					</view>
					
					<!-- 操作按钮 -->
					<view class="flex space-x-2">
						<button 
							class="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition"
							@click="editFood(food)"
						>
							编辑
						</button>
						<button 
							class="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 transition"
							@click="deleteFood(food.id)"
						>
							删除
						</button>
					</view>
				</view>
				
				<!-- 空状态 -->
				<view 
					v-if="foodStore.foods.length === 0" 
					class="py-12 flex flex-col items-center justify-center text-gray-400"
				>
					<text class="text-4xl mb-2 text-yellow-500">🍽️</text>
					<text class="text-lg mb-2">暂无美食</text>
					<text>点击上方按钮添加美食</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 编辑美食弹窗 -->
		<view 
			v-if="showEditModal" 
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
		>
			<view class="bg-white rounded-lg w-full max-w-md p-6">
				<text class="text-xl font-bold mb-4 block">编辑美食</text>

        <view class="mb-4">
          <text class="block text-gray-700 text-sm font-bold mb-2">美食名称</text>
          <input
              v-model="editingFood.name"
              type="text"
              placeholder="请输入美食名称"
              class="block w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </view>
				
				<view class="flex space-x-3 pt-4">
					<button
						class="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium"
						@click="cancelEdit"
					>
						取消
					</button>
					<button
						class="flex-1 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600"
						@click="saveFood"
					>
						保存
					</button>
				</view>
			</view>
		</view>
		
		<!-- 删除确认弹窗 -->
		<view 
			v-if="showDeleteModal" 
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
			@click="cancelDelete"
		>
			<view 
				class="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl"
				@click.stop
			>
				<!-- 弹窗标题 -->
				<view class="text-center mb-4">
					<text class="text-lg font-bold text-gray-800">确认删除</text>
				</view>
				
				<!-- 弹窗内容 -->
				<view class="text-center mb-6">
					<text class="text-gray-600">确定要删除这个美食吗？</text>
				</view>
				
				<!-- 操作按钮 -->
				<view class="flex space-x-3">
					<button
						class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
						@click="cancelDelete"
					>
						取消
					</button>
					<button
						class="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
						@click="confirmDelete"
					>
						删除
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
				showEditModal: false,
				showDeleteModal: false,
				editingFood: {
					id: null,
					name: ''
				},
				deletingFoodId: null,
				slogans: [
					'美食无界，分享此刻的味道',
					'一口定情，满分好味道',
					'让味蕾去旅行',
					'此刻好味，值得被记录',
					'烟火气里的小确幸',
					'认真吃饭，热爱生活'
				],
				currentSlogan: ''
			}
		},

		onShow() {
			if (this.slogans && this.slogans.length > 0) {
				const index = Math.floor(Math.random() * this.slogans.length)
				this.currentSlogan = this.slogans[index]
			}
		},
		
		methods: {
			// 获取美食图片背景样式类
			getFoodImageBgClass(index) {
				const bgClasses = [
					'bg-gradient-to-br from-orange-100 to-orange-200', // 橙色渐变
					'bg-gradient-to-br from-red-100 to-red-200',       // 红色渐变
					'bg-gradient-to-br from-yellow-100 to-yellow-200', // 黄色渐变
					'bg-gradient-to-br from-green-100 to-green-200',   // 绿色渐变
					'bg-gradient-to-br from-blue-100 to-blue-200',     // 蓝色渐变
					'bg-gradient-to-br from-purple-100 to-purple-200', // 紫色渐变
					'bg-gradient-to-br from-pink-100 to-pink-200',     // 粉色渐变
					'bg-gradient-to-br from-indigo-100 to-indigo-200', // 靛蓝渐变
					'bg-gradient-to-br from-teal-100 to-teal-200',     // 青色渐变
					'bg-gradient-to-br from-amber-100 to-amber-200'    // 琥珀色渐变
				]
				return bgClasses[index % bgClasses.length]
			},

			// 添加测试数据（用于验证滚动功能）
			async addTestFoods() {
				const testFoods = [
					'宫保鸡丁', '麻婆豆腐', '红烧肉', '糖醋里脊', '鱼香肉丝',
					'回锅肉', '水煮鱼', '酸菜鱼', '口水鸡', '白切鸡',
					'烤鸭', '北京烤鸭', '小笼包', '生煎包', '煎饺',
					'担担面', '兰州拉面', '重庆小面', '热干面', '炸酱面'
				]
				
				for (let i = 0; i < 10; i++) {
					const randomIndex = Math.floor(Math.random() * testFoods.length)
					const foodName = testFoods[randomIndex] + (i + 1)
					await this.foodStore.addFood(foodName, '')
				}
				
				uni.showToast({
					title: '测试数据添加成功',
					icon: 'success'
				})
			},

			// 跳转到添加美食页面
			goToAddFood() {
				uni.navigateTo({
					url: '/pages/food/add-food'
				})
			},
			
			// 编辑美食
			editFood(food) {
				this.editingFood = {
					id: food.id,
					name: food.name,
					image: food.image
				}
				this.showEditModal = true
			},
			
			// 保存美食
			async saveFood() {
				if (!this.editingFood.name.trim()) {
					uni.showToast({
						title: '请输入美食名称',
						icon: 'none'
					})
					return
				}
				
				// 使用数据库持久化存储
				await this.foodStore.editFood(this.editingFood.id, this.editingFood.name, this.editingFood.image)
				this.showEditModal = false
				uni.showToast({
					title: '保存成功',
					icon: 'none'
				})
			},
			
			// 删除美食
			deleteFood(id) {
				this.deletingFoodId = id
				this.showDeleteModal = true
			},
			
			// 确认删除
			async confirmDelete() {
				if (this.deletingFoodId) {
					// 使用数据库持久化存储
					await this.foodStore.removeFood(this.deletingFoodId)
					uni.showToast({
						title: '删除成功',
						icon: 'none'
					})
				}
				this.showDeleteModal = false
				this.deletingFoodId = null
			},
			
			// 取消删除
			cancelDelete() {
				this.showDeleteModal = false
				this.deletingFoodId = null
			},
			
			// 取消编辑
			cancelEdit() {
				this.showEditModal = false
			}
		}
	}
</script>

<style>
	/* 页面特殊样式 */
	.scroll-view {
		height: 100%;
		overflow: hidden;
	}
	
	/* 确保 flex-1 能够正确工作 */
	.flex-1 {
		flex: 1;
		min-height: 0; /* 重要：允许 flex 子项收缩到内容以下 */
	}
	
	/* 自定义弹框样式 - 确保跨设备一致性 */
	.fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
	}
	
	/* 弹框背景遮罩 */
	.bg-black.bg-opacity-50 {
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
	}
	
	/* 弹框主体 */
	.bg-white.rounded-lg {
		background-color: #ffffff;
		border-radius: 12px;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		transform: translateZ(0);
		-webkit-transform: translateZ(0);
	}
	
	/* 按钮样式优化 */
	button {
		-webkit-tap-highlight-color: transparent;
		user-select: none;
		-webkit-user-select: none;
	}
	
	/* 确保按钮在触摸设备上有良好的反馈 */
	button:active {
		transform: scale(0.98);
		transition: transform 0.1s ease;
	}
	
	/* 弹框动画效果 */
	@keyframes modalFadeIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	
	/* 应用动画到弹框 */
	.bg-white.rounded-lg {
		animation: modalFadeIn 0.2s ease-out;
	}
</style>