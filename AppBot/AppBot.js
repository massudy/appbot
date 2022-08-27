import TelegramBot from "node-telegram-bot-api";
import Func from "./Func/Func.js";

class AppBot extends TelegramBot {
    constructor(token,mainfunc){
        super(token,{polling : true})
    
        this.Funcs = []
        //this.Sessions [new Session]
        
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
    
    

    }






}

export default AppBot