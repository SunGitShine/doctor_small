const app = getApp();
// pages/jobDetail/jobDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgUrls: [],
      indicatorDots: true,
      autoplay: true,
      interval: 4000,
      duration: 1000,
      openid:"",
      releaseId:"",
      hospitalInfo:{},
      jobInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
         openid: options.openid,
         releaseId: options.id
     });
     //通过openid获取医院的相关信息
     this.findByOpneid();
     //通过releaseId获取职位相关信息
     this.findReleaseById();
  },
  //通过openid获取医院数据
  findByOpneid: function () {
      let _this = this;
      if (!_this.data.openid){return;}
      let params = {
          openid: _this.data.openid
      };
      wx.request({
          header: {
              "accept": 'application/json',
              "content-Type": "application/x-www-form-urlencoded"
          },
          url: app.globalData.commonBaseUrl + '/common/findByOpneid.htm',
          method: 'GET',
          dataType: 'json',
          data: {
              d: JSON.stringify(params)
          },
          success: function (res) {
              if (res.data.code == 'J000000') {
                  _this.setData({
                      hospitalInfo: res.data.resultMap.response,
                      imgUrls: res.data.resultMap.response.imageUrl
                  })
              } else {

              }
          },
          fail: function (res) {

          }
      })
  },
  //猎聘专区:职位详情
  findReleaseById: function () {
      let _this = this;
      let params = {
          releaseId: _this.data.releaseId
      };
      wx.request({
          header: {
              "accept": 'application/json',
              "content-Type": "application/x-www-form-urlencoded"
          },
          url: app.globalData.commonBaseUrl + '/hospital/findReleaseById.htm',
          method: 'GET',
          dataType: 'json',
          data: {
              d: JSON.stringify(params)
          },
          success: function (res) {
              if (res.data.code == 'J000000') {
                  _this.setData({
                      jobInfo: res.data.resultMap.release
                  })
              } else {

              }
          },
          fail: function (res) {

          }
      })
  }
})