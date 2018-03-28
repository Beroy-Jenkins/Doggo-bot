require('dotenv-extended').load()
const restify = require('restify');
const builder = require('botbuilder');
const descreverImagemDialog = require('./src/dialogs/descrever-imagem-dialog');

// Setup Restify Server

const port =  process.env.PORT;
const server = restify.createServer();
server.listen(port,  function () {
    console.log('%s listening to %s', server.name, server.url);
});


// Create chat connector for communicating with the Bot Framework Service
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

// Listen for messages from users 
server.post('/api/messages', connector.listen());

//Luis
const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL)
const intents = new builder.IntentDialog({
    recognizers: [recognizer]
})

intents.onDefault((session, args) => {
    session.send(`Desculpe, não entendi: **${session.message.text}**\n\nSou um bot com conhecimento limitado ainda =).`)
})
intents.matches('saudar',(session,args) =>{
    session.send('Heya, tudo de otimo! muito bom conheçer voce');
})
intents.matches('consciencia',(session,args) =>{
    session.send('Sou o Bot Doggo, desenvolvido pra ajuda em pesquisas rapidas na web =)');
})
intents.matches('ajuda',(session,args) =>{
    session.send('consigo fazer buscas na web de maneira rapida e facil, é so falar =)');
})
intents.matches('pesquisar',(session,args) =>{
    session.send('o que vc quer procurar?');
})
intents.matches('pesquisar-imagem',(session,args) =>{
    session.send('que imagem vc quer encontar?');
})
intents.matches('descrever-imagem', descreverImagemDialog)
bot.dialog('/',intents) 








/*
var inMemoryStorage = new builder.MemoryBotStorage();
// This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Olá.");
        session.beginDialog('askForDateTime');
    },
    function (session, results) {
        session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
        session.beginDialog('askForPartySize');
    },
    function (session, results) {
        session.dialogData.partySize = results.response;
        session.beginDialog('askForReserverName');
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(`Reservation confirmed. Reservation details: <br/>Date/Time: ${session.dialogData.reservationDate} <br/>Party size: ${session.dialogData.partySize} <br/>Reservation name: ${session.dialogData.reservationName}`);
        session.endDialog();
    }
]).set('storage', inMemoryStorage); // Register in-memory storage 

// Dialog to ask for a date and time
bot.dialog('askForDateTime', [
    function (session) {
        builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog to ask for number of people in the party
bot.dialog('askForPartySize', [
    function (session) {
        builder.Prompts.text(session, "How many people are in your party?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
])

// Dialog to ask for the reservation name.
bot.dialog('askForReserverName', [
    function (session) {
        builder.Prompts.text(session, "Who's name will this reservation be under?");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
*/
/*
// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
    session.send("You are: %s", session.userData.name);

    
});
*/