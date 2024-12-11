const { where } = require("sequelize");
const models = require("../models");
const fs = require("fs/promises");

exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  const url = req.protocol + "://" + req.get("host");

  try {
    const post = await models.Post.create({
      title,
      description,
      UserId: req.currentUser.id,
    });
    req.files.map(async function (file) {
      const post_img = await models.Post_Image.create({
        //رابط الصورة
        img_uri: url + "/public/images/" + file.filename,
        //نشر الصور
        PostId: post.id,
      });
    });
    res.status(200).json({ message: "تم انشاء المنشور بنجاح" });
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const post = await models.Post.findAll({
      include: [
        {
          model: models.User,
          attributes: { exclude: ["email", "password"] },
        },
        { model: models.Post_Image },
      ],
    });
    res.status(200).json(post);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.deleteMyPost = async (req, res) => {
  //معرف الطلب
  const { postId } = req.body;
  try {
    //البحث عن جميع الصور داخل منشور الطلب
    await models.Post_Image.findAll({
      where: { PostId: postId },
      //in case u find
    }).then((res) => {
      //الحصول على بيانات الطلب
      res.map((img) => {
        fs.unlink(
          "./public/images/" + img.img_uri.split("/")[5],
          function (err) {
            if (err) throw err;
          }
        );
      });
    });
    //delete img and post from database
    await models.Post_Image.destroy({
      where: { PostId: postId },
    });

    await models.Post.destroy({
      where: { id: postId, UserId: req.currentUser.id },
    });
    await models.Comment.destroy({
      where: { PostId: postId },
    });
    await models.Like.destroy({
      where: { PostId: postId },
    });
    res.status(200).json({ message: "deleta your post" });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.updatePost = async (req, res) => {
  const { title, description } = req.body;
  try {
    const update = await models.Post.update(
      {
        title,
        description,
      },
      {
        where: {
          id: req.params.postId,
          UserId: req.currentUser.id,
        },
      }
    );
    res.status(200).json({ message: "تم تعديل البيانات" });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.getMyPost = async (req, res) => {
  try {
    const myPost = await models.Post.findAll({
      where: { UserId: req.currentUser.id },
      include: [
        {
          model: models.Post_Image,
        },

        {
          model: models.User,
          attributes: { exclude: ["password"] },
        },
      ],
    });
    res.status(200).json(myPost);
  } catch (e) {
    res.status(500).json(e);
  }
};
