import GenericRepository from './generic.repository.js';
import Mail from "../helpers/nodemailer.js";
import CustomError from '../services/errors/CustomError.js';
import EErros from '../services/errors/enums.js';

export default class UsersRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
        this.mail = new Mail();
    }

    deleteMany = async () => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const users = await this.dao.getAll({ last_connection: { $lt: twoDaysAgo } });
        if (users.length == 0) {
            CustomError.createError({
                name: "Not found",
                message: "There are no users that meet those requirements",
                code: EErros.BAD_REQUEST
            })
        }
        users.forEach(user => {
            const html = `<h1>Tu cuenta ha sido eliminada</h1><br>
            <p>Hola ${user.first_name}, nos comunicamos contigo para informarte que debido a una inactividad de dos días o más tu cuenta ha sido eliminada.<p>`
            this.mail.send(user.email, 'Eliminación de cuenta', html)
        });
        return await this.dao.deleteMany();
    }

    sendMail = async (user, subject, html) => {
        return this.mail.send(user, subject, html);
    }

    changeRole = async (uid) => {
        const user = await this.dao.getById(uid);
        if (user.role == "premium") {
            user.role = "user";
            return await this.dao.update(uid, user);
        }
        const identification = user.documents.identification.status;
        const domicile = user.documents.domicile.status;
        const acc_status = user.documents.acc_status.status;
        if (user.role == 'user' && (identification == false || domicile == false || acc_status == false)) {
            CustomError.createError({
                name: "Bad request",
                message: "No tienes todos los archivos necesarios para hacerte premium.",
                code: EErros.BAD_REQUEST
            })
        }
        user.role = "premium";
        return await this.dao.update(uid, user);
    }

    adminChangeRole = async (uid) => {
        const user = await this.dao.getById(uid);
        if (user.role == 'admin') {
            CustomError.createError({
                name: "Unauthorized",
                message: "No tienes todos los permisos necesarios para hacer esto.",
                code: EErros.UNAUTHORIZED
            })
        }
        user.role == "premium" ? user.role = 'user' : user.role = 'premium'
        return await this.dao.update(uid, user);
    }

    uploadFiles = async (files, uid) => {
        const filesProps = Object.keys(files);
        if (filesProps.length == 0) {
            CustomError.createError({
                name: "Error al subir los archivos.",
                message: "No has seleccionado ningun archivos para subir.",
                code: EErros.BAD_REQUEST
            })
        }
        const user = await this.dao.getById(uid);
        if (files.profile) {
            user.documents.profile_pic = {
                status: true,
                name: "profile-pic",
                reference: files.profile[0].path
            }
        }
        if (files.identification) {
            user.documents.identification = {
                status: true,
                name: "identification",
                reference: files.identification[0].path
            }
        }
        if (files.domicile) {
            user.documents.domicile = {
                status: true,
                name: "domicile",
                reference: files.domicile[0].path
            }
        }
        if (files.accStatus) {
            user.documents.acc_status = {
                status: true,
                name: "acc-status",
                reference: files.accStatus[0].path
            }
        }
        await this.dao.update(uid, user);
    }

    deleteFiles = async (uid) => {
        const user = await this.dao.getById(uid);
        const docs = {
            profile_pic: {
                status: false,
                name: '',
                reference: ''
            },
            identification: {
                status: false,
                name: '',
                reference: ''
            },
            domicile: {
                status: false,
                name: '',
                reference: ''
            },
            acc_status: {
                status: false,
                name: '',
                reference: ''
            }
        }
        user.documents = docs;
        await this.dao.update(uid, user);
    }
}