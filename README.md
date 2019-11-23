# Voice Workshop Sample Code

## HackWestern 2019

Fulfillment code for a sample voice-first application, designed for use in Functions on Firebase


### Application Architecture

* Actions on Google ([Example Front End Integration](https://dialogflow.com/docs/integrations/actions/integration) - can actually use [whatever integration you'd like](https://cloud.google.com/dialogflow/docs/integrations/))
* Google Dialogflow ([NLU](https://en.wikipedia.org/wiki/Natural-language_understanding), [STT](https://en.wikipedia.org/wiki/Speech_recognition), [TTS](https://en.wikipedia.org/wiki/Speech_synthesis))
* Functions on Firebase ([Fulfillment](https://cloud.google.com/dialogflow/docs/fulfillment-configure))

Full details on this simple app pattern can be found in the [Google Dialogflow documentation](https://cloud.google.com/dialogflow/docs/fulfillment-overview).


### Workshop Instructions

1. Navigate to the Dialogflow Console, and create a new application called whatever you'd like, as long as it's memorable.
2. In the Dialogflow console, navigate to the Fulfillment tab, and enable the _Inline Editor_. This will provide a basic NodeJS server, and intent handlers for the welcome and default intents that were created with your Dialogflow project. Scroll to the bottom of the page and click _Deploy_ to save your settings.
3. Navigate back to the Intents section, and click on the Default Welcome Intent. Scroll down to the bottom, and toggle on _Enable webhook call for this intent_. Gave a look at the default response list. By saying that this Intent will be handled by Webhooks, you are overriding these default response with whatever the Fulfillment service sends back to the user. Click 'Save' at the top of the page to lock in your changes.
4. Do the same thing for the Default Fallback Intent. This intent will be triggered if the system has trouble matching what a user said to any other intent. (It's where the genetic 'Sorry, I don't understand' responses come from. We'll make a point of improving this in our app!)
5. In the right-hand panel, test the app by typing in 'hello'. The system should respond with the response defined in your fulfillment service. Try changing the response in this service, saving, and testing it again to see the changes. Next type in something absurd, and should respond with the fallback response in your fulfillment code.
6. Now we can apply the demo code from this repository. Navigate back to the Fulfillment section, and copy-paste the code from this repo's *package.json* file over the in-line *package.json* file. Click _Deploy_ at the bottom of the page.
7. Repeat for the *index.js* file; copy it's contents over the *index.js* in the inline editor.
8. Back in the Intents section, create each intent described in the index.js file. Be sure to have Fulfill with Webhooks for each of these intents before saving them.
9. Test it out, and confirm that each intent hives you the response from your fulfillment service.

### Quick Deploy Instructions

1. Clone this repo to your local machine.
2. Navigate to the Dialogflow Console, and create a new application called whatever you'd like, as long as it's memorable.
3. Click on the Gear icon next to your project name, and then click on the Import/Export tab in your project settings.
4. Click Import Agent, and select the *agent.zip* file from your cloned repo. After some processing, the agent should fully match the definition provided by this repo!

### Known Limitations

* When using the free tier of Dialogflow, any fulfillment service you build in the inline-fulfillment system can not leverage external APIs. This can be mitigated by instead hosting your fulfillment service on a seperate service, and have Dialogflow connect to it via Webhooks.
* Google Dialogflow and Actions on Google both support only a subset of the full SSML markup. You can see [Google's documentation on the supported tags here](https://developers.google.com/assistant/actions/reference/ssml), or the [full SSML documentation by the W3 consortum here](https://www.w3.org/TR/speech-synthesis11/).

### Awesome Resources

* [Anything you need to know about the Actions on Google response types, code samples, and other great stuff. Seriously. This is the most helpful link on this list for a hacker.](https://developers.google.com/assistant/conversational/responses#suggestion_chips)
* [Working with conversations means you will likely need to use Regular Expressions. This site is your best friend for debugging RegEx.](https://regexr.com/)
* [Working on front-end visuals and not sure what your browser supports CSS-wise? Got the IE11 blues? This tool will tell you what you can use, and where.](https://caniuse.com/)
