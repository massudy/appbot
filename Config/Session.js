class Session {
    constructor(userid,username){
        this.userID = userid
        this.userName = username
        this.waitInput = false
        this.inputPath = null
        this.inputValue = null
        this.inAction = false
        this.lastMsgID = null
        this.actualScreen = null 
    }
}

export default Session