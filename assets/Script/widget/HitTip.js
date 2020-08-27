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
        rootNode: {
            default: null,
            type: cc.Node,
            displayName: '根node',
        },
        winTip: {
            default: null,
            type: cc.Label,
            displayName: 'winTip',
        },
        loseTip: {
            default: null,
            type: cc.Label,
            displayName: 'loseTip',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    setData(hitTip){
        if(hitTip.dir==1){
            this.winTip.node.active=true;
            this.winTip.string=" + "+hitTip.amount;
            console.log("win");
        }
        if(hitTip.dir==-1){
            this.loseTip.node.active=true;
            this.loseTip.string=" - "+hitTip.amount;
            console.log("lose");
        }
        this.rootNode.setPosition(0,265);
        this.inited=true;
        
    },
    start () {

    },

    update (dt) {
        if(!this.totalTime){
            this.totalTime=0;
        }
        this.totalTime+=dt;
        if(this.inited){
            this.rootNode.y+=5;
        }
        if(this.totalTime>1){
            this.rootNode.destroy();
        }
    },
});
