import { n as onDestroy } from "../../../chunks/index-server.js";
import { J as escape_html, h as stringify, n as attr_class, o as derived, r as attr_style } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import "../../../chunks/supabase.js";
import "@mediapipe/tasks-vision";
//#region src/routes/mokugyo/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let videoElement;
		let sessionCount = 0;
		let isTapping = false;
		let toastTimeout;
		function stopCamera() {
			if (videoElement?.srcObject) {
				videoElement.srcObject.getTracks().forEach((track) => track.stop());
				videoElement.srcObject = null;
			}
		}
		let progressPercent = derived(() => sessionCount % 108 / 108 * 100);
		let remainingTaps = derived(() => 108 - sessionCount % 108);
		onDestroy(() => {
			stopCamera();
			clearTimeout(toastTimeout);
		});
		$$renderer.push(`<div class="min-h-screen bg-[#F7F3F0] relative overflow-hidden flex flex-col svelte-5bm6z2" role="button" tabindex="0"><header class="relative z-30 px-4 pt-6 pb-4 flex items-center justify-between svelte-5bm6z2"><button aria-label="Quay về trang chủ" class="p-2.5 rounded-full bg-[#3D3028]/5 backdrop-blur-md border border-[#3D3028]/10 hover:bg-[#3D3028]/10 transition-colors svelte-5bm6z2"><svg class="w-5 h-5 text-[#3D3028]/70 svelte-5bm6z2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7" class="svelte-5bm6z2"></path></svg></button> <h1 class="font-serif text-lg font-light text-[#3D3028] tracking-wide svelte-5bm6z2">Gõ Mõ Tích Công Đức</h1> <div class="w-10 svelte-5bm6z2"></div></header> <main class="flex-1 flex flex-col items-center justify-center px-6 py-8 svelte-5bm6z2"><div class="text-center mb-8 animate-fade-in-up svelte-5bm6z2"><p class="text-[#3D3028]/60 text-sm tracking-wide mb-1 svelte-5bm6z2">Hôm nay đã gõ</p> <p class="font-serif text-4xl text-[#3D3028] tracking-wide svelte-5bm6z2"><span class="text-[#C5A059] svelte-5bm6z2">${escape_html(sessionCount % 108)}</span> / 108 cốc</p></div> <div class="w-full max-w-xs mb-12 animate-fade-in-up svelte-5bm6z2" style="animation-delay: 0.1s;"><div class="h-1 bg-[#3D3028]/10 rounded-full overflow-hidden svelte-5bm6z2"><div class="h-full rounded-full transition-all duration-300 ease-out bg-gradient-to-r from-[#C5A059] to-[#B8944D] svelte-5bm6z2"${attr_style(`width: ${stringify(progressPercent())}%`)}></div></div> `);
		if (remainingTaps() > 0 && remainingTaps() < 108) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-center text-[#3D3028]/40 text-xs mt-2 tracking-wide svelte-5bm6z2">Còn ${escape_html(remainingTaps())} cốc để được +1 công đức</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="relative flex items-center justify-center svelte-5bm6z2">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div${attr_class("absolute w-48 h-48 rounded-full bg-[#C5A059]/10 blur-2xl transition-opacity duration-300 svelte-5bm6z2", void 0, {
			"opacity-100": isTapping,
			"opacity-30": true
		})}></div> <div${attr_class("relative transition-transform duration-100 svelte-5bm6z2", void 0, {
			"scale-105": isTapping,
			"scale-100": true
		})}><svg viewBox="0 0 200 200"${attr_class("w-48 h-48 md:w-56 md:h-56 transition-transform duration-100 svelte-5bm6z2", void 0, { "animate-mokugyo-shake": isTapping })}><defs class="svelte-5bm6z2"><linearGradient id="mokugyoGold" x1="0%" y1="0%" x2="100%" y2="100%" class="svelte-5bm6z2"><stop offset="0%" stop-color="#D4B96A" class="svelte-5bm6z2"></stop><stop offset="50%" stop-color="#C5A059" class="svelte-5bm6z2"></stop><stop offset="100%" stop-color="#A69050" class="svelte-5bm6z2"></stop></linearGradient><filter id="mokugyoShadow" x="-20%" y="-20%" width="140%" height="140%" class="svelte-5bm6z2"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#3D3028" flood-opacity="0.15" class="svelte-5bm6z2"></feDropShadow></filter></defs><ellipse cx="100" cy="105" rx="70" ry="55" fill="url(#mokugyoGold)" filter="url(#mokugyoShadow)" class="svelte-5bm6z2"></ellipse><path d="M 45 100 Q 60 95 75 100 Q 90 105 100 100 Q 115 95 130 100 Q 145 105 155 100" fill="none" stroke="#A69050" stroke-width="0.5" opacity="0.3" class="svelte-5bm6z2"></path><path d="M 50 115 Q 70 110 90 115 Q 110 120 130 115 Q 145 110 150 115" fill="none" stroke="#A69050" stroke-width="0.5" opacity="0.3" class="svelte-5bm6z2"></path><circle cx="70" cy="95" r="6" fill="#3D3028" opacity="0.7" class="svelte-5bm6z2"></circle><circle cx="130" cy="95" r="6" fill="#3D3028" opacity="0.7" class="svelte-5bm6z2"></circle><circle cx="68" cy="93" r="2" fill="#F7F3F0" opacity="0.5" class="svelte-5bm6z2"></circle><circle cx="128" cy="93" r="2" fill="#F7F3F0" opacity="0.5" class="svelte-5bm6z2"></circle><path d="M 85 115 Q 100 125 115 115" fill="none" stroke="#3D3028" stroke-width="2" stroke-linecap="round" opacity="0.6" class="svelte-5bm6z2"></path><ellipse cx="100" cy="55" rx="25" ry="15" fill="url(#mokugyoGold)" class="svelte-5bm6z2"></ellipse><ellipse cx="95" cy="50" rx="12" ry="6" fill="#D4B96A" opacity="0.5" class="svelte-5bm6z2"></ellipse><ellipse cx="55" cy="100" rx="15" ry="30" fill="#D4B96A" opacity="0.3" class="svelte-5bm6z2"></ellipse></svg></div></div> <div class="mt-12 text-center animate-fade-in-up svelte-5bm6z2" style="animation-delay: 0.2s;"><p class="text-[#3D3028]/50 text-sm tracking-wide svelte-5bm6z2">Chạm màn hình để gõ mõ</p> <p class="text-[#3D3028]/30 text-xs mt-4 svelte-5bm6z2">💡 Tap anywhere to tap the mokugyo</p></div></main> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="absolute inset-0 flex items-center justify-center z-20 bg-[#F7F3F0]/90 backdrop-blur-sm svelte-5bm6z2"><div class="text-center svelte-5bm6z2"><div class="relative w-16 h-16 mx-auto mb-4 svelte-5bm6z2"><div class="absolute inset-0 rounded-full border border-[#C5A059]/20 animate-ping svelte-5bm6z2" style="animation-duration: 3s;"></div> <div class="absolute inset-2 rounded-full border border-[#C5A059]/30 animate-pulse svelte-5bm6z2" style="animation-duration: 2s;"></div> <div class="absolute inset-4 rounded-full bg-[#C5A059]/20 svelte-5bm6z2"></div></div> <p class="text-[#3D3028]/60 text-sm tracking-wide svelte-5bm6z2">Đang khởi tạo...</p></div></div>`);
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
