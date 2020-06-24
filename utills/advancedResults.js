const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    let reqQuery = {...req.query}

    //exclude field
    let removeField = ['select', 'sort', 'page', 'limit']
    removeField.forEach(field => delete reqQuery[field])
    let queryStr = JSON.stringify(reqQuery)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = model.find(JSON.parse(queryStr))

    //select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    //sort
    if (req.query.sort) {
        const fields = req.query.sort.split(',').join(' ')
        query = query.sort(fields)
    } else {
        query = query.sort('-createdAt')
    }

    //pagination
    let page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 1
    let startIndex = (page - 1) * limit
    let endIndex = page * limit
    let total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit)

    if(populate){
        query = query.populate(populate)
    }

    const results = await query

    let pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        data: results,
        pagination
    }
    next()
}

module.exports = advancedResults