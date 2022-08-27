class Button {

    static New(TEXT,CALLBACK,URL = false){
    
    if(!URL){
        return {
            text : TEXT,
            callback_data : CALLBACK
            }
    } else {
        return {
            text : TEXT,
            url : CALLBACK
            }
    }
    
    }
    
    
    }
    
    export default Button