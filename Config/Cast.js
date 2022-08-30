class Cast {
    constructor(userid,path,props = {}){
        this.userID = userid
        this.Path = `${path}${JSON.stringify(props)}`
    }
}

export default Cast