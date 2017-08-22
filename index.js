var restify = require('restify');
var builder = require('botbuilder');

// Setup restify server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Create bot with root dialog
var bot = new builder.UniversalBot(connector, (session) => {

    // Get access token from Cortana request
    var tokenEntity = session.message.entities.find((e) => {
        return e.type === 'AuthorizationToken';
    });

    // For connected accounts, Cortana will ALWAYS send a token
    // If the token doesn't exist, then this is a non-Cortana channel
    if (!tokenEntity) {
        // Send message that info is not available
        session.say('No Cortana token detected.', 'Sorry, I couldn\'t get your info. Try again later on Cortana.', {
            inputHint: builder.InputHint.ignoringInput
        });

    }

    session.say('Cortana skill is working', 'Cortana skill is working here', {
        inputHint: builder.InputHint.ignoringInput
    }).endConversation();
});

// END OF LINE
