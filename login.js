const express = require('express')
const cors = require('cors');

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['https://www.spartacla.com.br', 'http://localhost:3000']
}));

const port = 5000

app.post('/login', function (req, res) {

    //node index.js
    //killall -9 node

    const captchaAPIKey = 'e634119877d1596502fbdb9c13301f0d'


    //const api = require('call-of-duty-api')({ platform: req.body.platform, debug: 1 });

    const api = require('call-of-duty-api');

    //api.enableDebugMode(true);


    login();

    async function login() {

        try {

            //STATS WARZONE
            //await api.login(req.body.email, req.body.password, captchaAPIKey).then(returnSSO).catch(console.log);
            await api.login(req.body.email, req.body.password, captchaAPIKey).then(returnSSO).catch(console.log);

            //api.apiAxios.defaults.headers.common.cookie = "XSRF-TOKEN=ydlRcTlIVLj8e5Can85f3PIRpyUBPjkR2fLZJpu-RPOVkW4QRdZ37uxv6gi2lrub;ACT_SSO_COOKIE=MTAwNTU1MTE2MzI1ODIxMjE0MDg6MTYzNzA5MTI1MDQ2NTo3MTUxZDk5ZDE4N2NiNjJkZDBjZDhjNjIzYTE2ZDAxMA;atkn=eyJhbGciOiAiQTEyOEtXIiwgImVuYyI6ICJBMTI4R0NNIiwgImtpZCI6ICJ1bm9fcHJvZF9sYXNfMSJ9.kyTZaytsujus0HH6D_1Oh30yx54WAbGGHXf0zEa9E6Nxs7aoLXftBg.SkG14aN5sli0ESom.TSz77jfRcidxONiyTSBa-wPV2gGrL8sHNIsqidg9DySXkfpdOCWd7Ccm4kALS6ZGnMJWXkmWJ4Bpg8ykhi5QCRe7hGS11NGbd4RtEcSTveTYqcSovDf1FAI7j7N6rQ2I8iitgld1n3lOl6vf4nw9GYOrQd-WQk1_fmLZG5w405N6ivx5nf7f5YM4oKThss9_N1cSMVQQqY0yZXDlmYF4tbG4hwsMVU5lAbEURsW-2dX8kAnK0ZYJIh-q1wvdbmGZz1bpMHjY8kWkxEc9cgFekL_bSgwSSsz3Mmd4wMgpVsU1UNonMSuFgcvC4LqMJnl9kot4UgnYZzN8TKSCAnHiL_T9pioruB_FE3KhNzX7vj4bu1DIDse71EYJFB5cJEzTG20YBr5x0O5LpzblqTl4kghZdmj7wik3kAlBLOcyPcsqyyhb4eVSZGZJrEopYL-_RP1srE-Kft-gJ_wbWbWK6zem5EwmAg._xNwzucm65uVw_MA0sS7kg;"

            returnSSO();

        } catch (Error) {

            console.log('Error: ', Error)
            //Handle Exception
        }
    }

    async function returnSSO() {

        try {

            let SSOToken = api.apiAxios.defaults.headers.common.cookie;

            const searchEqual = '='
            const replacerEqual = new RegExp(searchEqual, 'g')

            SSOToken = SSOToken.replace(replacerEqual, ':')

            SSOToken = SSOToken.split(":");

            const response = {
                status: 200,
                SSOToken: SSOToken[2].replace(";atkn", "")
            }

            res.status(200).send(response);

        } catch (Error) {

            console.log(Error)

            res.status(401).send(Error);

            //Handle Exception
        }
    }

});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

