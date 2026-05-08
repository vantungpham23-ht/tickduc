import { K as attr, l as head } from "../../chunks/dev.js";
//#region src/lib/assets/favicon.svg
var favicon_default = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='128'%20height='128'%20viewBox='0%200%20128%20128'%3e%3cdefs%3e%3clinearGradient%20id='lotusGradient'%20x1='0%25'%20y1='0%25'%20x2='100%25'%20y2='100%25'%3e%3cstop%20offset='0%25'%20style='stop-color:%23C5A059'/%3e%3cstop%20offset='100%25'%20style='stop-color:%233D3028'/%3e%3c/linearGradient%3e%3c/defs%3e%3ccircle%20cx='64'%20cy='64'%20r='60'%20fill='%23F7F3F0'/%3e%3cg%20transform='translate(64,%2060)'%3e%3c!--%20Lotus%20petals%20--%3e%3cpath%20d='M0,-35%20C-15,-25%20-25,-5%20-25,15%20C-25,30%20-10,40%200,45%20C10,40%2025,30%2025,15%20C25,-5%2015,-25%200,-35'%20fill='url(%23lotusGradient)'%20opacity='0.9'/%3e%3cpath%20d='M0,-35%20C-15,-25%20-25,-5%20-25,15%20C-25,30%20-10,40%200,45%20C10,40%2025,30%2025,15%20C25,-5%2015,-25%200,-35'%20fill='url(%23lotusGradient)'%20opacity='0.9'%20transform='rotate(72)'/%3e%3cpath%20d='M0,-35%20C-15,-25%20-25,-5%20-25,15%20C-25,30%20-10,40%200,45%20C10,40%2025,30%2025,15%20C25,-5%2015,-25%200,-35'%20fill='url(%23lotusGradient)'%20opacity='0.9'%20transform='rotate(144)'/%3e%3cpath%20d='M0,-35%20C-15,-25%20-25,-5%20-25,15%20C-25,30%20-10,40%200,45%20C10,40%2025,30%2025,15%20C25,-5%2015,-25%200,-35'%20fill='url(%23lotusGradient)'%20opacity='0.9'%20transform='rotate(216)'/%3e%3cpath%20d='M0,-35%20C-15,-25%20-25,-5%20-25,15%20C-25,30%20-10,40%200,45%20C10,40%2025,30%2025,15%20C25,-5%2015,-25%200,-35'%20fill='url(%23lotusGradient)'%20opacity='0.9'%20transform='rotate(288)'/%3e%3c!--%20Center%20--%3e%3ccircle%20cx='0'%20cy='5'%20r='12'%20fill='%23C5A059'/%3e%3c/g%3e%3c/svg%3e";
//#endregion
//#region src/routes/+layout.svelte
function _layout($$renderer, $$props) {
	let { children } = $$props;
	head("12qhfyh", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Tích Công Đức</title>`);
		});
		$$renderer.push(`<link rel="icon"${attr("href", favicon_default)}/> <meta name="description" content="Ứng dụng tích lũy công đức"/> <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>`);
	});
	children($$renderer);
	$$renderer.push(`<!---->`);
}
//#endregion
export { _layout as default };
