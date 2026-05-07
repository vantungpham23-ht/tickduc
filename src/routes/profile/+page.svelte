<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Settings, Bell, Moon, LogOut, ChevronRight, User, Award, Calendar, TrendingUp } from 'lucide-svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';

	// Mock user data
	let user = $state({
		name: 'Hồng Liên',
		dharmaName: 'Minh Tâm',
		email: 'honglien@email.com',
		meritPoints: 1280,
		streak: 7,
		totalDays: 45,
		joinDate: '15/03/2026'
	});
</script>

<div class="min-h-screen bg-zen-beige pb-24">
	<!-- Header -->
	<header class="px-6 py-6">
		<div class="flex items-center justify-between">
			<h1 class="font-serif text-2xl font-semibold text-zen-brown">Cá nhân</h1>
			<button onclick={() => goto('/settings')} class="p-2 rounded-full hover:bg-zen-brown/5 transition-colors">
				<Settings class="w-6 h-6 text-zen-brown" />
			</button>
		</div>
	</header>

	<!-- Profile Card -->
	<section class="px-6 mb-6">
		<div class="bg-zen-white rounded-3xl p-6 shadow-sm">
			<div class="flex items-center gap-4">
				<!-- Avatar -->
				<div class="w-20 h-20 rounded-full bg-gradient-to-br from-zen-gold to-zen-brown flex items-center justify-center">
					<span class="text-3xl font-serif text-white">{user.name.charAt(0)}</span>
				</div>
				
				<!-- Info -->
				<div class="flex-1">
					<h2 class="font-serif text-xl font-semibold text-zen-brown">{user.name}</h2>
					<p class="text-zen-brown/60 text-sm">Pháp danh: {user.dharmaName}</p>
					<p class="text-zen-gold text-sm mt-1">{user.meritPoints} công đức</p>
				</div>
				
				<button class="p-2 rounded-full bg-zen-beige">
					<ChevronRight class="w-5 h-5 text-zen-brown/40" />
				</button>
			</div>
		</div>
	</section>

	<!-- Stats Grid -->
	<section class="px-6 mb-6">
		<div class="grid grid-cols-3 gap-3">
			<div class="bg-zen-white rounded-2xl p-4 text-center shadow-sm">
				<div class="w-10 h-10 mx-auto rounded-full bg-zen-gold/10 flex items-center justify-center mb-2">
					<Award class="w-5 h-5 text-zen-gold" />
				</div>
				<p class="text-2xl font-semibold text-zen-brown">{user.meritPoints}</p>
				<p class="text-zen-brown/50 text-xs">Công đức</p>
			</div>
			
			<div class="bg-zen-white rounded-2xl p-4 text-center shadow-sm">
				<div class="w-10 h-10 mx-auto rounded-full bg-zen-gold/10 flex items-center justify-center mb-2">
					<TrendingUp class="w-5 h-5 text-zen-gold" />
				</div>
				<p class="text-2xl font-semibold text-zen-brown">{user.streak}</p>
				<p class="text-zen-brown/50 text-xs">Ngày liên tiếp</p>
			</div>
			
			<div class="bg-zen-white rounded-2xl p-4 text-center shadow-sm">
				<div class="w-10 h-10 mx-auto rounded-full bg-zen-gold/10 flex items-center justify-center mb-2">
					<Calendar class="w-5 h-5 text-zen-gold" />
				</div>
				<p class="text-2xl font-semibold text-zen-brown">{user.totalDays}</p>
				<p class="text-zen-brown/50 text-xs">Tổng ngày</p>
			</div>
		</div>
	</section>

	<!-- Menu Items -->
	<section class="px-6">
		<div class="bg-zen-white rounded-2xl shadow-sm overflow-hidden">
			<button class="w-full px-4 py-4 flex items-center gap-4 hover:bg-zen-beige/50 transition-colors border-b border-zen-brown/5">
				<div class="w-10 h-10 rounded-full bg-zen-gold/10 flex items-center justify-center">
					<User class="w-5 h-5 text-zen-gold" />
				</div>
				<span class="flex-1 text-left text-zen-brown">Chỉnh sửa hồ sơ</span>
				<ChevronRight class="w-5 h-5 text-zen-brown/30" />
			</button>
			
			<button class="w-full px-4 py-4 flex items-center gap-4 hover:bg-zen-beige/50 transition-colors border-b border-zen-brown/5">
				<div class="w-10 h-10 rounded-full bg-zen-gold/10 flex items-center justify-center">
					<Bell class="w-5 h-5 text-zen-gold" />
				</div>
				<span class="flex-1 text-left text-zen-brown">Thông báo</span>
				<ChevronRight class="w-5 h-5 text-zen-brown/30" />
			</button>
			
			<button class="w-full px-4 py-4 flex items-center gap-4 hover:bg-zen-beige/50 transition-colors">
				<div class="w-10 h-10 rounded-full bg-zen-gold/10 flex items-center justify-center">
					<Moon class="w-5 h-5 text-zen-gold" />
				</div>
				<span class="flex-1 text-left text-zen-brown">Chế độ tối</span>
				<ChevronRight class="w-5 h-5 text-zen-brown/30" />
			</button>
		</div>

		<!-- Logout -->
		<div class="mt-4">
			<button class="w-full px-4 py-4 bg-zen-white rounded-2xl shadow-sm flex items-center gap-4 hover:bg-red-50 transition-colors">
				<div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
					<LogOut class="w-5 h-5 text-red-500" />
				</div>
				<span class="text-red-500 font-medium">Đăng xuất</span>
			</button>
		</div>
	</section>

	<!-- App Version -->
	<div class="text-center mt-8 text-zen-brown/30 text-sm">
		<p>Tích Công Đức v1.0.0</p>
		<p class="mt-1">Ngày tham gia: {user.joinDate}</p>
	</div>
</div>

<!-- Bottom Navigation -->
<BottomNav currentRoute="/profile" />

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
