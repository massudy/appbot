class Session {
    constructor(userid,username,config = {maxfit : undefined, role : undefined}){
        this.userID = userid
        this.userName = username
        this.waitInput = false
        this.inputPath = null
        this.inputValue = null
        this.inAction = false
        this.lastMsgID = null
        this.actualScreen = null
        this.prevScreen = null  
        this.maxFit = config.maxfit
        this.ExternalContent = {
            type : null
        }
        this.waitPhoto = false
        this.photoPath = null
        this.waitVideo = false
        this.videoPath = null
        this.page = null
        this.admin = false
        this.role = config.role || 'user'
    }
}

export default Session