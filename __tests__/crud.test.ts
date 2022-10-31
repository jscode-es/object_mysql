import db from '../src'
import { model } from '../src/core/type'

describe('CRUD', () => {

    let hotel: model

    beforeAll(async () => {

        const { Hotel, User } = await db()

        //on('monitor', (data: any) => console.log(data))

        hotel = Hotel
    })

    test('Create', async () => {

        const { result } = await hotel.add({ id: 1, name: 'Hotel Barcelona 2' })

        expect(1).toBe(result.insertId)

    })

    test('Read', async () => {

        const { result: [result] } = await hotel.get({ where: { name: 'Hotel Barcelona 2' } })

        expect(1).toBe(result.id)

    })

    test('Update', async () => {

        const { result } = await hotel.update(1, { name: 'Hotel Barcelona' })

        expect(1).toBe(result.changedRows)

    })

    test('Delete', async () => {

        const { result } = await hotel.remove(1)

        expect(1).toBe(result.affectedRows)

    })


})