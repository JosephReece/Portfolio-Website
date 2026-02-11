import { views, type View } from '$lib/view.js';
import { redirect } from '@sveltejs/kit';

export function load({ params }) {
	const { view } = params;

	if (!views.includes(view as View)) {
		throw redirect(302, '/home');
	}

	return { view };
}