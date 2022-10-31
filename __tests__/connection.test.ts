import { Database } from '../src/core/database'

test('Connection', async () => {

    const db = new Database()

    const sql = 'SELECT 1=1 as test'

    const [data] = await db.query(sql)

    expect(1).toBe(data.test)

})