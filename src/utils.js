const needle = require('needle')
const moment = require('moment')

const hasImageAttachment = (session) => {
    return session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf('image') !== -1
}
module.exports = {
    hasImageAttachment
}