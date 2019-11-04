const AzureApi = require('./azure-api')

class AzureComputerVision extends AzureApi {

    constructor() {
        const API_URL = `${process.env.MICROSOFT_VISION_API_ENDPOINT}/vision/v2.1/analyze?visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult&language=pt`
        const API_KEY = process.env.MICROSOFT_VISION_API_KEY
        super(API_URL, API_KEY)
    }

}

module.exports = AzureComputerVision