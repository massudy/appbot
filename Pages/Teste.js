import Func from "../AppBot/Func/Func.js"

class Teste extends Func {
    constructor(){
        super(
           'testando',
           [],
           async (props) => {
            this.Text(props.userid,'Oie')  
            this.Button(props.userid,'Ir para o Menu','menu',{cocozao:'uhlala'})
            this.Buttons(props.userid,[
                this.SideButton('Botão 1','lugar1'),
                this.SideButton('Botão 2','lugar2')
            ])
            this.Button(props.userid,'Voltar para o menu','menu')

            } 
        )
    }
}
 

export default Teste