import userModel from './models/user.model.js'
import CustomError from '../../services/errors/CustomError.js';
import EErros from '../../services/errors/enums.js';
import UserDTO from '../dto/user.dto.js';
import { userService } from '../../services/index.repository.js';

export default class UsersMongo {
    constructor() {
        this.model = userModel;
    }

    getAll = async (query) => {
        if (!query) {
            const users = await this.model.find();
            const result = users.map(element => {
                const { _id, first_name, last_name, email, role } = element
                const user = new UserDTO({ _id, first_name, last_name, email, role })
                return user
            });
            return result
        }
        return await this.model.find(query);
    }

    getById = async (uid) => {
        const user = await this.model.findOne({ _id: uid });
        if (!user) {
            CustomError.createError({
                name: "Reference error",
                message: "There is no cart with that id",
                code: EErros.BAD_REQUEST
            })
        }
        return user;
    }

    create = async () => {
        return await this.model.create({});
    }

    update = async (uid, userToUpdate) => {
        return await this.model.findOneAndUpdate({ _id: uid }, userToUpdate, { new: true });
    }

    delete = async (uid) => {
        const user = await this.model.findOne({ _id: uid });
        if (user.role == 'admin') {
            CustomError.createError({
                name: "Unauthorized",
                message: "No tienes todos los permisos necesarios para hacer esto.",
                code: EErros.UNAUTHORIZED
            })
        }
        const html = `<h1>Tu cuenta ha sido eliminada</h1><br>
        <p>Hola ${user.first_name}, nos comunicamos contigo para informarte que tu cuenta ha sido eliminada por un administrador.<p>`
        await userService.sendMail(user.email, 'Eliminación de cuenta', html)
        return await this.model.deleteOne({ _id: uid });
    }

    deleteMany = async () => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return await this.model.deleteMany({ last_connection: { $lt: twoDaysAgo } });
    }
}