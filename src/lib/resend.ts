import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResendClient(): Resend {
	if (_resend) return _resend;
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		// In development it's useful to allow the app to run without the key.
		// Throwing here will make the original behavior explicit; callers can
		// choose to catch and handle the absence of an API key.
		throw new Error(
			"Missing RESEND_API_KEY. Set process.env.RESEND_API_KEY or provide a key in your environment. See https://resend.com/docs"
		);
	}
	_resend = new Resend(apiKey);
	return _resend;
}
