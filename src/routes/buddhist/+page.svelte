<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, RefreshCw } from 'lucide-svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
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
			text: "Mọi khổ đau đều sinh ra từ tham lam, sân hận, si mê. Mọi hạnh phúc đều sinh ra t�ý từ từ, biết đủ.",
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
	let isAnimating = $state(false);

	function getDailyQuote(): Quote {
		const today = new Date();
		const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
		return quotes[dayOfYear % quotes.length];
	}

	function getRandomQuote(): Quote {
		let randomIndex: number;
		do {
			randomIndex = Math.floor(Math.random() * quotes.length);
		} while (quotes[randomIndex] === currentQuote && quotes.length > 1);
		return quotes[randomIndex];
	}

	function refreshQuote() {
		isAnimating = true;
		setTimeout(() => {
			currentQuote = getRandomQuote();
			isAnimating = false;
		}, 300);
	}

	onMount(() => {
		currentQuote = getDailyQuote();
	});
</script>

<div class="min-h-screen bg-zen-cream pb-24">
	<!-- Background decoration -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden">
		<div class="absolute top-20 left-[10%] w-32 h-32 bg-zen-gold/5 rounded-full blur-3xl animate-float-drift"></div>
		<div class="absolute top-[40%] right-[5%] w-40 h-40 bg-zen-sage/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: 2s;"></div>
		<div class="absolute bottom-[30%] left-[5%] w-36 h-36 bg-zen-rose/5 rounded-full blur-3xl animate-float-drift" style="animation-delay: 4s;"></div>
	</div>

	<!-- Header -->
	<header class="relative px-6 pt-8 pb-6">
		<button 
			onclick={() => goto('/dashboard')}
			class="absolute left-4 top-8 p-2 rounded-full bg-zen-parchment/80 backdrop-blur-sm"
		>
			<ArrowLeft class="w-5 h-5 text-zen-brown" />
		</button>
		
		<div class="text-center">
			<h1 class="font-serif text-2xl font-light text-zen-brown-deep tracking-wide">Kinh Phật</h1>
			<p class="text-zen-brown-warm/60 text-sm mt-1">Lời vàng son mỗi ngày</p>
		</div>
	</header>

	<!-- Main content -->
	<div class="px-6">
		{#if currentQuote}
			<div class="relative">
				<!-- Quote card -->
				<div class="bg-zen-parchment/60 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden transition-all duration-300 {isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}">
					<!-- Decorative quote mark -->
					<div class="absolute top-4 left-4 text-6xl text-zen-gold/10 font-serif leading-none select-none">"</div>
					
					<!-- Lotus decoration -->
					<div class="absolute -right-4 -bottom-4 w-24 h-24 opacity-10">
						<svg viewBox="0 0 80 80" class="w-full h-full text-zen-gold animate-breathe">
							<ellipse cx="40" cy="70" rx="15" ry="5" fill="currentColor"/>
							<path d="M40 55 C40 55 25 40 25 28 C25 16 40 5 40 5 C40 5 55 16 55 28 C55 40 40 55 40 55" fill="currentColor"/>
							<path d="M25 48 C15 35 8 25 8 15 C8 5 22 2 32 8" fill="currentColor"/>
							<path d="M55 48 C65 35 72 25 72 15 C72 5 58 2 48 8" fill="currentColor"/>
						</svg>
					</div>
					
					<div class="relative pt-4">
						<p class="font-serif text-lg text-zen-brown-deep leading-relaxed italic">
							{currentQuote.text}
						</p>
						
						<div class="mt-6 flex items-center gap-3">
							<div class="w-8 h-px bg-zen-gold/30"></div>
							<p class="text-zen-gold text-sm font-medium">{currentQuote.source}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Refresh button -->
			<div class="mt-6 flex justify-center">
				<button
					onclick={refreshQuote}
					class="flex items-center gap-2 px-5 py-2.5 bg-zen-gold/10 rounded-full text-zen-brown-warm hover:bg-zen-gold/20 transition-colors group"
				>
					<RefreshCw class="w-4 h-4 text-zen-gold group-hover:rotate-180 transition-transform duration-500" />
					<span class="text-sm">Đọc câu khác</span>
				</button>
			</div>
		{/if}

		<!-- Daily reminder -->
		<div class="mt-8 bg-zen-sage/10 rounded-2xl p-5">
			<div class="flex items-start gap-4">
				<div class="w-10 h-10 rounded-full bg-zen-sage/20 flex items-center justify-center flex-shrink-0">
					<svg class="w-5 h-5 text-zen-sage" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 6v6l4 2"/>
					</svg>
				</div>
				<div>
					<p class="text-zen-sage font-medium text-sm">Mỗi ngày một lời</p>
					<p class="text-zen-brown-warm/60 text-sm mt-1 leading-relaxed">
						Mỗi ngày bạn sẽ nhận được một câu kinh khác nhau. Hãy suy ngẫm và áp dụng vào cuộc sống.
					</p>
				</div>
			</div>
		</div>

		<!-- Quick actions -->
		<div class="mt-6 grid grid-cols-2 gap-3">
			<button class="bg-zen-parchment/60 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-zen-parchment/80 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-zen-gold/20 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-zen-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
						<path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
					</svg>
				</div>
				<p class="font-medium text-zen-brown-deep text-sm">Đọc kinh</p>
				<p class="text-zen-brown-warm/50 text-xs mt-0.5">Tụng niệm hàng ngày</p>
			</button>
			
			<button class="bg-zen-parchment/60 backdrop-blur-sm rounded-2xl p-4 text-left hover:bg-zen-parchment/80 transition-colors">
				<div class="w-10 h-10 rounded-xl bg-zen-rose/20 flex items-center justify-center mb-3">
					<svg class="w-5 h-5 text-zen-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
					</svg>
				</div>
				<p class="font-medium text-zen-brown-deep text-sm">Yêu thương</p>
				<p class="text-zen-brown-warm/50 text-xs mt-0.5">Trao đi từ bi hỷ xả</p>
			</button>
		</div>
	</div>
</div>

<BottomNav currentRoute="/dashboard" />
