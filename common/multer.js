const multer = require('multer')
const fs=require('node:fs')
const {randomUUID}=require('crypto')
const multerLocal=({custpath=user,custtype=[]})=>{
    const fullPath=`uploads/${custpath}`
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})
    }
    const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            console.log(file)
            cb(null, fullPath)
        },
        filename:(req,file,cb)=>{
            cb(null,randomUUID()+"__"+file.originalname)
        }
    })
    function fileFilter (req, file, cb) {
        if(custtype.includes(file.minetype)){
            cb(new Error('I don\'t have a clue!'))
        }else{
        cb(null,true)
        }

}
    const upload = multer({storage,fileFilter})
    return upload
}
module.exports=multerLocal