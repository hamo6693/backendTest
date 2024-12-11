const models = require("../models")
const bcrypt = require("bcrypt")
const db = require("../models/database")
const jwt = require("jsonwebtoken")

exports.register = async (req,res) => {
    const {name,email,password} = req.body;

    try {
        const findEmail = await models.User.findOne({where:{email}})
        if(findEmail === null) {
            const user = await models.User.create({
                name,
                email,
                password:bcrypt.hashSync(password,8)
            })
            res.status(201).json({message:"تم انشاء الحساب"})
        }else{
            res.status(400).json({message:"البريد الالكتروني موجود مسبقا"})

        }
    
    } catch (e) {
        res.status(500).json(e)
        
    }
}

exports.login = async(req,res) => {
    const {email,password} = req.body
    try {
        const user = await models.User.findOne({where:{email}})
        if(user === null) {
            res.status(401).json({message:"خطا في البريد الالكتروني او كلمة المرور"})
        }else{
            const pass = await bcrypt.compare(password,user.password)
            if(pass) {
                const token = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET)
            res.status(200).json({accessToken:token})

            }else{
            res.status(401).json({message:"خطا في البريد الالكتروني او كلمة المرور"})
            }
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

exports.profile = async(req,res) => {
    try {
        const users = await models.User.findOne({
            where:{id: req.currentUser.id},
            attributes:{exclude:["password"]}
        })
        res.status(200).json(users)
    } catch (e) {
        res.status(500).json(e)
        
    }
}

exports.uploadUserPhoto = async(req,res) => {
    const url = req.protocol + "://" + req.get("host")
    try {
        const img = await models.User.update({
            img_uri: url + "/public/images/" + req.file.filename
        },{where:{id: req.currentUser.id}})
        res.status(201).json({message:"تم اضافة الصورة بنجاح"})
    } catch (e) {
        res.status(500).json(e)
    }
}


exports.updateUserProfile = async(req,res) => {
    const {name,email,password} = req.body;
    const hashPassword = await bcrypt.hash(password,8)
    try {
        const updates = await models.User.update({
            name,
            email,
            password:hashPassword
        },{where:{id:req.currentUser.id}})
        res.status(200).json({message:"تم تعديل البيانات"})
    } catch (e) {
        res.status(500).json(e)
        
    }
}