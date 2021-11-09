const mongoose = require('mongoose');

const UserModel = class User {
    constructor() {
        //Structure or Schema of document
        this.userSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true,
            },
            ph: {
                type: String,
                required: true,
            },
        });
        //this will enable us to paged or for searching
        this.userSchema.index({'$**': 'text'});
        //Create collection in mongodb
        this.user = new mongoose.model('Users', this.userSchema);
    }

    async createUser({ name, ph }) {
        try {
            const user = new this.user({
                name: name,
                ph: ph,
            });
            await user.save();
        }
        catch (err) {
            console.log('Error while Creating UserModel');
        }
    }

    async getAllUsers() {
        try {
            const users = this.user.find();
            return users;
        }
        catch (err) {
            console.log('Error while getting user');
        }
    }

    async getUserIdByName({ name }) {
        try {
            const user = await this.user.findOne({
                name: name,
            });
            return user.id;

        }
        catch (err) {
            console.log('Error while getting Id');
        }
    }
    async getUserByName({ name }) {
        try {
            const user = await this.user.findOne({
                name: name,
            });
            return user;

        }
        catch (err) {
            console.log('Error while getting User');
        }
    }
}
module.exports = UserModel;