import { userService } from "../services/index.repository.js";

// GET/api/users
const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.status(200).json({ status: "success", payload: users });
    } catch (error) {
        next(error);
    }
}

// GET/api/users
const deleteUsers = async (req, res, next) => {
    try {
        const usersDeleted = await userService.deleteMany();
        res.status(200).json({ status: "success", message: "Users deleted", payload: usersDeleted });
    } catch (error) {
        next(error);
    }
}

// GET/api/users/premium/:uid
const changeRole = async (req, res, next) => {
    try {
        const uid = req.user._id;
        const user = await userService.changeRole(uid);
        res.status(200).json({ status: "success", message: 'Role updated', payload: user });
    } catch (error) {
        next(error);
    }
}

// GET/api/users/admin/changeRole/:uid
const adminChangeRole = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const user = await userService.adminChangeRole(uid);
        res.status(200).json({ status: "success", message: 'Role updated', payload: user });
    } catch (error) {
        console.log(error)
        next(error);
    }
}

// DELETE/api/users/admin/changeRole/:uid
const deleteUser = async (req, res, next) => {
    try {
        const uid = req.params.uid;
        const userDeleted = await userService.delete(uid);
        res.status(200).json({ status: "success", message: "User deleted", payload: userDeleted });
    } catch (error) {
        console.log(error)
        next(error);
    }
}

// POST/api/users/:uid/documents
const uploadDocuments = async (req, res, next) => {
    try {
        const files = req.files;
        const uid = req.user._id;
        await userService.uploadFiles(files, uid);
        res.redirect('/profile');
    } catch (error) {
        return res.render('errors/base', {
            error: error.message,
            title: 'Ecommerce | Error',
            route: 'profile',
            page: 'Perfil'
        })
    }
}

// DELETE/api/users/:uid/documents
const deleteDocuments = async (req, res, next) => {
    try {
        const uid = req.user._id;
        await userService.deleteFiles(uid);
        res.status(200).json({ status: "success", message: "The documents have been cleaned" });
    } catch (error) {
        next(error);
    }
}

export default {
    getUsers,
    deleteUsers,
    changeRole,
    uploadDocuments,
    deleteDocuments,
    adminChangeRole,
    deleteUser
} 