const mongoose = require('mongoose');

const permission = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true

    },
    url : {
        type: String,
        required: true
    },
    method : {
        type: String,
    },
})

const Permission = mongoose.model('Permission', permission)

const role = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions : [{
        type: mongoose.Types.ObjectId,
        ref : 'Permission',
    }]
})  

const Role = mongoose.model('Role', role)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    roles : [{
        type: mongoose.Types.ObjectId,
        ref: 'Role',
    }],
    status : {
        type: Number,
    }
})
const User = mongoose.model('User', userSchema)

module.exports = {
    User,
    Permission,
    Role
}

