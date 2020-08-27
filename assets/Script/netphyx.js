// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const Ring = require('../widget/joystick/ring');


cc.Class({
    extends: cc.Component,

    properties: {
        joyStickMove: {
            default: null,
            type: Ring,
            displayName: '运动摇杆',
        },
        gameObj: {
            default: null,
            type: cc.Node,
            displayName: '游戏物体',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.schedule(this._sendJoyStickMoveCallback, 0.1);
    },

    start () {

    },

    _sendJoyStickMoveCallback(){
        let mySocket = window.mySocket;
        let joyStickMoveData = this.joyStickMove.getInputData();
        this._userInput = {
            addx: joyStickMoveData.addx,
            addy: joyStickMoveData.addy,
            bodyAngle: joyStickMoveData.bodyAngle,
        };

        if(this._userInput.addx!=0||this._userInput.addy!=0){
            mySocket.emit('simpleInput', this._userInput);
        }
    },
    regCallback() {
        var mySocket = window.mySocket;
        var that = this;
        mySocket.on('simpleMove', function (resp) {
            that.gameObj.setPosition(resp.x,resp.y);
            that.gameObj.angle=resp.r * 180 / Math.PI - 90;
            console.log(resp);
        });
    },

    // update (dt) {},
});
