const { Sequelize, DataTypes } = require('sequelize');
const db = require("./database")

const Post = db.define("Post",{
    title:{
        type:Sequelize.DataTypes.STRING
    },
    description:{
        type:Sequelize.DataTypes.STRING
    },
   

},{timestamps:false})


Post.associte = models => {
    Post.belongsTo(models.User)
    Post.hasMany(models.Post_Image)
    Post.hasMany(models.Comment)
}

module.exports = Post