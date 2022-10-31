class Query {

    // attrs class
    private table: string
    private schema: string
    private attrs: any
    private keys: Array<String>
    private primaryKeys: Array<String>
    private relations: any
    private data: any
    private limit: any
    private where: any
    private cache: any

    constructor(schema: string, table: string) {
        this.schema = schema
        this.table = table
        this.keys = []
        this.primaryKeys = []
        this.relations = []
        this.data = {}
        this.where = {}
        this.limit = ''
        this.cache = {}

        /* cache = {
            'MD5','query sql'
        } */
    }

    // Getters
    getTable() { return this.table }
    getSchema() { return this.schema }
    getAttrs() { return this.attrs }
    getKeys() { return this.keys }
    getPK() { return this.primaryKeys }
    getRelations() { return this.relations }

    // Setters
    setTable(data: any) { this.table = data }
    setSchema(data: any) { this.schema = data }
    setAttrs(data: any) { this.attrs = data }
    setKeys(data: any) { this.keys = data }
    setPK(data: any) { this.primaryKeys = data }
    setRelations(data: any) { this.relations = data }

    // Generador del modelo
    static async generate(schema: string, table: string) {

        const model = new Query(schema, table)

        // Setter datos
        model.setAttrs({})
        model.setRelations({})

        return model
    }

    private formatAttr() {

        if (this.data === '*') return this.data

        let attrs = Object.keys(this.data)

        return (attrs.map(item => `\`${item}\``)).join(',')

    }

    private formatValue() {

        let attrs = Object.keys(this.data)

        return (attrs.map(item => `:${item}`)).join(',')
    }

    private formatLimit() {

        if (!this.limit.length) return this.limit

        return `LIMIT ${this.limit}`
    }

    private formatSet() {

        if (!this.limit.length) return this.limit

        return `LIMIT ${this.limit}`
    }

    private formatWhere() {

        if (!Object.keys(this.where).length) return ''

        let sql = ''

        for (let key in this.where) {

            const data = this.where[key]

            // OR {id:[2,4]}
            if (Array.isArray(data)) {

                sql += this.formatOR({ data, key })

                continue
            }

            // AND { id: 2 }
            const regex = /\)$/m

            if (regex.test(sql)) sql += ' AND'

            let typeWhere = `= '${data}'`

            const isNull = data === null || data === 'null'

            if (isNull) typeWhere = 'IS NULL'

            sql += ` ${this.getTable()}.${key} ${typeWhere} AND `

        }

        if (sql.length) sql = `WHERE${sql}`

        return sql
    }

    private formatGroup() {

        if (!this.limit.length) return this.limit

        return `LIMIT ${this.limit}`
    }

    private formatOrder() {

        if (!this.limit.length) return this.limit

        return `LIMIT ${this.limit}`
    }

    private formatOR({ data, key, type = '=' }: any) {

        let or = ''

        for (const item of data) {

            or += `\`${key}\` ${type} '${item}' OR `
        }

        return `(${or.slice(0, -4)})`
    }

    private formatTable() {
        return `\`${this.getTable()}\``
    }

    // ------------------------------------
    // Own method to use the databases
    // ------------------------------------
    async add(data = {}) {

        this.data = data

        let sintax = 'INSERT INTO :table (:attr) VALUES (:value)'

        // REPLACES
        sintax = sintax.replace(':table', this.formatTable())
        sintax = sintax.replace(':attr', this.formatAttr())
        sintax = sintax.replace(':value', this.formatValue())

        return sintax
    }

    async get(condition: any = {}) {

        this.data = condition.values ?? '*'
        this.where = condition.where ?? {}
        this.limit = condition.limit ?? ''

        let sintax = 'SELECT :attr FROM :table :where :group :having :order :limit'

        // REPLACES
        sintax = sintax.replace(':attr', this.formatAttr())
        sintax = sintax.replace(':table', this.formatTable())
        sintax = sintax.replace(':where', this.formatWhere())
        sintax = sintax.replace(':group', this.formatGroup())
        sintax = sintax.replace(':having', '')
        sintax = sintax.replace(':order', this.formatOrder())
        sintax = sintax.replace(':limit', this.formatLimit())

        return sintax
    }

    async update(condition: any, data: any) {

        //this.where = condition?.where ?? {}
        //this.limit = condition?.limit ?? ''
        //this.data = data ?? {}

        let sintax = 'UPDATE :table :set :where :order :limit'

        // REPLACES
        //sintax = sintax.replace(':table', this.formatTable())
        //sintax = sintax.replace(':set', this.formatSet())
        //sintax = sintax.replace(':where', this.formatWhere())
        //sintax = sintax.replace(':order', this.formatOrder())
        //sintax = sintax.replace(':limit', this.formatLimit())

        return sintax
    }

    async remove(id: any, condition: any) {

        let sintax = 'DELETE FROM :table :where :order :limit'

        //this.limit = condition.limit ?? ''
        //this.where = condition.where ?? {}

        // REPLACES
        //sintax = sintax.replace(':table', this.formatTable())
        //sintax = sintax.replace(':where', this.formatWhere())
        //sintax = sintax.replace(':order', this.formatOrder())
        //sintax = sintax.replace(':limit', this.formatLimit())

        return sintax
    }
}

export default Query