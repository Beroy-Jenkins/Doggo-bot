const builder = require('botbuilder');
const https = require('https');
const AzureBingSearch  = require('../services/azure-bing-search');
//let host = 'api.cognitive.microsoft.com';
module.exports = [
    (session, results) => {
        builder.Prompts.text(session, 'O que  você gostaria de pesquisar?')
    },
    (session, args, next) => {    


    const azureBingSearch = new AzureBingSearch();

    let request_params = {
          method : 'GET',
          hostname : azureBingSearch._endpoint,
          path : azureBingSearch.path + '?q=' + encodeURIComponent(session.message.text),
          headers : {
              'Ocp-Apim-Subscription-Key' : azureBingSearch._key,
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
          for (var i = 0; i < value.length; i++ ) {
              var o = value[i];
              //console.log(" o.name " + o.name ); 
              //console.log(" o.url " + o.url ); 
              const message = 
              `name: **${ o.name }**\n\n`
              + `url: **${ o.url}**\n\n`
             // + `Tem conteúdo adulto: **${result.adult.isAdultContent}**\n\n`
             // + `Tem conteúdo racista: **${result.adult.isRacyContent}**\n\n`
             // + `Tem alguma pessoa na foto: **${result.faces.length}**`            
  
             //minhasessao.send("name : %s \n url  : %s",  o.name, o.url  );
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
