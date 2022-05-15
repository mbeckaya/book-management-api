import express from 'express'

export default class Controller {
    public static getQueryFields = (req: express.Request) => {
        let fieldList: string[] = []

        if (Boolean(req.query.fields)) {
            const fields: string = req.query.fields as string
            fieldList = fields.split(',')
        }

        return fieldList
    }
}