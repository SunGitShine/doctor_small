const app = getApp();

Page({
  /* 页面的初始数据*/
  data: {
    userInfo: {     
    },
    phoneNum:"",
    qrCode:"",
    motto: "Hello world",
    roleType:"",
    typechoose:false,
    date:""
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (option) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    console.log(this.data.userInfo);
  },

  chooseRole:function(e){
    let typeNum = e.currentTarget.dataset.idx;
    this.setData({ roleType:typeNum})
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    this.setData({
      roleType: "",
      typechoose: false
    });
    wx.request({
      url: app.globalData.commonBaseUrl +'/common/findByOpneid.htm',
      data: {d:{ "openid": "dew32" }},
      success:function(res){
        console.log(res);
        
      }
    })
  },
  codeInput:function(e){
    this.setData({
      qrCode: e.detail.value
    })
  },
  phoneInput:function(e){
    this.setData({
      phoneNum:e.detail.value
    })
  },
  //获取二维码
  getSmsCode:function(){
    var phoneReg = /^1[3|4|5|8][0-9]\d{4,8}$/;
    if (phoneReg.test(this.data.phoneNum)){
      wx.request({
        url: app.globalData.commonBaseUrl + '/common/sendSmsCode.htm',
        data: { d: { "phone": this.data.phoneNum } },
        success: function (res) {
          console.log(res);
        }
      })
    }else{
      wx.showToast({
        title: '号码不符合规范',
        icon:'none'
      })
    }
  },
  // 绑定账号
  bindAccount: function () {
    var openid;
    wx.getStorageSync({
      key: 'openid',
      success:function(res){
        openid = res.data;
      }
    })
    wx.request({
      url: app.globalData.commonBaseUrl + '/common/bindPhone',
      method:'POST',
      data:{
        "phone": this.data.phoneNum,
        "smsCode": this.data.qrCode,
        openid: openid,

      }
    })
    this.setData({ typechoose: true })
  },
})