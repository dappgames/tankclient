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
        let joyStickMoveData = this.joyStickMove.getInputData();
        this._userInput = {
            addx: joyStickMoveData.addx,
            addy: joyStickMoveData.addy,
            bodyAngle: joyStickMoveData.bodyAngle,
        };
        let oldPos=this.gameObj.position;
        if(joyStickMoveData.addx&&joyStickMoveData.addy){
            this.gameObj.setPosition(oldPos.x+joyStickMoveData.addx*10,oldPos.y+joyStickMoveData.addy*10);
            this.gameObj.angle=joyStickMoveData.bodyAngle-90;
        }
        // console.log(this._userInput);

    }

    // update (dt) {},
});
