// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const io = require('./utils/socket.io');
const cry=require('./utils/cry');
// const socketUrl='http://sh.suishizhuan.com:10800';
// const socketUrl='http://api-v1.eosflare.io';
// const socketUrl='http://localhost:10800';
const socketUrl='http://30.55.129.115:10900';
// const socketUrl='http://47.103.44.252:10800';


// const socketUrl = 'http://192.168.31.118:10800';



let SocketCenter = cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var that=this;
        window.gameSocket={
            socketio:null,
            status:0,//0未连接,1连接中,2已连接
        };
        console.log("EventCenter init");
        let check_intervral = setInterval(function(){
            that._checkSocketConnect();
        }, 1500);
        //socket
        //user
        window.gameUser={
            userId:null,
            accountName:null,
            nickName:null,
            chainName:null,
            balance:null,
        };
    },

    _deinitListener(){
        if(window.gameSocket&&window.gameSocket.socketio){
            window.gameSocket.socketio.removeAllListeners("connect");
            window.gameSocket.socketio.removeAllListeners("disconnect");
            window.gameSocket.socketio.removeAllListeners("connect_error");
            window.gameSocket.socketio.removeAllListeners("error");
        }
    },

    _checkSocketConnect(){
        // console.log("checkSocketConnect");
        var that=this;
        try{
            if(window.gameSocket.status==0){
                console.log("try connect");
                window.gameSocket.status=1;
                if(window.gameSocket.socketio!=null){
                    window.gameSocket.socketio.disconnect();
                    window.gameSocket.socketio=null;
                }
                var tm=(new Date().getTime())+"";
                var token = cry.hex_hmac_cry1('5bi1lbh2',tm);
                window.gameSocket.socketio = io.connect(socketUrl+"?tm="+tm+"&token="+token,{
                    reconnectionAttempts:1,
                });
                window.gameSocket.socketio.on('connect', function () {
                    if(window.gameSocket.socketio.connected){
                        window.gameSocket.status=2;
                        window.mySocket=window.gameSocket.socketio;
                        cc.director.emit('socketConnect', "connect");
                        console.log("连接成功");
                        console.log("连接id:"+window.gameSocket.socketio.id);
                    }else{
                        window.gameSocket.status=0;
                        cc.director.emit('socketConnect', "disconnect");
                        console.log("连接断开");
                    }
                });
                window.gameSocket.socketio.on('disconnect', function () {
                    window.gameSocket.status=0;
                    cc.director.emit('socketConnect', "disconnect");
                    console.log("连接断开");
                });
                window.gameSocket.socketio.on('connect_error', (err) => {
                    window.gameSocket.status=0;
                    cc.director.emit('socketConnect', "disconnect");
                    if(err){
                        console.log("连接错误:"+err);
                    }else{
                        console.log("连接断开");
                    }
                });
                window.gameSocket.socketio.on('error', (err) => {
                    window.gameSocket.status=0;
                    cc.director.emit('socketConnect', "disconnect");
                    if(err){
                        console.log("连接错误:"+err);
                    }else{
                        console.log("连接断开");
                    }
                });
            }
        }catch(err){
            console.log('checkSocketConnect error:'+err);
        }
    },
    // update (dt) {},
});

let socketCenter = new SocketCenter();
console.log('new SocketCenter()');
socketCenter.start();
module.exports = socketCenter;
