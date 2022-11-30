import TelegramBot from "node-telegram-bot-api";
import Func from "./Func/Func.js"
import Session from "./Config/Session.js";
import callbackFilter from "./Config/callbackFilter.js";
import NotFounded from "./Func/NotFounded.js";
import TemplateFunc from "./Func/TemplateFunc.js";
import Cast from "./Config/Cast.js";
import AdjustScreen from "./Func/AdjustScreen.js";
import idrule from "./Config/idrule.js";

class AppBot extends TelegramBot {
    constructor(token,mainfunc = TemplateFunc,config = {
        adjustscreen : false,
        sessions : [],
        keywords : [{keyword : '12f34f3qf43f3q4f34',func : 'functeste',props : {}}],
        admins : [],
        whitelist : [],
        blacklist : []
    }){
        super(token,{polling : true})
        
        if(mainfunc == TemplateFunc){
            console.error('ERROR - Mainfunc não carregada... | Iniciando com uma TemplateFunc')
        }
       
        this.Keywords = []
        if(config.keywords){this.Keywords.push(...config.keywords)}
        this.Token = token
        this.Funcs = [new Func]
        this.Funcs.splice(0,1)
        this.Sessions = [new Session]
        this.Sessions.splice(0,1)
        this.Admins = []
        this.WhiteList = [new idrule()]
        this.WhiteList.splice(0,1)
        this.BlackList = [new idrule()]
        this.BlackList.splice(0,1)

        if(config.admins){this.AddAdmins(config.admins)}
        if(config.blacklist){this.BlackLists.Add(config.blacklist)}
        if(config.whitelist){this.WhiteLists.Add(config.whitelist)}
    
    
        this.AddSessions(config.sessions)

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
            
            if(this.ID_Verify(c.from.id)){
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
            }
        })


        this.on('message',async (m) => {
            
            if(this.ID_Verify(m.from.id)){

                if(m.chat.type == 'private'){
            
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
                                    let find_keyword = this.Keywords.find(kw => kw.keyword == m.text)
                                    if(find_keyword){
                                    session = this.GetSession(m.from.id)
                                    if(find_keyword.props){
                                    this.ReloadScreen(`${find_keyword.func}${JSON.stringify(find_keyword.props)}`,session)
                                    }else {
                                    this.ReloadScreen(find_keyword.func,session)
                                    }
                                    
                                    } else {
                                    this.ReloadScreen(session.actualScreen,session,`⚠️ *Utilize apenas os botões*`)
                                    }
                                    
                                }
                                 } else {
                                    console.log(`${session.userName} está inAction`)
                                 }
                        } else {
                            if(!session.inAction){
                                if(m.photo && session.waitPhoto){
                                    this.getFileLink(m.photo[m.photo.length-1].file_id)
                                    .then(link => {
                                    this.Sessions[this.SessionIndex(session.userID)].inputValue = link
                                    this.Sessions[this.SessionIndex(session.userID)].waitPhoto = false
                                    session = this.GetSession(m.from.id)
                                    this.ReloadScreen(session.photoPath,session)
                                    }).catch(e => {
                                    this.Sessions[this.SessionIndex(session.userID)].inputValue = false
                                    this.Sessions[this.SessionIndex(session.userID)].waitPhoto = false
                                    session = this.GetSession(m.from.id)
                                    this.ReloadScreen(session.photoPath,session)
                                    })
                                    
                                } else if(m.video && session.waitVideo){
                
                                    this.getFileLink(m.video.file_id)
                                    .then(link => {
                                    this.Sessions[this.SessionIndex(session.userID)].inputValue = link
                                    this.Sessions[this.SessionIndex(session.userID)].waitVideo = false
                                    session = this.GetSession(m.from.id)
                                    this.ReloadScreen(session.videoPath,session)
                                    }).catch(e => {
                                    this.Sessions[this.SessionIndex(session.userID)].inputValue = false
                                    this.Sessions[this.SessionIndex(session.userID)].waitVideo = false
                                    session = this.GetSession(m.from.id)
                                    this.ReloadScreen(session.videoPath,session)
                                    })
            
                                } else {
                                this.ReloadScreen(session.actualScreen,session,`⚠️ *Utilize apenas os botões*`)
                                }
                            } else {
                                console.log(`${session.userName} está inAction`)
                             }
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
                    }

            }

        })


    }

GetSession(userid){
return this.Sessions.find(s => s.userID == userid)
}

IsAdmin(userid){
    if(this.Admins.includes(`${userid}`) || this.Admins.includes(userid)){
        return true
    } else {
        return false
    }
}

SessionIndex(userid){
return this.Sessions.findIndex(e => e.userID == userid)
}

