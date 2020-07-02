//mew = ourdata || 
//mews = news
const express = require('express');
const cors = require('cors');
//const monk = require('monk');

const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");
const app = express();

const db =require('monk')('localhost/news');
// collection inside db
const news  = db.get('news');

const filter = new Filter();


app.use(cors());
//use bodyparser middleware-any incoming req having content type app JSON will be parsed and put in body
app.use(express.json());


//incoming req and outgoing res
app.get('/', (req,res) =>{ 
    res.json({
        message: 'I get the Req!'
    })
})
//to make sure that the user inputs all given boxes
function isValidNews(mew) {
    return mew.name && mew.name.toString().trim() !== '' && mew.name.toString().trim().length <= 50 &&
      mew.content && mew.content.toString().trim() !== '' && mew.content.toString().trim().length <= 140;
  }

app.get('/news', (req,res)=>{
    news
    .find()
    .then(news => {
        res.json(news)
    });
});


app.use(rateLimit({
    windowMs: 30 * 1000, // 30 sec
    max: 1 // limit each IP to 1 requests per windowMs
  }));
app.post('/news', (req, res)=>{
    
    if (isValidNews(req.body)){
        //put it into DB
        const ourdatas = {
            name: filter.clean(req.body.name.toString()),
            content:filter.clean(req.body.content.toString()),
            created: new Date()
       };

        
        news
        .insert(ourdatas)
        .then(createdData => {
            res.json(createdData);
            console.log(createdData)
        });
  
    }
    else{
        res.status(422);
        res.json({
            message:"Please enter all required fields"
        })
    }
    console.log(req.body);
})




app.listen(5000, () =>{
    console.log('Listening on port 5000')
})