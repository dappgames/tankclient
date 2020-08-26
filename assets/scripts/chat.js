// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        chatMsgEdit: {
            default: null,
            type: cc.EditBox,
            displayName: '发送框',
        },
        chatMsgLayout: {
            default: null,
            type: cc.Node,
            displayName: '文本框',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log('chat onLoad');
        this._userName='user' + Math.floor((Math.random()*1000)+1);
    },

    start() {
        console.log('chat start');

    },

    update(dt) {},

    onEnable() {
        console.log('chat onEnable');
    },

    onDisable() {
        console.log('chat onDisable');
    },
    onDestroy() {
        console.log('chat onDestroy');
        window.mySocket.removeAllListeners("chatevent");
    },

    regCallback() {
        var mySocket = window.mySocket;
        var that = this;
        mySocket.on('chatevent', function (resp) {
            let str=resp.userName+":"+resp.message;
            var node = new cc.Node('Label');
            var lb = node.addComponent(cc.Label);
            lb.string = str;
            lb.node.color = new cc.color(0,0,0,255);
            node.parent = that.chatMsgLayout;
        });
    },

    sendMsg() {
        var that = this;
        var msg = that.chatMsgEdit.string;
        console.log('send msg');
        console.log(msg);
        let chatObj = {
            userName:that._userName,
            message:msg
        };
        let mySocket = window.mySocket;
        mySocket.emit('chatevent', chatObj);
    },
    recieveMsg() {

    }
});