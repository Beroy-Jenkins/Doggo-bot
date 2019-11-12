const builder = require('botbuilder')
const validUrl = require('valid-url')
const AzureComputerVision = require('../services/azure-computer-vision')
const utils = require('../utils')

module.exports = [
    (session, args, next) => {
        const options = {
            listStyle: builder.ListStyle.button,
            retryPrompt: 'Desculpe, não entendi, selecione uma das opções'
        }
        builder.Prompts.choice(
            session,
            'Como você deseja me enviar a imagem?',
            'cancelar|Anexo / Upload|URL / link',
            options
        )
    },
    (session, results) => {
        switch(results.response.index){
            case 0:
                session.send('Ok, operação cancelada. =)')
                break
            case 1:
                builder.Prompts.attachment(session, 'Ok, me envia uma imagem que eu vou tentar descrever o que tem nela.')
                break
            case 2:
                builder.Prompts.text(session, 'Ok, me passe o link url da imagem que eu vou tentar descrever o que tem nel.a')
                break
        }
    },
    
    (session, results) => {
        const computerVisionService = new AzureComputerVision()
        if(utils.hasImageAttachment(session)){
            const stream = utils.getImageStreamFromMessage(session.message)
            computerVisionService.findFromStrem(stream)
                .then(descreverSucces(session))
                .catch(descreverError(session))
        }
        else {
            
            const imageUrl = utils.parseAnchorTag(session.message.text) || (validUrl.isUri(session.message.text) ? session.message.text : null)
            if(imageUrl){
                computerVisionService.findFromUrl(imageUrl)
                    .then(descreverSucces(session))
                    .catch(descreverError(session))
            }else {
                    session.send('Não consegui identificar a imagem corretamente.')
                }
        }
    }
]

const descreverSucces =     (session) => {
    return (result) => {
        if(!result)
            return session.send('Não consegui descrever essa imagem.')
        
        const message = `Descrição: **${result.description.captions[0].text}**\n\n`
            + `Tags: **${result.description.tags.join(',')}**\n\n`
            + `Tem conteúdo adulto: **${result.adult.isAdultContent}**\n\n`
            + `Tem conteúdo racista: **${result.adult.isRacyContent}**\n\n`
            + `Tem alguma pessoa na foto: **${result.faces.length}**`

        session.send(message)
    }
}

const descreverError = (session) => {
    return (error) => {
        let errorMessage = 'Algo deu errado com o processamento.'
        if(error.message && error.message.indexOf('Access denied') > -1)
            errorMessage += '\n' + error.message
        session.send(errorMessage)
    }
}