import GenericRepository from './generic.repository.js';

export default class MessagesRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }
}