async LoadScreen(path,session = new Session,alert = null){
this.Sessions[this.SessionIndex(session.userID)].inAction = true
this.Sessions[this.SessionIndex(session.userID)].actualScreen = path
this.Sessions[this.SessionIndex(session.userID)].waitInput = false
this.Sessions[this.SessionIndex(session.userID)].waitVideo = false
this.Sessions[this.SessionIndex(session.userID)].waitPhoto = false
this.Sessions[this.SessionIndex(session.userID)].inputValue = null
this.Sessions[this.SessionIndex(session.userID)].admin = this.IsAdmin(session.userID)

const filteredpath = callbackFilter(path)

if(filteredpath.props.page || filteredpath.props.pg){
    if(filteredpath.props.page){
        session.page = filteredpath.props.page
        this.Sessions[this.SessionIndex(session.userID)].page = filteredpath.props.page
    }
    if(filteredpath.props.pg){
        session.page = filteredpath.props.pg
        this.Sessions[this.SessionIndex(session.userID)].page = filteredpath.props.pg
    }
} else {
    session.page = null
    this.Sessions[this.SessionIndex(session.userID)].page = null
}


filteredpath.props.mainfunc = this.Funcs[0].Name
filteredpath.props.session = session
filteredpath.props.userid = session.userID
filteredpath.props.token = this.Token
const func = this.Funcs.find(f => f.Name == filteredpath.path)
let build_object
if(func){
build_object = await func.Build(filteredpath.props)
} else {
    const notfounded = new NotFounded()
    build_object = await notfounded.Build(filteredpath.props)
}

if(build_object.Alert){
    alert = build_object.Alert
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

const options = {
        reply_markup : build_object.FinalButtons.reply_markup,
        parse_mode : "Markdown"
    }


if(build_object.ExternalContent.type != null || this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type != null){
    this.deleteMessage(session.userID,session.lastMsgID).catch(e => {})
    let keyboardCreated

    if(build_object.ExternalContent.type != null){
        options.caption = build_object.FinalText
        this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = build_object.ExternalContent.type
        
        if(build_object.ExternalContent.type == 'video'){
        keyboardCreated = await this.sendVideo(session.userID,build_object.ExternalContent.url,options).catch(async (e) => {
            console.error('Não foi possivel encontrar o video no url inserido')
            build_object.FinalText = `❌ Falha ao carregar video
            
${build_object.FinalText}`
            delete options.caption
            this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = null
        keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
        .then((keyboard) => {
            return keyboard
        }).catch(e => {})
        })
        } else if (build_object.ExternalContent.type == 'photo'){
        keyboardCreated = await this.sendPhoto(session.userID,build_object.ExternalContent.url,options).catch(async(e) =>{
            console.error('Não foi possivel encontrar a imagem no url inserido')
            build_object.FinalText = `❌ Falha ao carregar imagem
            
${build_object.FinalText}`
            delete options.caption
            this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = null
        keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
        .then((keyboard) => {
            return keyboard
        }).catch(e => {})
        })
        }

        

    } else {
        this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = null
        keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
        .then((keyboard) => {
            return keyboard
        }).catch(e => {})
    }

    

    if(keyboardCreated){
        if(!session.lastMsgID){
             for(let i = keyboardCreated.message_id-20;i<keyboardCreated.message_id;i++){
                this.deleteMessage(session.userID,i).catch(e => {})
            }
            }
        this.Sessions[this.SessionIndex(session.userID)].lastMsgID = keyboardCreated.message_id
    } 

} else {
    this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = null
    this.editMessageReplyMarkup(build_object.FinalButtons.reply_markup,config).catch((e) => { })
    this.editMessageText(build_object.FinalText,config).catch((e) => { })
}



if(build_object.newPath){
    this.Sessions[this.SessionIndex(session.userID)].actualScreen = build_object.newPath
}

if(build_object.BroadcastList.length){
    this.Broadcast(build_object.BroadcastList)
}

if(build_object.newMaxFit){
    this.Sessions[this.SessionIndex(session.userID)].maxFit = build_object.newMaxFit
}

if(build_object.BlackList.addlist.length){this.BlackLists.Add(build_object.BlackList.addlist)}
if(build_object.BlackList.removelist.length){this.BlackLists.Remove(build_object.BlackList.removelist)}
if(build_object.WhiteList.addlist.length){this.WhiteLists.Add(build_object.WhiteList.addlist)}
if(build_object.WhiteList.removelist.length){this.WhiteLists.Remove(build_object.WhiteList.removelist)}


if(build_object.waitInput){
    this.Sessions[this.SessionIndex(session.userID)].waitInput = true
    this.Sessions[this.SessionIndex(session.userID)].inputPath = build_object.inputPath
}
if(build_object.waitPhoto){
    this.Sessions[this.SessionIndex(session.userID)].waitPhoto = true
    this.Sessions[this.SessionIndex(session.userID)].photoPath = build_object.photoPath
}
if(build_object.waitVideo){
    this.Sessions[this.SessionIndex(session.userID)].waitVideo = true
    this.Sessions[this.SessionIndex(session.userID)].videoPath = build_object.videoPath
}
this.Sessions[this.SessionIndex(session.userID)].inAction = false
}

async ReloadScreen(path,session = new Session,alert = null){
    this.Sessions[this.SessionIndex(session.userID)].inAction = true
    this.Sessions[this.SessionIndex(session.userID)].actualScreen = path
    this.Sessions[this.SessionIndex(session.userID)].admin = this.IsAdmin(session.userID)
    const filteredpath = callbackFilter(path)
   
    if(filteredpath.props.page || filteredpath.props.pg){
        if(filteredpath.props.page){
            session.page = filteredpath.props.page
            this.Sessions[this.SessionIndex(session.userID)].page = filteredpath.props.page
        }
        if(filteredpath.props.pg){
            session.page = filteredpath.props.pg
            this.Sessions[this.SessionIndex(session.userID)].page = filteredpath.props.pg
        }
    } else {
        session.page = null
        this.Sessions[this.SessionIndex(session.userID)].page = null
    }
   
    filteredpath.props.mainfunc = this.Funcs[0].Name
    filteredpath.props.session = session
    filteredpath.props.userid = session.userID
    filteredpath.props.token = this.Token
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

    if(build_object.Alert){
        alert = build_object.Alert
    }

    if(alert){
        build_object.FinalText = `${alert}
        
${build_object.FinalText}`
    }
    
    this.deleteMessage(session.userID,session.lastMsgID).catch(e => {})
    
    let keyboardCreated

    if(build_object.ExternalContent.type != null){
        options.caption = build_object.FinalText
        this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = build_object.ExternalContent.type
        
        if(build_object.ExternalContent.type == 'video'){
        keyboardCreated = await this.sendVideo(session.userID,build_object.ExternalContent.url,options).catch(async (e) => {
            console.error('Não foi possivel encontrar o video no url inserido')
            build_object.FinalText = `❌ Falha ao carregar video
            
${build_object.FinalText}`
            delete options.caption
            this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = null
        keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
        .then((keyboard) => {
            return keyboard
        }).catch(e => {})
        })
        } else if (build_object.ExternalContent.type == 'photo'){
        keyboardCreated = await this.sendPhoto(session.userID,build_object.ExternalContent.url,options).catch(async (e) =>{
            console.error('Não foi possivel encontrar a imagem no url inserido')
            build_object.FinalText = `❌ Falha ao carregar imagem
            
${build_object.FinalText}`
            delete options.caption
            this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = null
        keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
        .then((keyboard) => {
            return keyboard
        }).catch(e => {})
        })
        }

        

    } else {
        this.Sessions[this.SessionIndex(session.userID)].ExternalContent.type = null
        keyboardCreated = await this.sendMessage(session.userID,build_object.FinalText,options)
        .then((keyboard) => {
            return keyboard
        }).catch(e => {})
    }

    

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
    if(build_object.waitPhoto){
        this.Sessions[this.SessionIndex(session.userID)].waitPhoto = true
        this.Sessions[this.SessionIndex(session.userID)].photoPath = build_object.photoPath
    }
    if(build_object.waitVideo){
        this.Sessions[this.SessionIndex(session.userID)].waitVideo = true
        this.Sessions[this.SessionIndex(session.userID)].videoPath = build_object.videoPath
    }
    this.Sessions[this.SessionIndex(session.userID)].inAction = false
}

ID_Verify(id){
if(this.WhiteList.length){
if(this.WhiteList.findIndex(idrule => idrule.ID == id) != -1){return true} else {return false}
} else {
if(this.BlackList.findIndex(idrule => idrule.ID == id) == -1){return true} else {return false}
}
}

Broadcast(castlist = [new Cast]){
this.BroadcastList.push(...castlist)
}

AddSessions(sessionlist = [new Session]){
    this.Sessions.push(...sessionlist)
}

AddAdmins(admins = []){this.Admins.push(...admins)}

WhiteLists = {
    Add : (idrule_list = [new idrule()]) => {
        idrule_list.forEach(id_rule => {
            if(this.WhiteList.findIndex(idrule => idrule.ID == id_rule.ID) == -1){
                this.WhiteList.push(id_rule)
            }
        })
        
    },
    Remove : (ids_list = ['']) => {
        ids_list.forEach(id => {
            const index = this.WhiteList.findIndex(idrule => idrule.ID == id)
            if(index != -1){
                this.WhiteList.splice(index,1)
            }
        })
    },
    View : () => {return this.WhiteList}
}
BlackLists = {
    Add : (idrule_list = [new idrule()]) => {
        idrule_list.forEach(id_rule => {
            if(this.BlackList.findIndex(idrule => idrule.ID == id_rule.ID) == -1){
                this.BlackList.push(id_rule)
            }
        })
       
    },
    Remove : (ids_list = ['']) => {
        ids_list.forEach(id => {
            const index = this.BlackList.findIndex(idrule => idrule.ID == id)
            if(index != -1){
                this.BlackList.splice(index,1)
            }
        })
    },
    View : () => {return this.BlackList}
}

static ID_Rule(id,date = '',action = async () => {}){return new idrule(id,date,action)}

static Session(){return Session}

static Cast(userid,path,props = {}){return new Cast(userid,path,props)}

static Func(){return Func}

}

export default AppBot


