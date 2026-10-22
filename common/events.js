

const { EventEmitter } = require('events')
const eventEmaitter=new EventEmitter()

eventEmaitter.on("confirm-email",async(fn)=>{
    fn()
})
module.exports=eventEmaitter