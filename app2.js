var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
        function (session) {
            builder.Prompts.text(session, 'Before we can talk, what is your name?');
        },
        function (session, results) {
            session.userData.name = results.response;
            session.endDialog("Hello " + session.userData.name + "!");
        }
    ]
);