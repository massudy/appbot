import TelegramBot from "node-telegram-bot-api";
import Func from "./Func/Func.js"
import Session from "./Config/Session.js";
import callbackFilter from "./Config/callbackFilter.js";
import NotFounded from "./Func/NotFounded.js";
import TemplateFunc from "./Func/TemplateFunc.js";
import Cast from "./Config/Cast.js";
import AdjustScreen from "./Func/AdjustScreen.js";

class AppBot extends TelegramBot {
    constructor(token,mainfunc = TemplateFunc,config = {adjustscreen : false}){
        super(token,{polling : true})
        
        if(mainfunc == TemplateFunc){
            console.error('ERROR - Mainfunc não carregada... | Iniciando com uma TemplateFunc')
        }
        
       
        this.Funcs = [new Func]
        this.Funcs.splice(0,1)
        this.Sessions = [new Session]
        this.Sessions.splice(0,1)
        
        this.BroadcastList = [new Cast]
        this.BroadcastList.splice(0,1)
        
        this.Broadcaster = setInterval(() => {
            if(this.BroadcastList.length){
               const cast = this.BroadcastList.splice(0,1).at(0)
               if(cast.userID && cast.Path){
                const session = this.GetSession(cast.userID) 
                if(session){
                 console.log(`Mensagem enviada para ${session.userName}`)
                 this.ReloadScreen(cast.Path,session)
                } else {
                 console.log(`Usuario de id ${cast.userID} não esta na session list`)
                }
               }
             }
        }, 500);

        
        let funcs = []
        let toadd = []
        const firstfunc = new mainfunc()
        funcs.push(firstfunc)
        funcs.push(new AdjustScreen)
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
            let session = this.GetSession(c.from.id)
            if(session){
                this.LoadScreen(c.data,session)
            } else {
                for(let i = c.message.message_id-20;i<=c.message.message_id;i++){
                    this.deleteMessage(c.from.id,i).catch(e => {})
                }
               
                this.Sessions.push(new Session(c.from.id,c.from.first_name))
                session = this.GetSession(c.from.id)
                if(config.adjustscreen && !session.maxFit){
                    this.ReloadScreen('adjustscreen',session)
                } else {
                    this.ReloadScreen(this.Funcs[0].Name,session)
                }
                
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
                        this.ReloadScreen(session.actualScreen,session,`⚠️ *Utilize apenas os botões*`)
                    }
                     } else {
                        console.log(`${session.userName} está inAction`)
                     }
            } else {
                this.ReloadScreen(session.actualScreen,session,`⚠️ *Utilize apenas os botões*`)
            }
           
        } else {
            for(let i = m.message_id-20;i<=m.message_id;i++){
                this.deleteMessage(m.from.id,i).catch(e => {})
            }
            this.Sessions.push(new Session(m.from.id,m.from.first_name))
        session = this.GetSession(m.from.id)
        if(config.adjustscreen && !session.maxFit){
            this.ReloadScreen('adjustscreen',session)
        } else {
            this.ReloadScreen(this.Funcs[0].Name,session)
        }
        
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
this.Sessions[this.SessionIndex(session.userID)].waitInput = false
this.Sessions[this.SessionIndex(session.userID)].inputValue = null

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

if(build_object.newPath){
    this.Sessions[this.SessionIndex(session.userID)].actualScreen = build_object.newPath
}

if(build_object.BroadcastList.length){
    this.Broadcast(build_object.BroadcastList)
}

if(build_object.newMaxFit){
    this.Sessions[this.SessionIndex(session.userID)].maxFit = build_object.newMaxFit
}

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
    
    this.deleteMessage(session.userID,session.lastMsgID).catch(e => {})
    
    const keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
    .then((keyboard) => {
        return keyboard
    }).catch(e => {})

    if(keyboardCreated){
        if(!session.lastMsgID){
             for(let i = keyboardCreated.message_id-20;i<keyboardCreated.message_id;i++){
                this.deleteMessage(session.userID,i).catch(e => {})
            }
            }
        this.Sessions[this.SessionIndex(session.userID)].lastMsgID = keyboardCreated.message_id
    } 
    if(session.inputValue){
        this.Sessions[this.SessionIndex(session.userID)].inputValue = null
    }
    
    if(build_object.newMaxFit){
        this.Sessions[this.SessionIndex(session.userID)].maxFit = build_object.newMaxFit
    }

    if(build_object.newPath){
        this.Sessions[this.SessionIndex(session.userID)].actualScreen = build_object.newPath
    }

    if(build_object.BroadcastList.length){
        this.Broadcast(build_object.BroadcastList)
    }

    if(build_object.waitInput){
        this.Sessions[this.SessionIndex(session.userID)].waitInput = true
        this.Sessions[this.SessionIndex(session.userID)].inputPath = build_object.inputPath
    }
    this.Sessions[this.SessionIndex(session.userID)].inAction = false
}

Broadcast(castlist = [new Cast]){
this.BroadcastList.push(...castlist)
}

AddSessions(sessionlist = [new Session]){
    this.Sessions.push(...sessionlist)
}

static Session(){return Session}

static Cast(userid,path,props = {}){return new Cast(userid,path,props)}

static Func(){return Func}

}

export default AppBot


