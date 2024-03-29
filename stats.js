const express = require('express')
const cors = require('cors');
const PORT = process.env.PORT || 5000


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['https://www.spartacla.com.br', 'http://localhost:3000']
}));


//https://dashboard.heroku.com/apps/node-warzone-stats/deploy/github

app.post('/', function (req, res) {

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

            let recentMatches = await api.Warzone.combatHistory(req.body.gamerTag, req.body.platform)

            let lastMatchId = recentMatches.data.matches[0].matchID;

            let lastMatchInfo = await api.Warzone.matchInfo(lastMatchId, req.body.platform)

            //STATS WARZONE
            api.Warzone.fullData(req.body.gamerTag, req.body.platform).then((fullData =>{

                const responseBody = {
                    status: 200,
                    gamerTag: req.body.gamerTag,
                    response: fullData,
                    recentMatches: recentMatches,
                    lastMatchInfo: lastMatchInfo
                }
                res.status(200).send(responseBody);
            }));

        } catch (Error) {

            res.status(401).send(Error);

            //Handle Exception
        }
    }
});

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
});

