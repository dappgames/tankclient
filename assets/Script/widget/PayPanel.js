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
            displayName: '根节点',
        },
        enterFeeEditBox: {
            default: null,
            type: cc.EditBox,
            displayName: '入场费',
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    openPanel(){
        this._show=1;
        this.panelNode.active=true;
    },
    closePanel(){
        this._show=0;
        this.panelNode.active=false;
    },
    myIsNaN(value) {
        return typeof value === 'number' && !isNaN(value);
    },
    checkNum(){
        var txt=this.enterFeeEditBox.string;
        if(txt === "" || txt ==null){
            txt="20";
    　　 }
        if(!this.myIsNaN(txt)){
            txt="20";
        }
    },

    halfBtnClick(){
        this.checkNum();
        var txt=this.enterFeeEditBox.string;
        txt=txt/2;
        if(txt<10){
            txt="10"
        }
        this.enterFeeEditBox.string = txt;
    },

    doubleBtnClick(){
        this.checkNum();
        var txt=this.enterFeeEditBox.string;
        txt=txt*2;
        if(txt>1000){
            txt="1000"
        }
        this.enterFeeEditBox.string = txt;
    },

    maxBtnClick(){
        this.checkNum();
        this.enterFeeEditBox.string = "1000";
    },
    // update (dt) {},
});
