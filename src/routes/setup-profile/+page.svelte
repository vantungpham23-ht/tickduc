<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';

	let dharmaName = $state('');
	let isLoading = $state(false);
	let isGuest = $state(false);
	let mounted = $state(false);
	let step = $state(1);

	const suggestions = ['An Lạc', 'Bình An', 'An Nhiên', 'Tịnh Tâm', 'Thiện Phúc', 'Trúc Lâm', 'Pháp Hiếu', 'Trí Tuệ', 'Trúc Diệu', 'Vân Tường'];

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

<div class="min-h-screen relative overflow-hidden" style="background-color: #F9F8F6;">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 bg-[#B8860B]/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#6B8E6B]/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: -4s;"></div>
	</div>

	<header class="px-5 py-5 relative z-10">
		<button onclick={() => step > 1 ? step-- : goto('/auth')} class="p-2 -ml-2 rounded-full hover:bg-[#F0EFEC] transition-colors">
			<svg class="w-5 h-5 text-[#7A7573]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
		</button>
	</header>

	<main class="flex-1 flex flex-col items-center justify-center px-6 py-4 relative z-10">
		<div class="w-full max-w-sm">
			{#if step === 1}
				<div class="text-center stagger-children">
					<div class="mb-10 animate-fade-in-scale">
						<div class="w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #B8860B, #DAA520);">
							<svg class="w-14 h-14 text-white" viewBox="0 0 80 80" fill="none">
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

					<h1 class="font-serif text-2xl font-medium text-[#1A1918] mb-3">Chào mừng bạn</h1>
					<p class="text-[#7A7573] text-base mb-10 leading-relaxed">Trong Phật giáo, pháp danh là tên gọi thánh thiện mà bạn nhận được trong quá trình tu tập</p>

					<div class="space-y-3 mb-10">
						<div class="flex items-start gap-3 p-4 rounded-2xl shadow-sm" style="background: white; border: 1px solid #E8E5E2;">
							<div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background: #B8860B15;">
								<svg class="w-5 h-5 text-[#B8860B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>
							</div>
							<div>
								<p class="text-[#1A1918] font-medium">Thiền định</p>
								<p class="text-[#7A7573] text-sm mt-1">Tích lũy thời gian thiền trì</p>
							</div>
						</div>
						<div class="flex items-start gap-3 p-4 rounded-2xl shadow-sm" style="background: white; border: 1px solid #E8E5E2;">
							<div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background: #6B8E6B15;">
								<svg class="w-5 h-5 text-[#6B8E6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M12 9V7"/><ellipse cx="12" cy="6" rx="3" ry="2"/></svg>
							</div>
							<div>
								<p class="text-[#1A1918] font-medium">Gõ Mõ</p>
								<p class="text-[#7A7573] text-sm mt-1">Tích lũy những lời kinh có giá trị</p>
							</div>
						</div>
						<div class="flex items-start gap-3 p-4 rounded-2xl shadow-sm" style="background: white; border: 1px solid #E8E5E2;">
							<div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style="background: #BC8F8F15;">
								<svg class="w-5 h-5 text-[#BC8F8F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
							</div>
							<div>
								<p class="text-[#1A1918] font-medium">Cộng đồng</p>
								<p class="text-[#7A7573] text-sm mt-1">Kết nối với các tâm hồn cùng chung lý tưởng</p>
							</div>
						</div>
					</div>

					<button onclick={() => step = 2} class="w-full py-4 bg-[#B8860B] text-white rounded-xl font-medium text-base transition-all duration-300 hover:bg-[#8B6508] shadow-lg shadow-[#B8860B]/20">
						Tiếp tục
					</button>
				</div>
			{:else}
				<div class="text-center stagger-children">
					<h1 class="font-serif text-2xl font-medium text-[#1A1918] mb-2">Nhập pháp danh</h1>
					<p class="text-[#7A7573] text-base mb-8">Hoặc chọn một gợi ý bên dưới</p>

					<div class="relative mb-8 animate-fade-in-up">
						<input type="text" placeholder="Pháp danh của bạn" bind:value={dharmaName} maxlength="20"
							class="w-full px-6 py-4 bg-white border border-[#E8E5E2] rounded-xl text-[#1A1918] text-center text-lg placeholder:text-[#A8A3A0] focus:outline-none focus:border-[#B8860B] focus:ring-2 focus:ring-[#B8860B]/10 transition-all shadow-sm"/>
					</div>

					<div class="mb-10 animate-fade-in-up" style="animation-delay: 0.2s;">
						<p class="text-[#A8A3A0] text-xs uppercase tracking-widest mb-4">Gợi ý</p>
						<div class="flex flex-wrap justify-center gap-2">
							{#each suggestions as name}
								<button type="button" onclick={() => selectSuggestion(name)}
									class="px-4 py-2 rounded-full text-sm font-medium border transition-all {dharmaName === name ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-[#7A7573] border-[#E8E5E2] hover:border-[#B8860B] hover:text-[#B8860B]'}">
									{name}
								</button>
							{/each}
						</div>
					</div>

					<button onclick={saveProfile} disabled={!dharmaName.trim() || isLoading}
						class="w-full py-4 bg-[#B8860B] text-white rounded-xl font-medium text-base transition-all duration-300 hover:bg-[#8B6508] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#B8860B]/20">
						{#if isLoading}Đang lưu...{:else}Bắt đầu hành trình{/if}
					</button>
					<button onclick={() => { dharmaName = 'Khách Hạnh'; saveProfile(); }} class="mt-4 text-[#A8A3A0] hover:text-[#7A7573] text-sm transition-colors">Bỏ qua - dùng tên "Khách Hạnh"</button>
				</div>
			{/if}
		</div>
	</main>

	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 animate-fade-in" style="animation-delay: 0.5s;">
		<div class="w-8 h-1 rounded-full transition-all duration-300 {step === 1 ? 'bg-[#B8860B]' : 'bg-[#E8E5E2]'}"></div>
		<div class="w-8 h-1 rounded-full transition-all duration-300 {step === 2 ? 'bg-[#B8860B]' : 'bg-[#E8E5E2]'}"></div>
	</div>
</div>
