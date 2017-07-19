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

var bot = new builder.UniversalBot(connector);

var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/9ccdde85-f34a-4fb3-b86c-f8bb4b091fcc?subscription-key=68603617abd246748298dd82c031dde2&verbose=true&timezoneOffset=0&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
dialog.matches("LogTimeToTask", [
    function (session, args, next) {

        var taskID = builder.EntityRecognizer.findEntity(args.entities, 'TaskID');
        var timeToLog = builder.EntityRecognizer.findEntity(args.entities, 'TimeToLog');

        session.endDialog("Gracias! Hemos agregado " + timeToLog.entity + " horas a la tarea " + taskID.entity);

    }
]);

dialog.matches("MyAssignedTasks", [
    function (session, args, next) {

        session.endDialog("Tus tareas son: AD3122, AM2121 y AP1223");

    }
]);

bot.dialog("/", dialog);