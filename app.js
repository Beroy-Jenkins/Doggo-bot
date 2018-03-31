require('dotenv-extended').load()
const restify = require('restify');
const builder = require('botbuilder');
const https = require('https');
const descreverImagemDialog = require('./src/dialogs/descrever-imagem-dialog');
const pesquisarDialog = require('./src/dialogs/pesquisar-dialog');

const port =  process.env.PORT;
const server = restify.createServer();
server.listen(port,  function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
const bot = new builder.UniversalBot(connector);
bot.set('storage', new builder.MemoryBotStorage());
bot.on('conversationUpdate', update => {
    ((update || {}).membersAdded || []).forEach(identity => {
        if(identity.id === update.address.bot.id){
            bot.loadSession(update.address, (err,session) =>{
                if(err){
                    return
                }
                session.send('Olá sou Doggo, o que posso encontrar pra você?')
            })
        }    
    })
})

server.post('/api/messages', connector.listen());

const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL)
const intents = new builder.IntentDialog({
    recognizers: [recognizer]
})



intents.onDefault((session, args) => {
    session.send(`Desculpe, não entendi: **${session.message.text}**\n\nSou um bot com conhecimento limitado ainda =).`)
})
intents.matches('saudar',(session,args) =>{
    session.send('Heya! muito bom conhecer você!');
})
intents.matches('consciencia',(session,args) =>{
    session.send('Sou o Bot Doggo, desenvolvido pra ajudar em pesquisas rapidas na web e em descrever certas imagems. =)');
})
intents.matches('ajuda',(session,args) =>{
    session.send('Consigo fazer buscas na web de maneira rapida e facil e também de descrever algumas imagens, é so falar oque vc quer fazer. =)');
})
intents.matches('pesquisar', pesquisarDialog)
intents.matches('descrever-imagem', descreverImagemDialog)
bot.dialog('/',intents) 