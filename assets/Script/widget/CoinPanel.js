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
        cocos_test: {
            default: null,
            type: cc.Node,
            displayName: 'cocos_test',
        },
        cocos: {
            default: null,
            type: cc.Node,
            displayName: 'cocos',
        },
        boom: {
            default: null,
            type: cc.Node,
            displayName: 'boom',
        },
        eos: {
            default: null,
            type: cc.Node,
            displayName: 'eos',
        },
        iost: {
            default: null,
            type: cc.Node,
            displayName: 'iost',
        },
        trx: {
            default: null,
            type: cc.Node,
            displayName: 'trx',
        },
        balanceTxt: {
            default: null,
            type: cc.Label,
            displayName: '余额txt',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setBalance(chainName,amount){
        this.cocos_test.active=false;
        this.cocos.active=false;
        this.boom.active=false;
        this.eos.active=false;
        this.iost.active=false;
        this.trx.active=false;


        var balance="0.0000 COCOS";

        if("cocos_test"==chainName){
            balance=amount+" COCOS(TEST)";
            this.cocos_test.active=true;
        }
        if("cocos"==chainName){
            balance=amount+" COCOS";
            this.cocos.active=true;
        }
        if("boom"==chainName){
            balance=amount+" BOOM";
            this.boom.active=true;
        }
        if("eos"==chainName){
            balance=amount+" EOS";
            this.eos.active=true;
        }
        if("iost"==chainName){
            balance=amount+" IOST";
            this.iost.active=true;
        }
        if("trx"==chainName){
            balance=amount+" TRX";
            this.trx.active=true;
        }

        this.balanceTxt.string=balance;
    },
    // update (dt) {},
});
