// Enviorement
const $ = process.env

// Imports
import mysql from 'promise-mysql'
import dotenv from 'dotenv'

// execute dotenv
dotenv.config()

export default class Database {

    // Attrs to class
    private result: any
    private setting: any

    constructor(options: any = {}) {
        this.result = []
        this.setting = this.setSetting(options)
    }

    private setSetting(options: any = {}) {
        if (typeof options !== 'object') throw "The options isn't object"

        let setting =
        {
            host: $.DB_HOST,
            user: $.DB_USER,
            password: $.DB_PASS,
            database: $.DB_TABLE,
            port: 3306,
            multipleStatements: false,
            connectionLimit: 5000,
            dateStrings: true,
            connectionTimeout: 30000,
            supportBigNumbers: true,
            stringifyObjects: true,
            charset: 'utf8mb4',
            queryFormat: function (query: string, values: any) {
                if (!values) return query

                return query.replace(/\:(\w+)/g, function (text: string, key: string) {

                    if (values.hasOwnProperty(key)) {
                        return mysql.escape(values[key])
                    }

                    return text

                }.bind(this))
            }
        }

        Object.assign(setting, options)

        return setting

    }

    private connect() {
        return mysql.createConnection(this.setting)
    }

    async query(sql: string, params: any = {}) {
        const con = await this.connect()

        const data = await con.query(sql, params)

        this.result = data

        con.end()

        return data
    }

    getResult() {
        return this.result
    }
}