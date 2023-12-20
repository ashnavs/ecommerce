const path = require('path');
const multer = require('multer');

const catStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImage'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name)
    }
})

const upload = multer({storage:catStorage})
 module.exports = upload;





// const path = require('path');
// const multer = require('multer');
// const fs = require('fs');

// const dynamicDestination = (folder) => (req, file, cb) => {
//   const destinationPath = path.join(__dirname, `../public/${folder}`);
//   fs.mkdirSync(destinationPath, { recursive: true });
//   cb(null, destinationPath);
// };

// const storage = multer.diskStorage({
//   destination: dynamicDestination('uploads'), // Default to 'uploads' if folder is not specified
//   filename: function (req, file, cb) {
//     const name = Date.now() + '-' + file.originalname;
//     cb(null, name);
//   }
// });

// const upload = multer({ storage: storage });

// module.exports = upload;







