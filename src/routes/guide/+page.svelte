<script lang="ts">
	import { goto } from '$app/navigation';

	type GuideMode = 'thien' | 'hanhdao' | 'gomo';
	let activeMode = $state<GuideMode>('thien');
	let currentStep = $state(0);

	const guides = {
		thien: {
			title: 'Thiền', subtitle: 'Tĩnh tâm mỗi ngày', color: '#6B8E6B',
			steps: [
				{ title: 'Chuẩn bị', description: 'Tìm nơi yên tĩnh, ngồi trên ghế hoặc trải tatami. Giữ lưng thẳng, thư giãn vai.', tip: 'Nên thiền vào sáng sớm hoặc tối muộn' },
				{ title: 'Mở camera', description: 'Bật camera để ứng dụng theo dõi tư thế của bạn. Đặt điện thoại sao cho thấy rõ 2 tay.', tip: 'Đặt điện thoại cách bạn khoảng 1-2 mét' },
				{ title: 'Tư thế thiền', description: 'Đặt 2 tay lên 2 đầu gối, lòng bàn tay hướng lên trên. Thư giãn, mắt nhắm nhẹ.', tip: 'Đảm bảo 2 tay đều nằm trong khung hình camera' },
				{ title: 'Thiền 10 phút', description: 'Hít thở đều đặn, tập trung vào hơi thở. Đếm thầm từ 1 đến 10 rồi lặp lại.', tip: 'Nếu tay di chuyển, đếm sẽ dừng và bạn cần đặt tay lại' },
				{ title: 'Nhận công đức', description: 'Sau 10 phút thiền, bạn sẽ được cộng 1 công đức. Nhạc thiền sẽ phát khi đang thiền.', tip: 'Thiền đều đặn mỗi ngày để tích lũy công đức' }
			]
		},
		hanhdao: {
			title: 'Hành Đạo', subtitle: 'Chắp tay tụng kinh', color: '#B8860B',
			steps: [
				{ title: 'Chuẩn bị', description: 'Đứng hoặc ngồi thẳng lưng. Hai tay đặt trước ngực, khuyu nhẹ đầu xuống.', tip: 'Nên thực hiện trước bàn thờ hoặc nơi trang nghiêm' },
				{ title: 'Mở camera', description: 'Bật camera để ứng dụng theo dõi 2 tay của bạn. Đặt điện thoại sao cho thấy rõ 2 bàn tay.', tip: 'Đảm bảo ánh sáng đủ để camera nhận diện tay' },
				{ title: 'Chắp tay', description: 'Hai lòng bàn tay chạm nhau, các ngón tay khép chặt, đặt trước ngực. Giữ tư thế này.', tip: 'Hai tay cần gần nhau để ứng dụng nhận diện' },
				{ title: 'Giữ 10 giây', description: 'Duy trì tư thế chắp tay trong 10 giây. Đọc thầm: "Nam mô A Di Đà Phật" hoặc tên Đức Phật bạn mến.', tip: 'Nếu 2 tay tách ra, đếm sẽ bắt đầu lại' },
				{ title: 'Nhận công đức', description: 'Sau 10 giây, bạn được +1 công đức. Tiếng mõ sẽ vang lên xác nhận.', tip: 'Có thể thực hiện nhiều lần liên tiếp' }
			]
		},
		gomo: {
			title: 'Gõ Mõ', subtitle: 'Tụng kinh 108 lần', color: '#6B8E6B',
			steps: [
				{ title: 'Chuẩn bị', description: 'Tìm nơi yên tĩnh. Bạn có thể ngồi thiền hoặc đứng trước bàn thờ.', tip: 'Chuẩn bị tràng hạt để đếm nếu muốn' },
				{ title: 'Mở ứng dụng', description: 'Gõ Mõ không cần camera. Chỉ cần mở ứng dụng và bắt đầu gõ.', tip: 'Có thể thực hiện ở bất kỳ đâu' },
				{ title: 'Gõ mõ', description: 'Nhấn vào mõ trên màn hình. Mỗi lần gõ = 1 lần tụng kinh.', tip: 'Gõ đều nhịp, không quá nhanh hay quá chậm' },
				{ title: 'Đếm 108', description: 'Gõ đủ 108 lần để hoàn thành 1 chuỗi tụng kinh. Đọc thầm: "Nam mô Phật Thích Ca Mâu Ni" mỗi lần gõ.', tip: '108 là con số thiêng liêng trong Phật giáo' },
				{ title: 'Nhận công đức', description: 'Khi đạt 108 lần gõ, bạn được +1 công đức. Tiếng mõ sẽ vang lên nhiều hơn để chúc mừng.', tip: 'Có thể tụng nhiều chuỗi liên tiếp' }
			]
		}
	};

	let currentGuide = $derived(guides[activeMode]);

	function selectMode(mode: GuideMode) { activeMode = mode; currentStep = 0; }
	function goToPractice() {
		if (activeMode === 'thien') goto('/meditate');
		else if (activeMode === 'hanhdao') goto('/praying');
		else goto('/mokugyo');
	}
