import Func from "../AppBot/Func/Func.js"

class Teste extends Func {
    constructor(){
        super(
           'testando',
           [],
           async (props) => {
            this.Text('Oie')  
            this.Button('Ir para o Menu','menu',{cocozao:'uhlala'})
            this.Buttons([
                this.SideButton('Botão 1','lugar1'),
                this.SideButton('Botão 2','lugar2')
            ])

            } 
        )
    }
}
 

export default Teste