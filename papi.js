const express = require('express')
const cors = require('cors');
const PORT = process.env.PORT || 5000
const https = require('https');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var cookieParser = require('cookie-parser');

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['https://www.spartacla.com.br', 'http://localhost:3000']
},cookieParser()));

//https://dashboard.heroku.com/apps/node-warzone-stats/deploy/github

app.post('/', function (req, resp) {

    const api = require('call-of-duty-api');

    const gamerTag = encodeURIComponent(req.body.gamerTag);
    const platform = req.body.platform;

    let baseUrl = `https://my.callofduty.com/api/papi-client/stats/cod/v1/title/mw/platform/${platform}/gamer/${gamerTag}/profile/type/wz`;

    proxy.web(req, resp, { target: 'http://143.208.200.26' });

    login();

    async function login() {

        try {

            console.log('GETTING LOGIN INFO')

            const loginStatus = api.login(req.body.SSOToken);

            if (loginStatus) {
                start();
            } else {
                resp.status(404).send("Access denid");
            }

        } catch (Error) {

            resp.status(401).send(Error);

            //Handle Exception
        }
    }

    async function start() {

        console.log("starting");

        https.get(baseUrl, (res) => {
            resp.cookie("ACT_SSO_COOKIE", req.body.SSOToken);
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", () => {
                try {
                    console.log("Retrieving data");
                    let json = JSON.parse(body);
                    console.log(json)
                    resp.status(200).send(json);
                } catch (error) {
                    console.error(error.message);
                    resp.status(401).send(error);
                };
            });

        }).on("error", (error) => {
            console.error(error.message);
            resp.status(401).send(error);
        });
    }

}).listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
});