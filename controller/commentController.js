const models = require("../models");


exports.CreateComments = async(req,res) => {
    const {text} = req.body
    try {
        const createComment = await models.Comment.create({
            text,
            PostId:req.params.postId,
            UserId:req.currentUser.id
        }) 
        res.status(201).json({message:"تم انشاء تعليق"})
    } catch (e) {
        res.status(500).json(e)
        
        
    }
}

exports.GetComments = async (req,res) => {

    try {
        const comment = await models.Comment.findAll({
            where:{PostId:req.params.postId},            
            include:{
                model:models.User,
                attributes:{exclude:["password"]}
            }
        })
        
        res.status(200).json({comment})
    } catch (e) {
        console.log(e);
        
    }
}