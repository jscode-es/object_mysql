import db from '../src'
import { model } from '../src/core/type'

describe('METHODS', () => {

    let hotel: model
    let user: model

    beforeAll(async () => {

        const { Hotel, User, on } = await db()

        on('monitor', (data: any) => console.log(data))

        hotel = Hotel
        user = User
    })

    test('Create', async () => {

        const { result } = await hotel.add({ id: 1, name: 'Hotel Barcelona 2' })

        expect(1).toBe(result.insertId)

    })

    test('IsExist', async () => {

        const result = await hotel.isExist({ name: 'Hotel Barcelona' })

        expect(result).toBe(true)

    })


    test('Count', async () => {

        const result = await hotel.count()

        expect(result).toBe(0)

    })

    test('IsNotExist', async () => {

        const result = await hotel.isExist({ name: 'Hotel Barcelona' })

        expect(result).toBe(false)

    })

    test.skip('Null where', async () => {

        const condition =
        {
            where: {
                name: null
            }
        }

        const result = await user.get(condition)

        console.log(result)

        expect(result.length).toBe(1)

    })

    test.skip('Check functions', async () => {

        const condition =
        {
            where: { id: 1 }
        }

        const { result } = await user.sum('id', condition)

        expect(result[0].total).toBe(1)

    })

    test.skip('INNER JOIN N:N', async () => {


        /* const tables = [
            { hotel, where: { id: 2 }, type: 'left' },
        ]

        const { result } = await user.join(tables, { where: { id: 1 } }) */


        expect(1).toBe(1)

    })

    test.skip('Change schema', async () => {

        const { User } = await db({ database: 'speackme' })

        let { error } = await User.add({
            alias: 'alias',
            email: 'sgonzalez@jscode.com',
            password: 'dads',
            type: '1',
            birthday: '1990-01-21'
        })

        console.log(error)
        /* const { error, result } = await Behaviour.getByAttr('uuid', '23423423')

        console.log({
            result
        }) */

        expect(1).toBe(1)
    })


    test('Delete', async () => {

        const { result } = await hotel.remove(1)

        expect(1).toBe(result.affectedRows)

    })
})