class Session {
    constructor(userid,username,config = {maxfit : undefined}){
        this.userID = userid
        this.userName = username
        this.waitInput = false
        this.inputPath = null
        this.inputValue = null
        this.inAction = false
        this.lastMsgID = null
        this.actualScreen = null 
        this.maxFit = config.maxfit
        this.ExternalContent = {
            type : null
        }
    }
}

export default Session