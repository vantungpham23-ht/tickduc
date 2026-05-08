import { K as attr, f as sanitize_props, m as spread_props, p as slot } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as Icon } from "../../../chunks/Icon.js";
import { t as Arrow_left } from "../../../chunks/arrow-left.js";
import "../../../chunks/supabase.js";
//#region node_modules/lucide-svelte/dist/icons/user.svelte
function User($$renderer, $$props) {
	Icon($$renderer, spread_props([
		{ name: "user" },
		sanitize_props($$props),
		{
			/**
			* @component @name User
			* @description Lucide SVG icon component, renders SVG Element with children.
			*
			* @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgMjF2LTJhNCA0IDAgMCAwLTQtNEg5YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user
			* @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
			*
			* @param {Object} props - Lucide icons props and any valid SVG attribute
			* @returns {FunctionalComponent} Svelte component
			*
			*/
			iconNode: [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", {
				"cx": "12",
				"cy": "7",
				"r": "4"
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
//#region src/routes/setup-profile/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let dharmaName = "";
		$$renderer.push(`<div class="min-h-screen bg-zen-cream flex flex-col"><header class="px-4 py-4"><button class="p-2 rounded-full hover:bg-zen-brown/5 transition-colors">`);
		Arrow_left($$renderer, { class: "w-6 h-6 text-zen-brown" });
		$$renderer.push(`<!----></button></header> <main class="flex-1 flex flex-col items-center justify-center px-6 py-8"><div class="w-full max-w-md text-center stagger-children"><div class="mb-8"><div class="w-20 h-20 mx-auto rounded-full bg-zen-gold/10 flex items-center justify-center">`);
		User($$renderer, {
			class: "w-10 h-10 text-zen-gold",
			strokeWidth: 1.5
		});
		$$renderer.push(`<!----></div></div> <h1 class="font-serif text-3xl md:text-4xl font-semibold text-zen-brown mb-3 svelte-1eff89a">Nhập Pháp Danh</h1> <p class="text-zen-brown/60 mb-10 max-w-sm mx-auto">Pháp danh là tên gọi trong hành trình tâm linh của bạn</p> <div class="relative mb-8"><input type="text" placeholder="Nhập pháp danh của bạn"${attr("value", dharmaName)} class="w-full px-6 py-5 bg-zen-cream border-2 border-zen-gold/30 rounded-3xl text-zen-brown text-center text-xl placeholder:text-zen-brown/30 focus:outline-none focus:border-zen-gold focus:ring-4 focus:ring-zen-gold/20 transition-all focus-visible:ring-2 focus-visible:ring-zen-gold/30 focus-visible:ring-offset-2"/></div> <button${attr("disabled", !dharmaName.trim(), true)} class="w-full py-4 bg-zen-brown text-zen-cream rounded-2xl font-medium text-lg transition-all duration-300 hover:bg-zen-brown/90 hover:shadow-lg hover:shadow-zen-brown/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`Tiếp tục`);
		$$renderer.push(`<!--]--></button></div></main> <div class="fixed inset-0 overflow-hidden pointer-events-none"><div class="absolute top-1/4 left-10 w-32 h-32 bg-zen-gold/5 rounded-full blur-3xl"></div> <div class="absolute bottom-1/4 right-10 w-48 h-48 bg-zen-gold/5 rounded-full blur-3xl"></div></div></div>`);
	});
}
//#endregion
export { _page as default };
