const express = require('express');
const app = express();
const port = 8080;
// CORSを有効にする
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});
app.get('/chat', function (req, res) {
        const userInputText = req.query.text;
        const callback = req.query.callback;
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

            const texts=['そうですね','なるほどですね','たしかに','そうでしたか～']
            msg.push({
                type: 'text',
                value: `${texts[parseInt(Math.random()*texts.length)]}`
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
);
app.listen(port, () => {
    console.log('チャットサーバーを開始しました ポート番号:' + port);
});