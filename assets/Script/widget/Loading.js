// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        loadingNode: {
            default: null,
            type: cc.Node,
            displayName: 'loading节点',
        },
        loadingMsg: {
            default: null,
            type: cc.Label,
            displayName: 'loadingMsg',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    open(msg){
        this.node.active=true;
        this.loadingMsg.string=msg;
    },
    close(){
        this.node.active=false;
    },
    update (dt) {
        this.loadingNode.angle=this.loadingNode.angle-4;
    },
});
