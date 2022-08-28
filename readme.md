# AppBot - Minimalist and Responsive TelegramBot

## Install
```
npm i appbot
```

## Getting Started
```
import AppBot from "appbot";

//  Class extended of Appbot.Func() with 3 parameters 
// - name : pathname of your Func/Page
// - linked : array of anothers Funcs/Pages to bot recognize and render
// - build : async function that will be executed when Func/Page is called by user click

class Menu extends AppBot.Func(){
    constructor(){
        super(
            'menu',
            [],
            async (props) => {
            this.Text(props.userid,'Hello World')
            this.Button(props.userid,'Button 1','button1')
            this.Button(props.userid,'Button 2','button2')
        })
    }
}

const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'


// Creating a new instance of bot with BOT_TOKEN and the main FUNC/PAGE

const bot = new AppBot(BOT_TOKEN,Menu)
```