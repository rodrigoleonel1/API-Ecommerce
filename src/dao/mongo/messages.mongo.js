import messagesModel from "./models/messages.model.js";

export default class MessagesMongo {
    constructor() {
        this.model = messagesModel;
    }

    getAll = async () => {
        return await this.model.find();
    }

    getById = async (mid) => {
        return await this.model.findOne({ _id: mid });
    }

    create = async (data) => {
        return await this.model.create(data);
    }

    update = async (mid, data) => {
        return await this.model.findOneAndUpdate({ _id: mid }, data, { new: true });
    }

    delete = async (mid) => {
        return await this.model.deleteOne({ _id: mid });
    }
}