import Func from "./Func.js";

class TemplateFunc extends Func {
    constructor(){
        super(
            'templatefunc',
            [],
            async (props) => {
                const userid = props.userid
                
                    switch (props.country) {
                        case 'br':
                            this.Text(userid,`🇧🇷 Brazil
👤 Population : 212 Milions`)
                            this.Button(userid,'← Back',this.Name)
                            break;

                            case 'us':
                            this.Text(userid,`🇺🇸 EUA
👤 Population : 329 Milions`)
                            this.Button(userid,'← Back',this.Name)
                            break;
                    
                        default:
                            this.Text(userid,'Hello World')
                            this.Button(userid,'🇧🇷 Brazil',this.Name,{country : 'br'})
                            this.Button(userid,'🇺🇸 EUA',this.Name,{country : 'us'})
                        break;
                    }
                

                
                


            }
        )
    }
}

export default TemplateFunc