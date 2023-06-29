import  { Router } from 'express'
import userModel from '../dao/mongo/models/user.model.js'
import { JWT_COOKIE_NAME } from '../config/credentials.js'
import { upload } from '../middlewares/multer.js'
const router = Router()

router.get('/premium/:uid', async ( req, res) => {
    try {
        if(!req.user) return res.status(401).render('errors/base', { error: 'Inicia sesion para continuar.' })
        const uid = req.user._id
        let user = await userModel.findOne({_id: uid})
        if(!user) return res.status(401).render('errors/base', { error: 'No existe ningún usuario con ese mail.' })
        let documentsName = []
        for (let index = 0; index < user.documents.length; index++) {
            let name = user.documents[index].name
            if(name == "identification" || name == "domicile" || name == "acc-status"){
                documentsName.push(name)
            }
        }
        if(user.role == 'user'){
            if(documentsName.length == 3){
                user.role = 'premium'
                await userModel.findOneAndUpdate({ _id: uid}, user)
                return res.clearCookie(JWT_COOKIE_NAME).render('sessions/changeRole')
            }
            else{
                return res.status(401).render('errors/base', { error: 'Para hacerte premium necesitas subir archivo de tu identificacion, comprobante de domicilio y comprobante de estado de tu cuenta.' })
            }
        }
        if(user.role == 'premium'){
            user.role = 'user'
            await userModel.findOneAndUpdate({ _id: user._id}, user)
            return res.clearCookie(JWT_COOKIE_NAME).render('sessions/changeRole')
        }
        res.status(401).render('errors/base', { error: 'Solo los usuarios con rol "user" o "premium" pueden cambiar su rol.' })
    } catch (error) {
        console.log(error)
    }
})

let fields = [
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1},
    { name: 'identification', maxCount: 1},
    { name: 'domicile', maxCount: 1},
    { name: 'accStatus', maxCount: 1}
]

router.post('/premium/:uid/documents', upload.fields(fields), async ( req, res) => {
    try {
        if(!req.files){return res.send({status: "error"})}
        const uid = req.user._id
        let user = await userModel.findOne({_id: uid})
        if(!user) return res.status(401)({status: 'no user'})
        user.documents = []
        let doc
        if(req.files.profile){
            doc = {
                name: "profile-pic",
                reference: req.files.profile[0].path
            }
            user.documents.push(doc)
        }
        if(req.files.product){
            doc = {
                name: "product-pic",
                reference: req.files.product[0].path
            }
            user.documents.push(doc)
        }
        if(req.files.identification){
            doc = {
                name: "identification",
                reference: req.files.identification[0].path
            }
            user.documents.push(doc)
        }
        if(req.files.domicile){
            doc = {
                name: "domicile",
                reference: req.files.domicile[0].path
            }
            user.documents.push(doc)
        }
        if(req.files.accStatus){
            doc = {
                name: "acc-status",
                reference: req.files.accStatus[0].path
            }
            user.documents.push(doc)
        }
        await userModel.findOneAndUpdate({ _id: uid}, user, {new: true})
        res.render('sessions/uploadSuccess')
    } catch (error) {
        console.log(error)
        res.send('error')
    }
})

export default router

