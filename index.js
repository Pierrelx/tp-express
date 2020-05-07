const express = require('express');
const bodyParser = require('body-parser');
const GitLabApi = require('./libs/gitlab');
const settings = require('app-settings');
const cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({ extended: true })) 
// parse application/json
app.use(bodyParser.json())
// app.use(cors())
app.options('localhost:3000', cors())

app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
var names = []
app.get('/', (req, res) => {
    let api = new GitLabApi(settings);
    api.listRecentIssues()
    .then(
        data => {
            res.render('index', { issues: data });
        }
    )
    .catch(
        err => {
        console.log('erreur')
        console.log(err)
    })
})

app.get('/getstats', (req, res)=> {
    let api = new GitLabApi(settings);
    res.setHeader('Content-Type', 'application/json');
    api.issuesStats('01-01-2019').then(
        data => {
            res.send(JSON.stringify(data));
        }
    )
    .catch(err => {
        console.log("erreur")
        console.log(err);
    });
})

app.get('/closed', (req, res) => {
    let api = new GitLabApi(settings);
    api.listClosedIssues('01-01-2019')
    .then(
        data => {
            res.send(JSON.stringify(data))
        }
    )
    .catch(err => {
        console.log('erreur')
        console.log(err)
    })
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})

// app.post('/add', (req, res) => {
//     let n = req.body.name;
//     names.push(n);
//     console.log(`${n} ajouté`)
//     res.redirect('/');
// })