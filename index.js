const PORT = process.env.PORT || 5000
import { login, enableDebugMode, Warzone } from "call-of-duty-api";
import express from "express";
import cors from "cors";
import httpProxy from "http-proxy";
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

    //const api = require('call-of-duty-api');

    enableDebugMode(true);

    loginSSO();

    async function loginSSO() {

        try {

            console.log('GETTING LOGIN INFO')

            const loginStatus = login(req.body.SSOToken);

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

        console.log('GETTING STATS INFO')

        try {

            //STATS WARZONE
            Warzone.fullData(gamerTag, req.body.platform).then((fullData =>{

                Warzone.combatHistory(gamerTag, req.body.platform).then(recentMatches =>{
                    let lastMatchId = recentMatches.data.matches[0].matchID;
                    Warzone.matchInfo(lastMatchId, req.body.platform).then(lastMatchInfo =>{
                        const responseBody = {
                            status: 200,
                            gamerTag: gamerTag,
                            response: fullData,
                            recentMatches: recentMatches,
                            lastMatchInfo: lastMatchInfo
                        }
                        res.status(200).send(responseBody);
                    }).catch(err =>{
                        res.status(500).send(String("Error: matchInfo ", err));
                    });
                }).catch(err =>{
                    res.status(500).send(String("Error: combatHistory ", err));
                });
            })).catch(err =>{
                res.status(500).send(String("Error: fullData ", err));
            });

        } catch (Error) {

            console.log(Error)

            res.status(500).send(Error);

            //Handle Exception
        }
    }


}).listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
});