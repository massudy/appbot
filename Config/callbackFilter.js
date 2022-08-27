function callbackFilter(callback_data){
let objreturn = {
    path : undefined,
    props : undefined
}

if(callback_data.includes('{')){
    objreturn.path = callback_data.substring(0,callback_data.indexOf('{'))
    objreturn.props = JSON.parse(callback_data.substring(callback_data.indexOf('{'),callback_data.length))
   } else {
    objreturn.path = callback_data
    objreturn.props = {}
   }


return objreturn
}

export default callbackFilter