# 概要

チャットUIライブラリ　[**chatux**](https://github.com/riversun/chatux)　のサンプル集

- **スマートフォン**も**PCブラウザ**も両方対応
- 既存のコンテンツを**ジャマしないで**チャットUIを表示可能
- 既存のWebページに**scriptタグを1つ入れるだけ**

<a href="https://riversun.github.io/chatux/ja/quizbot/app/">早速デモです。”ITクイズ！”　何問わかるかな？<br>（クイズで年齢がバレちゃうかも笑）<br><img src="https://qiita-image-store.s3.amazonaws.com/0/170905/cf34f21f-1d63-7df0-45ea-d2acb362face.gif"></a>

# 対象読者
- Java Scriptが書ける人(初心者でもOK)
- node.js環境がある人(npmまたはyarnが使える)

# できること

以下のデモのような**PCブラウザとスマホ**に両対応したチャットボットUIを作ります

**スマホ**の場合は画面にフィットしたチャットUI、**PCブラウザ**の場合はフローティングする小窓にチャットUIを表示します。これを実現するためにどのような技術を使っているかは記事本編にて説明します。

- 選択肢を選択していくタイプのチャットボット  
**デモ　「クイズボット」**  
https://riversun.github.io/chatux/ja/quizbot/app/  

<table border=0>
<tr>
<td>モバイルで表示</td>
<td>PCブラウザで表示</td>
</tr>
<tr>
<td><a href="https://riversun.github.io/chatux/ja/quizbot/app/"><img src="https://qiita-image-store.s3.amazonaws.com/0/170905/cf34f21f-1d63-7df0-45ea-d2acb362face.gif"></a></td>
<td><a href="https://riversun.github.io/chatux/ja/quizbot/app/"><img src="https://qiita-image-store.s3.amazonaws.com/0/170905/8dc21521-5dfe-ed1d-6203-f232f38cb686.gif"></a></td>
</tr></table>


- テキストを入力するタイプのチャットボット  
**デモ　「トークボット」**  
https://riversun.github.io/chatux/ja/talkbot/app/  
<img src="https://qiita-image-store.s3.amazonaws.com/0/170905/5707676e-0143-cdb7-db7d-e5423a4d5c82.gif" width="260px">


# 本編

**チャットUI**は見た目、**チャットサーバー**は頭脳に相当する。本稿は**チャットUI**＝**見た目**に関する内容がメインとなる。

## 構成
前述のとおり、本稿で紹介するチャットボットは以下のように**チャットUIの部分**と**チャットサーバー部分**の2つのパートで構成されている。

仕組みはシンプルで、ユーザーがチャットUIに入力するとサーバーにテキストが送信され、サーバー側で応答を生成してJSONとして返す。

**シーケンス動画**
![arch2.gif](https://qiita-image-store.s3.amazonaws.com/0/170905/c716bf4d-42a2-1ef9-225a-0d2ba34cf4ae.gif)


## エコーをかえすだけの簡単なチャットボット

さっそくエコー（自分が書いたテキストをそのまま返す）を返すチャットボットをつくる。

先に完成版デモ。

**エコーするだけのチャット**
https://riversun.github.io/chatux/ja/echobot/app/chat.html

### エコーチャット用のUIを作る

まず、以下の図の左側に相当するチャットUIをさくっと作る

![image.png](https://qiita-image-store.s3.amazonaws.com/0/170905/e1132c2c-1c47-b548-e8b4-665195f7da59.png)


以下の**index.html**をローカルに保存して実行するだけで、エコーチャットボットを試すことが可能。

```html:index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>エコーボット</title>
</head>
<body>
<script src="https://riversun.github.io/chatux/chatux.min.js"></script>
<script>
    const chatux = new ChatUx();

    //ChatUXの初期化パラメータ
 const initParam =
        {
            renderMode: 'auto',
            api: {
                //echo chat server
                endpoint: 'https://script.google.com/macros/s/AKfycbzro2SWVx5lMKfbLu4cBt16xbqg4lT7xU5wfu4bbSQs-OMcFsQh/exec',
                method: 'GET',
                dataType: 'jsonp'
            },
            bot: {
                botPhoto: 'https://riversun.github.io/chatbot/bot_icon_operator.png',
                humanPhoto: null,
                widget: {
                    sendLabel: '送信',
                    placeHolder: '何か話しかけてみてください'
                }
            },
            window: {
                title: 'エコーボット',
                infoUrl: 'https://github.com/riversun/chatux'
            }
        };
    chatux.init(initParam);
    chatux.start(true);

</script>
</body>
</html>
```

早速この**index.html**をブラウザで開いてみるとこの通り実行できる。

![chatux_konichia.gif](https://qiita-image-store.s3.amazonaws.com/0/170905/86dac333-6bc1-e29d-aee4-eda02447c5c9.gif)


さて、このコードの重要なところを見ていきたい

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

モバイル表示用に典型的なビューポート制御のmetaタグをいれる。

<hr>

```html
<script src="https://riversun.github.io/chatux/chatux.min.js"></script>
```

チャットUI表示用ライブラリ**[ChatUx](https://www.npmjs.com/package/chatux)**を読み込む。

このライブラリが今回のミソ。

今は手っ取り早くindex.html内に**script**タグでリンクするが、後で1つのjsファイルにバンドルする。


<hr>

```js
    const chatux = new ChatUx();
```

まず**ChatUx**インスタンスを作る。
次に**ChatUx**の初期化パラメータ(initParam)を見ていく。

```js
  renderMode: 'auto',
  api: {
    endpoint: 'https://script.google.com/macros/s/AKfycbzro2SWVx5lMKfbLu4cBt16xbqg4lT7xU5wfu4bbSQs-OMcFsQh/exec',
    method: 'GET',
    dataType: 'jsonp'
  }
```

* **renderMode**・・・チャットUIのレンダリングモード
    * **auto**・・・スマホとPCを自動判定して最適なUIを表示する
    * **pc**・・・強制的にPC用のレイアウト（小窓）を表示する
    * **mobile**・・・強制的にスマホ用のレイアウトを表示する

* **api**
    * **endpoint**・・・チャットサーバーのAPIエンドポイント。  
    ここではデモ用APIサーバーのURLを指定（次章で自前サーバーの例を示す）
    * **method**・・・チャットサーバーにアクセスするときのHTTPメソッド。ここではGETメソッドを指定。
    * **dataType**・・・チャットサーバーにAjaxアクセスするときの方法を**json**または**jsonp**で指定。


初期化パラメータの続きをみていく

```js
  bot: {
    botPhoto: 'https://riversun.github.io/chatbot/bot_icon_operator.png',
    humanPhoto: null,
    widget: {
      sendLabel: '送信',
      placeHolder: '何か話しかけてみてください'
    }
  },
```

* **bot**
    * **botPhoto**・・・チャットUIに出てくるボット側のアイコン画像のURL  
    ![image.png](https://qiita-image-store.s3.amazonaws.com/0/170905/e093252d-11c2-287e-1c7a-f35c989c306c.png)

    * **humanPhoto**・・・チャットUIに出てくる人間側のアイコン画像のURL
    * **widget**
        * **sendLabel**・・・送信ボタンに表示するテキスト
        * **placeHolder**・・・ユーザー入力用テキストボックに表示するヒントのテキスト  
        ![image.png](https://qiita-image-store.s3.amazonaws.com/0/170905/2b94c6bf-f572-9616-72a7-67ab5112d8c8.png)



```js
  window: {
    title: 'エコーボット',
    infoUrl: 'https://github.com/riversun/chatux'
  }
```

* **window**・・・PCモード時のウィンドウ設定
    * **title**・・・ウィンドウのタイトル
    * **infoUrl**・・・ウィンドウ左上アイコンをクリックしたときのジャンプ先。省略可。  
    ![image.png](https://qiita-image-store.s3.amazonaws.com/0/170905/7403d302-0204-364b-ae0a-b84d8114870c.png)



```js
chatux.init(initParam);
chatux.start(true);
```

* **chatux.init(param)**で、上の初期化パラメータを適用する

* **chatux.start(true)**でチャットUIを有効化する。
　引数に**true**を指定すると、チャットUIが自動的に表示される。
　引数に**false**を指定するか無指定の場合は、画面右下のチャット起動ボタン![image.png](https://qiita-image-store.s3.amazonaws.com/0/170905/f554b584-c204-45a6-e499-8fc28062ecd6.png)を押すとチャットUIが起動する。

ここまでで、ざっくり、お手軽にチャットボットUIを作れることをみてきた。

今は、デモ用のサーバーを指定したが、次はサーバーを自作してみる。

## チャット用のサーバーをつくる

次は、下図の右側に相当するチャットサーバーを作る

![image.png](https://qiita-image-store.s3.amazonaws.com/0/170905/75b623be-c206-9c1f-967c-99eebd549e85.png)

コマンドラインからサーバー用のnpmプロジェクトを準備する

```shell
mkdir chatserver
cd chatserver
npm init
(いろいろ聞かれるが、エンターを10回たたけばOK)

npm install express
```

これでnode環境でサーバーをつくる準備ができたので、いまつくった **chatserver ディレクトリ**に **server.js**というファイルを作って、以下のコードを書く。

```js:server.js
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
```

ソースを簡単に説明する

```js
const express = require('express');
const app = express();
const port = 8080;
```

チャットサーバーは入力したテキストに応じてJSON応答を返せれば何でもOK。
ここではexpressを使う。

<hr>

```js
app.get('/chat', function (req, res) {
    const userInputText = req.query.text;
    const callback = req.query.callback;//jsonp対応
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
```

ここで **/chat**にアクセスがあったときに以下のようなJSONを返すようにする。

```json
{  
   "output":[  
      {  
         "type":"text",
         "value":"「こんにちは」って言いました"
      }
   ]
}
```

さて、サーバーができたので以下のコマンドでサーバーを起動する。

```shell
node server.js
チャットサーバーを開始しました ポート番号:8080
```

さきほどの**index.html**内のコードを以下のように修正して、チャットサーバーのURLをいま作ったサーバーのURLに変更する

●変更前

```js:index.html(抜粋)
  api: {
    endpoint: 'https://script.google.com/macros/s/AKfycbzro2SWVx5lMKfbLu4cBt16xbqg4lT7xU5wfu4bbSQs-OMcFsQh/exec',
    method: 'GET',
    dataType: 'jsonp'
  }
```

↓↓↓
●変更前後

```js:index.html(抜粋)
api: {
    endpoint: 'http://localhost:8080/chat',
    method: 'GET',
    dataType: 'json'
},
```

つまりindex.html全体は以下のようになる


```html:index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>エコーボット</title>
</head>
<body>
<script src="https://riversun.github.io/chatux/chatux.min.js"></script>
<script>
    const chatux = new ChatUx();

    //ChatUXの初期化パラメータ
 const initParam =
        {
            renderMode: 'auto',
            api: {
                //echo chat server
                endpoint: 'http://localhost:8080/chat',
                method: 'GET',
                dataType: 'jsonp'
            },
            bot: {
                botPhoto: 'https://riversun.github.io/chatbot/bot_icon_operator.png',
                humanPhoto: null,
                widget: {
                    sendLabel: '送信',
                    placeHolder: '何か話しかけてみてください'
                }
            },
            window: {
                title: 'エコーボット',
                infoUrl: 'https://github.com/riversun/chatux'
            }
        };
    chatux.init(initParam);
    chatux.start(true);

</script>
</body>
</html>
```

上のindex.htmlをブラウザで開いてみると、このとおりローカルで開いたチャットサーバーに応答している。
![gokigen.gif](https://qiita-image-store.s3.amazonaws.com/0/170905/4b28a865-3e66-5d77-aca2-e29406cd0385.gif)

## 【ご参考】チャットサーバーを無料公開する

Google Apps Script(GAS) を使えば無料で上記チャットサーバー相当の機能を公開できる。

- GASでWeb APIサーバーを公開する方法は以下の記事をご参照。  
[今から10分ではじめる Google Apps Script(GAS) で Web API公開](https://qiita.com/riversun/items/c924cfe70e16ee3fe3ba)


- 以下にGAS用のコードも掲載する。express版のコードと多少の違いはあるがJavaScriptが読める人なら特に苦労は無いはず。

```js:GASで動くチャットサーバーのソースコード
function doGet(e) {
    var userInputText = e.parameter.text;
    var callback = e.parameter.callback;
    var response = {output: []};
    var msg = response.output;
    msg.push({
        type: 'text',
        value: '「' + userInputText + '」ですね！'
    });
    var responseText = '';
    if (callback) {
        //JSONP
        responseText = callback + '(' + JSON.stringify(response) + ')';
        return send(ContentService.MimeType.JAVASCRIPT, responseText);
    } else {
        //JSON
        return sendJson(response);
    }
}
function send(mimeType, responseText) {
    var textOut = ContentService.createTextOutput();
    textOut.setMimeType(mimeType);
    textOut.setContent(responseText);
    return textOut;
}
function sendJson(response) {
    var textOut = ContentService.createTextOutput();
    var responseText = JSON.stringify(response);
    textOut.setMimeType(ContentService.MimeType.JSON);
    textOut.setContent(responseText);
    return textOut;
}
```


## チャットUIのいろんな表現に対応する

ここからは、チャットUIにボタンや画像を表示させてみる。

基本的にチャットUIはサーバーからのレスポンスに応じてレンダリングされるので、チャットサーバー側を変更する。

### オプションボタンを表示

前出のチャットサーバーを編集して以下のようなオプションボタン（選択肢）を表示してみる

![image.png](https://qiita-image-store.s3.amazonaws.com/0/170905/e47e5a97-8937-9725-5b03-73a824b58b72.png)

コードの全体像はこんな感じで、

```js:server.js
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
});
app.listen(port, () => {
    console.log('チャットサーバーを開始しました ポート番号:' + port);
});
```

ポイントはここ

```js
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
    }
```

**type:'text'**として「好きな動物は？」のテキストを表示している
その次に、
**type:'option'**で、**options**にオプションボタンをコードのように設定する。
**delayMs:500**で表示の遅延時間(ミリ秒)を設定することができる。複数のメッセージ（たとえば、テキストとボタンと画像）を同時に出したいときは、それぞれに遅延時間を指定すればユーザーがメッセージを読むスピードにあわせて１件ずつ順番にメッセージを表示できる。

```js
opts.push({label: 'イヌ', value: '犬'});
```

オプションボタンは何個でも設定可能。
オプションボタンがクリックされると、**value**に指定された値がテキストを入力されたのと同じになる。

早速**index.html**を開いて動作を確認してみる。

`if (userInputText == 'ボタン') {`としているので、
チャットが開いたら「**ボタン**」と入力する。すると、以下のとおりレンダリングされる。
![show_buttons1.gif](https://qiita-image-store.s3.amazonaws.com/0/170905/5cb7c5fa-9a51-714c-3058-c8d65a84129d.gif)

### 画像を表示

次は画像を表示させる。
サーバーのコードに以下を追加する。

```js
 else if (userInputText == '画像') {
            msg.push({
                type: 'text',
                value: '画像を表示します',
                delayMs: 500
            });
            msg.push({
                type: 'image',
                value: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Kaiserpinguinjunges.jpg/800px-Kaiserpinguinjunges.jpg'
            });
```

**type:'image'**とすると、画像を表示できる
**value:[画像のURL]**で表示したい画像を指定する

server.jsを更新してチャットサーバーを再起動したあと、**index.html**を開いて、「**画像**」と入力すると、以下のように画像を表示できる。

![show_image.gif](https://qiita-image-store.s3.amazonaws.com/0/170905/a58fef79-3d07-3e4c-021f-861b7d9e68f0.gif)

# バンドルjsをつくって、チャットUI関連処理を1つのjsファイルにする

さて、いままでは**index.html**の中にChatUXモジュールを`<script src="https://riversun.github.io/chatux/chatux.min.js"></script>`のようにscriptタグをリンクし、さらにチャットUIのコードも`<script><script>`に書いてきたが、これを**webpack**で**1つのjsファイルにバンドル**する。

さっそく、チャットUIのバンドルjsをつくるためのnpmプロジェクトを作る

```shell
mkdir chatclient
cd chatclient
npm init
(エンター10回でOK)
```

## 必要モジュールのインストール

まず、チャットUIのコアモジュール[**ChatUx**](https://www.npmjs.com/package/chatux)からインストール

```shell
npm install --save chatux
```

次は、モジュールをバンドルするために**webpack**をインストール

```shell
npm install --save-dev webpack webpack-cli webpack-dev-server
```

最後に、ES6をES5に変換するために**babel**をインストール

```shell
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

これで必要なモジュールがインストールできた。

この状態で、**package.json**は以下のようになる

```json
{
  "name": "chatclient",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chatux": "^1.0.11"
  },
  "devDependencies": {
    "@babel/core": "^7.4.0",
    "@babel/preset-env": "^7.4.2",
    "babel-loader": "^8.0.5",
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.2.1"
  }
}
```

次に、**src**ディレクトリをつくって、そこに**index.js**をつくり、jsのソースコードを書く。

```js:src/index.js
import {ChatUx} from 'chatux';
const chatux = new ChatUx();
const initParam =
    {
        renderMode: 'auto',
        api: {
            //echo chat server
            endpoint: 'http://localhost:8080/chat',
            method: 'GET',
            dataType: 'json'
        },
        bot: {
            botPhoto: 'https://riversun.github.io/chatbot/bot_icon_operator.png',
            humanPhoto: null,
            widget: {
                sendLabel: '送信',
                placeHolder: '何か話しかけてみてください'
            }
        },
        window: {
            title: '新エコーボット',
            infoUrl: 'https://github.com/riversun/chatux'
        }
    };
chatux.init(initParam);
chatux.start(true);
```

ソースを書いたら、これをコンパイル（トランスパイル）してバンドルjsをつくるために**webpack**の設定をする。

**webpack.config.js**をルートディレクトリにつくる。

ちなみに、いまディレクトリはこうなっている。

```shell
chatclient
├── src
│   └── index.js
├── node_modules
├── package.json
├── package-lock.json
└── webpack.config.js（いまからここを作業する）
```

**webpack.config.js**は以下のとおり。

```js:webpack.config.js
const path = require('path');
module.exports = (env, argv) => {
    const conf = {
        mode: 'development',
        devServer: {
            open: true,
            openPage: 'index.html',
            contentBase: path.join(__dirname, 'public'),
            watchContentBase: true,
            port: 3000,
            disableHostCheck: true
        },
        entry: {chat: './src/index.js'},
        output: {
            path: path.join(__dirname, 'public'),
            publicPath: '/',
            filename: `[name].js`
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env',
                            {
                                'modules': 'false',
                                'useBuiltIns': 'usage',
                                "corejs": 3,
                                'targets': '> 0.25%, not dead'
                            }]]
                    }
                }]
            }]
        }
    };
    return conf;
};
```

次に**package.json**にwebpackでindex.jsをコンパイルするための起動スクリプトを追加する

**scripts**以下に**start**、**start:web**、**build:web**をそれぞれ追加する。


```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server",
    "build:web": "webpack --config webpack.config.js --mode production"
  },
```

**start**はデバッグ用途でwebpack-dev-serverを起動するため、
**build:web**はindex.jsをコンパイルして必要モジュールが入ったバンドル**chat.js**を生成するためのコマンド

さて、最後に**public**ディレクトリをつくりその下に、**index.html**を作る。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>新エコーボット</title>
</head>
<body>
<script src="chat.js"></script>
</body>
</html>
```

ここまでのディレクトリ構成は以下のとおり

```shell
chatclient
├── public
│   └── index.html
├── src
│   └── index.js
├── node_modules
├── package.json
├── package-lock.json
└── webpack.config.js
```

さきほどと同様、チャットサーバーをローカルに起動しておきつつ、いまつくったindex.htmlをwebpack-dev-serverでホストして実行する。


```shell
npm start
```

これでindex.htmlの中に`<script src="chat.js"></script>`をリンクしただけで無事起動した

![afterbunde.gif](https://qiita-image-store.s3.amazonaws.com/0/170905/be6fccd1-a8a5-bfb8-0f39-022649654db0.gif)

バンドルjsを生成したい場合は

```shell
npm run build:web
```

を実行すると、必要モジュールがすべてバンドルされたjsファイル**chat.js**が生成される。


```shell
chatclient
├── public
│   ├── chat.js (←いま生成されたバンドル)
│   └── index.html
├── src
│   └── index.js
├── node_modules
├── package.json
├── package-lock.json
└── webpack.config.js
```

ここまでで、チャットサーバーの作り方、チャットUIのバンドルの作り方をみてきたので、これで**script**タグを1ついれるだけで既存のWebコンテンツをジャマしない形でチャットUIを実現できる。

# カスタマイズと応用

チャットUIの見た目や挙動はカスタマイズ可能。またサーバー側を作り込めばチャットボットやチャットサービスを作成することが可能となる。

![styling.gif](https://qiita-image-store.s3.amazonaws.com/0/170905/13f4106d-07f2-5817-a151-377082528464.gif)

## チャットUI側の初期化パラメータの設定例

初期化パラメータで、チャットUIのウィンドウの見た目や各種コールバックイベントのハンドリング関数を指定できる。

```js
import {ChatUx} from 'chatux';
const chatux = new ChatUx();

//初期化パラメータ
const initParam = {
    //auto:PCとスマホを自動判定、pc:強制的にPCモード、mobile:強制的にスマホモード
    renderMode: 'auto',
    //true:チャットUIが開いたら、チャット起動ボタンを消す(pcモードのみ有効)
    buttonOffWhenOpenFrame: false,
    bot: {
        //チャットUI起動時に自動的にサーバーに送るテキスト
        wakeupText: null,
        //ボット側のアイコン画像URL
        botPhoto: 'https://riversun.github.io/chatbot/bot_icon_operator.png',
        //ユーザー側のアイコン画像URL
        humanPhoto: null,
        widget: {
            //SENDボタンのラベル
            sendLabel: '送信',
            //テキストボックスのヒント
            placeHolder: ''
        }
    },
    api: {
        //チャットサーバーのURL
        endpoint: 'http://localhost:8080/chat',
        //'GET'または'POST'
        method: 'GET',
        //'json'または'jsonp'
        dataType: 'json',
        errorResponse: {
            output: [
                //ネットワークエラー発生時のエラーメッセージ
                {type: 'text', value: 'ネットワークエラーが発生しました'}
            ]
        }
    },
    //PCモードの場合に表示される小窓（ウィンドウ）の設定
    window: {
        //ウィンドウのタイトル
        title: '私のチャットボット',
        //チャットウィンドウ左上のアイコンをクリックしたときにジャンプするURL
        infoUrl: 'https://github.com/riversun/chatux',
        size: {
            width: 350,//ウィンドウの幅
            height: 500,//ウィンドウの高さ
            minWidth: 300,//ウィンドウの最小幅
            minHeight: 300,//ウィンドウの最小高さ
            titleHeight: 50//ウィンドウのタイトルバー高さ
        },
        appearance: {
            //ウィンドウのボーダースタイル
            border: {
                shadow: '2px 2px 10px  rgba(0, 0, 0, 0.5)',//影
                width: 0,//ボーダーの幅
                radius: 6//ウィンドウの角丸半径
            },
            //ウィンドウのタイトルバーのスタイル
            titleBar: {
                fontSize: 14,
                color: 'white',
                background: 'black',
                leftMargin: 40,
                height: 40,
                buttonWidth: 36,
                buttonHeight: 16,
                buttonColor: 'white',
                buttons: [
                    //閉じるボタン
                    {
                        //閉じるボタンのアイコン(fontawesome)
                        fa: 'fas fa-times',
                        name: 'hideButton',
                        visible: true  //true:表示する
                    }
                ],
                buttonsOnLeft: [
                    //左上のinforUrlボタン
                    {
                        fa: 'fas fa-comment-alt',//specify font awesome icon
                        name: 'info',
                        visible: true  //true:表示する
                    }
                ],
            },
        }
    },
    //チャット起動ボタンの位置
    wakeupButton: {
        right: 20,
        bottom: 20,
        size: 60,
        fontSize: 25//フォントサイズ
    },
    //イベントのコールバックメソッド
    methods: {
        onChatWindowCreate: (win) => {
            //チャットUIが生成された時
        },
        onChatWindowPause: (win) => {
            //チャットUIが閉じられた時
        },
        onChatWindowResume: (win) => {
            //チャットUIが復帰した時
        },
        onUserInput: (userInputText) => {
            //ユーザーがテキストを入力したとき
            //(テキストをインターセプトする)
            console.log('#onUserInput userInputText=' + userInputText);
            if (userInputText === 'おしまい') {
                //チャットUIを終了する
                chatux.dispose();
                //consumed=trueで返すと、テキストはサーバーには送信されない
                const consumed = true;
                return consumed;
            }
        },
        onServerResponse: (response) => {
            //チャットサーバーのレスポンスを受け取った時
            //レンダリング前なのでresponseを編集するとレンダリング結果を変更できる
            console.log('#onServerResponse response=' + JSON.stringify(response));
            return response;
        }
    }
};
chatux.init(initParam);
//trueを指定すると、チャットUIを自動的に開く
chatux.start(true);
```

## 見た目、スタイリング

CSSでスタイリングが可能

ご参考
https://raw.githubusercontent.com/riversun/chatux/master/src/app.css

## ChatUxを構成している要素技術

これまでみてきたチャットUIをお手軽に実現する[**ChatUx**](https://github.com/riversun/chatux)モジュールでは以下のライブラリを内部で利用しているので興味があれば、以下リポジトリが参考になる

- チャットUI表示 https://github.com/botui/botui
- 小窓表示(PCモード時) https://github.com/riversun/JSFrame.js

## チャットサーバー側のカスタムについて

- 今回はサーバー側は触り程度の説明だったが、セッション機能を利用すればステートフルなチャットボット、チャットサービスをつくることが可能だし、認証機能を入れれば、ユーザーにあったチャットコンテンツを提供することも可能になる。
- お試し程度であればさきほど紹介した[GAS](https://qiita.com/riversun/items/c924cfe70e16ee3fe3ba)も地味に便利

## 人口無能からＡＩチャットサーバーへ
- 今回の例ではIF文をつかった原始的な対話をサンプルとして紹介した
- 手続き型の対話であれば Watson などを使ってテキスト→意図分類→対話応答生成という手順で設計すれば本格的な対話アプリは作れるし、WatsonつかわなくてもNLP系の[ライブラリ](https://github.com/axa-group/nlp.js)は最近充実してきているので、それらを活用すればそれっぽいチャットボットを作ることも可能。

**ご参考**
Watsonをモチーフにして、対話アプリを解説した[記事](https://qiita.com/riversun/items/c0ea4115d14e85d32474)


# まとめ
- スマホもPCブラウザにも両対応したチャットUIの作り方を紹介しました
- チャットUIの実現のために 拙作[**ChatUX**](https://github.com/riversun/chatux) というモジュールと使い方を説明しました
- よりカスタムしたい場合は https://github.com/riversun/chatux のREADMEやソースが参考になるとおもいます
- もし、この記事がお役に立てたら https://github.com/riversun/chatux のほうにもスターを頂けると作者が喜びます★★★

長文お読みいただきありがとうございました。

