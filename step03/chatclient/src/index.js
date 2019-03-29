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


