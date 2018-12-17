const express = require('express');
const CORS = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
 

//creating express app
const app = express();

// seting app to use bodyPareser and Cors
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(CORS());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`))


// db is now serving us our database
const db = [
    {
        userName:'e',
        password:'e'
    },
    {
        userName:'a',
        password:'a'
    }
];


// meddleware for checking if user have a token
const authUser =(req ,  res , next)=>{
    const headerInfo = req.headers['authorization'];
    // checking to see if toke exist in the headers or cookies or query
    if(typeof headerInfo !== 'undefined'){
        const headerInfoSplit = headerInfo.split(' ');
        const userToken = headerInfoSplit[1];

        // seting req.token equal to user token
        req.token = userToken;
        next()
    } else if (req.cookies && req.cookies.token) {
         req.token = req.cookies.token;
        next()
    } else if (req.query && req.query.token) {
         req.token = req.query.token;
         next()
    }else{
        res.sendStatus(403);
    }


};

function logout(req , res , next){
    req.cookies = {};
    req.query = {};
    req.headers['authorization'] = null
    // res.cookies.token = null
   
    
    next();
}


// this is a function that checks to see if the user documment is in the database
function checkUserAtDB(req , res , next){
    if (db.length === []){ 
        req.userInfo === undefined
    next();
    };
    for (let x = 0; x < db.length; x++) {
        if (req.body.userName === db[x].userName && req.body.password === db[x].password) {
             req.userInfo = db[x];
             next()
        }
    }

}


app.get('/',(req , res)=>{
    res.render('home');
})
app.get('/signup',(req, res)=>{
    res.render('form');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// login route;
app.post('/login', checkUserAtDB,(req, res) => {
    
    if (req.userInfo && req.userInfo.userName) {
    jwt.sign({...req.body},'My_name',{ expiresIn: 3000 },(err, token) => {
        if (err) {
            res.json({
                message: 'login failed',
            });
        } else {
            res.set('authorization', `Bearer ${token}`).render('homepage.ejs');
        }
    })
    }else if(req.userInfo === undefined){
    return res.send('404')
}

});


// sign up route
app.post('/signup', (req, res) => {
    db.push(req.body)
    jwt.sign({ ...req.body
    }, 'My_name', (err, token) => {
        if (err) {
            res.json({
                message: 'signup failed'
            });
        } else {
            res.render('homepage.ejs' ,{
                message: 'signup successful',
                token,
                db
            });
           
        }
    });

});


// logout user route
app.post('/logout',logout,(req , res)=>{

res.redirect('/login')
})

// protected pages routes

// homepage route
app.get('/profile', authUser, (req, res) => {
    jwt.verify(req.token,'My_name',(err , data)=>{
        if(err){
            res.send({
                message:'login or sign up'
            }).set('authorization', `Bearer ${token}`);
        }else{
            res.json({
                message:`welcome ${data.userName}`,
                data,
                token:req.token
            });
        }
    });
});

// post image route
app.post('/post/item', authUser, (req, res) => {


});










app.listen('9000',()=>{
    console.log('server stated');
    
});