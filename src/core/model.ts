// import 
import Validate from "./validate"
import { model, dataGenerate, dataFunction } from "./type"


export class Model {

    // attrs class
    private name: string
    private schema: string
    private attrs: any
    private keys: Array<String>
    private primaryKeys: Array<String>
    private relations: any
    private db: any

    constructor(schema: string, name: string, db: any) {
        this.db = db
        this.schema = schema
        this.name = name
        this.keys = []
        this.primaryKeys = []
        this.relations = []
    }

    // Getters
    getName() { return this.name }
    getSchema() { return this.schema }

    // SET Attrs to model
    setAttrs(attrs: any) { this.attrs = attrs }

    // GET Attrs to model
    async getAttrs() {

        if (!this.keys.length) {

            const { db } = this

            const sql = `SELECT * 
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = '${this.getSchema()}' 
            AND TABLE_NAME = '${this.getName()}'
            ORDER BY ORDINAL_POSITION ASC`

            const items = await db.query(sql)

            let keys: Array<String> = []

            for (const { COLUMN_NAME } of items) {

                keys.push(COLUMN_NAME as any)
            }

            this.keys = keys

            await this.getPrimaryKey()

            return items
        }

        await this.getPrimaryKey()

        return this.keys
    }

    // Get all primary keys
    async getPrimaryKey() {

        if (!this.primaryKeys.length) {

            const { db } = this

            const sql = `SELECT * 
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = '${this.getSchema()}' 
            AND TABLE_NAME = '${this.getName()}'
            AND COLUMN_KEY = 'PRI'
            ORDER BY ORDINAL_POSITION ASC`

            let primaryKeys: Array<String> = []

            const items = await db.query(sql)

            for (const { COLUMN_NAME } of items) {

                primaryKeys.push(COLUMN_NAME as any)
            }

            this.primaryKeys = primaryKeys

            return primaryKeys
        }

        return this.primaryKeys
    }

    getRelations() {

        return this.relations
    }

    async setRelations() {

        const { db } = this

        const sql = `
        SELECT                         
            TABLE_NAME,                           
            COLUMN_NAME,                         
            REFERENCED_TABLE_NAME,                 
            REFERENCED_COLUMN_NAME               
        FROM
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE  
        WHERE
            TABLE_SCHEMA = '${this.getSchema()}'              
            AND REFERENCED_TABLE_NAME IS NOT NULL 
            AND REFERENCED_TABLE_NAME = '${this.getName()}'`

        const relations = await db.query(sql)

        this.relations = relations[0]
    }

    // Model generate
    static async generate({ db, schema, table }: dataGenerate): Promise<model> {
        const model: Model = new Model(schema, table, db)
        const attrs = await Validate.setSchema(model)

        model.setAttrs(attrs)

        await model.setRelations()

        return model
    }

    // ------------------------------------
    // Private method to format
    // ------------------------------------
    private formatIn(_in: any, delWhere: boolean = false) {

        let { keys } = this

        let sql = 'WHERE'

        if (delWhere) sql = ''

        let existKey = false

        for (const key in _in) {

            if (keys.includes(key)) {

                existKey = true

                if (Array.isArray(_in[key])) {

                    sql += ` \`${key}\` IN ( '${_in[key].join('\',\'')}' ) AND`

                }

            } else {
                console.warn(`[ WARN ] This key '${key}', no exist`)
            }
        }

        let regex = /AND$/gm;

        if (regex.test(sql)) {
            sql = sql.slice(0, -4)
        }

        if (!existKey) sql = ''

        return sql
    }

    private formatOrder(order: any) {
        let { keys } = this
        let sql = ' ORDER BY '
        let existKey = false

        for (const key in order) {
            if (keys.includes(key)) {
                existKey = true
                sql += `\`${key}\` ${order[key]},`
            } else {
                console.warn(`[ WARN ] This key '${key}', not exist`)
            }
        }

        let regex = /\,$/gm;

        if (regex.test(sql)) {
            sql = sql.slice(0, -1)
        }

        if (!existKey) sql = ''

        return sql
    }

