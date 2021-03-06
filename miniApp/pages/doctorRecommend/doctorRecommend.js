const app = getApp();
// pages/doctorRecommend/doctorRecommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listDoctorItems:[],
    currentTab:"",
    pageNo:1
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
    }else{
      titleName = "推荐医生";
      this.setData({ currentTab: parseInt("0") });
      _this.findDoctorListPage();
    }
    wx.setNavigationBarTitle({
      title: titleName
    })

  },
  //获取医院推荐的医生
  findDoctorListPage: function () {
      let _this = this;
      let openId = wx.getStorageSync('openid');
      let params = {
          pageNo: _this.data.pageNo,
          pageSize: 10,
          hospitalOpenid: openId
      }
      wx.request({
          header: {
              "accept": 'application/json',
              "content-Type": "application/x-www-form-urlencoded"
          },
          url: app.globalData.commonBaseUrl + "/doctor/findDoctorListPage.htm",
          method: "GET",
          dataType: "json",
          data: {
              d: JSON.stringify(params)
          },
          success: function (res) {
              if (res.data.code == 'J000000' && res.data.resultMap) {
                  _this.setData({
                      listDoctorItems: (_this.data.listDoctorItems).concat(res.data.resultMap.rows),
                      iTotalDisplayRecords: res.data.resultMap.iTotalDisplayRecords
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
  },
  //
  //上拉刷新
  onReachBottom: function () {
      if ((this.data.pageNo) * 10 + 1 > this.data.iTotalDisplayRecords) return;
      let _this = this;
      let nextPage = _this.data.pageNo + 1;
      _this.setData({
          pageNo: nextPage
      });
      _this.findDoctorListPage();
  }
})