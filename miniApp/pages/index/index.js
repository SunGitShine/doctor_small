//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    imgUrls:[
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    jobList:[]
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.findByPage();
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
     * 获取一级科室
     */
  findParentDepartment: function () {
      wx.request({
          url: app.globalData.commonBaseUrl + "/department/findParentDepartment.htm",
          method: "POST",
          dataType: "json",
          data: {},
          success: function (res) {
              console.log(res)
          }
      })
  },
  //路由：跳转到职位列表
  goToJobListings: function (event) {
      let id = event.currentTarget.id;
      wx.navigateTo({
          url: '../infoList/infoList?id='+id
      })
  },
  //猎聘专区:获取职位列表
  findByPage: function () {
    let _this = this;
    let params = {
      pageNo: 1,
      pageSize:2
    };
    wx.request({
      header: {
        "accept": 'application/json',
        "content-Type": "application/x-www-form-urlencoded"
      },
      url: app.globalData.commonBaseUrl + '/position/findByPage.htm',
      method: 'GET',
      dataType: 'json',
      data: {
        d: JSON.stringify(params)
      },
      success: function (res) {
        if (res.data.code == 'J000000') {
          _this.setData({
            jobList: res.data.resultMap.rows
          })
        } else {

        }
      },
      fail: function (res) {

      }
    })
  }

})
