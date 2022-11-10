// Enviorment
const $ = process.env

// Import
import { Database } from './database'
import { Model } from './model'
import { toCamelCase } from './utils'
import { options, models, model } from './type'

export class Build {

    // Cache
    static cache: any = {}

    constructor() { }

    static async syncDatabase(options: options = {}): Promise<models> {

        let schema: string = ''
        let models: models = {}

        if (options?.database) schema = options.database ?? ''

        if (!schema) schema = String($.DB_TABLE)

        // If there is already a cached schema
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
        const db = new Database(options)

        // Get all tables
        const tables: any = await db.query(sql, { schema })

        if (!tables) return models

        const DataBaseInstance = new Database(options)

        // Loop through all tables
        for (let i = 0; i < tables.length; i++) {

            let tableName = toCamelCase(tables[i].TABLE_NAME);

            //Dynamic model generator
            (models[tableName] as model) = await Model.generate({ db: DataBaseInstance, schema, table: tables[i].TABLE_NAME })

        }

        Build.cache[schema] = models

        // Add intance database
        models.db = DataBaseInstance
        models.on = (eventName: string, listener: VoidFunction) => DataBaseInstance.listener(eventName.toLowerCase(), listener)
        models.cleanCache = Build.cleanCache
        models.getCache = Build.getCache

        return models
    }

    private static cleanCache() { Build.cache = {} }

    private static getCache() { return Build.cache }

    static isSchemaExist(schema: string) {
        return typeof schema === 'string' && schema.length === 0
    }

}