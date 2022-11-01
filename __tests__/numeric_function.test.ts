import db from '../src'
import { model } from '../src/core/type'

describe('NUMERIC FUNCTION', () => {

    let handlerHotel: model

    const listHotel = [
        { id: 1, name: 'Hotel Barcelona 2', capacity: 30, location: 'Barcelona' },
        { id: 2, name: 'Catalonia Sagrada Familia', capacity: 20, location: 'Sagrada familia' },
        { id: 3, name: 'NH Barcelona Diagonal Center', capacity: 10, location: 'Barcelona' },
        { id: 4, name: 'Apartments - Suite Place Barcelona', capacity: 0, location: 'Barecelona' }
    ]

    beforeAll(async () => {

        const { Hotel, on } = await db()

        handlerHotel = Hotel

        await handlerHotel.add(listHotel)
    })


    test('[ FUNCTION -> SUM ] sin where', async () => {

        const { result: [hotel] } = await handlerHotel.sum('capacity')

        expect(hotel.total).toBe(60)

    })

    test('[ FUNCTION -> SUM ] con where', async () => {

        const { result: [hotel] } = await handlerHotel.sum('capacity', { where: { location: 'Barcelona' } })

        expect(hotel.total).toBe(40)

    })

    test('[ FUNCTION -> AVG ] ', async () => {

        const { result: [hotel] } = await handlerHotel.avg('capacity')

        expect(hotel.total).toBe(15)

    })

    test('[ FUNCTION -> MIN ] ', async () => {

        const { result: [hotel] } = await handlerHotel.min('capacity')

        expect(hotel.total).toBe(0)

    })

    test('[ FUNCTION -> MAX ] ', async () => {

        const { result: [hotel] } = await handlerHotel.max('capacity')

        expect(hotel.total).toBe(30)

    })


    afterAll(async () => {
        await handlerHotel.remove(1)
        await handlerHotel.remove(2)
        await handlerHotel.remove(3)
        await handlerHotel.remove(4)
    })
})