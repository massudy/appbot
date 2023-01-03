import Button from "./Button.js"
import Cast from "../Config/Cast.js"
import Session from "../Config/Session.js"
import Spacing from "./Spacing.js"
import idrule from "../Config/idrule.js"
import callbackFilter from "../Config/callbackFilter.js"
import CodeGenerator from "../Config/CodeGenerator.js"
import VanillaDate from "../Config/VanillaDate.js"

const BuildPagination = (fullarray = [], items_per_page = 5) => {
    let pagination = [{
         page : 1,
         list : []
     }]
     pagination.splice(0,1)
     
     let object_model = {}
     let count = 0
     let type = typeof fullarray[0]
     
 
     fullarray.forEach((t,index) => {
         if (count == 0) {
             if(index == 0){
                 type = typeof t
                 if(typeof t == 'object'){
                     object_model = t
                 }
             }
             if(typeof t == type){
                 if(typeof t == 'object'){
                    let fullinclude = true
                    Object.keys(t).forEach(k => {
                        if(!Object.keys(object_model).includes(k)){
                            fullinclude = false
                        }
                    })
                     if(fullinclude){
                         pagination.push({ page: pagination.length + 1, list: [] })
                     pagination[pagination.length - 1].list.push(t)
                     count += 1
                     }
                 } else {
                    pagination.push({ page: pagination.length + 1, list: [] })
                     pagination[pagination.length - 1].list.push(t)
                     count += 1
                 }
                 
             }
             
         } else {
             if(typeof t == type){
                 if(typeof t == 'object'){
                    let fullinclude = true
                    Object.keys(t).forEach(k => {
                        if(!Object.keys(object_model).includes(k)){
                            fullinclude = false
                        }
                    })
                     if(fullinclude){
                     pagination[pagination.length - 1].list.push(t)
                     count += 1
                     }
                 } else {
                     pagination[pagination.length - 1].list.push(t)
                     count += 1
                 }
             }
         }
         
         if (count == items_per_page) { count = 0 }
     })
 return pagination
 }
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
            this.waitPhoto = false
            this.photoPath = ''
            this.waitVideo = false
            this.videoPath = ''
            this.AlertMessage = null
            this.WhiteList = {
                addlist : [],
                removelist : []
            }
            this.BlackList = {
                addlist : [],
                removelist : []
            }
            this.NewRoles = [{id : '',newrole : ''}]
            this.NewRoles.splice(0,1)
        }
    }


    //array de builds, a cada build é criado um objeto build em branco que é preenchido com a função build() da funcionalidade e depois é removida
    this.Builds = [new userBuild(0)]

    //o famoso user storage
    this.userStorage = {}

    this.Storages = {
        Set : (id,type,value) => {
            if(this.userStorage[id]){
                if(type){
                     this.userStorage[id][type] = value
                }
            } else {
                this.userStorage[id] = {}
                if(type){
                    this.userStorage[id][type] = value
                }
            }
        },
        Get : (id,type) => {
            const objreturn = {
                success : false,
                value : undefined
            }
            if(this.userStorage[id]){
                if(type){
                    if(this.userStorage[id][type] && this.userStorage[id][type] != {}){
                        objreturn.value = this.userStorage[id][type]
                        objreturn.success = true
                    }
                } else {
                    objreturn.value = this.userStorage[id]
                    objreturn.success = true
                }
                
            }
        
        return objreturn
        },
        Clear : (id,type) => {
            if(this.userStorage[id]){
                if(type){
                    if(this.userStorage[id][type]){
                        delete this.userStorage[id][type]
                    }
                } else {
                    delete this.userStorage[id]
                }
            }
        }
    
    }
   

    //Funções que preenchem texto e botões
    this.Text = (id,text = '',breakline = false) => {
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
            if(breakline){this.Text(id,'',false)} 
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
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitPhoto = false
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitVideo = false
           this.Builds[this.Builds.findIndex(e => e.id == id)].inputPath = `${inputpath}${JSON.stringify(props)}`
           
        } else {
       let erro
       if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
       console.error(`Falha ao ativar o WaitInput na Func ${this.Name} | ${erro}`)
       }
    }

    this.WaitPhoto = (id,inputpath = this.Name,props = {}) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitInput = false
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitPhoto = true
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitVideo = false
           this.Builds[this.Builds.findIndex(e => e.id == id)].photoPath = `${inputpath}${JSON.stringify(props)}`
           
        } else {
       let erro
       if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
       console.error(`Falha ao ativar o WaitPhoto na Func ${this.Name} | ${erro}`)
       }
    }

    this.WaitVideo = (id,inputpath = this.Name,props = {}) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitInput = false
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitPhoto = false
           this.Builds[this.Builds.findIndex(e => e.id == id)].waitVideo = true
           this.Builds[this.Builds.findIndex(e => e.id == id)].videoPath = `${inputpath}${JSON.stringify(props)}`
           
        } else {
       let erro
       if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
       console.error(`Falha ao ativar o WaitVideo na Func ${this.Name} | ${erro}`)
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

    this.Page = async (id,name = '',code = async () => {},config = {pagelabel : undefined}) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            if(name == this.Builds[this.Builds.findIndex(e => e.id == id)].Session.page){
                if(config.pagelabel){
                    this.PageLabel(id,config.pagelabel)
                }
                await code()
            } else {
                if(name.length == 0 && !this.Builds[this.Builds.findIndex(e => e.id == id)].Session.page){
                    if(config.pagelabel){
                        this.PageLabel(id,config.pagelabel)
                    }
                    await code() 
                }
            }


        } else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao carregar a page ${name} | ${erro}`)
        }

    }

    this.PageLabel = (id,pagelabel) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            
            if(this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText.length){
                this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText = `• ${pagelabel}
            
                ${this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText}`
            } else {
                this.Builds[this.Builds.findIndex(e => e.id == id)].FullyText = `• ${pagelabel}
