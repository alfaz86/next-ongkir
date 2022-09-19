import db from '../../../libs/db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).end();

    const { name, detail } = req.body;

    const update = await db('display').where({ id: 1 }).update({
        name, 
        detail: JSON.stringify(detail)
    })

    const updatedData = await db('display').where({ id: 1 }).first();

    res.status(200);
    res.json({
        message: 'display updated successfully!',
        data: updatedData
    });
}