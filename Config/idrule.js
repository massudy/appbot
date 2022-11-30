class idrule{
    constructor(id,date = '',action = async () => {}){
        this.ID = id
        this.Date = date
        this.Action = action
    
    }
}

export default idrule