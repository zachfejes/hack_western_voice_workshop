'use strict';
 
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { SimpleResponse, Suggestions, LinkOutSuggestion } = require("actions-on-google");
process.env.DEBUG = 'dialogflow:debug';

const FAVOURITE_ENUMS = {
    CAR: "car", 
    COLOUR: "colour", 
    FONT: "font", 
    DINOSAUR: "dinosaur", 
    UNIVERSITY: "university", 
    COUNTRY: "country", 
    SHOW: "show", 
    MOVIE: "movie", 
    FOOD: "food", 
    DEVELOPER: "developer"
};

const standardRate = "0.55";
const standardPitch = "+1st";
const standardSentencePause = "200ms";
const standardParagraphPause = "400ms";
const endOfParagraph = new RegExp(/<\/p>/gi);
const endOfSentenceButNotParagraph = new RegExp(/<\/s>(?!<\/p>)/gi);

const wrapSSML = (content) => {
    let fixedContent = content.replace(endOfParagraph, `</p><break time="${standardParagraphPause}" />`);
    fixedContent = fixedContent.replace(endOfSentenceButNotParagraph, `</s><break time="${standardSentencePause}" />`);
  
    return `<speak><prosody rate="${standardRate}" pitch="${standardPitch}">${fixedContent}</prosody></speak>`;
};

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  agent.requestSource = agent.ACTIONS_ON_GOOGLE; 
 
  function welcome(agent) {
    let conv = agent.conv();
    let text = "", speech = "";

    text = "Welcome to... me! I'm your new voice app. I can't do much yet, but I already have a lot of opinions I'd love to share. Ask me about my favorite things!";
    speech = "<p><s>Welcome to...</s><emphasis><s>me!</s></emphasis><s>I'm your new voice app.</s><s>I can't do much yet, but I already have a lot of opinions I'd love to share.</s><s>Ask me about my favorite things!</s></p>";

    conv.ask(new SimpleResponse({ text, speech: wrapSSML(speech) }));
    agent.add(conv);
  }
 
  function fallback(agent) {
    let conv = agent.conv();
    let text = "", speech = "";

    text = "I'm sorry but I didn't understand. My capabilities are kind of limited right now, but you can ask me what my favorite color, or car is. Alternately, if you want to improve my functionality, feel free to go make a pull request to my repo on GitHub!  \n\nOr you can join RBC and work with Zach and get paid to make really powerful voice apps.";
    speech = "<p><s>I'm sorry but I didn't understand.</s><s>My capabilities are kind of limited right now, but you can ask me what my favorite color, or car is.</s><s>Alternately, if you want to improve my functionality, feel free to go make a pull request to my repo on GitHub!</s></p><p><s>Or you can join RBC and work with Zach and get paid to make really powerful voice apps.</s></p>";

    conv.ask(new LinkOutSuggestion({ name: "Improve Me", url: "https://github.com/zachfejes/hack_western_voice_workshop/tree/develop" }));
    conv.ask(new Suggestions([ "Favorite Color", "Favorite Vehicle" ]));

    agent.add(conv);
  }

  function favouriteThings(agent) {    
    let conv = agent.conv();
    let { favoriteType } = agent.parameters;
    let cleanFavoriteType = favoriteType.toLowerCase().trim();
    let text = "", speech = ""; 
    
    if(!favoriteType) {
        text = "Could you ask again please? I missed what favourite thing you were asking about.";
        speech = "<p><s>Could you ask again please?</s><s>I missed what favourite thing you were asking about.</s></p>";
      
        conv.ask(new SimpleResponse({ text, speech: wrapSSML(speech) }));
        agent.add(conv);
        return;
    }

    switch(cleanFavoriteType) {
        case FAVOURITE_ENUMS.CAR:
            text = "My favourite car? That would be Elon Musk's Telsa Roadster, which is currently in a decaying orbit around the Sun.";
            speech = "<p><s>My favourite car?</s><s>That would be Elon Musk's Tesla Roadster, which is currently in a decaying orbit around the Sun.</s></p>";
            break;
        case FAVOURITE_ENUMS.COLOUR:
            text = "Oh that's an easy one. I like Blue and Gold!";
            speech = "<p><s>Oh that's an easy one.</s><s>I like Blue and Gold!</s></p>";
            break;
        case FAVOURITE_ENUMS.FONT:
            text = "I don't have a favourite, but I support pretty much any font that isn't Comic Sans.";
            speech = "<p><s>I don't have a favourite, but I support pretty much any font that isn't comic sans.</s></p>";
            break;
        case FAVOURITE_ENUMS.DINOSAUR:
            text = "My favourite dinosaur would be classic Geoff Goldblum, as seen in Jurrasic Park.";
            speech = "<p><s>My favourite dinosaur would be classic Geoff Goldblum, as seen in Jurrasic Park.</s></p>";
            break;
        case FAVOURITE_ENUMS.UNIVERSITY:
            text = "Nice try. If I answered that question with anything other than Western, you'd probably modify my fulfillment code.";
            speech = "<p><s>Nice try.</s><s>If I answered that question with anything other than Western, you'd probably modify my fulfillment code.</s></p>";
            break;
        case FAVOURITE_ENUMS.COUNTRY:
            text = "My favourite country would have to be Canada. Or New Zealand.";
            speech = "<p><s>My favourite country would have to be Canada.</s><s>Or New Zealand.</s></p>";
            break;
        case FAVOURITE_ENUMS.SHOW:
            text = "My favourite TV show? Well, I'm a somewhat sarcastic program, so my answer is pretty obviously Rick and Morty.";
            speech = "<p><s>My favourite TV show?</s><s>Well, I'm a somewhat sarcastic program, so my answer is pretty obviously Rick and Morty.</s></p>";
            break;
        case FAVOURITE_ENUMS.MOVIE:
            text = "I haven't been able to decide. There are so many good movies!";
            speech = "<p><s>I have't been able to decide.</s><s>There are so many good movies!</s></p>";
            break;
        case FAVOURITE_ENUMS.FOOD:
            text = "If you're asking for my food preferences, then I think you're in trouble. I'm a program. I can't eat.";
            speech = "<p><s>If you're asking for my food preferences, then I think you're in trouble.</s><s>I'm a program.</s><s>I can't eat.</s></p>";
            break;
        case FAVOURITE_ENUMS.DEVELOPER:
            text = "Whoever builds the best voice app! I want a friend!";
            speech = "<p><s>Whoever builds the best voice app!</s><s>I want a friend!</s></p>";
            break;
        default:
            text = `I don't have a favourite ${favoriteType} yet, but I'll be sure to think about it!`;
            speech = `<p><s>I don't have a favourite ${favoriteType} yet, but I'll be sure to think about it.</s></p>`;
            break;
    }
    
    conv.ask(new SimpleResponse({ text, speech: wrapSSML(speech) }));
    agent.add(conv);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Favorite Things', favouriteThings);

  agent.handleRequest(intentMap);
});