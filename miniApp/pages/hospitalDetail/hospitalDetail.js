//获取应用实例
const app = getApp();
// pages/hospitalDetail/hospitalDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.findByOpneid()
  },
  //获取身份
  findByOpneid: function () {
    let _this = this;
    let openId = wx.getStorageSync('openid');
    wx.request({
      url: app.globalData.commonBaseUrl + "/common/findByOpneid.htm",
      method: "GET",
      dataType: "json",
      data: {
        d: {
          openid: openId
        }
      },
      success: function (res) {
        if (res.data.code == 'J000000' && res.data.resultMap) {
          //设置身份标志
          _this.setData({
            identity: res.data.resultMap.identity
          })
          //未注册的引导去注册
          if (res.data.resultMap.identity == 0) {
            _this.setData({
              guideShow: true
            })
          }
          //医生
          if (res.data.resultMap.identity == 1) {
            //去除null的数据
            for (var key in res.data.resultMap.response) {
              if (res.data.resultMap.response[key] == null) {
                res.data.resultMap.response[key] = "----";
              }
            }
            _this.setData({
              roleType: 1,
              info: res.data.resultMap.response
            });
          }
          //医院
          if (res.data.resultMap.identity == 2) {
            //去除null的数据
            for (var key in res.data.resultMap.response) {
              if (res.data.resultMap.response[key] == null) {
                res.data.resultMap.response[key] = "----";
              }
            }
            _this.setData({
              info: res.data.resultMap.response
            });
          }
        }
      }
    })
  },
  //预览图片
  previewImage: function (event) {
      let current = event.target.dataset.src;
      wx.previewImage({
          current: current,
          urls: [current],
      })
  },
  //跳转到编辑
  goToEdit: function () {
    wx.navigateTo({
      url: '../hospitalEdit/hospitalEdit'
    })
  }

})