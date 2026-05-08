import "../../../chunks/index-server.js";
import "../../../chunks/dev.js";
import "../../../chunks/supabase.js";
import { t as BottomNav } from "../../../chunks/BottomNav.js";
//#region src/routes/leaderboard/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<div class="min-h-screen bg-zen-cream pb-24"><header class="relative px-6 pt-8 pb-6 overflow-hidden"><div class="absolute inset-0 pointer-events-none"><div class="absolute top-0 right-0 w-32 h-32 bg-zen-gold/5 rounded-full blur-3xl"></div> <div class="absolute -bottom-10 left-0 w-40 h-40 bg-zen-sage/5 rounded-full blur-3xl"></div></div> <div class="relative"><h1 class="font-serif text-3xl font-light text-zen-brown-deep tracking-wide">Đạo Hạnh</h1> <p class="text-zen-brown-warm/60 text-sm mt-2">Hành trình tích đức của con</p> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></header> `);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<div class="flex items-center justify-center py-20"><div class="relative"><div class="w-12 h-12 border-2 border-zen-gold/20 border-t-zen-gold rounded-full animate-spin"></div> <div class="absolute inset-0 w-12 h-12 border-2 border-zen-sage/20 border-b-zen-sage rounded-full animate-spin" style="animation-direction: reverse; animation-delay: 0.5s;"></div></div></div>`);
		$$renderer.push(`<!--]--> `);
		BottomNav($$renderer, { currentRoute: "/leaderboard" });
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _page as default };
