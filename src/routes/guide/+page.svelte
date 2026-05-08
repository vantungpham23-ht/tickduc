<script lang="ts">
	import { goto } from '$app/navigation';

	type GuideMode = 'thien' | 'hanhdao' | 'gomo';

	let activeMode = $state<GuideMode>('thien');

	const guides = {
		thien: {
			title: 'Thiền',
			subtitle: 'Tĩnh tâm mỗi ngày',
			color: '#93B1A7',
			steps: [
				{
					step: 1,
					title: 'Chuẩn bị',
					description: 'Tìm nơi yên tĩnh, ngồi trên ghế hoặc trải tatami. Giữ lưng thẳng, thư giãn vai.',
					tip: 'Nên thiền vào sáng sớm hoặc tối muộn'
				},
				{
					step: 2,
					title: 'Mở camera',
					description: 'Bật camera để ứng dụng theo dõi tư thế của bạn. Đặt điện thoại sao cho thấy rõ 2 tay.',
					tip: 'Đặt điện thoại cách bạn khoảng 1-2 mét'
				},
				{
					step: 3,
					title: 'Tư thế thiền',
					description: 'Đặt 2 tay lên 2 đầu gối, lòng bàn tay hướng lên trên. Thư giãn, mắt nhắm nhẹ.',
					tip: 'Đảm bảo 2 tay đều nằm trong khung hình camera'
				},
				{
					step: 4,
					title: 'Thiền 10 phút',
					description: 'Hít thở đều đặn, tập trung vào hơi thở. Đếm thầm từ 1 đến 10 rồi lặp lại.',
					tip: 'Nếu tay di chuyển, đếm sẽ dừng và bạn cần đặt tay lại'
				},
				{
					step: 5,
					title: 'Nhận công đức',
					description: 'Sau 10 phút thiền, bạn sẽ được cộng 1 công đức. Nhạc thiền sẽ phát khi đang thiền.',
					tip: 'Thiền đều đặn mỗi ngày để tích lũy công đức'
				}
			]
		},
		hanhdao: {
			title: 'Hành Đạo',
			subtitle: 'Chắp tay tụng kinh',
			color: '#C5A059',
			steps: [
				{
					step: 1,
					title: 'Chuẩn bị',
					description: 'Đứng hoặc ngồi thẳng lưng. Hai tay đặt trước ngực, khuyu nhẹ đầu xuống.',
					tip: 'Nên thực hiện trước bàn thờ hoặc nơi trang nghiêm'
				},
				{
					step: 2,
					title: 'Mở camera',
					description: 'Bật camera để ứng dụng theo dõi 2 tay của bạn. Đặt điện thoại sao cho thấy rõ 2 bàn tay.',
					tip: 'Đảm bảo ánh sáng đủ để camera nhận diện tay'
				},
				{
					step: 3,
					title: 'Chắp tay',
					description: 'Hai lòng bàn tay chạm nhau, các ngón tay khép chặt, đặt trước ngực. Giữ tư thế này.',
					tip: 'Hai tay cần gần nhau để ứng dụng nhận diện'
				},
				{
					step: 4,
					title: 'Giữ 10 giây',
					description: 'Duy trì tư thế chắp tay trong 10 giây. Đọc thầm: "Nam mô A Di Đà Phật" hoặc tên Đức Phật bạn mến.',
					tip: 'Nếu 2 tay tách ra, đếm sẽ bắt đầu lại'
				},
				{
					step: 5,
					title: 'Nhận công đức',
					description: 'Sau 10 giây, bạn được +1 công đức. Tiếng mõ sẽ vang lên xác nhận.',
					tip: 'Có thể thực hiện nhiều lần liên tiếp'
				}
			]
		},
		gomo: {
			title: 'Gõ Mõ',
			subtitle: 'Tụng kinh 108 lần',
			color: '#8B7355',
			steps: [
				{
					step: 1,
					title: 'Chuẩn bị',
					description: 'Tìm nơi yên tĩnh. Bạn có thể ngồi thiền hoặc đứng trước bàn thờ.',
					tip: 'Chuẩn bị tràng hạt để đếm nếu muốn'
				},
				{
					step: 2,
					title: 'Mở ứng dụng',
					description: 'Gõ Mõ không cần camera. Chỉ cần mở ứng dụng và bắt đầu gõ.',
					tip: 'Có thể thực hiện ở bất kỳ đâu'
				},
				{
					step: 3,
					title: 'Gõ mõ',
					description: 'Nhấn vào mõ trên màn hình hoặc gõ tay trên bàn (nếu có cảm biến). Mỗi lần gõ = 1 lần tụng kinh.',
					tip: 'Gõ đều nhịp, không quá nhanh hay quá chậm'
				},
				{
					step: 4,
					title: 'Đếm 108',
					description: 'Gõ đủ 108 lần để hoàn thành 1 chuỗi tụng kinh. Đọc thầm: "Nam mô Phật Thích Ca Mâu Ni" mỗi lần gõ.',
					tip: '108 là con số thiêng liêng trong Phật giáo'
				},
				{
					step: 5,
					title: 'Nhận công đức',
					description: 'Khi đạt 108 lần gõ, bạn được +1 công đức. Tiếng mõ sẽ vang lên nhiều hơn để chúc mừng.',
					tip: 'Có thể tụng nhiều chuỗi liên tiếp'
				}
			]
		}
	};

	let currentStep = $state(0);

	function selectMode(mode: GuideMode) {
		activeMode = mode;
		currentStep = 0;
	}

	function goToPractice() {
		if (activeMode === 'thien') goto('/meditate');
		else if (activeMode === 'hanhdao') goto('/praying');
		else goto('/mokugyo');
	}

	let currentGuide = $derived(guides[activeMode]);
