import express, { json } from 'express'
import Menu from './Pages/Menu.js'
import AppBot from './AppBot/AppBot.js'

const app = express()
app.use(json())
const port = process.env.PORT || 3000

const bot = new AppBot('5438099052:AAED8IirTBB9bUs_XojvTZPYKoBeXwLrWpo',Menu)
console.log(bot.Funcs)

app.get('/',(req,res) => {
    res.send('Start')
})

app.listen(port,() => {
    console.log('Server Running...')
})