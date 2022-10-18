import Button from "./Button.js"
import Cast from "../Config/Cast.js"
import Session from "../Config/Session.js"
import Spacing from "./Spacing.js"
class Func {
constructor(name,linked = [],build = async (props) => {}){
    
    //Propriedades padrão de uma Func
    this.Name = name // Name : o nome da funcionalidade em minusculo para ser instanciado como uma funcionalidade no AppBot
    this.Linked = linked // Linked : array de outras funcionalidades a serem linkadas e compreendidas no AppBot

    class userBuild{
        constructor(id,session = new Session){
            this.id = id
            this.Session = session
            this.FullyText = ''
            this.FullyButtons = []
            this.waitInput = false
            this.inputPath = ''
            this.BroadcastList = []
            this.newPath = null
            this.maxFit = null
            this.ExternalContent = {
                type : null,
                url : null,
            }
        }
    }


    //array de builds, a cada build é criado um objeto build em branco que é preenchido com a função build() da funcionalidade e depois é removida
    this.Builds = [new userBuild(0)]

    //Funções que preenchem texto e botões
    this.Text = (id,text = '') => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            if(text.length < 4090){
                if(this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText.length){
                    this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText = `${this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText}
${text}`
                } else {
                    this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText = text
                }
                
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
            if(url){
                this.Builds[this.Builds.findIndex(e => e.id == id)].FullyButtons.push([Button.New(text,`${path}`,url)])
            } else {
                this.Builds[this.Builds.findIndex(e => e.id == id)].FullyButtons.push([Button.New(text,`${path}${JSON.stringify(props)}`,url)])
            }
           
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
        if(url){
            return Button.New(text,`${path}`,url)
        } else {
            return Button.New(text,`${path}${JSON.stringify(props)}`,url)
        }
       
       
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
   
    this.Broadcast = (id,castlist = [new Cast]) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
        this.Builds[this.Builds.findIndex(e => e.id == id)].BroadcastList.push(...castlist)
        } else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao ativar o Broadcast na Func ${this.Name} | ${erro}`)
        }
        
    }

    this.Cast = (userid,path,props = {}) => {return new Cast(userid,path,props)}

    this.SetPath = (id,path,props = {}) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            this.Builds[this.Builds.findIndex(e => e.id == id)].newPath = `${path}${JSON.stringify(props)}`
            } else {
                let erro
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao ativar o SetPath na Func ${this.Name} | ${erro}`)
            }
    }

    this.SetMaxFit = (id,maxfit) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            this.Builds[this.Builds.findIndex(e => e.id == id)].maxFit = maxfit
            } else {
                let erro
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao ativar o SetMaxFit na Func ${this.Name} | ${erro}`)
            }
    }

    this.LineText = {
        Start : (id,text = '') => {
        this.Text(id,text)
        },
        Center : (id,text = '') => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            const maxfit = this.Builds[this.Builds.findIndex(e => e.id == id)].Session.maxFit
            if(maxfit){
            const diff = maxfit-text.length
            const finaltext = `${Spacing(Math.floor(diff/2))}${text}${Spacing(Math.floor(diff/2))}`
            this.Text(id,finaltext)
            } else {
            this.Text(id,text)
            }
        } else {
            this.Text(id,text)
        }
        
        },
        End : (id,text = '') => {
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                const maxfit = this.Builds[this.Builds.findIndex(e => e.id == id)].Session.maxFit
                if(maxfit){
                const diff = maxfit-text.length
                const finaltext = `${Spacing(diff-1)}${text}`
                this.Text(id,finaltext)
                } else {
                this.Text(id,text) 
                }
            } else {
                this.Text(id,text) 
            }
           
        }

    }

    this.Photo = (id,url) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            this.Builds[this.Builds.findIndex(e => e.id == id)].ExternalContent.type = 'photo'
            this.Builds[this.Builds.findIndex(e => e.id == id)].ExternalContent.url = url

        } else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao carregar a imagem na Func ${this.Name} | ${erro}`)
        }
    }

    this.Video = (id,url) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            this.Builds[this.Builds.findIndex(e => e.id == id)].ExternalContent.type = 'video'
            this.Builds[this.Builds.findIndex(e => e.id == id)].ExternalContent.url = url

        } else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao carregar o video na Func ${this.Name} | ${erro}`)
        }
    }

    //Função de build principal, executa a função build criada na raiz da funcionalidade e retorna o text e buttons gerados por ela
    this.Build = async (props) => { 
       try {
        this.Builds.push(new userBuild(props.userid,props.session))
        await build(props)
        if(this.Builds[this.Builds.findIndex(e => e.id == props.userid)]){
            return {
                FinalText : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].FullyText,
                FinalButtons : {reply_markup : {
                    inline_keyboard : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].FullyButtons
                }},
                waitInput : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].waitInput,
                inputPath : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].inputPath,
                BroadcastList : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].BroadcastList,
                newPath : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].newPath,
                newMaxFit :  this.Builds[this.Builds.findIndex(e => e.id == props.userid)].maxFit,
                ExternalContent : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].ExternalContent
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