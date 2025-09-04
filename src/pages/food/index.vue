<template>
	<view class="flex flex-col min-h-screen bg-gray-50">
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
			<view class="bg-white rounded-lg shadow-md overflow-hidden">
				<view 
					v-for="(food, index) in foodStore.foods" 
					:key="food.id"
					class="flex items-center p-4 border-b border-gray-100 last:border-b-0"
					:class="{ 'bg-gray-50': index % 2 === 0 }"
				>
					<!-- 美食图片 -->
					<view class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
						<text class="text-xl">🍽️</text>
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
					<text class="text-4xl mb-2">🍽️</text>
					<text class="text-lg mb-2">暂无美食</text>
					<text>点击上方按钮添加美食</text>
				</view>
			</view>
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
	</view>
</template>

<script>
	import { useFoodStore } from '../../stores/food.js'
	
	export default {
		data() {
			return {
				foodStore: useFoodStore(),
				showEditModal: false,
				editingFood: {
					id: null,
					name: ''
				},
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
			async deleteFood(id) {
				uni.showModal({
					title: '确认删除',
					content: '确定要删除这个美食吗？',
					success: async (res) => {
						if (res.confirm) {
							// 使用数据库持久化存储
							await this.foodStore.removeFood(id)
							uni.showToast({
								title: '删除成功',
								icon: 'none'
							})
						}
					}
				})
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
</style>