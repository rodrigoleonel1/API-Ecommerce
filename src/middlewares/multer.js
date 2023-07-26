import multer from "multer"
import __dirname from "../utils.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == 'profile') {
            file.originalname = "profile-" + file.originalname
            cb(null, (`${__dirname}` + '/public/profiles'))
        }
        if (file.fieldname == 'identification' || file.fieldname == 'domicile' || file.fieldname == 'accStatus') {
            cb(null, (`${__dirname}` + '/public/documents'))
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
export const fields = [
    { name: 'profile', maxCount: 1 },
    { name: 'identification', maxCount: 1 },
    { name: 'domicile', maxCount: 1 },
    { name: 'accStatus', maxCount: 1 }
]

export const upload = multer({ storage: storage })