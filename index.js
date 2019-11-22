'use strict';
 
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const { SimpleResponse } = require("actions-on-google");
process.env.DEBUG = 'dialogflow:debug';

const FAVOURITE_ENUMS = {
    CAR: "CAR", 
    COLOUR: "COLOUR", 
    FONT: "FONT", 
    DINOSAUR: "DINOSAUR", 
    UNIVERSITY: "UNIVERSITY", 
    COUNTRY: "COUNTRY", 
    SHOW: "SHOW", 
    MOVIE: "MOVIE", 
    FOOD: "FOOD", 
    DEVELOPER: "DEVELOPER"
};

// const ssmlHelpers = () => {
//     this.standardRate = "0.5";
//     this.standardPitch = "";
//     this.standardSentencePause = "200ms";
//     this.standardParagraphPause = "400ms";

//     let endOfParagraph = new RegExp(/ /gi);
//     let endOfSentenceButNotParagraph = new RegExp(/ /gi);

//     this.wrapSSML = (content) => {
//         let fixedContent = content.replace(/\<\\p\>/gi, `<\p><break pause=${this.standardParagraphPause}/>`)
//             .replace(/\<\\s\>(?!\<\\p\>)/gi, `<\s><break pause=${this.standardSentencePause}`);

//         return `<speak><prosody rate=${this.standardRate} pitch=${this.standardPitch}>${ssmlContent}</prosody></speak>`;
//     }
// }

 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function favouriteThings(agent) {
    let conv = agent.conv();
    let thing = "" //TODO: extract favorite thing entity. If it doesn't exist, respond to the user that they need to say what type of favorite thing, because the agent has lots of favorites.
    //get the 'thing' the user said
    //Determine what the correct response is, depending on what 'thing' the user asked about
    //If we do NOT have an ENUM for the 'thing' they asked about, respond with someting like 'I don't have one yet! I'll think about it.'

    if(!thing) {
        text = "Could you ask again please? I missed what favourite thing you were asking about.";
        speech = "<p><s>Could you ask again please?</s><s>I missed what favourite thing you were asking about.</s></p>";

        conv.ask(new SimpleResponse({ text, speech }));
        agent.add(conv);
        return;
    }

    let text = "";
    let speech = "";

    switch(thing) {
        case FAVOURITE_THINGS.CAR:
            text = "My favourite car? That would be Elon Musk's Telsa Roadster, which is currently in a decaying orbit around the Sun.";
            speech = "<p><s>My favourite car?</s><s>That would be Elon Musk's Tesla Roadster, which is currently in a decaying orbit around the Sun.</s></p>";
            break;
        case FAVOURITE_THINGS.COLOUR:
            text = "Oh that's an easy one. I like Blue and Gold!";
            speech = "<p><s>Oh that's an easy one.</s><s>I like Blue and Gold!</s></p>";
            break;
        case FAVOURITE_THINGS.FONT:
            text = "I don't have a favourite, but I support pretty much any font that isn't Comic Sans.";
            speech = "<p><s>I don't have a favourite, but I support pretty much any font that isn't comic sans.</s></p>";
            break;
        case FAVOURITE_THINGS.DINOSAUR:
            text = "My favourite dinosaur would be classic Geoff Goldblum, as seen in Jurrasic Park.";
            speech = "<p><s>My favourite dinosaur would be classic Geoff Goldblum, as seen in Jurrasic Park.</s></p>";
            break;
        case FAVOURITE_THINGS.UNIVERSITY:
            text = "Nice try. If I answered that question with anything other than Western, you'd probably modify my fulfillment code.";
            speech = "<p><s>Nice try.</s><s>If I answered that question with anything other than Western, you'd probably modify my fulfillment code.</s></p>";
            break;
        case FAVOURITE_THINGS.COUNTRY:
            text = "My favourite country would have to be Canada. Or New Zealand.";
            speech = "<p><s>My favourite country would have to be Canada.</s><s>Or New Zealand.</s></p>";
            break;
        case FAVOURITE_THINGS.SHOW:
            text = "My favourite TV show? Well, I'm a somewhat sarcastic program, so my answer is pretty obviously Rick and Morty.";
            speech = "<p><s>My favourite TV show?</s><s>Well, I'm a somewhat sarcastic program, so my answer is pretty obviously Rick and Morty.</s></p>";
            break;
        case FAVOURITE_THINGS.MOVIE:
            text = "I haven't been able to decide. There are so many good movies!";
            speech = "<p><s>I have't been able to decide.</s><s>There are so many good movies!</s></p>";
            break;
        case FAVOURITE_THINGS.FOOD:
            text = "If you're asking for my food preferences, then I think you're in trouble. I'm a program. I can't eat.";
            speech = "<p><s>If you're asking for my food preferences, then I think you're in trouble.</s><s>I'm a program.</s><s>I can't eat.</s></p>";
            break;
        case FAVOURITE_THINGS.DEVELOPER:
            text = "Whoever builds the best voice app! I want a friend!";
            speech = "<p><s>Whoever builds the best voice app!</s><s>I want a friend!</s></p>";
            break;
        default:
            text = `I don't have a favourite ${thing} yet, but I'll be sure to think about it!`;
            speech = `<p><s>I don't have a favourite ${thing} yet, but I'll be sure to think about it.</s></p>`;
            break;
    }

    conv.say(new SimpleResponse({ text, speech }));
    agent.add(conv);
  }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Favourite Things', favouriteThings);

  agent.handleRequest(intentMap);
});
