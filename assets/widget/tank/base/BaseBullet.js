// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const Bullet = require('./Bullet');

cc.Class({
    extends: cc.Component,

    properties: {
        rootNode: {
            default: null,
            type: cc.Node,
            displayName: '根node',
        },
        bulletComponent: {
            default: null,
            type: Bullet,
            displayName: 'bulletComponent',
        },
        sm: {
            default: null,
            type: Bullet,
            displayName: 'sm',
        },
        md: {
            default: null,
            type: Bullet,
            displayName: 'md',
        },
        hv: {
            default: null,
            type: Bullet,
            displayName: 'hv',
        },
        ls: {
            default: null,
            type: Bullet,
            displayName: 'ls',
        },
        pz: {
            default: null,
            type: Bullet,
            displayName: 'pz',
        },
        rk: {
            default: null,
            type: Bullet,
            displayName: 'rk',
        },

    },

    start () {

    },
    onLoad() {
        this.lastState="init";
        this.skin="sm";
    },
    setSkin(skin){
        if(skin=='sm'){
            this.bulletComponent=this.sm;
        }
        if(skin=='md'){
            this.bulletComponent=this.md;
        }
        if(skin=='hv'){
            this.bulletComponent=this.hv;
        }
        if(skin=='ls'){
            this.bulletComponent=this.ls;
        }
        if(skin=='pz'){
            this.bulletComponent=this.pz;
        }
        if(skin=='rk'){
            this.bulletComponent=this.rk;
        }
        this.skin=skin;
        if(this.bulletComponent==null){
            this.bulletComponent=this.sm;
            this.skin="sm";
        }
        this.bulletComponent.node.active=true;
        
    },
    setPos(x,y){
        if(this.rootNode){
            this.rootNode.setPosition(x,y);
        }
    },
    setAngle(a){
        if(this.rootNode){
            this.rootNode.angle=a;
        }
    },
    setBulletState(state,distance){
        if(this.bulletComponent){
            this.bulletComponent.setBulletState(state);
            if(this.lastState==state){

            }else{
                let vol=100/distance;
                if(vol>1){
                    vol=1;
                }
                if(vol<0.1){
                    vol=0;
                }
                this.lastState=state;
                var bulletSound={
                    skin:this.skin,
                    vol:vol,
                    state:state
                };
                cc.director.emit('bulletSound', bulletSound);
                // console.log(vol);
            }
        }
    },
    hide(){
        if(this.bulletComponent){
            this.bulletComponent.node.active=false;
            this.bulletComponent.hide();
            this.bulletComponent=null;
            
        }
    },
    onDestroy(){
        // console.log("destroy");
    },

    // update (dt) {},
});
