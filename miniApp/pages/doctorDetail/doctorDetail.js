
const app = getApp();
const common = require('../../filter/common');
// pages/doctorDetail/doctorDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:{},
        searchFlag:false//只是查询则为true，可编辑则为false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        //获取用户信息
        _this.findByOpneid(options.openid);
    },
    //获取身份
    findByOpneid: function (openid) {
        let _this = this;
        let openId;
        if (openid){
            openId = openid;
        }else{
            openId = wx.getStorageSync('openid');
        }
        
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
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
                }
            }
        })
    },
    //跳转到编辑
    goToEdit:function () {
        wx.navigateTo({
            url: '../doctorEdit/doctorEdit'
        })
    }
})