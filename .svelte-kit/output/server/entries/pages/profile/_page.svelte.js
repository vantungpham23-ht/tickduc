import "../../../chunks/index-server.js";
import { J as escape_html, c as ensure_array_like, f as sanitize_props, h as stringify, m as spread_props, n as attr_class, p as slot } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Arrow_left } from "../../../chunks/arrow-left.js";
import "../../../chunks/supabase.js";
import { t as BottomNav } from "../../../chunks/BottomNav.js";
//#region node_modules/lucide-svelte/dist/icons/sparkles.svelte
function Sparkles($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "sparkles" },
		sanitize_props($$props),
		{
			/**
			* @component @name Sparkles
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEuMDE3IDIuODE0YTEgMSAwIDAgMSAxLjk2NiAwbDEuMDUxIDUuNTU4YTIgMiAwIDAgMCAxLjU5NCAxLjU5NGw1LjU1OCAxLjA1MWExIDEgMCAwIDEgMCAxLjk2NmwtNS41NTggMS4wNTFhMiAyIDAgMCAwLTEuNTk0IDEuNTk0bC0xLjA1MSA1LjU1OGExIDEgMCAwIDEtMS45NjYgMGwtMS4wNTEtNS41NThhMiAyIDAgMCAwLTEuNTk0LTEuNTk0bC01LjU1OC0xLjA1MWExIDEgMCAwIDEgMC0xLjk2Nmw1LjU1OC0xLjA1MWEyIDIgMCAwIDAgMS41OTQtMS41OTR6IiAvPgogIDxwYXRoIGQ9Ik0yMCAydjQiIC8+CiAgPHBhdGggZD0iTTIyIDRoLTQiIC8+CiAgPGNpcmNsZSBjeD0iNCIgY3k9IjIwIiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sparkles
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [
				["path", { "d": "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" }],
				["path", { "d": "M20 2v4" }],
				["path", { "d": "M22 4h-4" }],
				["circle", {
					"cx": "4",
					"cy": "20",
					"r": "2"
				}]
			],
			children: ($$renderer) => {
				$$renderer.push(`<!--[-->`);
				slot($$renderer, $$props, "default", {}, null);
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		}
	]));
}
//#endregion
//#region src/routes/profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let avatarEmoji = "";
		const avatarOptions = [
			{
				id: "lotus",
				label: "Hoa sen"
			},
			{
				id: "sun",
				label: "Mặt trời"
			},
			{
				id: "moon",
				label: "Trăng"
			},
			{
				id: "star",
				label: "Sao"
			},
			{
				id: "leaf",
				label: "Lá"
			},
			{
				id: "flame",
				label: "Lửa"
			}
		];
		$$renderer.push(`<div class="min-h-screen bg-zen-cream pb-24"><header class="px-6 py-6"><div class="flex items-center justify-between"><h1 class="font-serif text-2xl font-semibold text-zen-brown svelte-maq4gq">Cá nhân</h1> <button class="p-2 rounded-full hover:bg-zen-brown/5 transition-colors">`);
		Arrow_left($$renderer, {
			class: "w-6 h-6 text-zen-brown",
			strokeWidth: 1.5
		});
		$$renderer.push(`<!----></button></div></header> <main class="px-6"><div class="bg-zen-parchment rounded-3xl p-8 shadow-sm text-center mb-6"><div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-zen-gold to-zen-brown flex items-center justify-center mb-4 shadow-lg shadow-zen-gold/20">`);
		if (avatarEmoji === "lotus" || avatarEmoji === "") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="42" rx="5" ry="2.5"></ellipse><path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"></path><path d="M19 34 C15 28 12 24 12 20 C12 16 17 14 21 16"></path><path d="M29 34 C33 28 36 24 36 20 C36 16 31 14 27 16"></path></svg>`);
		} else if (avatarEmoji === "sun") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"></circle><path d="M24 8v6M24 34v6M8 24h6M34 24h6M12.5 12.5l4.2 4.2M31.3 31.3l4.2 4.2M35.5 12.5l-4.2 4.2M16.7 31.3l-4.2 4.2"></path></svg>`);
		} else if (avatarEmoji === "moon") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M36 24c0-8.284-5.716-15-13-15-1.126 0-2.218.14-3.26.4C25.1 11.2 29 16 29 21.5c0 5.5-3.9 10.3-9.26 12.1 1.04.26 2.13.4 3.26.4 7.284 0 13-6.716 13-15z"></path></svg>`);
		} else if (avatarEmoji === "star") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8l4.9 10 11 1.6-8 7.8 1.9 11-9.8-5.2-9.8 5.2 1.9-11-8-7.8 11-1.6z"></path></svg>`);
		} else if (avatarEmoji === "leaf") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36 C12 24 20 12 36 12 C36 12 36 36 24 36 C18 36 12 36 12 36"></path><path d="M12 36 C20 32 28 24 36 12"></path></svg>`);
		} else if (avatarEmoji === "flame") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 44 C16 36 12 28 12 22 C12 14 18 8 24 8 C24 8 24 14 28 14 C32 14 36 18 36 24 C36 28 34 32 32 34 C30 36 26 38 24 44"></path></svg>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <h2 class="font-serif text-2xl font-semibold text-zen-brown mb-2 svelte-maq4gq">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span class="opacity-50">...</span>`);
		$$renderer.push(`<!--]--></h2> <div class="flex items-center justify-center gap-2 text-zen-gold">`);
		Sparkles($$renderer, {
			class: "w-5 h-5",
			strokeWidth: 1.5
		});
		$$renderer.push(`<!----> <span class="font-semibold">`);
		$$renderer.push("<!--[0-->");
		$$renderer.push(`<span class="opacity-50">...</span>`);
		$$renderer.push(`<!--]--></span> <span class="text-zen-brown/50">công đức</span></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <div class="bg-zen-parchment rounded-3xl p-6 shadow-sm"><h3 class="font-serif text-lg font-semibold text-zen-brown mb-4 text-center svelte-maq4gq">Đổi Avatar</h3> <div class="grid grid-cols-3 gap-4"><!--[-->`);
		const each_array = ensure_array_like(avatarOptions);
		for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
			let option = each_array[$$index];
			$$renderer.push(`<button${attr_class(`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${stringify(avatarEmoji === option.id ? "bg-zen-gold text-zen-cream" : "bg-zen-linen hover:bg-zen-brown/10")}`)}>`);
			if (option.id === "lotus") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="42" rx="5" ry="2.5"></ellipse><path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"></path><path d="M19 34 C15 28 12 24 12 20 C12 16 17 14 21 16"></path><path d="M29 34 C33 28 36 24 36 20 C36 16 31 14 27 16"></path></svg>`);
			} else if (option.id === "sun") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"></circle><path d="M24 8v6M24 34v6M8 24h6M34 24h6M12.5 12.5l4.2 4.2M31.3 31.3l4.2 4.2M35.5 12.5l-4.2 4.2M16.7 31.3l-4.2 4.2"></path></svg>`);
			} else if (option.id === "moon") {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M36 24c0-8.284-5.716-15-13-15-1.126 0-2.218.14-3.26.4C25.1 11.2 29 16 29 21.5c0 5.5-3.9 10.3-9.26 12.1 1.04.26 2.13.4 3.26.4 7.284 0 13-6.716 13-15z"></path></svg>`);
			} else if (option.id === "star") {
				$$renderer.push("<!--[3-->");
				$$renderer.push(`<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8l4.9 10 11 1.6-8 7.8 1.9 11-9.8-5.2-9.8 5.2 1.9-11-8-7.8 11-1.6z"></path></svg>`);
			} else if (option.id === "leaf") {
				$$renderer.push("<!--[4-->");
				$$renderer.push(`<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36 C12 24 20 12 36 12 C36 12 36 36 24 36 C18 36 12 36 12 36"></path><path d="M12 36 C20 32 28 24 36 12"></path></svg>`);
			} else if (option.id === "flame") {
				$$renderer.push("<!--[5-->");
				$$renderer.push(`<svg class="w-10 h-10" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 44 C16 36 12 28 12 22 C12 14 18 8 24 8 C24 8 24 14 28 14 C32 14 36 18 36 24 C36 28 34 32 32 34 C30 36 26 38 24 44"></path></svg>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--> <span class="text-xs mt-2">${escape_html(option.label)}</span></button>`);
		}
		$$renderer.push(`<!--]--></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<div class="mt-6"><button class="w-full py-3 bg-zen-linen text-zen-brown-warm rounded-xl font-medium hover:bg-zen-brown/10 transition-colors flex items-center justify-center gap-2"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16,17 21,12 16,7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Đăng xuất</button></div>`);
		$$renderer.push(`<!--]--></main> <div class="text-center mt-8 text-zen-brown/30 text-sm"><p>Tích Công Đức v1.0.0</p></div></div> `);
		BottomNav($$renderer, { currentRoute: "/profile" });
		$$renderer.push(`<!---->`);
	});
}
//#endregion
export { _page as default };
