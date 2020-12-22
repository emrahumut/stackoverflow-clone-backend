const asyncErrorWrapper = require("express-async-handler");
const {searchHelper,populateHelper,questionSortHelper,paginationHelper} = require("./queryMiddlewareHelpers")

const questionQueryMiddleware = function(model,options) {
    return asyncErrorWrapper(async function(req,res, next) {
        // initial query
        let query = model.find();
        // search
        query = searchHelper("title",query,req);

        if (options && options.population){
            query = populateHelper(query,options.population);
        }
        query = questionSortHelper(query,req)
        // pagination
        const paginationResult = await paginationHelper(model,query,req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResults = await query;
        req.queryResults = {
            success: true,
            count: queryResults.lenght,
            pagination: pagination,
            data: queryResults
        };
        next();
    });
};

module.exports = questionQueryMiddleware;