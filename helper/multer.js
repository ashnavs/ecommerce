const path = require('path');
const multer = require('multer');

const catStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/categoryImage'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
})

const upload = multer({storage:catStorage})
 module.exports = upload;


