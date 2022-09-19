import db from '../../../libs/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();

    const { q } = req.query;

    const data = await db.select('*').from('cities').join('subdistricts', function () {
        this
            .on('subdistricts.city_id', '=', 'cities.id')
    })
    .where('subdistricts.subdistrict_name', 'like', `%${q}%`)
    .orWhere('cities.city_name', 'like', `%${q}%`)

    res.status(200).json({
        message: 'subdistricts',
        data
    });
}