const app = getApp();

Page({
    /* 页面的初始数据*/
    data: {
        userInfo: {
        },
        phoneNum: "",
        qrCode: "",
        motto: "Hello world",
        roleType: "",//身份标志，1是医生，2是医院
        typechoose: true,
        date: "",
        roleShow: false,//身份选择弹框显示
        guideShow: false,//导向显示
        identity: "",//身份标志
        doctorData: {},//医生个人中心
        sittingStartTime: "",//坐诊开始时间
        sittingEndTime: ""//坐诊结束时间
    },
    /*生命周期函数--监听页面加载*/
    onLoad: function (option) {
        let _this = this;
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
     
    },
    //时间选择
    bindDateChange: function (e) {
        let _this = this;
        let time = e.detail.value;
        if (_this.data.doctorData.doctorReleseId) return;
        if (!_this.data.doctorData.startTime) {
            this.setData({
                doctorData: Object.assign(_this.data.doctorData, {
                    startTime: time
                })
            })
        } else {
            this.setData({
                doctorData: Object.assign(_this.data.doctorData, {
                    endTime: time
                })
            })
            _this.switchChange();
        }
    },
    //发布坐诊时间
    switchChange: function (event) {
        console.log(event);
        let _this = this;
        let params = {
            "openid": wx.getStorageSync('openid'),
            "startTime": _this.data.doctorData.startTime,
            "endTime": _this.data.doctorData.endTime
        }
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            dataType: 'json',
            url: app.globalData.commonBaseUrl + '/doctor/relese.htm',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    _this.findByOpneid();
                } else {
                    wx.showToast({
                        title: res.data.description,
                        icon: 'none'
                    });
                    
                }
            },
            fail:function (res) {
               
            }
        })
    },
    //更新坐诊时间
    updateReleseStatus: function (event) {
        console.log(event);
        let _this = this;
        let status = (event.detail.value)?('1'):('0')
        let params = {
            doctorReleseId: _this.data.doctorData.doctorReleseId,
            status: status
        }
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            method: 'GET',
            dataType: 'json',
            url: app.globalData.commonBaseUrl + '/doctor/updateReleseStatus.htm',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {

                } else {
                    wx.showToast({
                        title: res.data.description,
                        icon: 'none'
                    });
                    // _this.setData({
                    //     doctorData: Object.assign(_this.data.doctorData, {
                    //         sittingSwitch: false
                    //     })
                    // })
                }
            },
            fail: function (res) {
                _this.setData({
                    doctorData: Object.assign(_this.data.doctorData, {
                        sittingSwitch: false
                    })
                })
            }
        })
    },
    //删除坐诊时间
    deleteSittingTime: function () {
        console.log(event);
        let _this = this;
        let doctorReleseId = _this.data.doctorData.doctorReleseId;
        let params = {
            "doctorReleseId": doctorReleseId
        }
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/common/bindPhone.htm',
            method: 'GET',
            dataType: 'json',
            url: app.globalData.commonBaseUrl + '/doctor/deleteRelese.htm',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    _this.findByOpneid();
                    wx.showToast({
                        title: '删除成功',
                        icon: 'none'
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
    /* 生命周期函数--监听页面显示*/
    onShow: function () {
        let _this = this;
        this.setData({
            roleType: "",
            typechoose: true
        });
        _this.findByOpneid();
    },
    codeInput: function (e) {
        this.setData({
            qrCode: e.detail.value
        })
    },
    phoneInput: function (e) {
        this.setData({
            phoneNum: e.detail.value
        })
    },
    //获取二维码
    getSmsCode: function () {
        var phoneReg = /^1[3|4|5|8][0-9]\d{4,8}$/;
        if (phoneReg.test(this.data.phoneNum)) {
            wx.request({
                url: app.globalData.commonBaseUrl + '/common/sendSmsCode.htm',
                data: { d: { "phone": this.data.phoneNum } },
                success: function (res) {
                    console.log(res);
                }
            })
        } else {
            wx.showToast({
                title: '号码不符合规范',
                icon: 'none'
            })
        }
    },
    // 绑定账号
    bindAccount: function () {
        let _this = this;
        if (!_this.data.phoneNum || !_this.data.qrCode) {
            wx.showToast({
                title: '信息不能为而空',
                icon: 'none'
            })
            return;
        }
        let openid = wx.getStorageSync('openid');
        let params = {
            phone: _this.data.phoneNum,
            smsCode: _this.data.qrCode,
            openid: openid,
            identityType: _this.data.roleType,
            headImgUrl: app.globalData.userInfo.avatarUrl,
            name: app.globalData.userInfo.nickName,
        };
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/common/bindPhone.htm',
            method: 'POST',
            dataType: 'json',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    wx.navigateTo({
                        url: '../doctorEdit/doctorEdit'
                    })
                } else {
                    wx.showToast({
                        title: res.data.description,
                        icon: 'none'
                    })
                }
            },
            fail: function (res) {

            }
        })
        //this.setData({ typechoose: true })
    },
    //弹出身份选择框
    goFillInformation: function () {
        this.setData({
            roleShow: true
        })
    },
    //关闭身份选择框
    closeChooseRole: function () {
        this.setData({
            roleShow: false
        })
    },
    //选择身份
    chooseRole: function (e) {
        let typeNum = e.currentTarget.dataset.idx;
        // if (typeNum == 1){
        //     wx.navigateTo({
        //         url: '../doctorEdit/doctorEdit'
        //     })
        // }
    
        this.setData({
            roleType: typeNum,
            roleShow: true,
            typechoose: false,
            guideShow: false
        });
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
                            if (res.data.resultMap.response[key] == null){
                                res.data.resultMap.response[key] = "";
                            }
                        }
                        _this.setData({
                            roleType: 1,
                            doctorData: res.data.resultMap.response
                        });
                        _this.findReleaseListPage(1);
                    }
                }
            }
        })
    },
    //获取推荐医院
    findReleaseListPage: function (identity) {
        let _this = this;
        let openId = wx.getStorageSync('openid');
        let params = {
            pageNo: 1,
            pageSize: 10
        }
        //角色是医生
        if (identity == 1){
            params = Object.assign(params,{
                doctorOpenid: openId
            })
        } else if (identity == 2){
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
                        doctorData: Object.assign(_this.data.doctorData, {
                            iTotalDisplayRecords: res.data.resultMap.iTotalDisplayRecords,
                            listDoctorItems: res.data.resultMap.rows
                        })
                    })  
                }else{
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
    //路由：跳转到详情或者完善信息
    goToDoctorInfo: function () {
        let _this = this;
        if (_this.data.doctorData.completeStatus == 0){//未完善信息
            wx.navigateTo({
                url: '../doctorEdit/doctorEdit'
            })
        } else if (_this.data.doctorData.completeStatus == 1){//已有信息
            wx.navigateTo({
                url: '../doctorDetail/doctorDetail'
            })
        }
    }
})