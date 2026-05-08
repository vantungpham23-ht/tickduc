import { n as onDestroy } from "../../../chunks/index-server.js";
import { J as escape_html, K as attr, c as ensure_array_like, h as stringify, o as derived, r as attr_style } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import "../../../chunks/supabase.js";
import "@mediapipe/tasks-vision";
//#region src/routes/praying/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let videoElement;
		let prayerProgress = 0;
		let toastTimeout;
		const PRAYING_DURATION = 10;
		function stopCamera() {
			if (videoElement?.srcObject) {
				videoElement.srcObject.getTracks().forEach((track) => track.stop());
				videoElement.srcObject = null;
			}
		}
		let remainingSeconds = derived(() => Math.ceil(PRAYING_DURATION * (1 - prayerProgress / 100)));
		let progressPercent = derived(() => prayerProgress);
		let particles = [];
		onDestroy(() => {
			stopCamera();
			clearTimeout(toastTimeout);
		});
		$$renderer.push(`<div class="fixed inset-0 bg-black flex flex-col svelte-1pyn5o7"><div class="fixed inset-0 z-30 pointer-events-none overflow-hidden svelte-1pyn5o7"><!--[-->`);
		const each_array = ensure_array_like(particles);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let particle = each_array[$$index];
			$$renderer.push(`<div class="absolute svelte-1pyn5o7"${attr_style(` left: ${stringify(particle.x)}%; top: ${stringify(particle.y)}%; animation: fall linear infinite; animation-duration: ${stringify(10 + Math.random() * 5)}s; animation-delay: ${stringify(particle.delay)}s; opacity: 0.4; `)}>`);
			if (particle.type === "petal") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<svg${attr("width", particle.size)}${attr("height", particle.size)} viewBox="0 0 24 24"${attr_style(`transform: rotate(${stringify(particle.rotation)}deg)`)} class="svelte-1pyn5o7"><ellipse cx="12" cy="12" rx="6" ry="10" fill="#E8DCC8" transform="rotate(-15 12 12)" class="svelte-1pyn5o7"></ellipse></svg>`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`<svg${attr("width", particle.size)}${attr("height", particle.size)} viewBox="0 0 24 24"${attr_style(`transform: rotate(${stringify(particle.rotation)}deg)`)} class="svelte-1pyn5o7"><path d="M12 2C8 6 4 10 4 14c0 4 4 6 8 6s8-2 8-6c0-4-4-8-8-12z" fill="#9CAF88" opacity="0.7" class="svelte-1pyn5o7"></path></svg>`);
			}
			$$renderer.push(`<!--]--></div>`);
		}
		$$renderer.push(`<!--]--></div> <div class="absolute inset-0 svelte-1pyn5o7"><video class="absolute inset-0 w-full h-full object-cover z-0 svelte-1pyn5o7" style="transform: scaleX(-1);" playsinline="" muted="" autoplay=""></video> <canvas class="absolute inset-0 w-full h-full z-10 pointer-events-none svelte-1pyn5o7"${attr("width", 1280)}${attr("height", 720)} style="transform: scaleX(-1);"></canvas> <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-20 pointer-events-none svelte-1pyn5o7"></div></div> <header class="relative z-30 px-4 pt-6 pb-4 flex items-center justify-between svelte-1pyn5o7"><button class="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors svelte-1pyn5o7"><svg class="w-5 h-5 text-white svelte-1pyn5o7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7" class="svelte-1pyn5o7"></path></svg></button> <h1 class="font-serif text-lg text-white font-light tracking-wide svelte-1pyn5o7">Hành Đạo</h1> <div class="w-10 svelte-1pyn5o7"></div></header> <main class="relative z-30 flex-1 flex flex-col items-center justify-end pb-24 px-6 svelte-1pyn5o7"><div class="text-center mb-6 svelte-1pyn5o7"><p class="text-white/60 text-sm tracking-wide mb-2 svelte-1pyn5o7">${escape_html("Chờ tay...")}</p> <p class="font-serif text-6xl text-white tracking-wide tabular-nums svelte-1pyn5o7">${escape_html(remainingSeconds())}s</p></div> <div class="w-64 svelte-1pyn5o7"><div class="h-1 bg-white/20 rounded-full overflow-hidden svelte-1pyn5o7"><div class="h-full rounded-full transition-all duration-1000 bg-[#C5A059] svelte-1pyn5o7"${attr_style(`width: ${stringify(progressPercent())}%`)}></div></div></div> <div class="text-center mt-4 svelte-1pyn5o7"><p class="text-white/50 text-sm svelte-1pyn5o7">Chắp 2 tay trước ngực trong 10 giây</p></div></main> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="absolute inset-0 flex items-center justify-center z-40 bg-black/80 svelte-1pyn5o7"><div class="text-center svelte-1pyn5o7"><div class="w-16 h-16 mx-auto mb-4 rounded-full border border-white/20 svelte-1pyn5o7" style="animation: pulse 2s ease-in-out infinite;"></div> <p class="text-white/60 text-sm tracking-wide svelte-1pyn5o7">Đang khởi tạo camera...</p></div></div>`);
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
