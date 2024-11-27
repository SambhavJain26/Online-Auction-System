const crypto = require("crypto");
const multer = require("multer");
const path = require("path");

//Multer Storage Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/imgs/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(12, (err, name)=>{
      const fn = name.toString("hex") + path.extname(file.originalname)
      cb(null, fn)
    })
  }
})

const upload = multer({ storage: storage })

module.exports = upload;