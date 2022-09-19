import db from '../../libs/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { origin, originType, destination, destinationType, weight, courier } = req.body;

    const data = {
        origin, 
        originType, 
        destination, 
        destinationType, 
        weight, 
        courier
    }

    const response = await fetch('https://pro.rajaongkir.com/api/cost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            key: '6e959447893a850b5402628a2221fdbf'
        },
        body: JSON.stringify(data),
    })

    const result = await response.json()

    res.status(200).json({
        message: 'api cost!',
        data: result
    });
}