</script>

<div class="min-h-screen pb-20 relative overflow-hidden" style="background-color: #F9F8F6;">
	<div class="fixed inset-0 overflow-hidden pointer-events-none">
		<div class="absolute top-0 right-0 w-80 h-80 bg-[#B8860B]/5 rounded-full blur-3xl"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-[#6B8E6B]/5 rounded-full blur-3xl"></div>
	</div>

	<header class="relative px-6 pt-8 pb-4 text-center z-10">
		<h1 class="font-serif text-2xl font-medium text-[#1A1918]">Hướng dẫn</h1>
		<p class="text-[#7A7573] text-base mt-1">Hành trình tích công đức</p>
	</header>

	<div class="px-6 mb-4 z-10 relative">
		<div class="flex rounded-xl p-1 shadow-sm" style="background: white; border: 1px solid #E8E5E2;">
			{#each Object.entries(guides) as [key, guide]}
				<button onclick={() => selectMode(key as GuideMode)}
					class="flex-1 py-3 px-3 rounded-lg text-sm font-medium transition-all duration-300 {activeMode === key ? 'text-white shadow-sm' : 'text-[#7A7573] hover:text-[#1A1918]'}"
					style={activeMode === key ? `background: ${guide.color};` : ''}>
					{guide.title}
				</button>
			{/each}
		</div>
	</div>

	<div class="px-6 mb-4 z-10 relative">
		<div class="flex items-center justify-center gap-2">
			{#each currentGuide.steps as _, i}
				<button onclick={() => currentStep = i}
					class="h-1 rounded-full transition-all duration-500 {i === currentStep ? 'w-6' : 'w-2'} {i <= currentStep ? 'bg-[#B8860B]' : 'bg-[#E8E5E2]'}">
				</button>
			{/each}
		</div>
	</div>

	<div class="px-6 z-10 relative">
		<div class="rounded-2xl p-6 mb-6 shadow-sm" style="background: white; border: 1px solid #E8E5E2;">
			<div class="flex items-center justify-center gap-2 mb-4">
				<span class="text-sm font-medium" style="color: {currentGuide.color}">Bước {currentStep + 1}</span>
				<span class="text-[#D0CCC8]">•</span>
				<span class="text-[#A8A3A0] text-sm">{currentStep + 1}/{currentGuide.steps.length}</span>
			</div>

			<h2 class="font-serif text-xl text-[#1A1918] text-center mb-3 font-medium">{currentGuide.steps[currentStep].title}</h2>
			<p class="text-[#4A4543] text-base text-center leading-relaxed">{currentGuide.steps[currentStep].description}</p>

			<div class="mt-4 px-4 py-3 rounded-xl border" style="background: {currentGuide.color}08; border-color: {currentGuide.color}20;">
				<p class="text-sm text-center" style="color: {currentGuide.color}">{currentGuide.steps[currentStep].tip}</p>
			</div>
		</div>

		<div class="flex gap-3">
			<button onclick={() => currentStep > 0 ? currentStep-- : goto('/dashboard')}
				class="flex-1 py-4 px-4 rounded-xl shadow-sm text-[#4A4543] text-base font-medium hover:bg-[#F5F4F2] transition-colors"
				style="background: white; border: 1px solid #E8E5E2;">
				{currentStep > 0 ? 'Quay lại' : 'Đóng'}
			</button>
			<button onclick={() => currentStep < currentGuide.steps.length - 1 ? currentStep++ : goToPractice()}
				class="flex-1 py-4 px-4 rounded-xl text-base font-medium transition-colors shadow-lg"
				style="background: {currentGuide.color}; color: white;">
				{currentStep < currentGuide.steps.length - 1 ? 'Tiếp tục' : 'Bắt đầu'}
			</button>
		</div>

		<div class="mt-6 rounded-2xl p-5 text-center shadow-sm" style="background: #F5F4F2; border: 1px solid #E8E5E2;">
			<p class="text-[#7A7573] text-base">{currentGuide.title} • {currentGuide.subtitle}</p>
		</div>
	</div>
</div>
