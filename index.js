var calcMethod =require('lm-ut-calc-platform-method')
var clientInfo =require('lm-se-client-info')
var wechatLoginStatus =require('lm-th-wx-sr-login-status')
var nativeLoginStatus =require('lm-na-sr-login-status')


var cachedIsLogedin = false,
    cachedUserInfo = null,
    getLoginStatus = calcMethod({
        native: nativeLoginStatus,
        wechat: wechatLoginStatus,
        browser: function(){
            var localSavedUserInfo=localStorage.getItem('user')
            return localSavedUserInfo ? Promise.resolve(JSON.parse(localSavedUserInfo)) : Promise.reject({})
        }
    })

function getLoginStatusFunc(success, fail) {
    console.log('getting login status')
    getLoginStatus().then((userInfo) => {
        cachedIsLogedin = !!userInfo.userId
        cachedUserInfo = userInfo
        success && success()
    }, (err) => {
        cachedIsLogedin = false
        cachedUserInfo = null
        fail && fail(err)
    })
}

module.exports={
        isLogedin:function() {
            return new Promise(function(resolve, reject){
                console.log('trigger login check')
                getLoginStatusFunc(function(){
                    cachedIsLogedin ? resolve(true) : reject(false)
                },reject)
            })
        },
        userInfo:function() {
            return new Promise(function(resolve, reject){
                console.log('trigger getting userInfo')
                getLoginStatusFunc(function(){
                    !!cachedUserInfo ? resolve(cachedUserInfo) : reject(null)
                }, reject)
            })
        },
        _cachedUserInfo:function() {
            return cachedUserInfo
        }
}



