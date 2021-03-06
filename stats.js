const express = require('express')
const cors = require('cors');
const PORT = process.env.PORT || 5000


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['https://www.spartacla.com.br', 'http://localhost:3000']
}));

app.post('/', function (req, res) {

    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.socket.remoteAddress;

    console.log('Ip Address ', ip)

    //node index.js
    //killall -9 node

    //const api = require('call-of-duty-api')({ platform: req.body.platform });
    const api = require('call-of-duty-api')({
        platform: req.body.platform,
        debug: 1,
        ratelimit: {
            maxRequests: 2,
            perMilliseconds: 1000, maxRPS: 2
        }
    });

    login();

    async function login() {

        try {

            console.log('GETTING LOGIN INFO')

            await api.loginWithSSO(req.body.SSOToken).then(start).catch(console.log);

        } catch (Error) {

            res.status(401).send(Error);

            //Handle Exception
        }
    }


    function start() {


        try {

            console.log('GETTING STATS INFO')

            var SSOToken = api.apiAxios.defaults.headers.common.cookie;

            

            //STATS WARZONE
            api.MWBattleData(req.body.gamerTag, req.body.platform).then((output =>{

                const responseBody = {
                    status: 200,
                    gamerTag: req.body.gamerTag,
                    response: output,
                    //recentMatches: recentMatches,
                    //lastMatchDetail: lastMatchDetail,
                    //MWweeklystats: MWweeklystats,
                    //MWAnalysis: MWAnalysis,
                    SSOToken: SSOToken
                }

                res.status(200).send(responseBody);

            }));

            //let recentMatches = await api.MWcombatwz(req.body.gamerTag, req.body.platform);

            //let lastMatchDetail = await api.MWFullMatchInfowz(recentMatches.matches[0].matchID, req.body.platform);

            //let MWAnalysis = await api.MWAnalysis(req.body.gamerTag, req.body.platform);

            //let MWweeklystats = await api.MWweeklystats(req.body.gamerTag, req.body.platform);
            


        } catch (Error) {

            res.status(401).send(Error);

            //Handle Exception
        }
    }
});

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
});

