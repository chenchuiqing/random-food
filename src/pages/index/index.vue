<template>
	<view class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
		<text class="text-3xl font-bold text-blue-600 mb-4">Hello Tailwind CSS!</text>
		<text class="text-lg text-gray-700 mb-8">Uni-app with Tailwind CSS</text>
		
		<view class="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-8">
			<text class="text-xl font-semibold mb-4 text-center">环境变量信息</text>
			<view class="space-y-2">
				<view class="flex justify-between">
					<text class="font-medium">应用名称:</text>
					<text>{{ appName }}</text>
				</view>
				<view class="flex justify-between">
					<text class="font-medium">环境模式:</text>
					<text>{{ mode }}</text>
				</view>
				<view class="flex justify-between">
					<text class="font-medium">API 地址:</text>
					<text class="text-sm">{{ apiUrl }}</text>
				</view>
				<view class="flex justify-between">
					<text class="font-medium">调试模式:</text>
					<text>{{ debugMode ? '开启' : '关闭' }}</text>
				</view>
				<view class="flex justify-between">
					<text class="font-medium">应用版本:</text>
					<text>{{ appVersion }}</text>
				</view>
			</view>
		</view>
		
		<view class="w-full max-w-md bg-white rounded-lg shadow-md p-6 mb-8">
			<text class="text-xl font-semibold mb-4 text-center">HTTP 请求测试</text>
			<view class="space-y-4">
				<view class="flex items-center">
					<input 
						class="flex-1 border border-gray-300 rounded px-3 py-2 mr-2" 
						placeholder="输入用户ID"
						v-model="userId"
					/>
					<button 
						class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
						@click="fetchUser"
						:disabled="loading"
					>
						{{ loading ? '获取中...' : '获取用户' }}
					</button>
				</view>
				
				<view v-if="userData" class="border border-gray-200 rounded p-3">
					<text class="font-medium">用户信息:</text>
					<view class="mt-2">
						<text>姓名: {{ userData.name }}</text>
					</view>
					<view>
						<text>邮箱: {{ userData.email }}</text>
					</view>
				</view>
				
				<view v-if="error" class="text-red-500">
					<text>错误: {{ error }}</text>
				</view>
			</view>
		</view>
		
		<view class="flex flex-col items-center mb-8">
			<text class="text-2xl mb-4">Count: {{ counter.count }}</text>
			<view class="flex space-x-4">
				<button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition" @click="counter.decrement">-</button>
				<button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition" @click="counter.increment">+</button>
			</view>
		</view>
		
		<view class="flex space-x-4">
			<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Button 1</button>
			<button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Button 2</button>
		</view>
	</view>
</template>

<script>
	import { useCounterStore } from '../../stores/counter.js'
	
	// 引入环境变量工具
	import { getEnvString, getEnvBoolean } from '../../utils/env.js'
	
	// 引入 API 工具
	import { userApi } from '../../api/index.js'
	
	export default {
		data() {
			return {
				counter: useCounterStore(),
				// 使用环境变量
				appName: getEnvString('VITE_APP_NAME', '默认应用'),
				mode: import.meta.env.MODE || 'unknown',
				apiUrl: getEnvString('VITE_API_BASE_URL', ''),
				debugMode: getEnvBoolean('VITE_DEBUG_MODE', false),
				appVersion: getEnvString('VITE_APP_VERSION', '1.0.0'),
				
				// 请求相关数据
				userId: '',
				userData: null,
				loading: false,
				error: ''
			}
		},
		methods: {
			async fetchUser() {
				if (!this.userId) {
					this.error = '请输入用户ID'
					return
				}
				
				this.loading = true
				this.error = ''
				this.userData = null
				
				try {
					// 这里只是一个示例，实际项目中需要替换为真实的 API 地址
					// this.userData = await userApi.getUserInfo(this.userId)
					// 模拟数据
					this.userData = {
						name: '张三',
						email: 'zhangsan@example.com'
					}
				} catch (err) {
					this.error = err.message || '获取用户信息失败'
				} finally {
					this.loading = false
				}
			}
		}
	}
</script>

<style>
	/* 可以在这里添加特殊样式 */
</style>