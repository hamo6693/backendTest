const models = require("../models");

exports.like = async (req, res) => {
  try {
    const userLiked = await models.Like.findOne({
      where: {
        UserId: req.currentUser.id,
        PostId: req.params.postId,
      },
    });

    if (userLiked) {
      await models.Like.destroy({
        where: {
          UserId: req.currentUser.id,
          PostId: req.params.postId,
        },
      });
      res.status(200).json({ message: "تم حذف الإعجاب" });
    } else {
      await models.Like.create({
        UserId: req.currentUser.id,
        PostId: req.params.postId,
      });
      res.status(200).json({ message: "تم اضافة الاعجاب" });
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.likeCount = async (req, res) => {
  const likes = await models.Like.findAll({
    where: {
      //تعليقات المنشور جميعا
      PostId: req.params.postId,
    },
  });
  const userLike = await models.Like.findOne({
    where: {
      UserId: req.currentUser.id,
      PostId: req.params.postId,
    },
  });
  res.status(200).json({
    likes: likes.length,
    userLike,
  });
};
