<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Sparkles } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { supabase } from '$lib/supabase';

	// User data
	let dharmaName = $state('Tân Viên');
	let avatarEmoji = $state('');
	let totalMerits = $state(0);
	let isGuest = $state(false);
	let isLoading = $state(true);

	// Avatar options - SVG paths cho quiet luxury style
	const avatarOptions = [
		{ id: 'lotus', label: 'Hoa sen' },
		{ id: 'sun', label: 'Mặt trời' },
		{ id: 'moon', label: 'Trăng' },
		{ id: 'star', label: 'Sao' },
		{ id: 'leaf', label: 'Lá' },
		{ id: 'flame', label: 'Lửa' },
	];

	async function fetchUserData() {
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';

		if (isGuest) {
			dharmaName = localStorage.getItem('guestDharmaName') || 'Khách';
			avatarEmoji = '';
			totalMerits = parseInt(localStorage.getItem('guestMerit') || '0');
			isLoading = false;
			return;
		}

		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				isLoading = false;
				return;
			}

			const { data: profile } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user.id)
				.single();

			if (profile) {
				dharmaName = profile.dharma_name || 'Tân Viên';
				avatarEmoji = profile.avatar_emoji || '';
				totalMerits = profile.total_merits || 0;
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
		}

		isLoading = false;
	}

	async function updateAvatar(id: string) {
		avatarEmoji = id;

		if (isGuest) {
			localStorage.setItem('guestAvatarEmoji', id);
			return;
		}

		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) return;

			const { error } = await supabase
				.from('profiles')
				.update({ avatar_emoji: id })
				.eq('id', user.id);

			if (error) {
				console.error('Error updating avatar:', error);
			}
		} catch (error) {
			console.error('Error updating avatar:', error);
		}
	}

	async function handleLogout() {
		try {
			await supabase.auth.signOut();
			localStorage.removeItem('isGuest');
			localStorage.removeItem('guestMerit');
			localStorage.removeItem('guestDharmaName');
			localStorage.removeItem('guestAvatarEmoji');
			goto('/');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}

	onMount(() => {
		fetchUserData();
	});
</script>

<div class="min-h-screen bg-zen-cream pb-24">
	<!-- Header -->
	<header class="px-6 py-6">
		<div class="flex items-center justify-between">
			<h1 class="font-serif text-2xl font-semibold text-zen-brown">Cá nhân</h1>
			<button 
				onclick={() => goto('/dashboard')} 
				class="p-2 rounded-full hover:bg-zen-brown/5 transition-colors"
			>
				<ArrowLeft class="w-6 h-6 text-zen-brown" strokeWidth={1.5} />
			</button>
		</div>
	</header>

	<!-- Main Content -->
	<main class="px-6">
		<!-- Profile Card -->
		<div class="bg-zen-parchment rounded-3xl p-8 shadow-sm text-center mb-6">
			<!-- Avatar with SVG -->
			<div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-zen-gold to-zen-brown flex items-center justify-center mb-4 shadow-lg shadow-zen-gold/20">
				{#if avatarEmoji === 'lotus' || avatarEmoji === ''}
					<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<ellipse cx="24" cy="42" rx="5" ry="2.5"/>
						<path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"/>
						<path d="M19 34 C15 28 12 24 12 20 C12 16 17 14 21 16"/>
						<path d="M29 34 C33 28 36 24 36 20 C36 16 31 14 27 16"/>
					</svg>
				{:else if avatarEmoji === 'sun'}
					<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="24" cy="24" r="8"/>
						<path d="M24 8v6M24 34v6M8 24h6M34 24h6M12.5 12.5l4.2 4.2M31.3 31.3l4.2 4.2M35.5 12.5l-4.2 4.2M16.7 31.3l-4.2 4.2"/>
					</svg>
				{:else if avatarEmoji === 'moon'}
					<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M36 24c0-8.284-5.716-15-13-15-1.126 0-2.218.14-3.26.4C25.1 11.2 29 16 29 21.5c0 5.5-3.9 10.3-9.26 12.1 1.04.26 2.13.4 3.26.4 7.284 0 13-6.716 13-15z"/>
					</svg>
				{:else if avatarEmoji === 'star'}
					<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M24 8l4.9 10 11 1.6-8 7.8 1.9 11-9.8-5.2-9.8 5.2 1.9-11-8-7.8 11-1.6z"/>
					</svg>
				{:else if avatarEmoji === 'leaf'}
					<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 36 C12 24 20 12 36 12 C36 12 36 36 24 36 C18 36 12 36 12 36"/>
						<path d="M12 36 C20 32 28 24 36 12"/>
					</svg>
				{:else if avatarEmoji === 'flame'}
					<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M24 44 C16 36 12 28 12 22 C12 14 18 8 24 8 C24 8 24 14 28 14 C32 14 36 18 36 24 C36 28 34 32 32 34 C30 36 26 38 24 44"/>
					</svg>
				{/if}
			</div>
			
			<!-- Dharma Name -->
			<h2 class="font-serif text-2xl font-semibold text-zen-brown mb-2">
				{#if isLoading}
					<span class="opacity-50">...</span>
				{:else}
					{dharmaName}
				{/if}
			</h2>
			
			<!-- Merits -->
			<div class="flex items-center justify-center gap-2 text-zen-gold">
				<Sparkles class="w-5 h-5" strokeWidth={1.5} />
				<span class="font-semibold">
					{#if isLoading}
						<span class="opacity-50">...</span>
					{:else}
						{totalMerits.toLocaleString()}
					{/if}
				</span>
				<span class="text-zen-brown/50">công đức</span>
			</div>

			{#if isGuest}
				<div class="mt-4 px-4 py-2 bg-amber-50 rounded-full inline-block">
					<span class="text-amber-700 text-sm">Chế độ Khách</span>
				</div>
			{/if}
		</div>

		<!-- Change Avatar -->
		<div class="bg-zen-parchment rounded-3xl p-6 shadow-sm">
			<h3 class="font-serif text-lg font-semibold text-zen-brown mb-4 text-center">
				Đổi Avatar
			</h3>
			
			<div class="grid grid-cols-3 gap-4">
				{#each avatarOptions as option}
					<button
						onclick={() => updateAvatar(option.id)}
						class="w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 {avatarEmoji === option.id ? 'bg-zen-gold text-zen-cream' : 'bg-zen-linen hover:bg-zen-brown/10'}"
					>
						{#if option.id === 'lotus'}
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<ellipse cx="24" cy="42" rx="5" ry="2.5"/>
								<path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"/>
								<path d="M19 34 C15 28 12 24 12 20 C12 16 17 14 21 16"/>
								<path d="M29 34 C33 28 36 24 36 20 C36 16 31 14 27 16"/>
							</svg>
						{:else if option.id === 'sun'}
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="24" cy="24" r="8"/>
								<path d="M24 8v6M24 34v6M8 24h6M34 24h6M12.5 12.5l4.2 4.2M31.3 31.3l4.2 4.2M35.5 12.5l-4.2 4.2M16.7 31.3l-4.2 4.2"/>
							</svg>
						{:else if option.id === 'moon'}
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M36 24c0-8.284-5.716-15-13-15-1.126 0-2.218.14-3.26.4C25.1 11.2 29 16 29 21.5c0 5.5-3.9 10.3-9.26 12.1 1.04.26 2.13.4 3.26.4 7.284 0 13-6.716 13-15z"/>
							</svg>
						{:else if option.id === 'star'}
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M24 8l4.9 10 11 1.6-8 7.8 1.9 11-9.8-5.2-9.8 5.2 1.9-11-8-7.8 11-1.6z"/>
							</svg>
						{:else if option.id === 'leaf'}
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M12 36 C12 24 20 12 36 12 C36 12 36 36 24 36 C18 36 12 36 12 36"/>
								<path d="M12 36 C20 32 28 24 36 12"/>
							</svg>
						{:else if option.id === 'flame'}
							<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M24 44 C16 36 12 28 12 22 C12 14 18 8 24 8 C24 8 24 14 28 14 C32 14 36 18 36 24 C36 28 34 32 32 34 C30 36 26 38 24 44"/>
							</svg>
						{/if}
						<span class="text-xs mt-2">{option.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Guest Mode Info -->
		{#if isGuest}
			<div class="mt-6 text-center">
				<p class="text-zen-brown/50 text-sm">
					Đăng nhập để đồng bộ dữ liệu
				</p>
				<button
					onclick={() => goto('/auth')}
					class="mt-3 px-6 py-3 bg-zen-gold text-zen-cream rounded-full font-medium hover:bg-zen-gold/90 transition-colors"
				>
					Đăng nhập
				</button>
			</div>
		{:else}
			<!-- Logout Button -->
			<div class="mt-6">
				<button
					onclick={handleLogout}
					class="w-full py-3 bg-zen-linen text-zen-brown-warm rounded-xl font-medium hover:bg-zen-brown/10 transition-colors flex items-center justify-center gap-2"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
						<polyline points="16,17 21,12 16,7"/>
						<line x1="21" y1="12" x2="9" y2="12"/>
					</svg>
					Đăng xuất
				</button>
			</div>
		{/if}
	</main>

	<!-- App Version -->
	<div class="text-center mt-8 text-zen-brown/30 text-sm">
		<p>Tích Công Đức v1.0.0</p>
	</div>
</div>

<!-- Bottom Navigation -->
<BottomNav currentRoute="/profile" />

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
