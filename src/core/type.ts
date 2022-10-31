export interface options {
    user?: string
    password?: string
    host?: string
    database?: string
    port?: number
    multipleStatements?: boolean
    connectionLimit?: number
    dateStrings?: boolean
    connectionTimeout?: number
    supportBigNumbers?: boolean
    stringifyObjects?: boolean
    charset?: string
}

export interface model {
    getName: Function
    getSchema: Function
    getAttrs: Function
    getPrimaryKey: Function
    getRelations: Function
    add: Function
    get: Function
    update: Function
    remove: Function
    check: Function
    getByPk: Function
    getByAttr: Function
    count: Function
    getTotal: Function
    sum: Function
    isExist: Function
}

export interface models {
    [key: string]: model
    db?: any
    types?: any
    on?: any
}

export interface dataObject {
    [key: string]: string | number | boolean
}

export interface dataGenerate {
    db: any
    schema: string
    table: string
}

export interface typeQueryEnd {
    start: number
    query: string
    model: any
    params: dataObject
    result: dataObject[]
}

