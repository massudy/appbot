import Button from "./Button.js"

class Func {
constructor(name,linked = [],build = async (props) => {}){
    
    //Propriedades padrão de uma Func
    this.Name = name // Name : o nome da funcionalidade em minusculo para ser instanciado como uma funcionalidade no AppBot
    this.Linked = linked // Linked : array de outras funcionalidades a serem linkadas e compreendidas no AppBot

    //array de builds, a cada build é criado um objeto build em branco que é preenchido com a função build() da funcionalidade e depois é removida
    this.Builds = [{
        id : 0,
        FullyText : '',
        FullyButtons : [],
        waitInput : false,
        inputPath : ''
        
    }]

    //Funções que preenchem texto e botões
    this.Text = (id,text = '') => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            if(text.length < 4090){
            this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText = text
            } else {
                console.error(`Falha ao carregar o texto ${text.substring(0,40)} | TEXTO MUITO GRANDE`)
                this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText = 'Erro ao carregar texto'
            }
             } else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao carregar o texto ${text} na Func ${this.Name} | ${erro}`)
            }
       }
    
     this.Button = (id,text,path,props = {},url = false) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
           this.Builds[this.Builds.findIndex(e => e.id == id)].FullyButtons.push([Button.New(text,`${path}${JSON.stringify(props)}`,url)])
             } else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao carregar o botão ${text} na Func ${this.Name} | ${erro}`)
            }
   }
    
   this.Buttons = (id,sidebuttons = []) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
           
            this.Builds[this.Builds.findIndex(e => e.id == id)].FullyButtons.push([...sidebuttons])
        } else {
       let erro
       if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
       console.error(`Falha ao carregar os botões na Func ${this.Name} | ${erro}`)
       }
       
      
    }
    this.SideButton = (text,path,props = {},url = false) => {
       return Button.New(text,`${path}${JSON.stringify(props)}`,url)
    }
    
    this.WaitInput = (id,inputpath = this.Name,props = {}) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitInput = true
           this.Builds[this.Builds.findIndex(e => e.id == id)].inputPath = `${inputpath}${JSON.stringify(props)}`
           
        } else {
       let erro
       if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
       console.error(`Falha ao ativar o WaitInput na Func ${this.Name} | ${erro}`)
       }
    }
   
    //Função de build principal, executa a função build criada na raiz da funcionalidade e retorna o text e buttons gerados por ela
    this.Build = async (props) => { 
       try {
        this.Builds.push({id : props.userid,FullyText : '',FullyButtons : [],waitInput : false,inputPath : ''})
        await build(props)
        if(this.Builds[this.Builds.findIndex(e => e.id == props.userid)]){
            return {
                FinalText : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].FullyText,
                FinalButtons : {reply_markup : {
                    inline_keyboard : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].FullyButtons
                }},
                waitInput : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].waitInput,
                inputPath : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].inputPath
            }
        } else {
            return {
                FinalText : 'Erro de carregamento',
                FinalButtons : {reply_markup : {
                    inline_keyboard : Button.New('← Voltar',props.mainfunc)
                }}
            } 
        }
       
       } finally {
        this.Builds.splice(this.Builds.findIndex(e => e.id == props.userid),1)
       }
        
    }
}


}

export default Func