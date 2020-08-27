const Eos = require('./eos/eosjs');
const cocosTestConfig = {
    default_ws_node: "ws://test.cocosbcx.net",
    ws_node_list: [
        {
            url: "ws://test.cocosbcx.net",
            name: "node1"
        }
    ],
    networks: [{
        core_asset: "COCOS",
        chain_id: "c1ac4bb7bd7d94874a1cb98b39a8a582421d03d022dfa4be8c70567076e03ad0"
    }],
    faucet_url: "http://test-faucet.cocosbcx.net",
    auto_reconnect: true,
    check_cached_nodes_data: false
};
const eosNetwork = ScatterJS.Network.fromJson({
    blockchain: 'eos',
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    host: 'node1.zbeos.com',
    port: 443,
    protocol: 'https'
});

let WalletAdapter = cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    // checkWalletPlugin(callback) {
    //     var that = this;
    //     this.sca = null;
    //     this.bcl = null;
    //     ScatterJS.plugins(new ScatterEOS());
    //     Cocosjs.plugins(new CocosBCX());
    //     let supportWallets = [];
    //     that.checkWindowBcx(function (bcxConnected) {
    //         if (bcxConnected) {
    //             if (supportWallets.indexOf('cocos') == -1) {
    //                 supportWallets.push('cocos');
    //             }
    //             console.log('has cocos');
    //         } else {
    //             console.log('no cocos');
    //         }
    //         callback(supportWallets);
    //     });
    // },
    checkWalletPlugin(callback) {
        var that = this;
        this.sca = null;
        this.bcl = null;
        ScatterJS.plugins(new ScatterEOS());
        Cocosjs.plugins(new CocosBCX());
        let supportWallets=[];
        ScatterJS.connect('tankgo.io', {
            network:eosNetwork
        }).then(scatterConnected => {
            if(scatterConnected){
                
                if(supportWallets.indexOf('eos')==-1){
                    supportWallets.push('eos');
                }
                console.log('has eos');
            }else{
                console.log('no eos');
            }
            that.checkWindowBcx(function(bcxConnected){
                if(bcxConnected){
                    if(supportWallets.indexOf('cocos')==-1){
                        supportWallets.push('cocos');
                    }
                    console.log('has cocos');
                }else{
                    console.log('no cocos');
                }
                callback(supportWallets);
            });
        });
    },

    login(wallet, callback) {
        var walletUser = {
            accountName: null,
            pubKey:null,
            chainName: null,
            symbol: null,
            amount: null,
            coin: null,
            balance: null,
            errorMsg: 'wallet not support',
        };
        if (wallet) {
            if (wallet == 'eos') {
                this.loginByEos(callback);
            } else if (wallet == 'cocos') {
                this.loginByCocos(callback);
            } else {
                callback(walletUser);
            }
        } else {
            callback(walletUser);
        }
    },


    loginByEos(callback) {
        var that = this;
        var walletUser = {
            accountName: null,
            chainName: null,
            symbol: null,
            amount: null,
            coin: null,
            balance: null,
            errorMsg: null,
        };
        try {
            ScatterJS.login().then(id => {
                if (id) {
                    const account = ScatterJS.account('eos');
                    if (account && account.name) {
                        const options = {
                            authorization: [`${account.name}@${account.authority}`]
                        };
                        walletUser.accountName = account.name;
                        walletUser.chainName = 'eos';
                        const eos = ScatterJS.eos(eosNetwork, Eos);
                        eos.getCurrencyBalance('eosio.token', account.name, 'EOS').then(balance => {
                            console.log(balance);
                            if (balance && balance.length > 0) {
                                let balanceStr = balance[0];
                                walletUser.coin = "eos.EOS";
                                walletUser.balance = balanceStr;
                                let balanceStrArr = balanceStr.split(" ");
                                if (balanceStrArr && balanceStrArr.length > 1) {
                                    walletUser.amount = balanceStrArr[0];
                                    walletUser.symbol = balanceStrArr[1];
                                }
                            }
                            callback(walletUser);
                        }).catch((e) => {
                            walletUser.errorMsg = 'get balance error:' + e;
                            callback(walletUser);
                        });
                    } else {
                        walletUser.errorMsg = 'eos account not found';
                        callback(walletUser);
                    }
                } else {
                    walletUser.errorMsg = 'eos account not found';
                    callback(walletUser);
                }
            }).catch((e) => {
                walletUser.errorMsg = 'error:' + e;
                callback(walletUser);
            });
        } catch (err) {
            walletUser.errorMsg = 'error:' + e;
            callback(walletUser);
        }


    },
    loginByCocos(callback) {
        var that = this;
        var walletUser = {
            accountName: null,
            chainName: null,
            symbol: null,
            amount: null,
            coin: null,
            balance: null,
            errorMsg: null,
        };
        try {
            that.bcl.getAccountInfo().then(account => {
                if (account) {
                    if (!account.locked) {
                        let accountName = account.account_name;
                        if (accountName && accountName != "") {
                            walletUser.accountName = accountName;
                            walletUser.chainName = 'cocos_test';
                            that.getCocosBalance(accountName, function (balance) {
                                walletUser.errorMsg = balance.errorMsg;
                                walletUser.symbol = balance.symbol;
                                walletUser.amount = balance.amount;
                                walletUser.coin = "cocos_test.COCOS";
                                walletUser.balance = balance.amount + " " + balance.symbol;
                                callback(walletUser);
                            });
                        } else {
                            walletUser.errorMsg = "cocos account name is null";
                            callback(walletUser);
                        }
                    } else {
                        walletUser.errorMsg = "cocos account is locked";
                        callback(walletUser);
                    }
                } else {
                    walletUser.errorMsg = "cocos account is null";
                    callback(walletUser);
                }
            }).catch((e) => {
                walletUser.errorMsg = 'cocos login:' + e;
                callback(walletUser);
            });
        } catch (err) {
            walletUser.errorMsg = 'cocos login:' + err;
            callback(walletUser);
        }

    },
    checkWindowBcx(callback) {
        //目前进来的时候可能还没有吧bcx挂在window 需要个定时器
        let check_count = 0;
        let self = this;
        let sdk_intervral = setInterval(function () {
            console.log("checkWindowBcx", window.BcxWeb)
            if (window.BcxWeb) {
                self.bcl = window.BcxWeb;
                clearInterval(sdk_intervral);
                if (callback) {
                    callback(true);
                }
            } else {
                if (check_count >= 3) {
                    clearInterval(sdk_intervral);
                    if (callback) {
                        callback(false);
                    }
                }
            }
            check_count = check_count + 1;
        }, 200);
    },
    getCocosBalance(account, callback) {
        var balance = {
            amount: "0.0000",
            symbol: "COCOS(TEST)",
            errorMsg: null,
        };
        this.bcl.queryAccountBalances({
            assetId: 'COCOS',
            account: account,
        }).then(function (res) {
            console.info('getCocosBalance:', res);
            if (res.code === -25 || res.code === 125) {
                //表示还没有这种代币，先给与赋值为0
                res.code = 1;
                res.data.COCOS = 0;
            }
            if (res && res.code == 1 && res.data && res.data.COCOS) {
                balance.amount = res.data.COCOS;
                balance.symbol = "COCOS(TEST)";
                callback(balance);
            } else {
                balance.amount = "0.0000";
                balance.symbol = "COCOS(TEST)";
                balance.errorMsg = res.message;
                callback(balance);
            }
        }).catch((e) => {
            balance.amount = "0.0000";
            balance.symbol = "COCOS(TEST)";
            balance.errorMsg = 'get balance error:' + e;
            callback(balance);
        });
    },
    getCocosBcx() {
        return this.bcl;
    }
    // update (dt) {},
});
let walletAdapter = new WalletAdapter();
console.log('new walletAdapter()');
walletAdapter.start();
module.exports = walletAdapter;