const app = getApp();
// pages/doctorRecommend/doctorRecommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listDoctorItems: [
      {
        name: "刘海波"
      },
      {
        name: "谢强"
      }
    ],
    currentTab:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let _this = this;
    let currentTab, titleName;
    currentTab = options.currentTab;

    if (currentTab == "0"){
      titleName = "推荐医院";
      this.setData({ currentTab: parseInt("1") });
      _this.findReleaseListPage();
    }else{
      titleName = "推荐医生";
      this.setData({ currentTab: parseInt("0") });
    }
    wx.setNavigationBarTitle({
      title: titleName,
    })

  },
  //获取推荐医院
  findReleaseListPage: function () {
      let _this = this;
      let openId = wx.getStorageSync('openid');
      let identity = _this.currentTab;
      let params = {
          pageNo: 1,
          pageSize: 10
      }
      //角色是医生
      if (identity == 1) {
          params = Object.assign(params, {
              doctorOpenid: openId
          })
      } else if (identity == 2) {
          params = Object.assign(params, {
              hospitalOpenid: openId
          })
      }
      wx.request({
          header: {
              "accept": 'application/json',
              "content-Type": "application/x-www-form-urlencoded"
          },
          url: app.globalData.commonBaseUrl + "/hospital/findReleaseListPage.htm",
          method: "GET",
          dataType: "json",
          data: {
              d: JSON.stringify(params)
          },
          success: function (res) {
              if (res.data.code == 'J000000' && res.data.resultMap) {
                  _this.setData({
                      listDoctorItems: res.data.resultMap.rows
                  })
              } else {
                  wx.showToast({
                      title: res.data.description,
                      icon: 'none'
                  });
              }
          },
          fail: function (res) {
              wx.showToast({
                  title: res.data.description,
                  icon: 'none'
              });
          }
      })
  }
})