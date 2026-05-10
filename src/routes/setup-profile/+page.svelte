<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let dharmaName = $state('');
	let isLoading = $state(false);
	let isGuest = $state(false);
	let mounted = $state(false);
	let step = $state(1);

	const suggestions = ['An Lạc', 'Bình An', 'An Nhiên', 'Tịnh Tâm', 'Thiên Phúc', 'Trúc Lâm', 'Pháp Hiếu', 'Trí Tuệ', 'Trúc Diệu', 'Vân Tường'];

	async function saveProfile() {
		if (!dharmaName.trim()) return;
		isLoading = true;
		isGuest = localStorage.getItem('isGuest') === 'true';
		try {
			if (isGuest) { localStorage.setItem('guestDharmaName', dharmaName); }
			else {
				const { data: { user } } = await supabase.auth.getUser();
				if (user) await supabase.from('profiles').update({ dharma_name: dharmaName }).eq('id', user.id);
			}
		} catch (error) { console.error('Error saving profile:', error); }
		isLoading = false;
		goto('/dashboard');
	}

	function selectSuggestion(name: string) { dharmaName = name; }

	onMount(() => {
		mounted = true;
		const saved = localStorage.getItem('guestDharmaName');
		if (saved) dharmaName = saved;
	});
</script>

<div class="min-h-screen relative overflow-hidden">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/8 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#93B1A7]/8 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<header class="px-5 py-5 relative z-10">
		<button onclick={() => step > 1 ? step-- : goto('/auth')} class="p-2 -ml-2 rounded-full hover:bg-[#C5A059]/5 transition-colors">
			<svg class="w-5 h-5 text-[#9A8E80]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
		</button>
	</header>

	<main class="flex-1 flex flex-col items-center justify-center px-6 py-4 relative z-10">
		<div class="w-full max-w-sm">
			{#if step === 1}
				<div class="text-center stagger-children">
					<div class="mb-10 animate-fade-in-scale">
						<div class="w-24 h-24 mx-auto rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center">
							<svg class="w-14 h-14 text-[#C5A059]/60" viewBox="0 0 80 80" fill="none">
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="currentColor" opacity="0.5" transform="rotate(0 40 48)"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="currentColor" opacity="0.5" transform="rotate(60 40 48)"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="currentColor" opacity="0.5" transform="rotate(120 40 48)"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="currentColor" opacity="0.5" transform="rotate(180 40 48)"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="currentColor" opacity="0.5" transform="rotate(240 40 48)"/>
								<ellipse cx="40" cy="22" rx="7" ry="14" fill="currentColor" opacity="0.5" transform="rotate(300 40 48)"/>
								<circle cx="40" cy="48" r="5" fill="currentColor" opacity="0.6"/>
							</svg>
						</div>
					</div>

					<h1 class="font-serif text-2xl font-light text-[#4A3F35] mb-3 tracking-wide">Chào mừng bạn</h1>
					<p class="text-[#9A8E80] text-sm mb-10 leading-relaxed font-light">Trong Phật giáo, pháp danh là tên gọi thánh thiện mà bạn nhận được trong quá trình tu tập</p>

					<div class="space-y-3 mb-10">
						<div class="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E5DDD0]">
							<div class="w-9 h-9 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-[#C5A059]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
							</div>
							<div><p class="text-[#6B5D4D] text-sm font-light">Thiền định</p><p class="text-[#9A8E80]/50 text-xs mt-1">Tích lũy thời gian thiền trì</p></div>
						</div>
						<div class="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E5DDD0]">
							<div class="w-9 h-9 rounded-xl bg-[#93B1A7]/10 border border-[#93B1A7]/20 flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-[#93B1A7]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M12 9V7"/><ellipse cx="12" cy="6" rx="3" ry="2"/></svg>
							</div>
							<div><p class="text-[#6B5D4D] text-sm font-light">Gõ Mõ</p><p class="text-[#9A8E80]/50 text-xs mt-1">Tích lũy những lời kinh có giá trị</p></div>
						</div>
						<div class="flex items-start gap-3 p-4 rounded-2xl bg-white border border-[#E5DDD0]">
							<div class="w-9 h-9 rounded-xl bg-[#C4A89C]/10 border border-[#C4A89C]/20 flex items-center justify-center flex-shrink-0">
								<svg class="w-4 h-4 text-[#C4A89C]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
							</div>
							<div><p class="text-[#6B5D4D] text-sm font-light">Cộng đồng</p><p class="text-[#9A8E80]/50 text-xs mt-1">Kết nối với các tâm hồn cùng chung lý tưởng</p></div>
						</div>
					</div>

					<button onclick={() => step = 2} class="w-full py-4 bg-[#C5A059] border border-[#B8944A] text-white rounded-2xl font-light text-sm tracking-wide transition-all duration-300 hover:bg-[#B8944A]">Tiếp tục</button>
				</div>
			{:else}
				<div class="text-center stagger-children">
					<h1 class="font-serif text-2xl font-light text-[#4A3F35] mb-2 tracking-wide">Nhập pháp danh</h1>
					<p class="text-[#9A8E80] text-sm mb-8 font-light">Hoặc chọn một gợi ý bên dưới</p>

					<div class="relative mb-8 animate-fade-in-up">
						<input type="text" placeholder="Pháp danh của bạn" bind:value={dharmaName} maxlength="20"
							class="w-full px-6 py-4 bg-white border border-[#E5DDD0] rounded-2xl text-[#4A3F35] text-center text-lg placeholder:text-[#9A8E80]/40 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/20 transition-all font-light shadow-sm"/>
					</div>

					<div class="mb-10 animate-fade-in-up" style="animation-delay: 0.2s;">
						<p class="text-[#9A8E80]/40 text-[10px] uppercase tracking-widest mb-4">Gợi ý</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each suggestions as name}
								<button type="button" onclick={() => selectSuggestion(name)}
									class="px-4 py-2 rounded-full text-xs font-light border transition-all {dharmaName === name ? 'bg-[#C5A059]/15 border-[#C5A059]/40 text-[#8B6840]' : 'bg-white border-[#E5DDD0] text-[#9A8E80] hover:border-[#C5A059]/30 hover:text-[#8B6840]/80'}">
									{name}
								</button>
							{/each}
						</div>
					</div>

					<button onclick={saveProfile} disabled={!dharmaName.trim() || isLoading}
						class="w-full py-4 bg-[#C5A059] border border-[#B8944A] text-white rounded-2xl font-light text-sm tracking-wide transition-all duration-300 hover:bg-[#B8944A] disabled:opacity-30 disabled:cursor-not-allowed">
						{#if isLoading}Đang lưu...{:else}Bắt đầu hành trình{/if}
					</button>
					<button onclick={() => { dharmaName = 'Khách Hạnh'; saveProfile(); }} class="mt-4 text-[#9A8E80]/40 hover:text-[#9A8E80]/60 text-xs transition-colors">Bỏ qua - dùng tên "Khách Hạnh"</button>
				</div>
			{/if}
		</div>
	</main>

	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 animate-fade-in" style="animation-delay: 0.5s;">
		<div class="w-8 h-[2px] rounded-full transition-all duration-300 {step === 1 ? 'bg-[#C5A059]/60' : 'bg-[#9A8E80]/20'}"></div>
		<div class="w-8 h-[2px] rounded-full transition-all duration-300 {step === 2 ? 'bg-[#C5A059]/60' : 'bg-[#9A8E80]/20'}"></div>
	</div>
</div>
