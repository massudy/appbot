import TelegramBot from "node-telegram-bot-api";
import Func from "./Func/Func.js"
import Session from "./Session.js";
import callbackFilter from "./callbackFilter.js";
import NotFounded from "./Func/NotFounded.js";

class AppBot extends TelegramBot {
    constructor(token,mainfunc){
        super(token,{polling : true})
    
        this.Funcs = [new Func]
        this.Funcs.splice(0,1)
        this.Sessions = [new Session]
        
        let funcs = []
        let toadd = []
        const firstfunc = new mainfunc()
        funcs.push(firstfunc)
        toadd.push(...firstfunc.Linked)
        while(toadd.length){
            toadd.forEach((f,i) => {
                const instancedfunc = new f()
                if(!funcs.find(e => e.Name == instancedfunc.Name)){
                    funcs.push(instancedfunc)
                    toadd.push(...instancedfunc.Linked)
                }
            toadd.splice(i,1)
            })
        }
        this.Funcs.push(...funcs)
    
        
        
        this.on('callback_query',(c) => {
            console.log(c)
            let session = this.GetSession(c.from.id)
            if(session){
                this.LoadScreen(c.data,session)
            } else {
                for(let i = c.message.message_id-20;i<=c.message.message_id;i++){
                    this.deleteMessage(c.from.id,i).catch(e => {})
                }
               
                this.Sessions.push(new Session(c.from.id,c.from.first_name))
                session = this.GetSession(c.from.id)
                this.ReloadScreen(this.Funcs[0].Name,session)
            }
            
        })


        this.on('message',async (m) => {
        let session = this.GetSession(m.from.id)
        if(session){
            if(m.text){
                if(!session.inAction){
                    if(session.waitInput){
                        this.Sessions[this.SessionIndex(session.userID)].inputValue = m.text
                        this.Sessions[this.SessionIndex(session.userID)].waitInput = false
                        session = this.GetSession(m.from.id)
                        this.ReloadScreen(session.inputPath,session)
                    } else {
                        this.ReloadScreen(session.actualScreen,session,`⚠️ *Para navegar utilize apenas os botões*`)
                    }
                     } else {
                        console.log(`${session.userName} está inAction`)
                     }
            } else {
                this.ReloadScreen(session.actualScreen,session,`⚠️ *Para navegar utilize apenas os botões*`)
            }
           
        } else {
            for(let i = m.message_id-20;i<=m.message_id;i++){
                this.deleteMessage(m.from.id,i).catch(e => {})
            }
            this.Sessions.push(new Session(m.from.id,m.from.first_name))
        session = this.GetSession(m.from.id)
        this.ReloadScreen(this.Funcs[0].Name,session,'Boas vindas')
          }
        

        })


    }

GetSession(userid){
return this.Sessions.find(s => s.userID == userid)
}

SessionIndex(userid){
return this.Sessions.findIndex(e => e.userID == userid)
}

async LoadScreen(path,session = new Session,alert = null){
this.Sessions[this.SessionIndex(session.userID)].inAction = true
this.Sessions[this.SessionIndex(session.userID)].actualScreen = path
const filteredpath = callbackFilter(path)
filteredpath.props.mainfunc = this.Funcs[0].Name
filteredpath.props.session = session
filteredpath.props.userid = session.userID
const func = this.Funcs.find(f => f.Name == filteredpath.path)
let build_object
if(func){
build_object = await func.Build(filteredpath.props)
} else {
    const notfounded = new NotFounded()
    build_object = await notfounded.Build(filteredpath.props)
}
if(alert){
    build_object.FinalText = `${alert}
    
${build_object.FinalText}`
}
const config = {
        chat_id : session.userID,
        message_id : session.lastMsgID,
        parse_mode : "Markdown"
    }   

this.editMessageReplyMarkup(build_object.FinalButtons.reply_markup,config).catch((e) => { })
this.editMessageText(build_object.FinalText,config).catch((e) => { })

if(build_object.waitInput){
    this.Sessions[this.SessionIndex(session.userID)].waitInput = true
    this.Sessions[this.SessionIndex(session.userID)].inputPath = build_object.inputPath
}
this.Sessions[this.SessionIndex(session.userID)].inAction = false
}

async ReloadScreen(path,session = new Session,alert = null){
    this.Sessions[this.SessionIndex(session.userID)].inAction = true
    this.Sessions[this.SessionIndex(session.userID)].actualScreen = path
    const filteredpath = callbackFilter(path)
    filteredpath.props.mainfunc = this.Funcs[0].Name
    filteredpath.props.session = session
    filteredpath.props.userid = session.userID
    const func = this.Funcs.find(f => f.Name == filteredpath.path)
    let build_object
    if(func){
    build_object = await func.Build(filteredpath.props)
     } else {
        const notfounded = new NotFounded()
        build_object = await notfounded.Build(filteredpath.props)
       }
       const options = {
        reply_markup : build_object.FinalButtons.reply_markup,
        parse_mode : "Markdown"
    }
    if(alert){
        build_object.FinalText = `${alert}
        
${build_object.FinalText}`
    }
    console.log(session)
    this.deleteMessage(session.userID,session.lastMsgID).catch(e => {})
    const keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
    .then((keyboard) => {
        return keyboard
    }).catch(e => {})

    if(keyboardCreated){
        this.Sessions[this.SessionIndex(session.userID)].lastMsgID = keyboardCreated.message_id
    } 
    if(build_object.waitInput){
        this.Sessions[this.SessionIndex(session.userID)].waitInput = true
        this.Sessions[this.SessionIndex(session.userID)].inputPath = build_object.inputPath
    }
    this.Sessions[this.SessionIndex(session.userID)].inAction = false
}




}

export default AppBot