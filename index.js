const express = require('express')
const app = express()
const port = 5000
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


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guqdp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // root
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })
    const addCustomerData = client.db("CreativeAgency").collection("customerdata");
    const addCustomerOrder = client.db("CreativeAgency").collection("customerorder");
    const addService = client.db("CreativeAgency").collection("addservice");
    const adminAccess = client.db("CreativeAgency").collection("admin");
    console.log('db connection success')

    // add review
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
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
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