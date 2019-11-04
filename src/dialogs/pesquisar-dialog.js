const builder = require('botbuilder');
const https = require('https');
const AzureBingSearch = require('../services/azure-bing-search');
module.exports = [
    (session, results) => {
        builder.Prompts.text(session, 'O que  você gostaria de pesquisar?')
    },
    (session, args, next) => {
        
        const azureBingSearch = new AzureBingSearch();

        let request_params = {
            method: 'GET',
            hostname: azureBingSearch._endpoint,
            path: azureBingSearch.path +
                '?q=' +
                encodeURIComponent(session.message.text) +
                'count=3' +
                'safeSearch=off',
            headers: {
                'Ocp-Apim-Subscription-Key': azureBingSearch._key,
            }
        };

        let req = https.request(request_params, function (response) {
            let body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                var
                    data = JSON.parse(body)
                    , value = data.webPages.value
                    ;
                session.send('Consegui encotrar algo: ');
                for (var i = 0; i < value.length; i++) {
                    var o = value[i];
                    const card = new builder.HeroCard(session)
                        .title(o.name)
                        .subtitle(o.displayUrl)
                        .text(o.snippet)
                        .buttons([
                            builder.CardAction.openUrl(session, o.url, 'Acesse o site')
                        ])
                    const message = new builder.Message(session).addAttachment(card)

                    session.send(message);


                }
            });
            response.on('error', function (e) {
                console.log('Error: ' + e.message);
            });
        }
        );
        req.end();
    }

]