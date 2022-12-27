import Button from "./Button.js"
import Cast from "../Config/Cast.js"
import Session from "../Config/Session.js"
import Spacing from "./Spacing.js"
import idrule from "../Config/idrule.js"
import callbackFilter from "../Config/callbackFilter.js"
import CodeGenerator from "../Config/CodeGenerator.js"

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
                props : [{props_key : 'id',value_type : 'text', value : 'ID'}]
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
                                switch (prop.value_type) {
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

    this.Keyboard = (id) =>{
        this.Buttons(id,[
            this.SideButton('1',this.Name,{page : 'num',key : '1'}),
            this.SideButton('2',this.Name,{page : 'num',key : '2'}),
            this.SideButton('3',this.Name,{page : 'num',key : '3'})
        ])
        this.Buttons(id,[
            this.SideButton('4',this.Name,{page : 'num',key : '4'}),
            this.SideButton('5',this.Name,{page : 'num',key : '5'}),
            this.SideButton('6',this.Name,{page : 'num',key : '6'})
        ])
        this.Buttons(id,[
            this.SideButton('7',this.Name,{page : 'num',key : '7'}),
            this.SideButton('8',this.Name,{page : 'num',key : '8'}),
            this.SideButton('9',this.Name,{page : 'num',key : '9'})
        ])
    
        this.Buttons(id,[
            this.SideButton('Apagar',this.Name,{page : 'num',key : 'del'}),
            this.SideButton('0',this.Name,{page : 'num',key : '0'}),
            this.SideButton('Letras',this.Name)
            
        ])
    }

    this.BuildFilter = (props) => {
        let propsreturn = props

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
        }
        let actual = callbackFilter(this.Builds[this.Builds.findIndex(e => e.id == props.userid)].Session.actualScreen)
        this.SetPath(props.userid,actual.path,propsreturn)
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