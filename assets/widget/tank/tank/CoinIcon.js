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
        boom:{
            default: null,
            type: cc.Sprite,
            displayName: 'boom',
        },
        cocos:{
            default: null,
            type: cc.Sprite,
            displayName: 'cocos',
        },
        eos:{
            default: null,
            type: cc.Sprite,
            displayName: 'eos',
        },
        iost:{
            default: null,
            type: cc.Sprite,
            displayName: 'iost',
        },
        trx:{
            default: null,
            type: cc.Sprite,
            displayName: 'trx',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    show(name){
        this.boom.node.active=false;
        this.cocos.node.active=false;
        this.eos.node.active=false;
        this.iost.node.active=false;
        this.trx.node.active=false;
        name=name.toLowerCase();
        if(name == 'boom'){
            this.boom.node.active=true;
        }
        if(name == 'cocos'){
            this.cocos.node.active=true;
        }
        if(name == 'eos'){
            this.eos.node.active=true;
        }
        if(name == 'iost'){
            this.iost.node.active=true;
        }
        if(name == 'trx'){
            this.trx.node.active=true;
        }
    },

    start () {

    },

    // update (dt) {},
});
