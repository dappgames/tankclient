// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const walletAdapter=require('./WalletAdapter');
const LoginPanel = require('./widget/LoginPanel');
const Loading = require('./widget/Loading');
const Msgbox = require('./widget/Msgbox');
const cry=require('./utils/cry');
const socketCenter=require('./SocketCenter');
cc.Class({
    extends: cc.Component,

    properties: {
        testDes: {
            default: null,
            type: cc.Node,
            displayName: '测试删除',
        },
        userNameEdit: {
            default: null,
            type: cc.EditBox,
            displayName: '玩家名字',
        },
        userNameTxt: {
            default: null,
            type: cc.Label,
            displayName: '玩家名字',
        },
        userBalanceTxt: {
            default: null,
            type: cc.Label,
            displayName: '玩家余额',
        },
        boomBalanceTxt: {
            default: null,
            type: cc.Label,
            displayName: 'boom余额',
        },
        loginPanel: {
            default: null,
            type: LoginPanel,
            displayName: '登录框',
        },
        shopPanel:{
            default: null,
            type: cc.Node,
            displayName: 'shop',
        },
        walletPanel:{
            default: null,
            type: cc.Node,
            displayName: 'wallet',
        },
        historyPanel:{
            default: null,
            type: cc.Node,
            displayName: 'history',
        },
        settingPanel:{
            default: null,
            type: cc.Node,
            displayName: 'setting',
        },

        enterFeeEditBox: {
            default: null,
            type: cc.EditBox,
            displayName: '入场费',
        },
        loginLoading: {
            default: null,
            type: Loading,
            displayName: '登录loading',
        },
        socketLoading: {
            default: null,
            type: Loading,
            displayName: 'socketLoading',
        },
        msgbox: {
            default: null,
            type: Msgbox,
            displayName: 'msgbox',
        },
        armorProp: {
            default: null,
            type: cc.ProgressBar,
            displayName: '盔甲',
        },
        speedProp: {
            default: null,
            type: cc.ProgressBar,
            displayName: '速度',
        },
        cdProp: {
            default: null,
            type: cc.ProgressBar,
            displayName: '装填时间',
        },
        smaSprite: {
            default: null,
            type: cc.Sprite,
            displayName: 'sma',
        },
        mdaSprite: {
            default: null,
            type: cc.Sprite,
            displayName: 'mda',
        },
        hvaSprite: {
            default: null,
            type: cc.Sprite,
            displayName: 'hva',
        },
        _currentSkin: {
            default: null,
        },
        _skinList: {
            default: null,
        },
        _skinPropList: {
            default: null,
        },
    },


    onTankChange(event, arg) {
        var inx = arg;
        this._currentSkin = this._skinList[inx];
        console.log(this._currentSkin);
        let tankarr=[this.smaSprite,this.mdaSprite,this.hvaSprite];
        for(let obj in tankarr){
            tankarr[obj].node.active=false;
        }
        tankarr[inx].node.active=true;
        if(inx>-1&&inx<3){
            let skinProp=this._skinPropList[inx];
            this.armorProp.progress=skinProp.armor;
            this.speedProp.progress=skinProp.speed;
            this.cdProp.progress=skinProp.cd;
        }
    },
    fillUserInfo(){
        var that = this;
        var walletUser=window.walletUser;
        if(walletUser){
            that.userNameTxt.string=walletUser.accountName;
            that.userBalanceTxt.string=walletUser.balance;
        }
        var serverUser=window.serverUser;
        if(serverUser){
            if(serverUser.balances){
                for(let inx in serverUser.balances){
                    if(serverUser.balances[inx].tokenSymbol=="BOOM"){
                        that.boomBalanceTxt.string=serverUser.balances[inx].balance+" BOOM";
                    }
                }
            }
        }
    },

    onLoginClick() {
        // 
        var that = this;
        if(window.walletUser&&window.serverUser){
            that.fillUserInfo();
        }else{
            that.loginLoading.open('checking...');
            walletAdapter.checkWalletPlugin(function(supportWallets){
                that.loginLoading.close();
                if(supportWallets.length>0){
                    window.supportWallets=supportWallets;
                    if(supportWallets.length==1){
                        that.walletLogin(null,supportWallets[0]);
                    }else{
                        that.loginPanel.openPanel();
                    }
                }else{
                    that.msgbox.open('no wallet plugin found');
                }
            });
        }
    },
    walletLogin(event, wallet){
        var that=this;
        that.loginLoading.open('login...');
        walletAdapter.login(wallet,function(walletUser){
            console.log(walletUser);
            that.loginPanel.closePanel();
            
            if(walletUser.accountName&&walletUser.accountName.length>0){
                window.walletUser=walletUser;
                that.socketLogin(walletUser);
            }else{
                that.msgbox.open('login fail,account is null');
                that.loginLoading.close();
            }
            if(walletUser.errorMsg&&walletUser.errorMsg.length>0){
                that.msgbox.open(walletUser.errorMsg);
                that.loginLoading.close();
            }
        });
    },
    socketLogin(walletUser){
        if(!this._checkSocketState(true)){
            return;
        }
        var that=this;
        let sk = cc.sys.localStorage.getItem(walletUser.chainName+"_"+walletUser.accountName);
        if(!sk){
            sk="";
        }
        var reqTime=(new Date().getTime())+"";
        var signMsg=cry.hex_hmac_cry1(sk,reqTime);
        let userInfoDTO={
            chainName:walletUser.chainName,
            accountName:walletUser.accountName,
            reqTime:reqTime,
            signMsg:signMsg
        };
        console.log(userInfoDTO);

        this.gameSocket.socketio.emit("login",userInfoDTO,function(loginResp){
            if(loginResp){
                if(loginResp.success&&loginResp.data){
                    if(loginResp.data.checkMemo&&loginResp.data.checkMemo.length>0){
                        console.log('need block check');
                    }else if(loginResp.data.userId){
                        // console.log('登录成功');
                        // console.log(loginResp.data);
                        window.serverUser=loginResp.data;
                        that.fillUserInfo();
                        that.loginLoading.close();
                    }
                }else{
                    console.log('login fail,resp data is null');
                    that.loginLoading.close();
                }
            }else{
                console.log('login fail,resp is null');
                that.loginLoading.close();
            }
        });


    },
    _initSocketListener(){
        var that=this;
        that.gameSocket.socketio.on('allowLogin',function(data, ackServerCallback){
            if(that){
                console.log("allowJoin");
                if(ackServerCallback){
                    ackServerCallback('allowLogin-success');
                    // console.log('allowLogin-success');
                }
                if(window.walletUser){
                    cc.sys.localStorage.setItem(window.walletUser.chainName+"_"+window.walletUser.accountName,data.sk);
                    // console.log('save sk');
                }
                that.loginLoading.close();
            }
        });
        that.gameSocket.socketio.on('allowJoin', function (user,ackServerCallback) {
            if(!that){
                return;
            }
            console.log("allowJoin");
            if(ackServerCallback){
                ackServerCallback('allowJoin-success');
            }
            var gameUser = {
                userName: user.userName,
                skin: user.skin,
                token:user.token,
            };
            that.gameSocket.socketio.emit('joinRoom', gameUser, function (ret) {
                console.log(ret);
                if(ret&&ret.data&&ret.success){
                    window.playId=ret.data.playId;
                    window.playKey=ret.data.key;
                    cc.director.loadScene('game');
                }
            });
        });
        that.gameSocket.socketio.on('testAck', function (user,ackServerCallback) {
            if(!that){
                return;
            }
            console.log("testAck");
            if(ackServerCallback){
                ackServerCallback('testAck-success');
            }
        });
    },
    _deInitSocketListener(){
        try{

            if(this.gameSocket){
                this.gameSocket.socketio.removeAllListeners("allowLogin");
                this.gameSocket.socketio.removeAllListeners("allowJoin");
            }
        }catch(err){

        }
    },

    showComingSoon(){
        var that=this;
        that.msgbox.open('coming soon');
    },
    onTestClick() {
        console.log('testclick');    
        console.log(this.gameSocket.socketio.id);    
        // cc.sys.localStorage.setItem(window.walletUser.chainName+"_"+window.walletUser.accountName,'hehe');
        // if(window.walletUser){
        //     this.socketLogin(window.walletUser);
        // }
    },

    onFreePreJoin(){
        if(!this._checkSocketState(true)){
            return;
        }
        var that = this;
        var userName = 'user'+parseInt(Math.random()*1000);
        if (userName.length > 0) {
            console.log(userName);
            var gameUser = {
                userName: userName,
                skin: that._currentSkin,
            };
            this.gameSocket.socketio.emit('joinRoom', gameUser, function (ret) {
                console.log(ret);
                if(ret&&ret.data&&ret.success){
                    window.playId=ret.data.playId;
                    window.playKey=ret.data.key;
                    cc.director.loadScene('game');
                }
            });
        } else {
            console.log("username is null");
        }
    },

    onPayPreJoin(){
        if(!this._checkSocketState(true)){
            return;
        }
        if(!window.walletUser){
            console.log("no user");
            this.onFreePreJoin();
            return;
        }
        var that = this;
        var userName = this.userNameTxt.string;
        if (userName.length > 0) {
            console.log(userName);
            var gameUser = {
                userName: userName,
                skin: that._currentSkin,
                coin:'cocos_test.COCOS',
                amount:that.enterFeeEditBox.string,
            };
            this.gameSocket.socketio.emit('preJoinRoom', gameUser, function (ret) {
                console.log(ret);
                if(ret&&ret.data&&ret.success){
                    that.openTransferPanel(ret.data);
                }else{
                    that.msgbox.open(ret.msg);
                }
            });
        } else {
            console.log("username is null");
        }
    },

    openTransferPanel(data){
        let userName=data.userName;
        let gameContract = data.gameContract;
        let tokenCode = data.tokenCode;
        let tokenAmount = data.tokenAmount;
        let memo = data.memo;
        var bcx = walletAdapter.getCocosBcx();
        bcx.transferAsset({
            proposeAccount: userName,
            fromAccount: userName,
            toAccount: gameContract,
            amount: tokenAmount,
            assetId: tokenCode,
            memo: memo,
            feeAssetId: tokenCode,
            // isPropose: false,
            onlyGetFee: false
        }).then(res => {
            if (1 != res.code) {
                console.log("ERR, transferAsset:" + JSON.stringify(res));
            } else {
                console.log("SUC, transferAsset");
            }
        });
    },

    onCocosPreJoin() {
        if(!this._checkSocketState(true)){
            return;
        }

        var that = this;
        var userName = this.userNameTxt.string;
        if (userName.length > 0) {
            console.log(userName);
            var gameUser = {
                userName: userName,
                roomName: 'cocos',
                skin: that._currentSkin,
            };
            var bcx = walletAdapter.getCocosBcx();
            this.gameSocket.socketio.emit('preJoinRoom', gameUser, function (roomInfo) {
                if (roomInfo && roomInfo.success == true) {
                    if (roomInfo.data.validate != 1) {
                        let gameContract = roomInfo.data.gameContract;
                        let tokenCode = roomInfo.data.tokenCode;
                        let tokenAmount = roomInfo.data.tokenAmount;
                        let memo = roomInfo.data.memo;
                        bcx.transferAsset({
                            proposeAccount: userName,
                            fromAccount: userName,
                            toAccount: gameContract,
                            amount: tokenAmount,
                            assetId: tokenCode,
                            memo: memo,
                            feeAssetId: tokenCode,
                            // isPropose: false,
                            onlyGetFee: false
                        }).then(res => {
                            if (1 != res.code) {
                                console.log("ERR, transferAsset:" + JSON.stringify(res));
                            } else {
                                const data = res.data;
                                console.log("SUC, transferAsset");
                            }
                        });
                    }
                }
                console.log(roomInfo);
            });
        } else {
            console.log("username is null");
        }
    },
    onEosPreJoin() {
        console.log('eos');
    },
    // LIFE-CYCLE CALLBACKS:


    _checkSocketState(showmsg){
        if(!this.gameSocket){
            if(showmsg){
                this.msgbox.open('Lost Connection');
            }
            return false;
        }
        if(!this.gameSocket.socketio){
            if(showmsg){
                this.msgbox.open('Lost Connection');
            }
            return false;
        }
        if(!this.gameSocket.status){
            if(showmsg){
                this.msgbox.open('Lost Connection');
            }
            return false;
        }
        if(this.gameSocket.status!=2){
            if(showmsg){
                this.msgbox.open('Service Not Connected');
            }
            return false;
        }
        return true;
    },

    onLoad() {
        this.gameSocket=window.gameSocket;
        this._currentSkin = "sma";
        this._skinList = ['sma', 'mda', 'hva', 'smb', 'mdb', 'hvb', 'smc', 'mdc', 'hvc'];
        this._skinPropList = [
            {armor:0.1,speed:0.5,cd:0.2},
            {armor:0.2,speed:0.4,cd:0.4},
            {armor:0.3,speed:0.3,cd:0.6},
        ];
        var that = this;
        
        cc.director.on("socketConnect", this._dealSocketConnectChanged,that);
        if(this._checkSocketState(false)){
            this.onLoginClick();
        }
        //进来时已连接，则直接部署事件
        if(window.gameSocket&&window.gameSocket.socketio&&window.gameSocket.socketio.connected){
            console.log("reget listener");
            this._initSocketListener();
        }
        this.schedule(function(){
            // if(window.walletUser){
            //     if(that&&that.socketLogin){
            //         that.socketLogin(window.walletUser);
            //     }
            // }
        },3);
    },

    _dealSocketConnectChanged(state){
        if(this){
            if (state == 'connect') {
                this._deInitSocketListener();
                this.socketLoading.close();
                this.gameSocket=window.gameSocket;
                this._initSocketListener();
                this.onLoginClick();
                console.log("connect change");
            }else{
                this.gameSocket=window.gameSocket;
                this.socketLoading.open("Connecting...");
            }
        }else{
            console.log("cover socketConnect that is null");
        }
    },

    onDestroy() {
        var that=this;
        this._deInitSocketListener();
        cc.director.off("socketConnect", this._dealSocketConnectChanged,this);
        this.unscheduleAllCallbacks();
    },
    start() {

    },
    update(dt) {

    },
    openMyPanel(event, customEventData){
        if("shop"==customEventData){
            this.shopPanel.active=true;
        }
        if("wallet"==customEventData){
            this.walletPanel.active=true;
        }
        if("history"==customEventData){
            this.historyPanel.active=true;
        }
        if("setting"==customEventData){
            this.settingPanel.active=true;
        }
    },
    // menuGoScene(event, customEventData){
    //     cc.director.loadScene(customEventData);
    // },
    goFullScreen() {
        let element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
        }
    },


});