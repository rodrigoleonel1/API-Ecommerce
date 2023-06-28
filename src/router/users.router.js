import  { Router } from 'express'
import userModel from '../dao/mongo/models/user.model.js'
import { JWT_COOKIE_NAME } from '../config/credentials.js'
import { upload } from '../middlewares/multer.js'
const router = Router()

router.get('/premium/:uid', async ( req, res) => {
    try {
        console.log(req.user)
        const uid = req.user._id
        let user = await userModel.findOne({_id: uid})
        if(!user) return res.status(401).render('errors/base', { error: 'No existe ningún usuario con ese mail.' })
        if(user.role == 'user'){
            user.role = 'premium'
            await userModel.findOneAndUpdate({ _id: uid}, user)
            return res.clearCookie(JWT_COOKIE_NAME).render('sessions/changeRole')
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
    { name: 'document', maxCount: 1}
]

router.post('/premium/:uid/documents', upload.fields(fields), async ( req, res) => {
    try {
        if(!req.files){return res.send({status: "error"})}
        const uid = req.user._id
        let user = await userModel.findOne({_id: uid})
        if(!user) return res.status(401)({status: 'no user'})
        let doc
        if(req.files.profile){
            doc = {
                name: req.files.profile[0].filename,
                reference: req.files.profile[0].path
            }
            user.documents.push(doc)
        }
        if(req.files.product){
            doc = {
                name: req.files.product[0].filename,
                reference: req.files.product[0].path
            }
            user.documents.push(doc)
        }
        if(req.files.document){
            doc = {
                name: req.files.document[0].filename,
                reference: req.files.document[0].path
            }
            user.documents.push(doc)
        }
        await userModel.findOneAndUpdate({ _id: uid}, user, {new: true})
        res.send({status: 'File uploaded', payload: user})
    } catch (error) {
        console.log(error)
        res.send('error')
    }
})

export default router

