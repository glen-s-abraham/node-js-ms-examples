const express = require('express');
const bodyParser = require('body-parser')

const app = express();


const postsWithComments = {}

app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    res.status(200).json(postsWithComments);
})

app.post('/events', (req, res) => {
    const {type,data} = req.body;
    if(type==='postCreated'){
        const {id,title} =data;
        postsWithComments[id] = {id,title,comments:[]}
    }
    if(type==='commentCreated'){
        const {id,content,postId} = data;
        postsWithComments[postId].comments.push({id,content});
    }

    res.status(200);
})


app.listen(4002, () => console.log('Listening on port 4002'));
