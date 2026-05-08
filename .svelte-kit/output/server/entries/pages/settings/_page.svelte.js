import { J as escape_html, K as attr, h as stringify, n as attr_class } from "../../../chunks/dev.js";
import "../../../chunks/navigation.js";
import { t as Eye } from "../../../chunks/eye.js";
import { t as BottomNav } from "../../../chunks/BottomNav.js";
//#region src/routes/settings/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let selectedAvatar = [
			{
				id: "lotus",
				label: "Hoa sen",
				color: "bg-pink-50"
			},
			{
				id: "sun",
				label: "Mặt trời",
				color: "bg-amber-50"
			},
			{
				id: "moon",
				label: "Trăng",
				color: "bg-indigo-50"
			},
			{
				id: "star",
				label: "Sao",
				color: "bg-yellow-50"
			},
			{
				id: "leaf",
				label: "Lá",
				color: "bg-green-50"
			},
			{
				id: "flame",
				label: "Lửa",
				color: "bg-orange-50"
			}
		][0];
		let currentPassword = "";
		let newPassword = "";
		let confirmPassword = "";
		let isChangingPassword = false;
		$$renderer.push(`<div class="min-h-screen bg-zen-cream pb-24"><header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10"><div class="px-6 py-4 flex items-center gap-3"><button class="w-10 h-10 rounded-full hover:bg-zen-brown/5 flex items-center justify-center transition-colors"><svg class="w-5 h-5 text-zen-brown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg></button> <h1 class="text-xl font-serif font-bold text-zen-brown">Cài đặt</h1></div></header> <div class="px-4 pt-6 space-y-4"><div class="bg-white rounded-2xl shadow-sm overflow-hidden"><div class="px-4 py-4 border-b border-zen-brown/10"><h2 class="font-semibold text-zen-brown">Avatar Phật pháp</h2></div> <div class="p-4"><div class="flex items-center gap-4 mb-4"><button class="relative"><div${attr_class(`w-16 h-16 rounded-full ${stringify(selectedAvatar.color)} flex items-center justify-center shadow-md border-2 border-zen-gold/50 hover:scale-105 transition-transform`)}>`);
		if (selectedAvatar.id === "lotus") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<svg class="w-8 h-8 text-zen-brown/60" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="24" cy="42" rx="5" ry="2.5"></ellipse><path d="M24 38 C24 38 19 32 19 26 C19 20 24 14 24 14 C24 14 29 20 29 26 C29 32 24 38 24 38"></path><path d="M19 34 C15 28 12 24 12 20 C12 16 17 14 21 16"></path><path d="M29 34 C33 28 36 24 36 20 C36 16 31 14 27 16"></path></svg>`);
		} else if (selectedAvatar.id === "sun") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<svg class="w-8 h-8 text-zen-brown/60" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"></circle><path d="M24 8v6M24 34v6M8 24h6M34 24h6"></path></svg>`);
		} else if (selectedAvatar.id === "moon") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<svg class="w-8 h-8 text-zen-brown/60" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M36 24c0-8.284-5.716-15-13-15-1.126 0-2.218.14-3.26.4C25.1 11.2 29 16 29 21.5c0 5.5-3.9 10.3-9.26 12.1 1.04.26 2.13.4 3.26.4 7.284 0 13-6.716 13-15z"></path></svg>`);
		} else if (selectedAvatar.id === "star") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<svg class="w-8 h-8 text-zen-brown/60" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8l4.9 10 11 1.6-8 7.8 1.9 11-9.8-5.2-9.8 5.2 1.9-11-8-7.8 11-1.6z"></path></svg>`);
		} else if (selectedAvatar.id === "leaf") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<svg class="w-8 h-8 text-zen-brown/60" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 36 C12 24 20 12 36 12 C36 12 36 36 24 36 C18 36 12 36 12 36"></path><path d="M12 36 C20 32 28 24 36 12"></path></svg>`);
		} else if (selectedAvatar.id === "flame") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<svg class="w-8 h-8 text-zen-brown/60" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 44 C16 36 12 28 12 22 C12 14 18 8 24 8 C24 8 24 14 28 14 C32 14 36 18 36 24 C36 28 34 32 32 34 C30 36 26 38 24 44"></path></svg>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-zen-gold rounded-full flex items-center justify-center"><svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></button> <div><p class="font-medium text-zen-brown">${escape_html(selectedAvatar.label)}</p> <p class="text-sm text-zen-brown/50">Nhấn để thay đổi</p></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div></div> <div class="bg-white rounded-2xl shadow-sm overflow-hidden"><div class="px-4 py-4 border-b border-zen-brown/10"><h2 class="font-semibold text-zen-brown">Đổi mật khẩu</h2></div> <form class="p-4 space-y-4"><div><label class="block text-sm font-medium text-zen-brown/70 mb-1.5">Mật khẩu hiện tại</label> <div class="relative"><input${attr("type", "password")}${attr("value", currentPassword)} placeholder="Nhập mật khẩu hiện tại" class="w-full px-4 py-3 rounded-xl border border-zen-brown/20 bg-zen-linen/50 focus:outline-none focus:ring-2 focus:ring-zen-gold/50 focus:border-zen-gold transition-all text-zen-brown placeholder:text-zen-brown/30"/> <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60">`);
		$$renderer.push("<!--[-1-->");
		Eye($$renderer, {
			class: "w-5 h-5",
			strokeWidth: 1.5
		});
		$$renderer.push(`<!--]--></button></div></div> <div><label class="block text-sm font-medium text-zen-brown/70 mb-1.5">Mật khẩu mới</label> <div class="relative"><input${attr("type", "password")}${attr("value", newPassword)} placeholder="Ít nhất 6 ký tự" class="w-full px-4 py-3 rounded-xl border border-zen-brown/20 bg-zen-linen/50 focus:outline-none focus:ring-2 focus:ring-zen-gold/50 focus:border-zen-gold transition-all text-zen-brown placeholder:text-zen-brown/30"/> <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60">`);
		$$renderer.push("<!--[-1-->");
		Eye($$renderer, {
			class: "w-5 h-5",
			strokeWidth: 1.5
		});
		$$renderer.push(`<!--]--></button></div></div> <div><label class="block text-sm font-medium text-zen-brown/70 mb-1.5">Xác nhận mật khẩu mới</label> <div class="relative"><input${attr("type", "password")}${attr("value", confirmPassword)} placeholder="Nhập lại mật khẩu mới" class="w-full px-4 py-3 rounded-xl border border-zen-brown/20 bg-zen-linen/50 focus:outline-none focus:ring-2 focus:ring-zen-gold/50 focus:border-zen-gold transition-all text-zen-brown placeholder:text-zen-brown/30"/> <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-zen-brown/40 hover:text-zen-brown/60">`);
		$$renderer.push("<!--[-1-->");
		Eye($$renderer, {
			class: "w-5 h-5",
			strokeWidth: 1.5
		});
		$$renderer.push(`<!--]--></button></div></div> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> `);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <button type="submit"${attr("disabled", isChangingPassword, true)} class="w-full py-3.5 bg-zen-gold text-white font-semibold rounded-xl hover:bg-zen-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
		$$renderer.push("<!--[-1-->");
		$$renderer.push(`Cập nhật mật khẩu`);
		$$renderer.push(`<!--]--></button></form></div> <div class="bg-zen-brown/5 rounded-2xl p-4"><p class="text-sm text-zen-brown/60 text-center">Các cài đặt khác sẽ sớm được cập nhật</p></div></div> `);
		BottomNav($$renderer, { currentRoute: "/profile" });
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _page as default };
