
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/auth" | "/buddhist" | "/dashboard" | "/guide" | "/leaderboard" | "/meditate" | "/mokugyo" | "/onboarding" | "/praying" | "/profile" | "/profile/level" | "/settings" | "/setup-profile";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/auth": Record<string, never>;
			"/buddhist": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/guide": Record<string, never>;
			"/leaderboard": Record<string, never>;
			"/meditate": Record<string, never>;
			"/mokugyo": Record<string, never>;
			"/onboarding": Record<string, never>;
			"/praying": Record<string, never>;
			"/profile": Record<string, never>;
			"/profile/level": Record<string, never>;
			"/settings": Record<string, never>;
			"/setup-profile": Record<string, never>
		};
		Pathname(): "/" | "/auth" | "/buddhist" | "/dashboard" | "/guide" | "/leaderboard" | "/meditate" | "/mokugyo" | "/onboarding" | "/praying" | "/profile" | "/profile/level" | "/settings" | "/setup-profile";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/bell.mp3" | "/medi.mp3" | "/medi2.mp3" | "/mokugyo.mp3" | "/robots.txt" | string & {};
	}
}