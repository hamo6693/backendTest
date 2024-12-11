require("dotenv").config();
const express = require("express")
const router = require("./routes")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const db = require("./models/database")
const models = require("./models")

port = process.env.PORT || 3001

const app = express()


//خاص بمسارات الطلب
//للتعامل مع ترويسات الطلب http
//للتحقق من رمز الطلب
app.use(cors())
//اظهار استجابة الطلب
app.use(morgan("dev"))

//للحصول على البيانات المرسلة وتحويلها بصغية جسون
//للتعامل مع جسم الصفحة
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use("*/images",express.static(__dirname + "/public/images"))

app.use("/",router)

db.sync().then(() => {
    app.listen(port,() => {
        console.log("server is runngin on port " + port);
    })
})

