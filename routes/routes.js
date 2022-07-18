const express = require("express");
const router = express.Router();
const songs = require("../models/songs");
const artists = require("../models/artists");
const multer = require("multer");
 const fs = require("fs");
//image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

//insert an song into databse
router.post("/add", upload, (req, res) => {
    const song = new songs({
        name: req.body.name,
        Dor: req.body.Dor,
        Artists: req.body.Artists,
        image: req.file.filename,
    });
    song.save((err) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "sucess",
                message: "song aded sucessfully",
            };
            res.redirect("/");
        }
    });
});
// get all songs
router.get("/", (req, res) => {
    songs.find().exec((err, songs)=>{
        if(err){
            res.json({ message: err.message});
        }else {
            res.render("index",{
                title: "Home page",
                songs: songs,
            })
        }
    })
});

/////////////////////////////////

// router.get("/", async function (req, res) {

//     const songs = await songs.find() // Return simple JSON data, not a Mongoose objects collection (simpler and faster)
//                         .exec(); // Returns a true Promise, not just a thenable. You can then await the Promise

//     const artists = await artists.find().exec();
    
//     res.render("index",{songs:songs , artists: artists }); // or {users:users, admins:admins}, same thing
// });

// router.get("/", function (req, res) {
//     // Filter the users by role
//     songs.find(function (err, songs) {
//       artists.find(function (err, artists) {
//         res.render("index", { songs, artists });
//       });
//     });
//   })

///////////////////////////////////





//artist adding
router.post("/add_artist", upload,(req, res) => {
    const artist = new artists({
        a_name: req.body.a_name,
        Dob: req.body.Dob,
        bio: req.body.bio,
    });
    artist.save((err) => {
        if (err) {
            res.json({ message: err.message, type: "danger" });
        } else {
            req.session.message = {
                type: "sucess",
                message: "artist aded sucessfully",
            };
            res.redirect("/add");
        }
    });
});



// get all the artists
router.get("/artist_list", (req, res) => {
    artists.find().exec((err, artists)=>{
        if(err){
            res.json({ message: err.message});
        }else {
            res.render("artist_list",{
                title: "page",
                artists: artists,
            })
        }
    })
});

router.get("/add", (req, res) => {
    res.render("add_songs", { title: "add songs" });
});

router.get("/add_artist", (req, res) => {
    res.render("add_artist", { title: "add artist" });
});





//edit songs
router.get("/edit/:id",(req, res)=>{
    let id = req.params.id;
    songs.findById(id, (err, song)=>{
        if(err){
            res.redirect("/");
        }else{
            if(song == null){
              res.redirect("/");  
            }else{ 
                res.render('edit_songs',{
                    title: "Edit songs",
                    song: song,
                });
            }
        }
    });
});

//update songs route
router.post('/update/:id', upload, (req, res)=>{
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else {
        new_image = req.body.old_image;
    }

    songs.findByIdAndUpdate(id, {
        name: req.body.name,
        Dor: req.body.Dor,
        Artists: req.body.Artists,
        image: new_image,
    },(err, result)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: 'sucess',
                message: 'user updated sucess',
            };
            res.redirect("/");
        }
    })
});

//delete songs

router.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    songs.findByIdAndRemove(id, (err, result)=>{
        if(result.iamge != ''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            } catch{err}{
                console.log(err);
            }
        }
        if(err){
            res.json({message: err.message});
        }else{
            req.session.message = {
                type: 'sucess',
                message: 'song deleted'
            };
            res.redirect("/");
        }
    })
})

module.exports = router;