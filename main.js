// imports

require("dotenv").config({ path: "./song_app/.env" });

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;


//database conection
mongoose.connect('mongodb://localhost:27017/song_info', {
    useNewUrlParser: true,
  useUnifiedTopology: true
});
// mongoose.connect(process.env.DB_URI,  {useNewParser: true, 
//     useUnifiedTopology: true
//       });
const db = mongoose.connection;
db.on("error", (error)=> console.log(error));
db.once("open", ()=> console.log("connected to the databse"));
 
//MIDDLE WARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('uploads'));

//set template engines
app.set('view engine','ejs');


//router prefix
app.use("", require("./routes/routes"));

app.listen(PORT, ()=>{
    console.log(`server started at http://localhost:${PORT}`);
});
