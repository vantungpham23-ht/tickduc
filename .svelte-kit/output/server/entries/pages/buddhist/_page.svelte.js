import "../../../chunks/index-server.js";
import { J as escape_html } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
//#region src/routes/buddhist/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		function getFormattedDate() {
			return (/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
		}
		$$renderer.push(`<div class="min-h-screen bg-[#F7F3F0] pb-20"><header class="relative px-6 pt-8 pb-6 text-center"><h1 class="font-serif text-2xl font-light text-[#3D3028] tracking-wide">Kinh Phật</h1> <p class="text-[#3D3028]/50 text-sm mt-1">${escape_html(getFormattedDate())}</p></header> <div class="px-6">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="mt-8 text-center"><p class="text-[#3D3028]/40 text-sm">Mỗi ngày một lời kinh mới</p></div></div></div>`);
	});
}
//#endregion
export { _page as default };
