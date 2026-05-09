<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let dharmaName = $state('');
	let isLoading = $state(false);
	let isGuest = $state(false);
	let mounted = $state(false);
	let step = $state(1);

	const suggestions = [
		'An Lạc', 'Bình An', 'An Nhiên', 'Tịnh Tâm',
		'Thiên Phúc', 'Trúc Lâm', 'Pháp Hiếu',
		'Trí Tuệ', 'Trúc Diệu', 'Vân Tường'
	];

	async function saveProfile() {
		if (!dharmaName.trim()) return;

		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';

		try {
			if (isGuest) {
				localStorage.setItem('guestDharmaName', dharmaName);
			} else {
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

	function selectSuggestion(name: string) {
		dharmaName = name;
	}

	onMount(() => {
		mounted = true;
		const saved = localStorage.getItem('guestDharmaName');
		if (saved) {
			dharmaName = saved;
		}
	});
</script>

<div class="min-h-screen bg-[#F7F3F0] flex flex-col relative overflow-hidden">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-1/4 right-1/4 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-1/3 left-1/4 w-48 h-48 bg-[#9CAF88]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -3s;"></div>
	</div>

	<header class="px-6 py-6 relative z-10">
		<button
			onclick={() => step > 1 ? step-- : goto('/auth')}
			class="p-2 -ml-2 rounded-full hover:bg-[#3D3028]/5 transition-colors animate-fade-in"
		>
			<svg class="w-6 h-6 text-[#5C4F44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</button>
	</header>

	<main class="flex-1 flex flex-col items-center justify-center px-8 py-4 relative z-10">
		<div class="w-full max-w-sm">
			{#if step === 1}
				<div class="text-center stagger-children">
					<div class="mb-10 animate-lotus-bloom">
						<div class="w-24 h-24 mx-auto rounded-full bg-[#C5A059]/10 flex items-center justify-center">
							<svg class="w-14 h-14 text-[#C5A059]" viewBox="0 0 80 80" fill="none">
								<defs>
									<linearGradient id="profileLotus" x1="0%" y1="100%" x2="0%" y2="0%">
										<stop offset="0%" stop-color="#C9B896"/>
										<stop offset="100%" stop-color="#E8DCC8"/>
									</linearGradient>
								</defs>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#profileLotus)" transform="rotate(0 40 48)" opacity="0.8"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#profileLotus)" transform="rotate(60 40 48)" opacity="0.8"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#profileLotus)" transform="rotate(120 40 48)" opacity="0.8"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#profileLotus)" transform="rotate(180 40 48)" opacity="0.8"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#profileLotus)" transform="rotate(240 40 48)" opacity="0.8"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="url(#profileLotus)" transform="rotate(300 40 48)" opacity="0.8"/>
								<circle cx="40" cy="48" r="5" fill="#C9B896"/>
							</svg>
						</div>
					</div>

					<h1 class="font-serif text-3xl font-light text-[#3D3028] mb-3 tracking-wide">
						Chào mừng bạn
					</h1>
					<p class="text-[#7A6B5A]/70 text-sm mb-10 leading-relaxed">
						Trong Phật giáo, pháp danh là tên gọi thánh thiện mà bạn nhận được trong quá trình tu tập
					</p>

					<div class="space-y-4 mb-10 text-left">
						<div class="flex items-start gap-4 p-4 bg-[#F2EDE6] rounded-2xl">
							<div class="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center flex-shrink-0">
								<svg class="w-5 h-5 text-[#C5A059]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<circle cx="12" cy="12" r="10"/>
									<path d="M12 6v6l4 2"/>
								</svg>
							</div>
							<div>
								<p class="font-medium text-[#3D3028] text-sm">Thiền định</p>
								<p class="text-[#7A6B5A]/60 text-xs mt-1">Tích lũy thời gian thiền trì</p>
							</div>
						</div>

						<div class="flex items-start gap-4 p-4 bg-[#F2EDE6] rounded-2xl">
							<div class="w-10 h-10 rounded-xl bg-[#9CAF88]/15 flex items-center justify-center flex-shrink-0">
								<svg class="w-5 h-5 text-[#9CAF88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<ellipse cx="12" cy="14" rx="8" ry="5"/>
									<path d="M12 9V7"/>
									<ellipse cx="12" cy="6" rx="3" ry="2"/>
								</svg>
							</div>
							<div>
								<p class="font-medium text-[#3D3028] text-sm">Gõ Mõ</p>
								<p class="text-[#7A6B5A]/60 text-xs mt-1">Tích lũy những lời kinh có giá trị</p>
							</div>
						</div>

						<div class="flex items-start gap-4 p-4 bg-[#F2EDE6] rounded-2xl">
							<div class="w-10 h-10 rounded-xl bg-[#C4A89C]/15 flex items-center justify-center flex-shrink-0">
								<svg class="w-5 h-5 text-[#C4A89C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									<path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z"/>
								</svg>
							</div>
							<div>
								<p class="font-medium text-[#3D3028] text-sm">Cộng đồng</p>
								<p class="text-[#7A6B5A]/60 text-xs mt-1">Kết nối với các tâm hồn cùng chung lý tưởng</p>
							</div>
						</div>
					</div>

					<button
						onclick={() => step = 2}
						class="w-full py-4 bg-[#3D3028] text-[#F7F3F0] rounded-2xl font-medium text-base transition-all duration-300 hover:bg-[#3D3028]/90 hover:shadow-lg hover:shadow-[#3D3028]/20"
					>
						Tiếp tục
					</button>
				</div>

			{:else}
				<div class="text-center stagger-children">
					<h1 class="font-serif text-3xl font-light text-[#3D3028] mb-2 tracking-wide">
						Nhập pháp danh
					</h1>
					<p class="text-[#7A6B5A]/70 text-sm mb-8">
						Hoặc chọn một gợi ý bên dưới
					</p>

					<div class="relative mb-8 animate-fade-in-up">
						<input
							type="text"
							placeholder="Pháp danh của bạn"
							bind:value={dharmaName}
							maxlength="20"
							class="w-full px-6 py-5 bg-[#FAF8F5] border-2 border-[#C5A059]/30 rounded-3xl text-[#3D3028] text-center text-xl placeholder:text-[#7A6B5A]/30 focus:outline-none focus:border-[#C5A059] focus:ring-4 focus:ring-[#C5A059]/10 transition-all"
						/>
					</div>

					<div class="mb-10 animate-fade-in-up" style="animation-delay: 0.2s;">
						<p class="text-[#7A6B5A]/50 text-xs uppercase tracking-wider mb-4">Gợi ý</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each suggestions as name}
								<button
									type="button"
									onclick={() => selectSuggestion(name)}
									class="px-4 py-2 bg-[#F2EDE6] text-[#5C4F44] text-sm rounded-full border border-transparent hover:border-[#C5A059]/30 transition-all {dharmaName === name ? 'border-[#C5A059] bg-[#C5A059]/10' : ''}"
								>
									{name}
								</button>
							{/each}
						</div>
					</div>

					<button
						onclick={saveProfile}
						disabled={!dharmaName.trim() || isLoading}
						class="w-full py-4 bg-[#3D3028] text-[#F7F3F0] rounded-2xl font-medium text-base transition-all duration-300 hover:bg-[#3D3028]/90 hover:shadow-lg hover:shadow-[#3D3028]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{#if isLoading}
							<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Đang lưu...
						{:else}
							Bắt đầu hành trình
						{/if}
					</button>

					<button
						onclick={() => { dharmaName = 'Khách Hạnh'; saveProfile(); }}
						class="mt-4 text-[#7A6B5A]/50 hover:text-[#7A6B5A] text-sm transition-colors"
					>
						Bỏ qua - dùng tên "Khách Hạnh"
					</button>
				</div>
			{/if}
		</div>
	</main>

	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 animate-fade-in" style="animation-delay: 0.5s;">
		<div class="w-8 h-1 rounded-full transition-all duration-300 {step === 1 ? 'bg-[#C5A059]' : 'bg-[#E8E0D8]'}"></div>
		<div class="w-8 h-1 rounded-full transition-all duration-300 {step === 2 ? 'bg-[#C5A059]' : 'bg-[#E8E0D8]'}"></div>
	</div>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
