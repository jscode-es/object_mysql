// Enviorment
const $ = process.env

// Import
import Database from './database'
import Model from './model'
import { toCamelCase } from './utils'

export default class Build {

    // Cache
    static cache: any = {}

    static async syncDatabase(schema: string = '') {

        // Model
        let models: any = {}

        // Si ya hay un esquema en cache
        if (Build.cache[schema]) return Build.cache[schema]

        // Define schema
        if (Build.isSchemaExist(schema)) schema = String($.DB_TABLE)

        // Request all tables to schema
        let sql = `
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = :schema`.trim()

        // Define table find
        const tableDefined: string = String($.TABLE_DEFINED)

        if (tableDefined !== 'undefined') {
            let tables = tableDefined.split(',')

            for (const table of tables) {
                sql += ` AND table_name='${table}'`
            }
        }

        // Instance database
        const db = new Database()

        // Get all tables
        let tables: any = await db.query(sql, { schema })

        if (!tables) return models

        // Recorrer todas las tablas
        for (let i = 0; i < tables.length; i++) {

            let tableName = toCamelCase(tables[i].TABLE_NAME)

            //Dynamic model generator
            models[tableName] = await Model.generate(schema, tables[i].TABLE_NAME)

        }

        // Add intance database
        models.db = new Database()

        return models

    }

    static isSchemaExist(schema: string) {
        return typeof schema === 'string' && schema.length === 0
    }
}