`
            }
        }  else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao carregar a PageLabel ${pagelabel} | ${erro}`)
        }
    }

    this.IsAdmin = (id) => {
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            return this.Builds[this.Builds.findIndex(e => e.id == id)].Session.admin
          } else {
            let erro
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao executar o método IsAdmin | ${erro}`) 
        }
    }

    this.Alert = (id,message = '',default_emoji = true) => {
        let erro
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
            if(message.length <= 50){
                if(default_emoji){
                    this.Builds[this.Builds.findIndex(e => e.id == id)].AlertMessage = `⚠️ ${message}`
                } else {
                    this.Builds[this.Builds.findIndex(e => e.id == id)].AlertMessage = message
                }
            } else {
               erro = 'Message grande demais, máximo de 50 characters'
                console.error(`Falha ao executar o método Alert | ${erro}`) 
            }
        } else {
            
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao executar o método Alert | ${erro}`) 
        }
    }

    this.WhiteLists = {
        Add : (id,idrule_list = [new idrule()]) => {
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                this.Builds[this.Builds.findIndex(e => e.id == id)].WhiteList.addlist.push(...idrule_list)
            } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Whitelists.add() | ${erro}`)   
            }
        },
        Remove : (id,ids_list = ['']) => {
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                this.Builds[this.Builds.findIndex(e => e.id == id)].WhiteList.removelist.push(...ids_list)
            } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Whitelists.remove() | ${erro}`)   
            }
        }
    }
    this.BlackLists = {
        Add : (id,idrule_list = [new idrule()]) => {
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                this.Builds[this.Builds.findIndex(e => e.id == id)].BlackList.addlist.push(...idrule_list)
            } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Blacklists.add() | ${erro}`)   
            }
        },
        Remove : (id,ids_list = ['']) => {
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                this.Builds[this.Builds.findIndex(e => e.id == id)].BlackList.removelist.push(...ids_list)
            } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Blacklists.remove() | ${erro}`)   
            }
        }
    }

    this.Role = {
        Check : (id,role) => {
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                if(this.Builds[this.Builds.findIndex(e => e.id == id)].Session.role == role){
                    return true
                } else {return false}
            } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Role.Check | ${erro}`)   
            }
        },
        Set : (id,id_to_set,role) => {
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                if(this.Builds[this.Builds.findIndex(e => e.id == id)].Session.admin){
                    this.Builds[this.Builds.findIndex(e => e.id == id)].NewRoles.push({id : id_to_set,newrole : role})
                    return true
                } else {return false}
            } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Role.Set | ${erro}`)   
            }
        }
    }

    this.Pagination = {
        Button : (id,array = [],config = {
            actual_page : 1,
            itens_per_page : 5,
            button : {
                text : [{type : 'text',value : 'text1'},{type : 'key',value : 'ID'}],
                path : {type : 'text',value : 'path1'},
                props : [{props_key : 'id',type : 'text', value : 'ID'}]
                },
            template_config : true
        }) => {
            let page = 1
            let objreturn = {
                actual_page : page,
                total_pages : 0
            }
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){
                let actual = callbackFilter(this.Builds[this.Builds.findIndex(e => e.id == id)].Session.actualScreen)
                let remote_actualprops = actual.props
                let semprops = true
                //buildpagination
               let per_page = 5
                if(config.itens_per_page){if(config.itens_per_page != 5){per_page = config.itens_per_page}}
                let Pagination = BuildPagination(array,per_page)
                objreturn.total_pages = Pagination.length
                
                // parte que verifica o userstorage 
                let pagination_id
                if(this.userStorage[id]){
                    if(this.userStorage[id][`Paginations`]){
                       let pagination_storage = this.userStorage[id][`Paginations`].find(p => p.Pagination == JSON.stringify(Pagination))
                       if(pagination_storage){
                        page = pagination_storage.Page
                        pagination_id = pagination_storage.ID
                    }
                    } else {
                        pagination_id = CodeGenerator.AlfaNumeric(3)
                        this.userStorage[id][`Paginations`] = []
                        this.userStorage[id][`Paginations`].push({
                            ID : pagination_id,
                            Pagination : JSON.stringify(Pagination),
                            Page : page
                        }) 
                    }
                } else {
                    pagination_id = CodeGenerator.AlfaNumeric(3)
                    this.userStorage[id] = {}
                    this.userStorage[id][`Paginations`] = []
                    this.userStorage[id][`Paginations`].push({
                        ID : pagination_id,
                        Pagination : JSON.stringify(Pagination),
                        Page : page
                    })
                }

                if(config.actual_page && !config.template_config){
                    page = config.actual_page
                    objreturn.actual_page = page
                    if(this.userStorage[id]){
                        if(this.userStorage[id][`Paginations`]){
                           let pagination_index = this.userStorage[id][`Paginations`].findIndex(p => p.Pagination == JSON.stringify(Pagination))
                           if(pagination_index != -1){this.userStorage[id][`Paginations`].at(pagination_index).Page = config.actual_page}
                        }
                    }
                }
        
                if(page > Pagination.length) {
                    page = Pagination.length
                    objreturn.actual_page = page
                } else if (page < 1){
                    page = 1
                    objreturn.actual_page = 1
                }
                
                
                //build array of buttons
                let buttons_array = [{text : '',path : '', props : {}}]
                let sides = []
                buttons_array.splice(0,1)
                if(config.button && !config.template_config){
                    
                    Pagination[Pagination.findIndex(p => p.page == page)].list.forEach(list_instance => {
                        let fulltext = ''
                        let fullpath = ''
                        let fullprops = {}
                        
                        
                        if(typeof list_instance == 'object'){
                            fulltext = `${Object.keys(list_instance).at(0)} : ${list_instance[Object.keys(list_instance).at(0)]}`
                            fullpath = actual.path
                            fullprops = actual.props
                        } else {
                            fulltext = list_instance
                            fullpath = actual.path
                            fullprops = actual.props
                        }
                        
                        
                        //buildtext
                       if(config.button.text){
                            fulltext = ''
                            config.button.text.forEach(text => {
                                switch (text.type) {
                                    case 'text':
                                    fulltext = `${fulltext}${text.value}`    
                                    break;
                                    
                                    case 'key':
                                    if(typeof list_instance == 'object'){
                                        if(list_instance[text.value]){
                                            fulltext = `${fulltext}${list_instance[text.value]}`
                                        }
                                    }
                                    break;
    
                                    default:
                                    break;
                                }
                            })
                        }
                        
                        
                        //buildpath
                        if(config.button.path){
                            fullpath = ''
                            if(config.button.path.type){
                                switch (config.button.path.type) {
                                    case 'text':
                                        fullpath = config.button.path.value 
                                        break;
                                
                                        case 'key':
                                            if(typeof list_instance == 'object'){
                                                if(list_instance[config.button.path.value]){
                                                   fullpath = list_instance[config.button.path.value]
                                                }
                                            }
                                            break;
        
                                    default:
                                        break;
                                }
        
                            }
                        }
                        

                        //buildprops
                        if(config.button.props){
                            fullprops = {}
                            config.button.props.forEach(prop => {
                                semprops = false
                                switch (prop.type) {
                                    case 'text':
                                    fullprops[prop.props_key] = prop.value
                                    break;
                            
                                    case 'key':
                                        if(typeof list_instance == 'object'){
                                            if(list_instance[prop.value]){
                                                fullprops[prop.props_key] = list_instance[prop.value]
                                            }
                                        }
                                        break;
                                
                                    default:
                                        break;
                                }
                            })
                        }
                       

                        //pushbutton
                       buttons_array.push({text : fulltext,path : fullpath, props : fullprops})
                    })

                } else {
                    
                if(Pagination.length){
                   
                        objreturn.total_pages = Pagination.length
                        Pagination[Pagination.findIndex(p => p.page == page)].list.forEach(list_instance => {
                            if(typeof list_instance == 'object'){
                                buttons_array.push({text : `${Object.keys(list_instance).at(0)} : ${list_instance[Object.keys(list_instance).at(0)]}`,path : actual.path,props : actual.props })
                            } else {
                                buttons_array.push({text : list_instance,path : actual.path,props : actual.props })
                            }
                        })
                    }
                    
                }
                
                //sidebuttons para passar página
               objreturn.actual_page = page
                if(objreturn.actual_page > 1){
                    let prev_props = actual.props
                    prev_props.pid = `p${pagination_id}`
                    sides.push(this.SideButton(`⇦ Página ${objreturn.actual_page-1}`,actual.path,prev_props))
                }
                if(objreturn.actual_page < objreturn.total_pages){
                    let next_props = actual.props
                    next_props.pid = `n${pagination_id}`
                    sides.push(this.SideButton(`Página ${objreturn.actual_page+1} ⇨`,actual.path,next_props))
                    
                }


                //load buttons
                
                if(semprops){
                    buttons_array.forEach((e,i) => {
                        buttons_array[i].props = {}
                    })
                }
              

                buttons_array.forEach(b => {
                    this.Button(id,b.text,b.path,b.props)
                })
                
                this.Buttons(id,sides)
            
        
        } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Paginaton.Button | ${erro}`)   
            }
        return objreturn
        },
        Text : (id,array,page,config = {}) => {
            let erro
            if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            } else {
                if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
                console.error(`Falha ao executar o método Paginaton.Text | ${erro}`)   
            }
        }
    }
    
    this.Keyboard = (id,name = '',config = {
        confirmbutton : {
            props : {},
            include_typed : true,
            clear_keyboard : true
        },
        maxlength : 30,
        template_config : true
    }) =>{
        
        let objreturn = {
            keyboard_name : '',
            typed : ''
        }

        let erro
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            if(!config.maxlength){config.maxlength = 30}

            if(!config.confirmbutton){config.confirmbutton = {
                props : {},
                include_typed : true,
                clear_keyboard : true
            } }


            if(name && name != ''){
                objreturn.keyboard_name = name
                
                if(this.Storages.Get(id,name).success){
                    let storage_data = this.Storages.Get(id,name).value
                    objreturn.typed = storage_data.typed
                    storage_data.max = config.maxlength
                    storage_data.confirmbutton = config.confirmbutton
                    this.Storages.Set(id,name,storage_data)
                } else {
                    //modelo base do storage do keyboard
                    this.Storages.Set(id,name,{
                        typed : '',
                        max : config.maxlength,
                        confirmbutton : config.confirmbutton
                    })
                }               

                let actual = callbackFilter(this.Builds[this.Builds.findIndex(e => e.id == id)].Session.actualScreen)
                delete actual.props['kt']
                delete actual.props['kn']
                class LoadButton {
                    constructor(texto,addprops = {}){
                        this.Texto = texto
                        this.AddProps = addprops
                    }
                }

                const loadbuttons = [
                    [
                        new LoadButton('1',{kt : '1',kn : name}),
                        new LoadButton('2',{kt : '2',kn : name}),
                        new LoadButton('3',{kt : '3',kn : name})
                    ],
                    [
                        new LoadButton('4',{kt : '4',kn : name}),
                        new LoadButton('5',{kt : '5',kn : name}),
                        new LoadButton('6',{kt : '6',kn : name})
                    ],
                    [
                        new LoadButton('7',{kt : '7',kn : name}),
                        new LoadButton('8',{kt : '8',kn : name}),
                        new LoadButton('9',{kt : '9',kn : name})
                    ],
                    [
                        new LoadButton('Apagar',{kt : 'del',kn : name}),
                        new LoadButton('0',{kt : '0',kn : name}),
                        new LoadButton('Confirmar',{...config.confirmbutton.props,kn : name})
                    ]
                ]
        
                loadbuttons.forEach(sides_list => {
                    let sides = []
                    sides_list.forEach(side => {
                        const fullprops = {...actual.props,...side.AddProps}
                        sides.push(this.SideButton(side.Texto,this.Name,fullprops))
                    })
                this.Buttons(id,sides)
                })

               
            } else {
            erro = 'É necessario inserir o parametro `name`, para identificar o keyboard'
            console.error(`Falha ao executar o método this.Keyboard | ${erro}`)
            } 

            

        } else {
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao executar o método this.Keyboard | ${erro}`)   
        }

      return objreturn
    }

    this.TimePicker = (id,name = '') => {
        let objreturn = {
            time : '',
            hr : '',
            pr : ''
        }

        let erro
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            if(name && name != ''){
            //storage manage
            if(this.Storages.Get(id,name).success){
                let storage_data = this.Storages.Get(id,name).value
                objreturn = storage_data
                this.Storages.Set(id,name,storage_data)
            } else {
                //modelo base do storage do determinado método
                this.Storages.Set(id,name,{
                    time : '',
                    hr : '',
                    pr : ''
                })
            }    

            let actual = callbackFilter(this.Builds[this.Builds.findIndex(e => e.id == id)].Session.actualScreen)
            
            if(objreturn.pr == ''){
                this.Button(id,'☀️ Manhã',this.Name,{...actual.props,tm_pick : name,pr : 'manha'})
                this.Button(id,'🌇 Tarde',this.Name,{...actual.props,tm_pick : name,pr : 'tarde'})
                this.Button(id,'🌙 Noite',this.Name,{...actual.props,tm_pick : name,pr : 'noite'})
            } else if (objreturn.hr == ''){

                switch (objreturn.pr) {
                    case 'manha':
                      for(let i = 5;i <= 12;i++){
                        let formated
                        if(i < 10){formated = `0${i}:00`} else {formated = `${i}:00`}
                        this.Button(id,`🕑 ${formated} hrs`,this.Name,{...actual.props,tm_pick : name,hr : i.toString()})
                      }
                      break;
        
                      case 'tarde':
                      for(let i = 13;i <= 19;i++){
                        let formated
                        if(i < 10){formated = `0${i}:00`} else {formated = `${i}:00`}
                        this.Button(id,`🕑 ${formated} hrs`,this.Name,{...actual.props,tm_pick : name,hr : i.toString()})
                      }
                      break;
        
                      case 'noite':
                      for(let i = 20;i <= 28;i++){
                        let formated
                        let intern = i
                        if(intern > 23){intern = intern-24}
        
                        if(intern < 10){formated = `0${intern}:00`} else {formated = `${intern}:00`}
                        this.Button(id,`🕑 ${formated} hrs`,this.Name,{...actual.props,tm_pick : name,hr : intern.toString()})
                      }
                      break;
                  
                    default:
                      break;
                  }
                    
            this.Button(id,'🔄 Alterar Periodo',this.Name,{...actual.props,tm_pick : name,pr : ''})

            } else {
                
            let hrview = objreturn.hr
            if(objreturn.hr < 10){hrview = `0${objreturn.hr}`}

            for(let i = 0 ; i <= 5;i++){
            const fulltime = `${hrview}:${i}0`
            if(objreturn.time == fulltime){
                this.Button(id,`👉 ${fulltime}`,this.Name,{...actual.props,tm_pick : name,time : fulltime})
            } else {
                this.Button(id,`${fulltime}`,this.Name,{...actual.props,tm_pick : name,time : fulltime})
            }   
              
            }

            this.Button(id,'🔄 Alterar Hora',this.Name,{...actual.props,tm_pick : name,hr : '',time : ''})

            }

            //load period picker

            //load hour picker

            //load exactly picker

        } else {
            erro = 'É necessario inserir o parametro `name`, para identificar o keyboard'
            console.error(`Falha ao executar o método this.Keyboard | ${erro}`)
        } 

        }  else {
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao executar o método this.TimePicker | ${erro}`)   
        }



        return objreturn
    }

    this.DatePicker = (id,name = '') => {
        let objreturn = {
            date : '',  
            dp_m : '',
            dp_y : ''
        }

        let actual = callbackFilter(this.Builds[this.Builds.findIndex(e => e.id == id)].Session.actualScreen)
        let erro
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            if(name && name != ''){
            //storage manage
            if(this.Storages.Get(id,name).success){
                let storage_data = this.Storages.Get(id,name).value
                objreturn = storage_data
                this.Storages.Set(id,name,storage_data)
            } else {
                //modelo base do storage do determinado método
                this.Storages.Set(id,name,{
                    date : '',
                    dp_m : VanillaDate.ActualMonth().toString(),
                    dp_y : VanillaDate.GetYear().toString()
                })
                objreturn = {
                    date : '',
                    dp_m : VanillaDate.ActualMonth().toString(),
                    dp_y : VanillaDate.GetYear().toString()
                    }
            }    

            if(objreturn.dp_m == ''){
                let maxsides = 2
                let sides = []
                VanillaDate.AllMonths().forEach((m,i) => {
                    if(sides.length == maxsides){
                        sides.push(this.SideButton(m,this.Name,{...actual.props,dt_pick : name,dp_m : `${i}`}))
                        this.Buttons(id,sides)
                        sides = []
                    } else {
                        sides.push(this.SideButton(m,this.Name,{...actual.props,dt_pick : name,dp_m : `${i}`}))
                    }
                })

            } else if (objreturn.dp_y == ''){
                let actualyear = VanillaDate.GetYear()
                for(let year = actualyear;year <= (actualyear+3);year++){
                 this.Button(id,year,this.Name,{...actual.props,dt_pick : name,dp_y : `${year}`})
                }
            } else {

                const days = VanillaDate.DaysOnMonth(objreturn.dp_y,Number(objreturn.dp_m)+1)


                this.Buttons(id,[
                  this.SideButton(VanillaDate.MonthName(objreturn.dp_m),this.Name,{...actual.props,dt_pick : name,dp_m : ''}),
                  this.SideButton(objreturn.dp_y,this.Name,{...actual.props,dt_pick : name,dp_y : ''})
                ])
                
                let sides = []
                for(let i = 1; i <= days; i++){
                  if(sides.length < 7 && i < days){
                    sides.push(this.SideButton(i,this.Name,{...actual.props,dt_pick : name,dp_d : `${i}`}))
                  } else {
                    sides.push(this.SideButton(i,this.Name,{...actual.props,dt_pick : name,dp_d : `${i}`}))
                    this.Buttons(id,sides)
                    sides = []
                  }
                }

            }
            
            
            
            

        } else {
            erro = 'É necessario inserir o parametro `name`, para identificar o keyboard'
            console.error(`Falha ao executar o método this.Keyboard | ${erro}`)
        } 

        }  else {
            if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
            console.error(`Falha ao executar o método this.TimePicker | ${erro}`)   
        }



        return objreturn
    }

    this.Calendar = (id,name ='',config = {
        default_year : '',
        template_config : true
    }) => {
       const objreturn = {
            date : '',
            hour : ''
        }
        
        let erro
        if(this.Builds[this.Builds.findIndex(e => e.id == id)]){

            if(name && name != ''){

                if(this.Storages.Get(id,name).success){
                    let storage_data = this.Storages.Get(id,name).value
                    
                    this.Storages.Set(id,name,storage_data)
                } else {
                    //modelo base do storage do calendar
                    this.Storages.Set(id,name,{
                        date : '',
                        hour : ''
                    })
                }   

                /*
                const days = VanillaDate.DaysOnMonth(2023,2)


          
          let sides = []
          for(let i = 1; i <= days; i++){
            if(sides.length < 7 && i < days){
              sides.push(this.SideButton(i,this.Name))
            } else {
              sides.push(this.SideButton(i,this.Name))
              this.Buttons(id,sides)
              sides = []
            }
          }
                */
                //select year

                //select month

                //select day

                //select hour

            } else {
                erro = 'É necessario inserir o parametro `name`, para identificar o calendar'
                console.error(`Falha ao executar o método this.Calendar | ${erro}`)
            }

        } else {
        if(!id){erro = 'USERID NÃO INFORMADO - Coloque o props.userid no parametro id'}
        console.error(`Falha ao executar o método Paginaton.Text | ${erro}`)   
        }



        return objreturn
    }


    this.BuildFilter = (props) => {
        let propsreturn = props
        let actual = callbackFilter(this.Builds[this.Builds.findIndex(e => e.id == props.userid)].Session.actualScreen)
        
        if(propsreturn.pid){
            let addpage = 0
            const type = propsreturn.pid.slice(0,1)
            if(type == 'n'){addpage = 1} else {addpage = -1}
            const pagination_id = propsreturn.pid.slice(1)  
            if(this.userStorage[propsreturn.userid]){
                if(this.userStorage[propsreturn.userid][`Paginations`]){
                   let pagination_index = this.userStorage[propsreturn.userid][`Paginations`].findIndex(p => p.ID == pagination_id)
                   if(pagination_index != -1){this.userStorage[propsreturn.userid][`Paginations`].at(pagination_index).Page += addpage}
                }
            }    
        delete propsreturn[`pid`]
        delete actual.props[`pid`]
        }

        if(propsreturn.kn){
            if(propsreturn.kt){
                let keyboard_object = this.Storages.Get(propsreturn.userid,propsreturn.kn)
                if(keyboard_object.success){
                    if(propsreturn.kt == 'del'){
                        if(keyboard_object.value.typed.length > 0){
                            keyboard_object.value.typed = keyboard_object.value.typed.slice(0,-1)
                            this.Storages.Set(propsreturn.userid,propsreturn.kn,keyboard_object.value)
                        }
                    } else {
                        if(keyboard_object.value.typed.length < keyboard_object.value.max){
                            keyboard_object.value.typed = `${keyboard_object.value.typed}${propsreturn.kt}`
                            this.Storages.Set(propsreturn.userid,propsreturn.kn,keyboard_object.value)
                        }
                    }
                }
                delete propsreturn[`kt`]
                delete actual.props[`kt`]
            } else {
                let keyboard_object = this.Storages.Get(propsreturn.userid,propsreturn.kn)
                if(keyboard_object.success){
                    if(keyboard_object.value.confirmbutton.include_typed){
                        propsreturn.typed = keyboard_object.value.typed
                    }
                    if(keyboard_object.value.confirmbutton.clear_keyboard){
                        this.Storages.Clear(propsreturn.userid,propsreturn.kn)
                    }
                }
            }
        
            delete propsreturn[`kn`]
            delete actual.props[`kn`]
        }

        if(propsreturn.tm_pick){

            let timepicker_data = this.Storages.Get(propsreturn.userid,propsreturn.tm_pick)

            if(propsreturn.pr != undefined){
               timepicker_data.value.pr = propsreturn.pr
                delete propsreturn[`pr`]
                delete actual.props[`pr`]
            }
            if(propsreturn.hr != undefined){
                timepicker_data.value.hr = propsreturn.hr
                 delete propsreturn[`hr`]
                 delete actual.props[`hr`]
             }
             if(propsreturn.time != undefined){
                timepicker_data.value.time = propsreturn.time
                 delete propsreturn[`time`]
                 delete actual.props[`time`]
             }

            this.Storages.Set(propsreturn.userid,propsreturn.tm_pick,timepicker_data.value)
            delete propsreturn[`tm_pick`]
            delete actual.props[`tm_pick`]
        }

        if(propsreturn.dt_pick){
            let datepicker_data = this.Storages.Get(propsreturn.userid,propsreturn.dt_pick)

            if(propsreturn.dp_m != undefined){
                datepicker_data.value.dp_m = propsreturn.dp_m
                datepicker_data.value.date = ''
                delete propsreturn[`dp_m`]
                delete actual.props[`dp_m`]
            }

            if(propsreturn.dp_y != undefined){
                datepicker_data.value.dp_y = propsreturn.dp_y
                datepicker_data.value.date = ''
                delete propsreturn[`dp_y`]
                delete actual.props[`dp_y`]
            }

            if(propsreturn.dp_d != undefined){
                let month = Number(datepicker_data.value.dp_m)+1
                if(month < 10){month = `0${month}`}
                if(propsreturn.dp_d < 10){propsreturn.dp_d = `0${propsreturn.dp_d}`}
                datepicker_data.value.date = `${propsreturn.dp_d}/${month}/${datepicker_data.value.dp_y}`
                delete propsreturn[`dp_d`]
                delete actual.props[`dp_d`]
            }


            


            this.Storages.Set(propsreturn.userid,propsreturn.tm_pick,datepicker_data.value)
            delete propsreturn[`dt_pick`]
            delete actual.props[`dt_pick`]
        }

        this.SetPath(props.userid,actual.path,actual.props)
        return propsreturn
    }

    //Função de build principal, executa a função build criada na raiz da funcionalidade e retorna o text e buttons gerados por ela
    this.Build = async (props) => { 
       try {
        this.Builds.push(new userBuild(props.userid,props.session))
        props = this.BuildFilter(props)
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
                ExternalContent : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].ExternalContent,
                waitPhoto : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].waitPhoto,
                photoPath : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].photoPath,
                waitVideo : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].waitVideo,
                videoPath : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].videoPath,
                Alert : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].AlertMessage,
                BlackList : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].BlackList,
                WhiteList : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].WhiteList,
                NewRoles : this.Builds[this.Builds.findIndex(e => e.id == props.userid)].NewRoles
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