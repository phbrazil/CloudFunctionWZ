const express = require('express')
const cors = require('cors');


const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['https://www.spartacla.com.br', 'http://localhost:3000']
}));

const port = 3000

app.post('/login', function (req, res) {

    //node index.js
    //killall -9 node

    const captchaAPIKey = 'e634119877d1596502fbdb9c13301f0d'


    //const api = require('call-of-duty-api')({ platform: req.body.platform, debug: 1 });

    const api = require('call-of-duty-api')();


    login();

    async function login() {

        try {

            //STATS WARZONE
           await api.login(req.body.email, req.body.password, captchaAPIKey).then(returnSSO).catch(console.log);

        } catch (Error) {

            console.log('Error: ', Error)
            //Handle Exception
        }
    }

    async function returnSSO() {

        try {

            const SSOToken = api.apiAxios.defaults.headers.common.cookie;

            const response = {
                status: 200,
                SSOToken: SSOToken
            }

            res.status(200).send(response);

        } catch (Error) {

            res.status(401).send(Error);

            //Handle Exception
        }
    }

});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

