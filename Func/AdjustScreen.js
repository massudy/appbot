import Func from "./Func.js";
import Spacing from "./Spacing.js";

class AdjustScreen extends Func {
    constructor(){
        super(
            'adjustscreen',
            [],
            async (props) => {
                const id = props.userid
            
               
                if(props.ok){
                this.SetMaxFit(id,props.fit)
                this.Text(id,'Tela ajustada com sucesso !')
                
                if(props.next){
                    this.Button(id,'Prosseguir →',props.next)
                    this.SetPath(id,props.next)
                } else {
                    this.Button(id,'Prosseguir →',props.mainfunc)
                    this.SetPath(id,props.mainfunc)
                }
                
                } else {

                if(!props.space || props.space < 5){
                    props.space = 5
                 } 
               
                
                
                this.Text(id,`• Ajustar a tela •

Exemplo correto :

⠀⠀⠀⠀    ⬇️
⬇️⠀⠀⠀⠀⠀
📱 ✅     📱 ❌  ⠀⬇️ ❌         
⬆️     ⠀   ⬆️          ⬆️          
         
Use os botões para 
levar o celular abaixo
para a *direita*
até ficar entre as setas`)
            
                this.Text(id,`
                
⬇️${Spacing(props.space)}📱
⬆️`)
  
            const side1 = []
            const side5 = []
            if(props.space >5){
                side1.push(this.SideButton('←',this.Name,{space : props.space-1,next : props.next}))
                side1.push(this.SideButton('→',this.Name,{space : props.space+1,next : props.next}))
            } else {
                side1.push(this.SideButton('→',this.Name,{space : props.space+1,next : props.next}))
            }
            
            if(props.space >5){
                side5.push(this.SideButton('← ←',this.Name,{space : props.space-5,next : props.next}))
                side5.push(this.SideButton('→ →',this.Name,{space : props.space+5,next : props.next}))
            } else {
                side5.push(this.SideButton('→→',this.Name,{space : props.space+5,next : props.next}))
            }
           
           
            this.Buttons(id,side1)
            this.Buttons(id,side5)
                
                if(props.next){
                    this.Button(id,'✔️ Confirmar Ajuste',this.Name,{ok : true,fit : props.space,next : props.next})
                } else {
                    this.Button(id,'✔️ Confirmar Ajuste',this.Name,{ok : true,fit : props.space})
                }
               
            
           
                }
            }
        )
    }
}

export default AdjustScreen