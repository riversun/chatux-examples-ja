
import {ChatUx} from 'chatux';

//スタイリング用のcssを読み込む
import './app.css';

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
            console.log('#onChatWindowCreate');
        },
        onChatWindowPause: (win) => {
            //チャットUIが閉じられた時
            console.log('#onChatWindowPause');
        },
        onChatWindowResume: (win) => {
            //チャットUIが復帰した時
            console.log('#onChatWindowResume');
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


