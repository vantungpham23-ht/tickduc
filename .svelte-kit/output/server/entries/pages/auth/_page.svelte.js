import "../../../chunks/index-server.js";
import { J as escape_html, K as attr, f as sanitize_props, m as spread_props, p as slot } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Arrow_left } from "../../../chunks/arrow-left.js";
import { t as Eye } from "../../../chunks/eye.js";
import "../../../chunks/supabase.js";
//#region node_modules/lucide-svelte/dist/icons/lock.svelte
function Lock($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "lock" },
		sanitize_props($$props),
		{
			/**
			* @component @name Lock
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTEiIHg9IjMiIHk9IjExIiByeD0iMiIgcnk9IjIiIC8+CiAgPHBhdGggZD0iTTcgMTFWN2E1IDUgMCAwIDEgMTAgMHY0IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/lock
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["rect", {
				"width": "18",
				"height": "11",
				"x": "3",
				"y": "11",
				"rx": "2",
				"ry": "2"
			}], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]],
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
//#region node_modules/lucide-svelte/dist/icons/mail.svelte
function Mail($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "mail" },
		sanitize_props($$props),
		{
			/**
			* @component @name Mail
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjIgNy04Ljk5MSA1LjcyN2EyIDIgMCAwIDEtMi4wMDkgMEwyIDciIC8+CiAgPHJlY3QgeD0iMiIgeT0iNCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjE2IiByeD0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/mail
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", {
				"x": "2",
				"y": "4",
				"width": "20",
				"height": "16",
				"rx": "2"
			}]],
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
//#region src/routes/auth/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let email = "";
		let password = "";
		let isLoading = false;
		$$renderer.push(`<div class="min-h-screen bg-zen-cream flex flex-col relative">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <header class="px-4 py-4"><button class="p-2 rounded-full hover:bg-zen-brown/5 transition-colors">`);
		Arrow_left($$renderer, { class: "w-6 h-6 text-zen-brown" });
		$$renderer.push(`<!----></button></header> <main class="flex-1 flex flex-col items-center justify-center px-6 py-8"><div class="w-full max-w-md stagger-children"><div class="text-center mb-10"><h1 class="font-serif text-3xl md:text-4xl font-semibold text-zen-brown mb-2 svelte-1s728sz">Chào mừng</h1> <p class="text-zen-brown/60">Tích lũy công đức mỗi ngày</p></div> <form class="space-y-4"><div class="relative"><input type="email" placeholder="Email"${attr("value", email)} class="w-full px-4 py-4 pl-12 bg-zen-cream border border-zen-brown/10 rounded-2xl text-zen-brown placeholder:text-zen-brown/40 focus:outline-none focus:border-zen-gold focus:ring-2 focus:ring-zen-gold/20 transition-all focus-visible:ring-2 focus-visible:ring-zen-gold/30 focus-visible:ring-offset-2"/> `);
		Mail($$renderer, { class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zen-brown/30" });
		$$renderer.push(`<!----></div> <div class="relative"><input${attr("type", "password")} placeholder="Mật khẩu"${attr("value", password)} class="w-full px-4 py-4 pl-12 pr-12 bg-zen-cream border border-zen-brown/10 rounded-2xl text-zen-brown placeholder:text-zen-brown/40 focus:outline-none focus:border-zen-gold focus:ring-2 focus:ring-zen-gold/20 transition-all focus-visible:ring-2 focus-visible:ring-zen-gold/30 focus-visible:ring-offset-2"/> `);
		Lock($$renderer, { class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zen-brown/30" });
		$$renderer.push(`<!----> <button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60 transition-colors">`);
		$$renderer.push("<!--[-1-->");
		Eye($$renderer, { class: "w-5 h-5" });
		$$renderer.push(`<!--]--></button></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button type="submit"${attr("disabled", isLoading, true)} class="w-full py-4 bg-zen-brown text-zen-cream rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-zen-brown/90 hover:shadow-lg hover:shadow-zen-brown/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`${escape_html("Đăng nhập")}`);
		$$renderer.push(`<!--]--></button></form> <div class="mt-4 text-center"><button type="button" class="text-zen-brown/60 hover:text-zen-brown text-sm transition-colors">${escape_html("Chưa có tài khoản? Đăng ký")}</button></div> <div class="mt-6 text-center"><button type="button" class="text-zen-brown/50 hover:text-zen-brown/70 text-sm transition-colors">Tiếp tục với tư cách Khách</button></div> <div class="mt-12 text-center"><p class="text-zen-brown/30 text-xs">Tích Công Đức v1.0.0</p></div></div></main></div>`);
	});
}
//#endregion
export { _page as default };
