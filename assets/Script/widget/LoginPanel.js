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
        panelNode: {
            default: null,
            type: cc.Node,
            displayName: '登录根节点',
        },
        cocosLoginBtn: {
            default: null,
            type: cc.Node,
            displayName: 'cocos登录按钮',
        },
        eosLoginBtn: {
            default: null,
            type: cc.Node,
            displayName: 'eos登录按钮',
        },
        trxLoginBtn: {
            default: null,
            type: cc.Node,
            displayName: 'trx登录按钮',
        },
        iostLoginBtn: {
            default: null,
            type: cc.Node,
            displayName: 'iost登录按钮',
        },
        _show: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cocosLoginBtn.active=false;
        this.eosLoginBtn.active=false;
        this.trxLoginBtn.active=false;
        this.iostLoginBtn.active=false;
    },

    start () {

    },

    openPanel(){
        this._show=1;
        let supportWallets = window.supportWallets;
        if(supportWallets){
            this.panelNode.active=true;
            console.log(supportWallets);
            if(supportWallets.indexOf('cocos')>-1){
                this.cocosLoginBtn.active=true;
                console.log('show cocosLoginBtn');
            }
            if(supportWallets.indexOf('eos')>-1){
                this.eosLoginBtn.active=true;
                console.log('show eosLoginBtn');
            }
            if(supportWallets.indexOf('trx')>-1){
                this.trxLoginBtn.active=true;
                console.log('show trxLoginBtn');
            }
            if(supportWallets.indexOf('iost')>-1){
                this.iostLoginBtn.active=true;
                console.log('show iostLoginBtn');
            }
        }else{

        }
    },
    closePanel(){
        this._show=0;
        this.panelNode.active=false;
        this.cocosLoginBtn.active=false;
        this.eosLoginBtn.active=false;
        this.trxLoginBtn.active=false;
        this.iostLoginBtn.active=false;
    }


    // update (dt) {},
});
