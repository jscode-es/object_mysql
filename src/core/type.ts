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
    isExist: Function
    check: Function
    getByPk: Function
    getByAttr: Function
    count: Function
    getTotal: Function
    sum: Function
    avg: Function
    max: Function
    min: Function
    ascii: Function
    char_length: Function
    length: Function
    lower: Function
    trim: Function
    ltrim: Function
    rtrim: Function
    reverse: Function
    upper: Function
}

export interface models {
    [key: string]: model
    db?: any
    types?: any
    on?: any
    cleanCache?: any
    getCache?: any
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

export interface dataFunction {
    attr: string
    params: dataObject
    nameFun: string
    attrName: string
}


