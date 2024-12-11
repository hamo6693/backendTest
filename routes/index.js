const express = require("express")
const router = express.Router()
const userController = require("../controller/userController")
const postController = require("../controller/postController")

const { userValidationRules,postValidationRules,validate} = require("../middlewares/validator")
const  isLoggedIn = require("../middlewares/auth")
const upload = require("../middlewares/uplaod")
const  likeController  = require("../controller/likeController")

const { GetComments, CreateComments } = require("../controller/commentController")

router.get("/",(req,res) => {
    res.json({message:"hello word"})
})

router.post("/register",userValidationRules(),validate,userController.register)

router.post("/login",userController.login)

router.get("/profile",isLoggedIn,userController.profile)

router.put("/upload-profile",isLoggedIn,upload.single("avatar"),userController.uploadUserPhoto)

router.put("/update-profile",isLoggedIn,userController.updateUserProfile)

router.post("/create-post",isLoggedIn,upload.array("avatar",4),postController.createPost)

router.get("/get-all-post",isLoggedIn,postController.getAllPosts )


router.get("/my-post",isLoggedIn,postController.getMyPost )
router.get("/my-post/:postId",isLoggedIn,postController.getMyPost )


router.put("/like/:postId",isLoggedIn,likeController.like );

router.get("/like/:postId",isLoggedIn,likeController.likeCount );


router.get("/comment/:postId",isLoggedIn,GetComments )

router.post("/comment/:postId",isLoggedIn,CreateComments );

router.delete("/get-all-post/delete",isLoggedIn,postController.deleteMyPost )

router.put("/my-post/:postId/update",isLoggedIn,postController.updatePost )

module.exports = router