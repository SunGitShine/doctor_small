//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        if(res.code){
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              //小程序唯一标识
              appid: 'wxf02042140ebabb8f',
              //小程序的 app secret
              secret: '4164d0eabdee68c833fde99de731aa53',
              grant_type: 'authorization_code',
              js_code: res.code
            },
            method:'GET',
            header: { 'content-type': 'application/json'},
            success:function(openIdRes){
              console.log(openIdRes);
              if(openIdRes.data.openid != null & openIdRes.data.openid != undefined){
                wx.setStorageSync('openid', openIdRes.data.openid);
              }
            }
          })
        }

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //定义整个项目的全局变量或者常量
  globalData: {
    userInfo: {
      avatarUrl: "../../images/hospital_icon.png",
      nickName:"Kevin"
    },
    commonBaseUrl:"http://112.74.57.165:8080/share_doctor",
    userOpenId:""
  }
})