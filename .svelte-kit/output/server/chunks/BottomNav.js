import { J as escape_html, K as attr, c as ensure_array_like, h as stringify, n as attr_class } from "./dev.js";
//#region src/lib/components/BottomNav.svelte
function BottomNav($$renderer, $$props) {
	let { currentRoute } = $$props;
	const navItems = [
		{
			route: "/dashboard",
			label: "Trang chủ"
		},
		{
			route: "/leaderboard",
			label: "Đạo hạnh"
		},
		{
			route: "/profile",
			label: "Cá nhân"
		}
	];
	$$renderer.push(`<nav class="fixed bottom-0 left-0 right-0 bg-[#F7F3F0]/95 backdrop-blur-md border-t border-[#E8E0D8] px-4 py-2 pb-6 z-50"><div class="flex items-center justify-around max-w-md mx-auto"><!--[-->`);
	const each_array = ensure_array_like(navItems);
	for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
		let item = each_array[$$index];
		const isActive = currentRoute === item.route;
		$$renderer.push(`<a${attr("href", item.route)} class="flex flex-col items-center py-2 px-5 min-w-[80px] transition-all duration-300"><div${attr_class(`w-11 h-11 rounded-2xl flex items-center justify-center mb-1 transition-all duration-300 ${stringify(isActive ? "bg-[#C5A059]/15" : "bg-transparent")}`)}>`);
		if (item.route === "/dashboard") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<svg${attr_class(`w-5 h-5 transition-all duration-300 ${stringify(isActive ? "text-[#3D3028] scale-110" : "text-[#3D3028]/40")}`)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`);
		} else if (item.route === "/leaderboard") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<svg${attr_class(`w-5 h-5 transition-all duration-300 ${stringify(isActive ? "text-[#3D3028] scale-110" : "text-[#3D3028]/40")}`)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"></path></svg>`);
		} else if (item.route === "/profile") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<svg${attr_class(`w-5 h-5 transition-all duration-300 ${stringify(isActive ? "text-[#3D3028] scale-110" : "text-[#3D3028]/40")}`)} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <span${attr_class(`text-[11px] tracking-wide transition-all duration-300 ${stringify(isActive ? "text-[#3D3028] font-medium" : "text-[#3D3028]/40")}`)}>${escape_html(item.label)}</span> `);
		if (isActive) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="w-1 h-1 rounded-full bg-[#C5A059] mt-1"></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></a>`);
	}
	$$renderer.push(`<!--]--></div></nav>`);
}
//#endregion
export { BottomNav as t };
