const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8081;
// CORSを有効にする
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

//POSTでrequest bodyをJSONとして受け取るとき
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function handleRequest(userInputText, callback, res) {
    const response = {output: []};
    const msg = response.output;

    if (userInputText == 'ボタン') {
        msg.push({
            type: 'text',
            value: '好きな動物は？',
            delayMs: 500 //表示ディレイ（ミリ秒）
        });
        //オプションボタンを作る
        const opts = [];
        opts.push({label: 'イヌ', value: '犬'});
        opts.push({label: 'ネコ', value: '猫'});
        opts.push({label: 'ウサギ', value: '兎'});
        msg.push({type: 'option', options: opts});
    } else if (userInputText == '画像') {
        msg.push({
            type: 'text',
            value: '画像を表示します',
            delayMs: 500
        });
        msg.push({
            type: 'image',
            value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kaiserpinguinjunges.jpg/800px-Kaiserpinguinjunges.jpg'
        });
    } else {
        msg.push({
            type: 'text',
            value: '「' + userInputText + '」ですね！'
        });
    }

    if (callback) {
        const responseText = callback + '(' + JSON.stringify(response) + ')';
        res.set('Content-Type', 'application/javascript');
        res.send(responseText);
    } else {
        res.json(response);
    }
}

app.get('/chat', function (req, res) {
        const userInputText = req.query.text;
        const callback = req.query.callback;
        handleRequest(userInputText, callback, res);
    }
);
app.post('/chat', function (req, res) {
        const userInputText = req.body.text;
        const callback = null;
        handleRequest(userInputText, callback, res);
    }
);
app.listen(port, () => {
    console.log('チャットサーバーを開始しました ポート番号:' + port);
});