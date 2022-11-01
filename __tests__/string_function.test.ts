import db from '../src'
import { model } from '../src/core/type'

describe('STRING FUNCTION', () => {

    let handlerHotel: model

    const listHotel = [
        { id: 1, name: ' Hotel Barcelona 2 ', capacity: 30, location: 'Barcelona' },
        { id: 2, name: 'Catalonia Sagrada Familia', capacity: 20, location: 'Sagrada familia' },
        { id: 3, name: 'NH Barcelona Diagonal Center', capacity: 10, location: 'Barcelona' },
        { id: 4, name: 'Apartments - Suite Place Barcelona', capacity: 0, location: 'Barecelona' }
    ]

    beforeAll(async () => {

        const { Hotel, on } = await db()

        handlerHotel = Hotel

        await handlerHotel.add(listHotel)
    })


    test('[ FUNCTION -> ASCII ]', async () => {

        const { result: [hotel] } = await handlerHotel.ascii('name')

        expect(hotel.data).toBe(32)

    })

    test('[ FUNCTION -> CHAR_LENGTH ]', async () => {

        const { result: [hotel] } = await handlerHotel.char_length('name')

        expect(hotel.data).toBe(19)

    })

    test('[ FUNCTION -> LENGTH ]', async () => {

        const { result: [hotel] } = await handlerHotel.length('name')

        expect(hotel.data).toBe(19)

    })

    test('[ FUNCTION -> LOWER ]', async () => {

        const { result: [hotel] } = await handlerHotel.lower('name')

        expect(hotel.data).toBe(' hotel barcelona 2 ')

    })

    test('[ FUNCTION -> TRIM ]', async () => {

        const { result: [hotel] } = await handlerHotel.trim('name')

        expect(hotel.data).toBe('Hotel Barcelona 2')

    })

    test('[ FUNCTION -> LTRIM ]', async () => {

        const { result: [hotel] } = await handlerHotel.ltrim('name')

        expect(hotel.data).toBe('Hotel Barcelona 2 ')

    })

    test('[ FUNCTION -> RTRIM ]', async () => {

        const { result: [hotel] } = await handlerHotel.rtrim('name')

        expect(hotel.data).toBe(' Hotel Barcelona 2')

    })

    test('[ FUNCTION -> REVERSE ]', async () => {

        const { result: [hotel] } = await handlerHotel.reverse('name')

        expect(hotel.data).toBe(' 2 anolecraB letoH ')

    })

    test('[ FUNCTION -> UPPER ]', async () => {

        const { result: [hotel] } = await handlerHotel.upper('name')

        expect(hotel.data).toBe(' HOTEL BARCELONA 2 ')

    })


    afterAll(async () => {
        await handlerHotel.remove(1)
        await handlerHotel.remove(2)
        await handlerHotel.remove(3)
        await handlerHotel.remove(4)
    })
})