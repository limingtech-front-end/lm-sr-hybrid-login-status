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
            console.log('in browser')
            var localSavedUserInfo=localStorage.getItem('user')
            return localSavedUserInfo ? Promise.resolve(JSON.parse(localSavedUserInfo)) : Promise.reject({})
        }
    })

function getLoginStatusFunc() {
        console.log('getting login status')
        return new Promise(function(resolve,reject){
            getLoginStatus().then(function(userInfo){
                cachedIsLogedin = !!userInfo.userId
                cachedUserInfo = userInfo
                cachedIsLogedin ? resolve() : reject()
            }, function(){
                cachedIsLogedin = false
                cachedUserInfo = null
                reject()
            })
        })
}

module.exports={
        isLogedin:function() {

            return getLoginStatusFunc().then(function(){
                return true
            },function(){
                return false
            })

        },
        userInfo:function() {
            return getLoginStatusFunc().then(function(){
                return cachedUserInfo
            },function(){
                return null
            })
        },
        _cachedUserInfo:function() {
            return cachedUserInfo
        }
}



