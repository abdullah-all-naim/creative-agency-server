const express = require('express')
const app = express()
const port = 8000
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

// mongodb+srv://naim:<password>@cluster0.u5omi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guqdp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = 'mongodb+srv://naim:naim007@cluster0.u5omi.mongodb.net/foodscape?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // root
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    const addUser = client.db("foodscape").collection("users");
    const donateInfo = client.db("foodscape").collection("donate");
    const leader = client.db("foodscape").collection("leaderboard");
    app.post("/users", (req, res) => {
        const userInfo = req.body;
        addUser.insertOne(userInfo)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/userinfos', (req, res) => {
        addUser.find({token : req.query.token})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.post("/whodonate", (req, res) => {
        const user = req.body;
        donateInfo.insertOne(user)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/infos', (req, res) => {
        donateInfo.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/donateinfos', (req, res) => {
        donateInfo.find({email : req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.post("/leader", (req, res) => {
        const user = req.body;
        leader.updateOne()
    })

    app.get('/leaderinfo', (req, res) => {
        leader.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })




    app.post("/customerreview", (req, res) => {
        const reviewerImage = req.files.file;
        const reviewName = req.body.name;
        const companyName = req.body.companyName;
        const description = req.body.description;
        const addImg = reviewerImage.data;
        const encImage = addImg.toString('base64');

        var photo = {
            contentType: reviewerImage.mimetype,
            size: reviewerImage.size,
            image: Buffer.from(encImage, 'base64')
        };
        addCustomerData.insertOne({ reviewName, companyName, description, photo })
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result);
            })
    })

    // add customerorder
    app.post("/customerorder", (req, res) => {
        const review = req.body;
        addCustomerOrder.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // add services
    app.post("/addservices", (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        addService.insertOne({ name, description, image })
            .then(result => {
                res.send(result.insertedCount > 0)
                console.log(result);
            })
    })

    // add admin
    app.post("/makeadmin", (req, res) => {
        const review = req.body;
        adminAccess.insertOne(review)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // get services data
    app.get('/getaddedservices', (req, res) => {
        addService.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    // // query 
    app.get('/getorderinfo', (req, res) => {
        addCustomerOrder.find({ email: req.query.email })
        console.log(addCustomerOrder.find({ email: req.query.email }))
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // console.log(addCustomerOrder)
    // get orderinfo
    app.get('/customersorderinfo', (req, res) => {
        addCustomerOrder.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // get review
    app.get('/getreviewdata', (req, res) => {
        addCustomerData.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // get admin access
    app.get('/adminaccess', (req, res) => {
        adminAccess.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

});

app.listen(process.env.PORT || port)