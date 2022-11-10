// imports
import joi from 'joi'
import date from '@joi/date'

const Joi = joi.extend(date)

export default class Validate {

    static async setSchema(model: any) {

        let schema: any = {}

        let attrs = await model.getAttrs()

        for (const attr of attrs) {

            const {
                COLUMN_NAME,
                DATA_TYPE,
                IS_NULLABLE,
                COLUMN_DEFAULT,
                CHARACTER_MAXIMUM_LENGTH,
                COLUMN_KEY,
                EXTRA,
                NUMERIC_SCALE
            } = attr

            schema[COLUMN_NAME] = null

            if (DATA_TYPE === 'varchar' || DATA_TYPE === 'text' || DATA_TYPE === 'mediumtext' || DATA_TYPE === 'tinyinttext' || DATA_TYPE === 'longtext') {
                schema[COLUMN_NAME] = Joi.string().trim()

                if (CHARACTER_MAXIMUM_LENGTH) {
                    schema[COLUMN_NAME] = schema[COLUMN_NAME].max(CHARACTER_MAXIMUM_LENGTH)
                }

                if (COLUMN_NAME === 'email') {
                    schema[COLUMN_NAME] = schema[COLUMN_NAME].email()
                }

            } else if (DATA_TYPE === 'decimal') {

                schema[COLUMN_NAME] = Joi.number().precision(NUMERIC_SCALE)

            } else if (DATA_TYPE === 'int' || DATA_TYPE === 'tinyint') {

                schema[COLUMN_NAME] = Joi.number()

            } else if (DATA_TYPE === 'int' || DATA_TYPE === 'tinyint') {

                schema[COLUMN_NAME] = Joi.date()

            } else if (DATA_TYPE === 'json') {

                schema[COLUMN_NAME] = Joi.string()

            } else if (DATA_TYPE === 'date') {

                schema[COLUMN_NAME] = (Joi.date() as any).format('YYYY-MM-DD').utc()

            } else if (DATA_TYPE === 'datetime') {

                schema[COLUMN_NAME] = Joi.string()
            }

            if (COLUMN_DEFAULT) {
                if (COLUMN_DEFAULT !== 'CURRENT_TIMESTAMP') {
                    schema[COLUMN_NAME] = schema[COLUMN_NAME].default(COLUMN_DEFAULT)
                }
            }

            if (IS_NULLABLE === 'NO') {
                if (COLUMN_KEY !== 'PRI' && COLUMN_DEFAULT === null) {
                    if (schema[COLUMN_NAME])
                        schema[COLUMN_NAME] = schema[COLUMN_NAME].required()
                }

                if (COLUMN_KEY === 'PRI' && EXTRA !== 'auto_increment') {
                    if (schema[COLUMN_NAME])
                        schema[COLUMN_NAME] = schema[COLUMN_NAME].required()
                }
            }
        }

        return Joi.object(schema)
    }

    static check(schema: any, data: any, required: boolean = true) {

        const setting =
        {
            abortEarly: false,
            convert: true,
            allowUnknown: false,
            stripUnkwown: true,
            skipFunctions: true
        }

        if (!required) {

            let { keys } = schema['$_terms']

            for (const { key } of keys) {

                schema._ids._byKey.get(key).schema._flags.presence = 'optional'
            }
        }

        let { error, value } = schema.validate(data, setting)

        if (error) {
            for (const { message } of error.details) {
                console.warn('[ Error ] ', message)
            }
        }

        if (!required) {

            let keys = Object.keys(value)

            let newData: any = {}

            for (const item in data) {

                if (keys.includes(item)) {
                    newData[item] = data[item]
                }
            }

            value = newData
        }

        return { error, value }
    }
}