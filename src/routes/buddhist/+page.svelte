<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface Quote {
		text: string;
		source: string;
	}

	const quotes: Quote[] = [
		{
			text: "Nếu bạn yêu thương mà không gây ra hận quả, bạn đã hiểu ý nghĩa của sự vắng lặng.",
			source: "Đức Phật"
		},
		{
			text: "Đừng sống trong quá khứ, đừng mơ về tương lai, trí tuệ là sống trong hiện tại.",
			source: "Đức Phật"
		},
		{
			text: "Kẻ thù không thể nào là kẻ thù vĩnh viễn, cũng như người bạn không thể nào là bạn vĩnh viễn. Vạn vật đều vô thường.",
			source: "Đức Phật"
		},
		{
			text: "Hạnh phúc không phải là điều có sẵn, nó xuất phát từ chính hành động của bạn.",
			source: "Đức Phật"
		},
		{
			text: "Người không vướng bận danh lợi, khen hay chê đều bình đẳng, đó mới là người giác ngộ.",
			source: "Đức Phật"
		},
		{
			text: "Mọi khổ đau đều sinh ra từ tham lam, sân hận, si mê. Mọi hạnh phúc đều sinh ra từ từ, biết đủ.",
			source: "Đức Phật"
		},
		{
			text: "Người hiểu biết không nói nhiều, người nói nhiều không có trí tuệ thực sự.",
			source: "Đức Phật"
		},
		{
			text: "Sự thật chỉ là một, nhưng có vô số con đường dẫn đến nó.",
			source: "Đức Phật"
		},
		{
			text: "Hãy để tâm bạn như mặt hồ tĩnh lặng, nhìn thẳng vào bản chất của sự vật.",
			source: "Thiền Tông"
		},
		{
			text: "Ngồi yên, không làm gì, mùa xuân đến, cỏ tự nhiên mọc.",
			source: "Thiền Tông"
		},
		{
			text: "Nước trong thì không có cá, người tâm không khổ thì không phiền não.",
			source: "Thiền Tông"
		},
		{
			text: "Khi bạn buông bỏ được tất cả, bạn sẽ nhận ra điều kỳ diệu nhất.",
			source: "Thiền Tông"
		},
		{
			text: "Tâm như gương sáng, phản chiếu tất cả mà không dính bụi bẩn.",
			source: "Kinh Phật"
		},
		{
			text: "Người có tâm từ bi như ao nước mát mẻ, nuôi dưỡng tất cả chúng sinh.",
			source: "Kinh Phật"
		},
		{
			text: "Một hạt giống nhỏ có thể biến núi non thành rừng rậm, một lời ác có thể phá hủy cả cuộc đời.",
			source: "Kinh Phật"
		},
		{
			text: "Người tu hành không phải để trốn tránh cuộc sống, mà để hiểu và sống tốt hơn.",
			source: "Thiền Sư"
		},
		{
			text: "Khi bạn thức tỉnh, những thứ từng khiến bạn khổ sẽ không còn quan trọng nữa.",
			source: "Thiền Tông"
		},
		{
			text: "Con đường ngắn nhất đến hạnh phúc là quay về bên trong, tìm lại chính mình.",
			source: "Đức Phật"
		},
		{
			text: "Nếu bạn biết đủ, bạn sẽ luôn có đủ. Nếu bạn tham lam, ngàn vàng chưa đủ.",
			source: "Đức Phật"
		},
		{
			text: "Hãy là ánh sáng cho chính mình, đừng chờ đợi ai thắp sáng cho bạn.",
			source: "Kinh Phật"
		},
		{
			text: "Sự giận dữ sinh ra sự hối hận, sự bình yên sinh ra hạnh phúc vĩnh cửu.",
			source: "Đức Phật"
		},
		{
			text: "Người không sợ chết là kẻ đã tìm được ý nghĩa cuộc sống.",
			source: "Thiền Tông"
		},
		{
			text: "Mỗi ngày là một cơ hội để bắt đầu lại, để trở nên tốt đẹp hơn.",
			source: "Đức Phật"
		},
		{
			text: "Tâm an thì cảnh an. Tâm loạn thì cảnh loạn.",
			source: "Thiền Tông"
		},
		{
			text: "Cho đi không mất, giữ lại không được, hà tất phải tham lam.",
			source: "Kinh Phật"
		},
		{
			text: "Người thông minh hiểu người, người trí tuệ hiểu mình.",
			source: "Đức Phật"
		},
		{
			text: "Im lặng không phải là yếu đuối, đó là sức mạnh của người biết kiềm chế.",
			source: "Thiền Tông"
		},
		{
			text: "Mọi thứ rồi sẽ qua đi, hãy tận hưởng khoảnh khắc hiện tại.",
			source: "Đức Phật"
		},
		{
			text: "Khi tâm bạn rộng lớn như đại dương, mọi khổ đau đều tan biến.",
			source: "Kinh Phật"
		},
		{
			text: "Hãy đi con đường của từ bi, nơi đó có hạnh phúc đích thực.",
			source: "Đức Phật"
		}
	];

	let currentQuote = $state<Quote | null>(null);

	function getDailyQuote(): Quote {
		const today = new Date();
		const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
		return quotes[dayOfYear % quotes.length];
	}

	function getFormattedDate(): string {
		const today = new Date();
		const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
		return today.toLocaleDateString('vi-VN', options);
	}

	onMount(() => {
		currentQuote = getDailyQuote();
	});
</script>

<div class="min-h-screen bg-[#F7F3F0] pb-20">
	<!-- Header -->
	<header class="relative px-6 pt-8 pb-6 text-center">
		<h1 class="font-serif text-2xl font-light text-[#3D3028] tracking-wide">Kinh Phật</h1>
		<p class="text-[#3D3028]/50 text-sm mt-1">{getFormattedDate()}</p>
	</header>

	<!-- Main content -->
	<div class="px-6">
		{#if currentQuote}
			<div class="bg-[#EDE8E3]/60 rounded-3xl p-8 relative">
				<div class="absolute top-4 left-4 text-6xl text-[#C5A059]/10 font-serif leading-none select-none">"</div>
				
				<div class="relative pt-4">
					<p class="font-serif text-lg text-[#3D3028] leading-relaxed italic">
						{currentQuote.text}
					</p>
					
					<div class="mt-6 flex items-center gap-3">
						<div class="w-8 h-px bg-[#C5A059]/30"></div>
						<p class="text-[#C5A059] text-sm font-medium">{currentQuote.source}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Daily reminder -->
		<div class="mt-8 text-center">
			<p class="text-[#3D3028]/40 text-sm">Mỗi ngày một lời kinh mới</p>
		</div>
	</div>
</div>
