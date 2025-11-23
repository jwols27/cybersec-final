// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				email: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace google.accounts.id {
		function initialize(
			options: {
				client_id: string;
				use_fedcm_for_prompt?: boolean;
				callback: (response: GoogleCredentialResponse) => void;
			},
		): void;
		function prompt(): void;
	}
}

export { };
