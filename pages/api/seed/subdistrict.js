import db from '../../../libs/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const cities = await db('cities');

    cities.forEach( async city => {
        
        if (city.id < 100) {
            
            const response = await fetch(process.env.API_URL + '/api/subdistrict?city=' + city.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    key: process.env.API_KEY
                },
            })
        
            const result = await response.json()
        
            const data = result.rajaongkir.results
        
            data.forEach(async row => {
                const subdistrict = await db('subdistricts').where({ id: row.subdistrict_id }).first();
                if (!subdistrict) {
                    await db('subdistricts').insert({
                        id: row.subdistrict_id,
                        subdistrict_name: row.subdistrict_name,
                        province_id: row.province_id,
                        city_id: row.city_id
                    });
                }
                if (subdistrict) {
                    await db('subdistricts')
                        .where({ id: row.subdistrict_id })
                        .update({
                            subdistrict_name: row.subdistrict_name,
                            province_id: row.province_id,
                            city_id: row.city_id
                        })
                }
            });
            
        }
        
    });

    res.status(200).json({
        message: 'Seed API successfully!',
    });
}