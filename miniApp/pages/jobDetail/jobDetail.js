const app = getApp();
// pages/jobDetail/jobDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      releaseId:"",
      jobInfo:{},
      flag:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      let _this = this;
      _this.setData({
        releaseId: options.id
      });
      if (options.flag && options.flag == 'job'){
        _this.findById();
        _this.setData({
          flag: 'job'
        });
      }else{
        _this.setData({
          flag: 'in'
        });
        _this.findReleaseById(options.id);
      }
  },
  //职位详情
  findReleaseById: function (ReleaseById){
      let _this = this;
      let params = {
          "releaseId": ReleaseById,
      }
      wx.request({
          method: 'GET',
          dataType: 'json',
          url: app.globalData.commonBaseUrl + '/hospital/findReleaseById.htm',
          data: {
              d: JSON.stringify(params)
          },
          success: function (res) {
              if (res.data.code == 'J000000') {
                  _this.setData({
                      jobInfo: res.data.resultMap.release
                  })
              } else {
                  wx.showToast({
                      title: res.data.description,
                      icon: 'none'
                  });

              }
          },
          fail: function (res) {

          }
      })
  },
  //猎聘专区:职位详情
  findById: function () {
    let _this = this;
    let params = {
      positionId: _this.data.releaseId
    };
    wx.request({
      header: {
        "accept": 'application/json',
        "content-Type": "application/x-www-form-urlencoded"
      },
      url: app.globalData.commonBaseUrl + '/position/findById.htm',
      method: 'GET',
      dataType: 'json',
      data: {
        d: JSON.stringify(params)
      },
      success: function (res) {
        if (res.data.code == 'J000000') {
          _this.setData({
            jobInfo: res.data.resultMap.position
          })
        } else {

        }
      },
      fail: function (res) {

      }
    })
  }
})