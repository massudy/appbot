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
                            this.LineText.Center(userid,`π§π· Brazil`)
                            this.LineText.Center(userid,`π€ Population : 212 Milions`)
                            this.Button(userid,'β Back',this.Name)
                            break;

                            case 'us':
                            this.Text(userid,`πΊπΈ EUA
π€ Population : 329 Milions`)
                            this.Button(userid,'β Back',this.Name)
                            break;
                    
                        default:
                            this.LineText.Center(userid,'Hello World !!')
                            this.Button(userid,'π§π· Brazil',this.Name,{country : 'br'})
                            this.Button(userid,'πΊπΈ EUA',this.Name,{country : 'us'})
                            this.Button(userid,'Ajustar Tela','adjustscreen')
                            break;
                    }
                

                
                


            }
        )
    }
}

export default TemplateFunc