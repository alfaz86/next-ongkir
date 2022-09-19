import db from '../../../libs/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const response = await fetch(process.env.API_URL + '/api/city', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            key: process.env.API_KEY
        },
    })

    const result = await response.json()

    const data = result.rajaongkir.results

    data.forEach(async row => {
        const city = await db('cities').where({ id: row.city_id }).first();
        if (!city) {
            await db('cities').insert({
                id: row.city_id,
                city_name: row.city_name,
                type: row.type,
                province_id: row.province_id,
                postal_code: row.postal_code,
            });
        }
        if (city) {
            await db('cities')
                .where({ id: row.city_id })
                .update({
                    city_name: row.city_name,
                    type: row.type,
                    province_id: row.province_id,
                    postal_code: row.postal_code,
                })
        }
    });

    res.status(200).json({
        message: 'Seed API successfully!',
    });
}