    private formatValue(value: any): String {

        let { keys } = this

        let existKey = false
        let existFunction = false
        let sql = ''

        if (Array.isArray(value)) {


            for (const key of value) {

                if (keys.includes(key)) {

                    existKey = true

                    sql += `\`${key}\`, `

                } else {

                    const regex = /^([A-z]+)+\(+([\.\,\'\"\s\:\/\\A-z]+)+\)/m;


                    if (regex.test(key)) {

                        existFunction = true

                        let [fun, alias] = key.split(/\):/m)

                        alias = (alias) ? `) AS \`${alias}\`` : ''

                        sql += `${fun}${alias}, `

                    } else {

                        let [attr, alias] = key.split(':')

                        if (keys.includes(attr)) {

                            existKey = true

                            alias = (alias) ? ` AS \`${alias}\`` : ''

                            sql += `\`${attr}\`${alias}, `

                        } else {

                            const regex = /^[\w\s]+\(+[\W\w\s]+\)/gm;

                            if (!regex.test(attr)) {
                                //throw `[ WARN ] This key '${key}', not exist`
                            } else {

                                sql += `${attr} AS \`${alias}\`, `
                            }

                        }

                    }
                }

            }
        }

        let regex = /\,\s$/gm;

        if (regex.test(sql)) {
            sql = sql.slice(0, -2)
        }

        if (!existKey && !existFunction) sql = ''


        return sql
    }

    private formatWhere(where: any, type: string = '=', delWhere: boolean = false) {

        let { keys } = this

        let sql = ' WHERE'

        if (delWhere) sql = ''

        let existKey = false

        for (let key in where) {

            /* let [table,attr] = key.split('.')

            if(attr)
            {
                key = attr
            } */

            if (keys.includes(key)) {

                existKey = true

                if (Array.isArray(where[key])) {

                    let or = ''

                    for (const item of where[key]) {

                        or += `\`${key}\` ${type} '${item}' OR `
                    }

                    sql += ` ( ${or.slice(0, -3)} )`


                } else {

                    let regex = /\)$/m;

                    if (regex.test(sql)) {
                        sql += ' AND'
                    }


                    let typeWhere = `${type} '${where[key]}'`

                    if (where[key] === null || where[key] === 'null') {

                        typeWhere = 'IS NULL'
                    }

                    sql += ` ${this.getName()}.${key} ${typeWhere} AND`



                }

            } else {

                const regex = /\_OR\_/m

                if (regex.test(key)) {

                    let keys = key.split('_OR_') // alias_OR_name ['alias','name']
                    let or = ''

                    for (const item of keys) {

                        if (keys.includes(item)) {
                            existKey = true
                            or += `\`${item}\` LIKE '${where[key]}' OR `
                        }
                    }

                    sql += ` ( ${or.slice(0, -3)} )`

                    continue
                }

                console.warn(`[ WARN ] This key '${key}', not exist`)

            }
        }

        let regex = /AND$/gm;

        if (regex.test(sql)) {
            sql = sql.slice(0, -4)
        }

        if (!existKey) sql = ''

        return sql
    }

    // ------------------------------------
    // Own method to use the databases
    // ------------------------------------

    //TODO: ver que en el array tenga todos la misma cantidad de attributos sino verificar si tiene un valor por defecto
    async add(data: any) {

        if (typeof data !== 'object') return false

        let { attrs } = this

        let result: any = {}
        let error: any = []

        if (!Array.isArray(data)) data = [data]

        const { db } = this

        const sql: string = `INSERT INTO \`${this.getSchema()}\`.\`${this.getName()}\` ( \`${Object.keys(data[0]).join("`,`")}\` ) VALUES ?`

        for (const item of data) {

            let { error: errors } = Validate.check(attrs, item)

            if (errors) error.push(errors)
        }

        if (!error.length) error = false

        const values = data.map((item: any) => Object.values(item))

        let success = await db.query(sql, values, { model: this.getName() })

        result = success

        return { result, error }
    }

    async get(params: any, expresion = '=') {

        let result: any = []
        let error: any = []

        const { db } = this

        let sql = `SELECT * FROM  \`${this.getSchema()}\`.\`${this.getName()}\``

        if (typeof params === 'object') {

            if ('values' in params) {

                let replace: any = this.formatValue(params.values)

                if (replace.length === 0) {
                    replace = '*'
                }

                sql = sql.replace('*', replace)

            }

            if ('where' in params) {
                sql += this.formatWhere(params.where, expresion)
            }

            if ('in' in params) {

                if ('where' in params) {
                    sql += ` AND ${this.formatIn(params.in, true)}`
                } else {
                    sql += this.formatIn(params.in)
                }

            }

            if ('like' in params) {

                if ('where' in params) {
                    sql += ` AND ${this.formatWhere(params.like, 'LIKE', true)}`
                } else {
                    sql += this.formatWhere(params.like, 'LIKE')
                }
            }


            if ('likeOR' in params) {

                if ('where' in params) {
                    sql += ` AND ${this.formatWhere(params.like, 'LIKE', true)}`
                } else {
                    sql += this.formatWhere(params.likeOR, 'LIKE')
                }
            }

            if ('order' in params) {

                sql += this.formatOrder(params.order)

            }

            if ('limit' in params) {
                sql += ` LIMIT ${params.limit}`
            }
        }

        result = await db.query(sql, {}, { model: this.getName() })

        if (!error.length) error = false

        return { result, error }
    }

    async update(find: any, data: any, pk: any = 'id') {

        let result: any = []

        if (typeof data !== 'object') return { result, error: 'This data is not to Object' }

        let where = ''

        if (typeof find === 'number' || typeof find === 'string') {

            let primaryKey = await this.getPrimaryKey()

            if (!primaryKey.includes(pk)) {

                if (primaryKey.length != 0) {
                    console.warn(`[ WARN ] The Primary Key was not found '${pk}', and 'id`)
                    pk = primaryKey[0]
                }
            }

            where += `WHERE ${pk} = :find`

        } else if (typeof find === 'object' && !Array.isArray(find)) {

            where += `WHERE `

            for (const key in find) {

                where += `\`${key}\` = '${find[key]}' AND`
            }

            let regex = /AND$/gm;

            if (regex.test(where)) {
                where = where.slice(0, -4)
            }
        }

        let { attrs } = this

        let { error, value } = Validate.check(attrs, data, false)

        if (!error) {

            const { db } = this

            let set = ''

            for (const key in value) {
                set += `\`${key}\` = '${value[key]}',`
            }

            set = set.slice(0, -1)

            let sql = `UPDATE \`${this.getSchema()}\`.\`${this.getName()}\` SET ${set} ${where}`

            value = Object.assign(value, { find })

            result = await db.query(sql, value, { model: this.getName() })

        }

        if (!error || !error.length) error = false

        return { result, error }
    }

    async remove(id: any, pk: any = 'id') {

        let result: any = []
        let error: any = []

        if (id && typeof id !== 'object') {

            const { db } = this

            let primaryKey = await this.getPrimaryKey()

            if (!primaryKey.includes(pk)) {
                if (primaryKey.length != 0) {
                    console.warn(`[ WARN ] The Primary Key was not found '${pk}', and 'id`)
                    pk = primaryKey[0]
                }
                else
                    return { result: [], error: `This primary key, '${pk}' is not exist` }
            }

            let sql = `
            DELETE FROM \`${this.getSchema()}\`.\`${this.getName()}\` 
            WHERE ${pk} = :id`

            result = await db.query(sql, { id }, { model: this.getName() })

        } else {

            error = 'Required id'
        }

        if (!error.length) error = false

        return { result, error }

    }

    // ------------------------------------
    // Special methods to use the databases
    // ------------------------------------

    check(data: any, required = true) {

        if (typeof data !== 'object') return false

        let { attrs } = this

        return Validate.check(attrs, data, required)
    }

    async getByPk(id: number | string, pk: any = 'id') {

        let primaryKey = await this.getPrimaryKey()

        let where: any = {}

        if (!primaryKey.includes(pk)) {
            if (primaryKey.length != 0) {
                console.warn(`[ WARN ] The Primary Key was not found '${pk}', and 'id`)
                pk = primaryKey[0]
            }
            else
                return { result: [], error: `This primary key, '${pk}' is not exist` }
        }

        where[pk] = id

        let { result, error } = await this.get({ where })

        return { result, error }
    }

    async getByAttr(nameAttr: string, attr: string | number | null, expresion = '=') {

        let where = {
            [nameAttr]: attr
        }

        let { result, error } = await this.get({ where }, expresion)

        return { result, error }
    }

    async count(row: string = '*', params: any = {}) {

        let result: any = 0

        const { db } = this

        let sql = `SELECT COUNT(${row}) AS total FROM \`${this.getName()}\``

        if (typeof params === 'object') {

            if ('where' in params) {
                sql += this.formatWhere(params.where, '=')
            }

            if ('in' in params) {

                if ('where' in params) {
                    sql += ` AND ${this.formatIn(params.in, true)}`
                } else {
                    sql += this.formatIn(params.in)
                }

            }

            if ('like' in params) {

                if ('where' in params) {
                    sql += ` AND ${this.formatWhere(params.like, 'LIKE', true)}`
                } else {
                    sql += this.formatWhere(params.like, 'LIKE')
                }
            }

        }

        result = await db.query(sql, {}, { model: this.getName() })

        return result[0].total
    }

    async getTotal() { return await this.count() }

    async getDataFunction({ attr, params, nameFun, attrName }: dataFunction) {

        const condition =
        {
            values: [`${nameFun}(${attr}):${attrName}`]
        }

        Object.assign(condition, params)

        return await this.get(condition)
    }

    async sum(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'SUM', attrName: 'total' })
    }

    async avg(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'AVG', attrName: 'total' })
    }

    /*  async count(attr: string = '*', params: any = {}) {
 
         return this.getDataFunction({ attr, params, nameFun: 'COUNT', attrName: 'total' })
     } */

    async max(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'MAX', attrName: 'total' })
    }

    async min(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'MIN', attrName: 'total' })
    }

    async ascii(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'ASCII', attrName: 'data' })
    }

    async char_length(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'CHAR_LENGTH', attrName: 'data' })
    }

    async length(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'LENGTH', attrName: 'data' })
    }

    async lower(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'LOWER', attrName: 'data' })
    }

    async trim(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'TRIM', attrName: 'data' })
    }

    async ltrim(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'LTRIM', attrName: 'data' })
    }

    async rtrim(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'RTRIM', attrName: 'data' })
    }

    async reverse(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'REVERSE', attrName: 'data' })
    }

    async upper(attr: string, params: any = {}) {

        return this.getDataFunction({ attr, params, nameFun: 'UPPER', attrName: 'data' })
    }

    async join(joins: any, params: any) {

        const { db } = this
        let current = this.getName()
        let relation = this.getRelations()

        let sql: any = `SELECT * FROM ${current} `

        sql += `INNER JOIN ${relation.TABLE_NAME} ON
        ${relation.TABLE_NAME}.${relation.COLUMN_NAME} =  ${current}.${relation.REFERENCED_COLUMN_NAME} `

        /*  SELECT * FROM user 
         INNER JOIN hotel_has_user 
         ON hotel_has_user.user_id = user.id
         INNER JOIN hotel 
         ON hotel_has_user.hotel_id = hotel.id */

        let sqlAndWhere = ''

        for (const join of joins) {

            let model = false

            for (const key in join) {

                if (join[key] instanceof Model) {

                    let parent = join[key].getRelations()

                    sql += `INNER JOIN ${join[key].getName()} ON
                    ${parent.TABLE_NAME}.${parent.COLUMN_NAME} =  ${join[key].getName()}.${parent.REFERENCED_COLUMN_NAME} `

                    let a = join[key].formatWhere(join.where)

                }

            }
        }

        sql += this.formatWhere(params.where)

        const data = {
            error: [],
            result: await db.query(sql, {}, { model: this.getName() })
        }

        return data

    }

    async isExist(params: any = {}) {

        if (!Object.keys(params).length) throw new Error("Required to object");

        let { result } = await this.get({ where: params, limit: '1' })

        return !!result.length
    }
}