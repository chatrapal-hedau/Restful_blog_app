var bodyParser   = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
{ body } = require('express-validator'),
methodOverride   = require("method-override"),
mongoose         = require("mongoose"),
express          = require("express"),
keys             = require("./keys.js"),
app              = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer())
app.use(methodOverride("_method"));
app.set("view engine","ejs");

//map global promise - to get rid of warning
mongoose.Promise =global.Promise;
//APP config
mongoose.connect(keys,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: false
})
.then(() => console.log("MongoDB connected..."))
.catch(err => console.log(err))

//mongoose/model config
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created:{type : Date, default :Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

    ` Blog.create({
         title :"First",
         image :"https://images.unsplash.com/photo-1574333751907-d1df49fde1c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
         body :"Anything",
     });`


     app.get("/", function(req, res){
        res.redirect("/blogs"); 
     });
     
     // INDEX ROUTE
     app.get("/blogs", function(req, res){
        Blog.find({}, function(err, blogs){
            if(err){
                console.log("ERROR!");
            } else {
               res.render("index", {blogs: blogs}); 
            }
        });
     });
     
     // NEW ROUTE
     app.get("/blogs/new", function(req, res){
         res.render("new");
     });
     
     // CREATE ROUTE
     app.post("/blogs", function(req, res){
         // create blog
         console.log(req.body);
         console.log("===========")
         console.log(req.body);
         Blog.create(req.body.blog, function(err, newBlog){
             if(err){
                 res.render("new");
             } else {
                 //then, redirect to the index
                 res.redirect("/blogs");
             }
         });
     });
     
     // SHOW ROUTE
     app.get("/blogs/:id", function(req, res){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            } else {
                res.render("show", {blog: foundBlog});
            }
        })
     });
     
     // EDIT ROUTE
     app.get("/blogs/:id/edit", function(req, res){
         Blog.findById(req.params.id, function(err, foundBlog){
             if(err){
                 res.redirect("/blogs");
             } else {
                 res.render("edit", {blog: foundBlog});
             }
         });
     })
     
     
     // UPDATE ROUTE
     app.put("/blogs/:id", function(req, res){
         req.body.blog.body = req.sanitize(req.body.blog.body)
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
           if(err){
               res.redirect("/blogs");
           }  else {
               res.redirect("/blogs/" + req.params.id);
           }
        });
     });
     
     // DELETE ROUTE
     app.delete("/blogs/:id", function(req, res){
        //destroy blog
        Blog.findByIdAndRemove(req.params.id, function(err){
            if(err){
                res.redirect("/blogs");
            } else {
                res.redirect("/blogs");
            }
        })
        //redirect somewhere
     });

var PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));