// pages/hospitalPublish/hospitalPublish.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNo: 1,
        pageSize: 10,
        listDoctorItems:[],
        currentTab:1,
        id:"",
        isJob:true,//标识：猎聘专区模板
        flag:'job',
        iTotalDisplayRecords:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.findByPage();
    },
    //猎聘专区:获取职位列表
    findByPage: function () {
      let _this = this;
      let params = {
          pageNo: _this.data.pageNo,
        pageSize: 10
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
                listDoctorItems: (_this.data.listDoctorItems).concat(res.data.resultMap.rows),
              iTotalDisplayRecords: res.data.resultMap.iTotalDisplayRecords
            })
          } else {

          }
        },
        fail: function (res) {

        }
      })
    },
    //上拉刷新
    onReachBottom: function () {
        if ((this.data.pageNo) * 10 + 1 > this.data.iTotalDisplayRecords) return;
        let _this = this;
        let nextPage = _this.data.pageNo + 1;
        _this.setData({
            pageNo: nextPage
        });
        _this.findByPage();
    }

})