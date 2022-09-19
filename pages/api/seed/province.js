import db from '../../../libs/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const response = await fetch(process.env.API_URL+'/api/province', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            key: process.env.API_KEY
        },
    })

    const result = await response.json()

    const data = result.rajaongkir.results

    data.forEach(async row => {
        const province = await db('provinces').where({ id: row.province_id }).first();
        if (!province) {
            await db('provinces').insert({
                id: row.province_id,
                province: row.province,
            });
        }
        if (province) {
            await db('provinces')
                .where({ id: row.province_id })
                .update({
                    province: row.province,
                })
        }
    });

    res.status(200).json({
        message: 'Seed API successfully!',
    });
}