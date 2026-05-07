<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, User } from 'lucide-svelte';
	import { supabase } from '$lib/supabase';

	let dharmaName = $state('');
	let isLoading = $state(false);
	let isGuest = $state(false);

	async function saveProfile() {
		if (!dharmaName.trim()) return;

		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';

		try {
			if (isGuest) {
				// Save to localStorage for guests
				localStorage.setItem('guestDharmaName', dharmaName);
			} else {
				// Save to Supabase for logged-in users
				const { data: { user } } = await supabase.auth.getUser();
				if (user) {
					const { error } = await supabase
						.from('profiles')
						.update({ dharma_name: dharmaName })
						.eq('id', user.id);

					if (error) {
						console.error('Error saving profile:', error);
					}
				}
			}
		} catch (error) {
			console.error('Error saving profile:', error);
		}

		isLoading = false;
		goto('/dashboard');
	}
</script>

<div class="min-h-screen bg-zen-beige flex flex-col">
	<!-- Header -->
	<header class="px-4 py-4">
		<button onclick={() => goto('/auth')} class="p-2 rounded-full hover:bg-zen-brown/5 transition-colors">
			<ArrowLeft class="w-6 h-6 text-zen-brown" />
		</button>
	</header>

	<!-- Main Content -->
	<main class="flex-1 flex flex-col items-center justify-center px-6 py-8">
		<div class="w-full max-w-md text-center stagger-children">
			<!-- Icon -->
			<div class="mb-8">
				<div class="w-20 h-20 mx-auto rounded-full bg-zen-gold/10 flex items-center justify-center">
					<User class="w-10 h-10 text-zen-gold" strokeWidth={1.5} />
				</div>
			</div>

			<!-- Title -->
			<h1 class="font-serif text-3xl md:text-4xl font-semibold text-zen-brown mb-3">
				Nhập Pháp Danh
			</h1>
			<p class="text-zen-brown/60 mb-10 max-w-sm mx-auto">
				Pháp danh là tên gọi trong hành trình tâm linh của bạn
			</p>

			<!-- Dharma Name Input -->
			<div class="relative mb-8">
				<input
					type="text"
					placeholder="Nhập pháp danh của bạn"
					bind:value={dharmaName}
					class="w-full px-6 py-5 bg-zen-white border-2 border-zen-gold/30 rounded-3xl text-zen-brown text-center text-xl placeholder:text-zen-brown/30 focus:outline-none focus:border-zen-gold focus:ring-4 focus:ring-zen-gold/20 transition-all"
				/>
			</div>

			<!-- Continue Button -->
			<button
				onclick={saveProfile}
				disabled={!dharmaName.trim() || isLoading}
				class="w-full py-4 bg-zen-brown text-zen-white rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-zen-brown/90 hover:shadow-lg hover:shadow-zen-brown/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				{#if isLoading}
					<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Đang lưu...
				{:else}
					Tiếp tục
				{/if}
			</button>
		</div>
	</main>

	<!-- Decorative elements -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 left-10 w-32 h-32 bg-zen-gold/5 rounded-full blur-3xl"></div>
		<div class="absolute bottom-1/4 right-10 w-48 h-48 bg-zen-gold/5 rounded-full blur-3xl"></div>
	</div>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
