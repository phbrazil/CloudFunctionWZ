const express = require('express')
const cors = require('cors');
const PORT = process.env.PORT || 5000
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['https://www.spartacla.com.br', 'http://localhost:3000']
}));

//https://dashboard.heroku.com/apps/node-warzone-stats/deploy/github

app.post('/', function (req, res) {

    //encoded gamerTag
    const gamerTag = encodeURIComponent(req.body.gamerTag);

    console.log(gamerTag)

    proxy.web(req, res, { target: 'http://143.208.200.26' });

    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.socket.remoteAddress;

    console.log('Ip Address ', ip)

    //node index.js
    //killall -9 node

    const api = require('call-of-duty-api');

    login();

    async function login() {

        try {

            console.log('GETTING LOGIN INFO')

            const loginStatus = api.login(req.body.SSOToken);

            if(loginStatus){
                start();
            }else{
                res.status(404).send("Access denid");         
            }

        } catch (Error) {

            res.status(401).send(Error);

            //Handle Exception
        }
    }


    async function start() {


        try {

            console.log('GETTING STATS INFO')

            let recentMatches = await api.Warzone.combatHistory(gamerTag, req.body.platform)

            let lastMatchId = recentMatches.data.matches[0].matchID;

            let lastMatchInfo = await api.Warzone.matchInfo(lastMatchId, req.body.platform)

            //STATS WARZONE
            api.Warzone.fullData(gamerTag, req.body.platform).then((fullData =>{

                const responseBody = {
                    status: 200,
                    gamerTag: gamerTag,
                    response: fullData,
                    recentMatches: recentMatches,
                    lastMatchInfo: lastMatchInfo
                }
                res.status(200).send(responseBody);
            })).catch(err =>{
                console.log("Error :", err)
                res.status(401).send(String(err));
            });

        } catch (Error) {

            console.log(Error)

            res.status(401).send(Error);

            //Handle Exception
        }
    }


}).listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
});