</script>

<div class="min-h-screen bg-[#F7F3F0] pb-20">
	<!-- Header -->
	<header class="px-6 pt-8 pb-4 text-center">
		<h1 class="font-serif text-2xl font-light text-[#3D3028] tracking-wide">Hướng dẫn</h1>
		<p class="text-[#3D3028]/50 text-sm mt-1">Hành trình tích công đức</p>
	</header>

	<!-- Mode tabs -->
	<div class="px-6 mb-4">
		<div class="flex bg-[#EDE8E3]/60 rounded-2xl p-1">
			{#each Object.entries(guides) as [key, guide]}
				<button
					onclick={() => selectMode(key as GuideMode)}
					class="flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all {activeMode === key ? `bg-white text-[${guide.color}] shadow-sm` : 'text-[#3D3028]/50'}"
					style="color: {activeMode === key ? guide.color : undefined}"
				>
					{guide.title}
				</button>
			{/each}
		</div>
	</div>

	<!-- Progress indicator -->
	<div class="px-6 mb-4">
		<div class="flex items-center justify-center gap-2">
			{#each currentGuide.steps as step, i}
				<button
					onclick={() => currentStep = i}
					class="h-1.5 rounded-full transition-all duration-300 {i <= currentStep ? '' : 'bg-[#E8E0D8]'}"
					style="width: {i <= currentStep ? '24px' : '12px'}; background-color: {i <= currentStep ? currentGuide.color : undefined}"
				></button>
			{/each}
		</div>
	</div>

	<!-- Main content -->
	<div class="px-6">
		<!-- Step card -->
		<div class="bg-[#EDE8E3]/60 rounded-3xl p-6 mb-6">
			<!-- Step number -->
			<div class="flex items-center justify-center gap-2 mb-4">
				<span class="text-sm font-medium" style="color: {currentGuide.color}">
					Bước {currentGuide.steps[currentStep].step}
				</span>
				<span class="text-[#3D3028]/20">•</span>
				<span class="text-[#3D3028]/50 text-sm">
					{currentStep + 1}/{currentGuide.steps.length}
				</span>
			</div>
			
			<!-- Title -->
			<h2 class="font-serif text-xl text-[#3D3028] text-center mb-3">
				{currentGuide.steps[currentStep].title}
			</h2>
			
			<!-- Description -->
			<p class="text-[#3D3028]/70 text-center leading-relaxed">
				{currentGuide.steps[currentStep].description}
			</p>
			
			<!-- Tip -->
			<div 
				class="mt-4 px-4 py-3 rounded-xl"
				style="background-color: {currentGuide.color}15"
			>
				<p 
					class="text-sm text-center"
					style="color: {currentGuide.color}"
				>
					💡 {currentGuide.steps[currentStep].tip}
				</p>
			</div>
		</div>

		<!-- Navigation buttons -->
		<div class="flex gap-3">
			{#if currentStep > 0}
				<button
					onclick={() => currentStep--}
					class="flex-1 py-3 px-4 bg-[#EDE8E3] rounded-xl text-[#3D3028] font-medium"
				>
					Quay lại
				</button>
			{:else}
				<button
					onclick={() => goto('/dashboard')}
					class="flex-1 py-3 px-4 bg-[#EDE8E3] rounded-xl text-[#3D3028] font-medium"
				>
					Đóng
				</button>
			{/if}
			
			{#if currentStep < currentGuide.steps.length - 1}
				<button
					onclick={() => currentStep++}
					class="flex-1 py-3 px-4 rounded-xl text-white font-medium transition-colors"
					style="background-color: {currentGuide.color}"
				>
					Tiếp tục
				</button>
			{:else}
				<button
					onclick={goToPractice}
					class="flex-1 py-3 px-4 rounded-xl text-white font-medium transition-colors"
					style="background-color: {currentGuide.color}"
				>
					Bắt đầu
				</button>
			{/if}
		</div>

		<!-- Practice card -->
		<div class="mt-6 bg-[#EDE8E3]/40 rounded-2xl p-5 text-center">
			<div class="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style="background-color: {currentGuide.color}20">
				{#if activeMode === 'thien'}
					<svg class="w-8 h-8" style="color: {currentGuide.color}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="8" r="4"/>
						<path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
					</svg>
				{:else if activeMode === 'hanhdao'}
					<svg class="w-8 h-8" style="color: {currentGuide.color}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M12 2L12 6"/>
						<path d="M12 18L12 22"/>
						<circle cx="12" cy="12" r="4"/>
						<path d="M4.93 4.93L7.76 7.76"/>
						<path d="M16.24 16.24L19.07 19.07"/>
						<path d="M2 12L6 12"/>
						<path d="M18 12L22 12"/>
					</svg>
				{:else}
					<svg class="w-8 h-8" style="color: {currentGuide.color}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<ellipse cx="12" cy="14" rx="8" ry="6"/>
						<path d="M12 8V6"/>
						<ellipse cx="12" cy="5" rx="3" ry="2"/>
					</svg>
				{/if}
			</div>
			<p class="text-[#3D3028]/60 text-sm">
				{currentGuide.title} • {currentGuide.subtitle}
			</p>
		</div>
	</div>
</div>

<style>
	.font-serif {
		font-family: 'Playfair Display', Georgia, serif;
	}
</style>
