import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { account } = await request.json();

		if (!account) {
			return json({ error: 'Account number is required' }, { status: 400 });
		}

		// เรียก API จาก server-side เพื่อหลีกเลี่ยง CORS
		const response = await fetch('https://apiplatform.ghbank.co.th/genqr/GenQR/VerifyAccountByQRNoSSN', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				account: account
			})
		});

		if (!response.ok) {
			return json({ error: 'Failed to fetch loan details' }, { status: response.status });
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		console.error('Error in loan-details API:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
