import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { account_to, value, name } = await request.json();

		if (!account_to || !value || !name) {
			return json({ error: 'Missing required parameters' }, { status: 400 });
		}

		// เรียก API จาก server-side เพื่อหลีกเลี่ยง CORS
		const response = await fetch('https://apiplatform.ghbank.co.th/genqr/GenQR/QRDisplayByMicro', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				account_to: account_to,
				value: value,
				name: name
			})
		});

		if (!response.ok) {
			return json({ error: 'Failed to generate QR code' }, { status: response.status });
		}

		const html = await response.text();
		
		// แยก base64 image จาก HTML โดยดึงทั้ง <img> tag
		try {
			// หา <img> tag ที่มี src เป็น base64 และดึงทั้ง tag
			const imgPattern = /<img[^>]*src\s*=\s*"data:image\/[^"]*"[^>]*>/i;
			const imgMatch = html.match(imgPattern);
			
			if (!imgMatch) {
				throw new Error('Cannot find base64 image in response');
			}
			
			const imgTag = imgMatch[0];

			return json({ 
				success: true,
				qrCodeUrl: imgTag, // ส่งทั้ง <img> tag กลับไป
				account: account_to,
				amount: value,
				name: name
			});
		} catch (parseError) {
			console.error('Error parsing HTML response:', parseError);
			return json({ error: 'Failed to parse QR code from response' }, { status: 500 });
		}
	} catch (error) {
		console.error('Error in generate-qr API:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
