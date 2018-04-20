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
        isRelease:true,//模板判断标致
        reviewSwitch:false//模板发布开关状态
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.setData({
            id: options.id
        });
        _this.findReleaseListPage();
    },
    //查询职位信息
    findReleaseListPage: function () {
        let _this = this;
        let openId = wx.getStorageSync('openid');
        let params = {
            pageNo: 1,
            pageSize: 10,
            hospitalOpenid: openId
        }
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/hospital/findReleaseListPage.htm',
            method: 'GET',
            dataType: 'json',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    _this.setData({
                        listDoctorItems: res.data.resultMap.rows
                    });
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
    //发布信息
    updateReleaseStatus: function (item) {
        let _this = this;
        let params = {
            releaseId: item.id,
            status: item.status//状态，0：下架，1：上架
        }
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/hospital/updateReleaseStatus.htm',
            method: 'GET',
            dataType: 'json',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    wx.showToast({
                        title: "状态修改成功",
                        icon: 'none'
                    });
                    //刷新列表
                    _this.findReleaseListPage();
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
    //医院是否发布招聘信息
    releaseChange: function (event) {
        console.log(event);
        let _this = this;
        let flag = event.detail.value;//判断发布状态
        let id = event.target.dataset.id;
        _this.updateReleaseStatus({
            id: id,
            status: (flag) ? (1) : (0)
        })
    },
    //删除发布信息
    deleteRelease: function (event) {
        let _this = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除吗?',
            success: function (res) {
                if (res.confirm) {
                    let id = event.target.dataset.id;
                    let params = {
                        releaseId: id
                    }
                    wx.request({
                        header: {
                            "accept": 'application/json',
                            "content-Type": "application/x-www-form-urlencoded"
                        },
                        url: app.globalData.commonBaseUrl + '/hospital/deleteRelease.htm',
                        method: 'GET',
                        dataType: 'json',
                        data: {
                            d: JSON.stringify(params)
                        },
                        success: function (res) {
                            if (res.data.code == 'J000000') {
                                wx.showToast({
                                    title: "删除成功",
                                    icon: 'none'
                                });
                                _this.findReleaseListPage();
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
                } else if (res.cancel) {
             
                }
            }
        })
        
    }
})