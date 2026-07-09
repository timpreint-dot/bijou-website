export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { name, contact, role, instagram, message } = req.body;

    if (!name || !contact) {
        return res.status(400).json({ error: 'Name and contact are required' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram bot credentials are not set in environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const text = `
🔥 <b>Новая заявка с сайта BIJOU</b>

👤 <b>Имя:</b> ${name}
📞 <b>Связь:</b> ${contact}
🎭 <b>Роль:</b> ${role || 'Не указано'}
📱 <b>Instagram:</b> ${instagram || 'Не указан'}

💬 <b>Сообщение:</b>
${message || 'Без сообщения'}
    `.trim();

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'HTML',
            }),
        });

        const data = await response.json();

        if (data.ok) {
            return res.status(200).json({ success: true });
        } else {
            console.error('Telegram API Error:', data);
            return res.status(500).json({ error: 'Failed to send message to Telegram' });
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
