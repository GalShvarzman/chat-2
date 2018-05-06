const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function RootMenu(callback, question) {
    rl.question(question +"\n" , function (answer) {
        waitForAnAnswer(answer, callback, RootMenu)
    })
}

function exitChat() {
    rl.close();
}

function waitForAnAnswer(answer, callback, func){
    if (!answer) {
        console.log('Well, I need an answer..');
        return func(callback);
    }
    callback(answer);
}

function sendMessage(message){
    console.log(message);
}

function sendErrorMessage(message){
    console.error(message);
}

module.exports = {
    RootMenu,
    sendMessage,
    exitChat,
    sendErrorMessage
};