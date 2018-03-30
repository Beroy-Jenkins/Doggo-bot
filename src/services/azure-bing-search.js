const AzureApi = require('./azure-api')

class AzureBingSearch extends AzureApi {

    constructor() {
        const API_URL = `${process.env.MICROSOFT_SEARCH_API_ENDPOINT}`
        const API_KEY = process.env.MICROSOFT_SEARCH_API_KEY
        super(API_URL, API_KEY)
        this.path = '/bing/v7.0/search';
    }

}

module.exports = AzureBingSearch