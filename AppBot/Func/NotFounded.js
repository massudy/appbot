import Func from "./Func.js";

class NotFounded extends Func {
    constructor(){
        super(
            'notfounded',
            [],
            async (props) => {
                const userid = props.session.userID
                this.Text(userid,'Página não encontrada')
                this.Button(userid,'← Voltar',props.mainfunc)


            }
        )
    }
}

export default NotFounded