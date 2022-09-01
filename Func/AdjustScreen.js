import Func from "./Func.js";
import Spacing from "./Spacing.js";

class AdjustScreen extends Func {
    constructor(){
        super(
            'adjustscreen',
            [],
            async (props) => {
                const id = props.userid
            
               
                if(props.confirm){
                this.SetMaxFit(id,props.fit)
                this.Text(id,'Tela ajustada com sucesso !')
                this.Button(id,'← Voltar',props.mainfunc)
                this.SetPath(id,props.mainfunc)
                } else {

                if(!props.space || props.space < 5){
                    props.space = 5
                 } 
               
                
                
                this.Text(id,`🌟 Vamos ajustar a tela 🌟

⠀⠀⠀⠀    ⬇️
⬇️⠀⠀⠀⠀⠀
📱 ✅     📱 ❌  ⠀⬇️ ❌         
⬆️     ⠀   ⬆️          ⬆️          
         
*Mova o 📱 até
ficar igual o exemplo
correto de cima*`)
            
                this.Text(id,`
                
⬇️${Spacing(props.space)}📱
⬆️`)
  
            const side1 = []
            const side5 = []
            if(props.space >5){
                side1.push(this.SideButton('←',this.Name,{space : props.space-1}))
                side1.push(this.SideButton('→',this.Name,{space : props.space+1}))
            } else {
                side1.push(this.SideButton('→',this.Name,{space : props.space+1}))
            }
            
            if(props.space >5){
                side5.push(this.SideButton('← ←',this.Name,{space : props.space-5}))
                side5.push(this.SideButton('→ →',this.Name,{space : props.space+5}))
            } else {
                side5.push(this.SideButton('→→',this.Name,{space : props.space+5}))
            }
           
           
            this.Buttons(id,side1)
            this.Buttons(id,side5)
            
                this.Button(id,'✔️ Confirmar Ajuste',this.Name,{confirm : true,fit : props.space})
            
           
                }
            }
        )
    }
}

export default AdjustScreen