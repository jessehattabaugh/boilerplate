/** @type {NetlifyType} */
const body = 'Hello Netlify';

/**
 * @type {import('@netlify/functions').Handler}
 */
export default async function handler() {
	return { statusCode: 200, body };
}
