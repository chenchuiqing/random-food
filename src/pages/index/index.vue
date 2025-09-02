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
	
	export default {
		data() {
			return {
				counter: useCounterStore(),
				// 使用环境变量
				appName: getEnvString('VITE_APP_NAME', '默认应用'),
				mode: import.meta.env.MODE || 'unknown',
				apiUrl: getEnvString('VITE_API_BASE_URL', ''),
				debugMode: getEnvBoolean('VITE_DEBUG_MODE', false),
				appVersion: getEnvString('VITE_APP_VERSION', '1.0.0')
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	/* 可以在这里添加特殊样式 */
</style>