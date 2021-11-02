const express = require('express')
const cors = require('cors');


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['https://www.spartacla.com.br', 'http://localhost:3000']
}));

const port = 3000

app.post('/', function (req, res) {

    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
    req.socket.remoteAddress;

    console.log('Ip Address ', ip)

    //node index.js
    //killall -9 node

    const captchaAPIKey = 'e634119877d1596502fbdb9c13301f0d'


    //const api = require('call-of-duty-api')({ platform: req.body.platform });
    const api = require('call-of-duty-api')({ platform: req.body.platform, debug: 1 });

    //const api = require('call-of-duty-api')();

    try {


        if (req.body.SSOToken.trim()) {

            api.loginWithSSO(req.body.SSOToken).then(start).catch(console.log);

        } else {

            console.log('getting new SSO')

            api.login(req.body.email, req.body.password, captchaAPIKey).then(start).catch(console.log);

        }


    } catch (Error) {

        res.status(401).send(Error);

        //Handle Exception
    }


    async function start() {

        try {

            //STATS WARZONE
            var statsWarzone = await api.MWBattleData(req.body.gamerTag);

            let recentMatches = await api.MWcombatwz(req.body.gamerTag, req.body.platform);

            let lastMatchDetail = await api.MWFullMatchInfowz(recentMatches.matches[0].matchID, req.body.platform);

            //let MWAnalysis = await api.MWAnalysis(req.body.gamerTag, req.body.platform);

            var SSOToken = api.apiAxios.defaults.headers.common.cookie;

            const responseBody = {
                status: 200,
                gamerTag: req.body.gamerTag,
                response: statsWarzone,
                recentMatches: recentMatches,
                lastMatchDetail: lastMatchDetail,
                //MWAnalysis: MWAnalysis,
                SSOToken: SSOToken
            }

            res.status(200).send(responseBody);

        } catch (Error) {

            res.status(401).send(Error);

            //Handle Exception
        }
    }
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

