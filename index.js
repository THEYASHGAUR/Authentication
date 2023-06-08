
import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));


// Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdjasdbajsdbjasd");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user){
    return res.redirect("/register");
  }
    

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5555, () => {
  console.log("Server is working");
});
















































// import express from "express";
// import path from "path";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import jwt from 'jsonwebtoken';
// import { decode } from "punycode";
// // import alerts from 'node-alerts';

// const server = express();
// const port = 5555;

// // db
// mongoose.connect("mongodb://127.0.0.1:27017", {
//     dbName: 'backend'
// }).then((e) => {
//     console.log("database connnected");      
// }).catch(() => {
//     console.log(e);
// })
// // creating a userSchema
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String
// })

// // create a user model
// const User = mongoose.model("User", userSchema);

// const users = [];

// // express.static(path.join(path.resolve, 'public'));  //yhid id s mddleware thats why still we can't use this 

// // using Middlewares
// server.use(express.static(path.join(path.resolve(), 'public')));
// server.use(express.urlencoded({ extended: true }));
// server.use(cookieParser());


// // setting up the view engine
// server.set("view engine", "ejs");

// //this is also a middleware
// const isAuthenticated = async (req, res, next) => {
//     const { token } = req.cookies;

//     if (token) {
//         const decoded = jwt.verify(token, 'asdf1234');

//         req.user = await User.findById(decoded._id);

//         next();
//     }
//     else {
//         res.render("login");
//     }
// }




// server.get('/', isAuthenticated, (req, res) => {
//     res.render("logout", { name: req.user.name });
// });


// server.post("/login", async (req, res) => {
//     const { name, email } = req.body;

//     let user = await User.findOne({name , email });
//     if (!user) {
//         res.redirect("/register");
//     }
//     else {
//         user = await User.create({
//             name,
//             email,
//         });

//         const token = jwt.sign({ _id: user._id }, "asdf1234");
//         // console.log(token);

//         res.cookie('token', token, {
//             httpOnly: true,
//             expires: new Date(Date.now() + 60 * 1000)
//         });
//         res.redirect('/');

//     }

// })

// server.get('/register',  async (req, res) => {
//     const {name , email} = req.body;

//     const user = await User.create({name , email});
//     if(user){
//         // return res.json({message:'User already exists'});
//         res.render('login');
//     }
//     else{
//         const token = jwt.sign({_id:user._id} , 'asdf1234');
        
//         res.cookie('token' , token, {
//             httpOnly:true,
//             expires: new Date(Date.now() + 600* 1000)
//         });
//         res.redirect('/');
//     }
// })


// server.get('/signup', isAuthenticated, (req, res) => { 
//     // console.log(req.user);
//     res.render("logout" , {name:req.user.name});
// });



// server.get("/logout", (req, res) => {
//     res.cookie('token', null, {
//         httpOnly: true,
//         expires: new Date(Date.now())
//     });
//     res.redirect('/');
// })



// server.listen(port, () => {
//     console.log("Server is running");
// });




















// server.get('/add', async (req, res) => {
//     await Message.create({ name: "harsh2333", email: "yash222@gmail.com" }).then(() => {
//         res.send('nice');
//     })
// })


// server.get('/users', (req, res) => {
//     res.json({
//         users,
//     });
// })

// server.get('/success', (req, res) => {
//     res.render("success");
// })

// server.post('/contact', async (req, res) => {
//     const { name, email } = req.body;

//     await Message.create({ name, email });

//     res.redirect("/success");
// });
