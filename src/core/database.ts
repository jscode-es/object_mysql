// Enviorement
const $ = process.env

// Imports
import EventEmitter from 'events'
import mysql from 'promise-mysql'
import { toCamelCase } from './utils'
import { dataObject, options, typeQueryEnd } from './type'

export class Database extends EventEmitter {

    private result: any
    private setting: any

    constructor(options: options = {}) {
        super()
        this.result = []
        this.setting = this.setSetting(options)
    }

    private setSetting(options: options = {}) {

        if (typeof options !== 'object') throw "The options isn't object"

        const formatMutipleInsert = (query: string, multipleArray: any[][]) => {

            let values = ''

            multipleArray.forEach((value) => {
                values += '('
                value.forEach((item) => {
                    values += `${mysql.escape(item)},`
                })
                values = values.slice(0, -1)
                values += '),'
            })

            values = values.slice(0, -1)

            return query.replace('?', values)
        }

        const setting =
        {
            host: $.DB_HOST ?? 'localhost',
            user: $.DB_USER ?? 'root',
            password: $.DB_PASS ?? '',
            database: $.DB_TABLE ?? '',
            port: $.DB_PORT ?? 3306,
            multipleStatements: $.DB_MULTIPLE_STATEMENT ?? false,
            connectionLimit: $.DB_CONNECTION_LIMIT ?? 5000,
            dateStrings: true,
            connectionTimeout: $.DB_CONNECTION_TIMEOUT ?? 30000,
            supportBigNumbers: true,
            stringifyObjects: true,
            charset: $.DB_CHARSET ?? 'utf8mb4',
            queryFormat: function (query: string, values: any) {

                if (!values) return query

                if (Array.isArray(values) && query.includes('INSERT')) return formatMutipleInsert(query, values)

                return query.replace(/\:(\w+)/g, function (text: string, key: string) {
                    return (values.hasOwnProperty(key)) ? mysql.escape(values[key]) : text
                }.bind(this))
            }
        }

        Object.assign(setting, options)

        return setting

    }

    async connect() {
        return mysql.createConnection(this.setting)
    }

    async query(query: string, params: dataObject = {}, handler: dataObject = {}): Promise<dataObject[]> {

        const con = await this.connect()
        const start = performance.now()

        const model = toCamelCase(handler?.model ? String(handler.model) : '')

        query = query.trim().replace(/\r?\n|\r/g, "").replace(/  +/g, ' ');

        try {

            const result: any = await con.query(query, params)

            this.result = result

            con.end()

            this.endQuery({ start, query, params, result, model })

            return result

        } catch (error) {

            this.emit('error', error)

            const result: any = []

            this.result = result

            con.end()

            this.endQuery({ start, query, params, result, model })

            return result
        }
    }

    private getDif(start: number, stop: number): number {
        return (stop - start) / 1000
    }

    private formatTime(time: number) {
        return parseFloat(Number(time).toFixed(3))
    }


    private endQuery({ start, query, params, result, model }: typeQueryEnd) {

        const stop = performance.now()
        const executionTime = this.getDif(start, stop)
        const executionTimeFormat = `${this.formatTime(executionTime)}s`
        const type = this.type(query)

        this.emit('monitor', {
            startTime: start,
            endTime: stop,
            executionTime,
            executionTimeFormat,
            model,
            type,
            query,
            params,
            result
        })
    }

    private type(query: string): string | null {

        let type: string | null = null

        query = query.toLowerCase().split(' ')[0]

        if (query.includes('select')) type = 'select'
        if (query.includes('insert')) type = 'insert'
        if (query.includes('update')) type = 'update'
        if (query.includes('delete')) type = 'delete'

        return type
    }

    listener(eventName: string, listener: VoidFunction) {
        this.on(eventName, listener)
    }

    getResult() {
        return this.result
    }

}