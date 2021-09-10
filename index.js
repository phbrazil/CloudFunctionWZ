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

    //node index.js
    //killall -9 node

    const captchaAPIKey = 'e634119877d1596502fbdb9c13301f0d'


     const api = require('call-of-duty-api')({ platform: req.body.platform, debug: 1 });

    //const api = require('call-of-duty-api')();

    try {

        if(req.body.SSOToken!='' || req.body.SSOToken != null){

            api.loginWithSSO(req.body.SSOToken).then(start).catch(console.log);

        }else{

            api.login(req.body.email, req.body.password, captchaAPIKey).then(start).catch(console.log);

        }


    } catch (Error) {

        console.log('Error: ', Error)
        //Handle Exception
    }


    async function start() {

        try {

            //STATS WARZONE
            var statsWarzone = await api.MWBattleData(req.body.gamerTag);

            let recentMatches = await api.MWcombatwz(req.body.gamerTag, req.body.platform);

            var SSOToken = '{'+api.apiAxios.defaults.headers.common.cookie.replace(/=/g, ': ').replace(';',', ')+'}';

            const responseBody = {
                status: 200,
                gamerTag: req.body.gamerTag,
                response: statsWarzone,
                recentMatches: recentMatches,
                SSOToken: SSOToken
            }

            res.status(200).send(responseBody);

        } catch (Error) {

            console.log('Error: ', Error)
            //Handle Exception
        }
    }
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

