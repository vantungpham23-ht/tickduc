

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.Bd_AOONL.js","_app/immutable/chunks/B90iauH_.js","_app/immutable/chunks/BMRk7WTg.js"];
export const stylesheets = ["_app/immutable/assets/0.fDg2PpkI.css"];
export const fonts = [];
