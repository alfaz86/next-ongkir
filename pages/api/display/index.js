import db from '../../../libs/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const display = await db('display').first();

    res.status(200).json({
        message: 'display data',
        data: display
    });
}