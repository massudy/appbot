import Func from "../AppBot/Func/Func.js"
import Teste from "./Teste.js"

class Menu extends Func {
    constructor(){
        super(
           'menu',
           [Teste],
           async (props) => {
            this.Text(props.userid,'Oie')  
            this.Button(props.userid,'Ir para o Menu','menu',{daniel:'ratito'})
            this.Buttons(props.userid,[
                this.SideButton('Botão 1','testando'),
                this.SideButton('Botão 2','lugar2')
            ])

            } 
        )
    }
}
 

export default Menu