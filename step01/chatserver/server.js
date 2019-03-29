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
    msg.push({
        type: 'text',
        value: '「' + userInputText + '」ですね！'
    });
    if (callback) {
        const responseText = callback + '(' + JSON.stringify(response) + ')';
        res.set('Content-Type', 'application/javascript');
        res.send(responseText);

    } else {
        res.json(response);
    }
});
app.listen(port, () => {
    console.log('チャットサーバーを開始しました ポート番号:' + port);
});