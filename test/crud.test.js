const Database = require('../dist/core/database').default
const ObjectDB = require('../dist/index').default

require('dotenv').config()

describe('CRUD', () => {

    test('Connection', async () => {

        let db = new Database()

        let sql = 'SELECT 1=1 as test'

        let [data] = await db.query(sql)

        expect(1).toBe(data.test)

    })

    test('Create', async () => {

        let { Hotel } = await ObjectDB()

        let { error, result } = await Hotel.add({ id: 1, name: 'Hotel Barcelona 2' })

        expect(error).toBe(undefined)

    })

    test('Read', async () => {

        let { Hotel } = await ObjectDB()

        let { error, result } = await Hotel.get({ where: { name: 'Hotel Barcelona 2' } })

        expect(error).toBe(undefined)

    })

    test('Update', async () => {

        let { Hotel } = await ObjectDB()

        let { error, result } = await Hotel.update(1, { name: 'Hotel Barcelona' })

        expect(error).toBe(undefined)

    })

    test('IsExist', async () => {

        let { Hotel } = await ObjectDB()

        let result = await Hotel.isExist({ name: 'Hotel Barcelona' })

        expect(result).toBe(true)

    })

    test('Delete', async () => {

        let { Hotel } = await ObjectDB()

        let { error, result } = await Hotel.remove(1)

        expect(error).toBe(undefined)

    })

    test('Count', async () => {

        let { Hotel } = await ObjectDB()

        let result = await Hotel.count()

        expect(result).toBe(0)

    })

    test('IsNotExist', async () => {

        let { Hotel } = await ObjectDB()

        let result = await Hotel.isExist({ name: 'Hotel Barcelona' })

        expect(result).toBe(false)

    })
})
