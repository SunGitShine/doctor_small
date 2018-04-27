// pages/hospitalPublish/hospitalPublish.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        departmentItems: [],
        parentDepartments: [],//一级科室
        selectedParentDepartment: "",//选择的一级科室
        selectedSonDepartment: "",//选择的二级科室
        //学历列表，1：大专，2：本科，3：硕士，4：博士，5：其他
        educationItems: [
            {
                value: 1,
                name: '大专'
            },
            {
                value: 2,
                name: '本科'
            },
            {
                value: 3,
                name: '硕士'
            },
            {
                value: 4,
                name: '博士'
            },
            {
                value: 5,
                name: '其他'
            },
        ],
        //工作时长
        workTime: "",
        //工作时长文字显示
        workTimeText:"",
        //工作时长列表
        workTimeList: [
            {
                name: "1~3年",
                value: 1
            },
            {
                name: "3~5年",
                value: 2
            },
            {
                name: "5年以上",
                value: 3
            }
        ],
        selectedEducation: "",//当前选中的学历
        selectedEducationText: "",//当前学历的text
        selectedCity: "",//当前选中的城市
        jobTitle: "",//招聘的名字
        //职称
        title: "",
        //职称text显示
        titleText: "",
        //职称列表
        titleItems: [
            {
                name: "医师",
                value: 1
            },
            {
                name: "主治医师",
                value: 2
            },
            {
                name: "副主任医师",
                value: 3
            },
            {
                name: "主任医师",
                value: 4
            }
        ],
        //到岗时间
        jobDay: "",
        //薪资福利列表
        moneyItems: [
            { name: "商议", value: "0", checked: true },
            { name: "具体金额", value: "1" }
        ],
        //薪资选项
        moneyFlag: "0",
        //薪资输入框是否禁止
        moneyInputDisable: true,
        //薪资值
        moneyVal: "",
        //职位描述
        jobDescription: "",
        //职位要求
        jobRequire: "",
        //医院的ID
        id: "",
        //医院地址
        address: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.setData({
            id: options.id
        })
        _this.findParentDepartment();
    },
    //获取一级科室
    findParentDepartment: function () {
        let _this = this;
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + "/department/findParentDepartment.htm",
            method: "GET",
            dataType: "json",
            data: {},
            success: function (res) {
                console.log(res)
                if (res.data.code == 'J000000' && res.data.resultMap) {
                    _this.setData({
                        departmentItems: [res.data.resultMap.parentDepartments, []],
                        parentDepartments: res.data.resultMap.parentDepartments
                    });
                    _this.fixedFistNoChange();
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    //解决第一次不自动触发一级科室变化导致第二列无数据
    fixedFistNoChange: function () {
        let _this = this;
        let parentId = (_this.data.departmentItems[0][0]).id;
        let params = {
            parentId: parentId
        };
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/department/findSonDepartment.htm',
            method: 'GET',
            dataType: 'json',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    _this.setData({
                        departmentItems: [_this.data.parentDepartments, res.data.resultMap.sonDepartments]
                    })
                } else {

                }
            },
            fail: function (res) {

            }
        })
    },
    //一级科室变化
    bindFirstDepartmentChange: function (event) {
        let _this = this;
        console.log(event);
        if (event.detail.column != 0) return;
        let parentId = (_this.data.departmentItems[0])[event.detail.value].id;

        let params = {
            parentId: parentId
        };
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/department/findSonDepartment.htm',
            method: 'GET',
            dataType: 'json',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    _this.setData({
                        departmentItems: [_this.data.parentDepartments, res.data.resultMap.sonDepartments]
                    })
                } else {

                }
            },
            fail: function (res) {

            }
        })
    },
    //获取科室信息
    bindDepartmentChange: function (event) {
        let _this = this;
        let parentDepartment = (_this.data.departmentItems[0])[event.detail.value[0]];
        if (event.detail.value[1] == null) { event.detail.value[1] = 0; }
        let sonDepartment = (_this.data.departmentItems[1])[event.detail.value[1]];
        let departmentId = "";
        if (sonDepartment) {
            departmentId = sonDepartment.id
        } else {
            departmentId = parentDepartment.id
        }
        _this.setData({
            selectedParentDepartment: parentDepartment.departmentName,
            selectedSonDepartment: (sonDepartment) ? sonDepartment.departmentName : "",
            departmentId: departmentId
        })
    },
    //获取职称
    bindTitleChange: function (event) {
        let _this = this;
        this.setData({
            title: _this.data.titleItems[event.detail.value].value,
            titleText: _this.data.titleItems[event.detail.value].name
        })
    },
    //获取工作时长
    getWorkYear: function (event) {
        this.setData({
            workTime: event.detail.value
        })
    },
    //获取工作时长(change)
    workYearChange: function (event) { 
        console.log(event);
        let _this = this;

        _this.setData({
            workTime: _this.data.workTimeList[event.detail.value].value,
            workTimeText: _this.data.workTimeList[event.detail.value].name
        })
    },
    //学历picker改变的时候获取学历
    bindEducationChange: function (event) {
        console.log(event);
        let _this = this;

        _this.setData({
            selectedEducation: _this.data.educationItems[event.detail.value].value,
            selectedEducationText: _this.data.educationItems[event.detail.value].name
        })
        console.log(_this.data.selectedEducation);
    },
    //城市picker改变
    bindCityChange: function (event) {
        console.log(event);
        let value = event.detail.value;
        this.setData({
            selectedCity: value
        })
    },
    //工作时间picker改变
    jobDayChange: function (event) {
        console.log(event);
        let value = event.detail.value;
        this.setData({
            jobDay: value
        })
    },
    //薪资待遇改变
    jobMoneyChange: function (event) {
        let _this = this;
        _this.setData({
            moneyFlag: event.detail.value
        });
        if (event.detail.value == 1) {
            _this.setData({
                moneyInputDisable: false
            })
        } else {
            _this.setData({
                moneyInputDisable: true
            })
        }
    },
    //获取具体薪水
    getMoneyVal: function (event) {
        this.setData({
            moneyVal: event.detail.value
        })
    },
    //获取职位描述
    getJobDescription: function (event) {
        this.setData({
            jobDescription: event.detail.value
        })
    },
    //获取职位标题
    getJobTitle: function (event) {
        this.setData({
            jobTitle: event.detail.value
        })
    },
    //获取职位要求
    getJobRequire: function (event) {
        this.setData({
            jobRequire: event.detail.value
        })
    },
    //发布信息
    publishInfo: function () {
        let _this = this;
       
        let params = {
            openid: wx.getStorageSync('openid'),
            hospitalId: _this.data.id,
            departmentId: _this.data.departmentId,
            departmentName: (_this.data.selectedSonDepartment) ? (_this.data.selectedSonDepartment) : (_this.data.selectedParentDepartment),
            title: _this.data.jobTitle,
            doctorTitle: _this.data.title,
            education: _this.data.selectedEducation,
            workTime: _this.data.workTime,
            time: _this.data.jobDay,
            moneyType: (_this.data.moneyFlag == 0) ? ('-1') : (_this.data.moneyVal),
            jobDescription: _this.data.jobDescription,
            jobRequire: _this.data.jobRequire
        };
        //标题验证
        if (!params.title) {
            wx.showToast({
                title: "请输入标题",
                icon: 'none',
                time: 500
            });
            return;
        }
        //科室验证
        if (!params.departmentName || !params.departmentId) {
            wx.showToast({
                title: "请选择科室",
                icon: 'none',
                time: 500
            });
            return;
        }

        //职称验证
        if (!params.doctorTitle) {
            wx.showToast({
                title: "请选择职称",
                icon: 'none',
                time: 500
            });
            return;
        }
        //学历验证
        if (!params.education) {
            wx.showToast({
                title: "请选择学历",
                icon: 'none',
                time: 500
            });
            return;
        }
        //工作年限验证
        if (!params.workTime) {
            wx.showToast({
                title: "请输入工作年限",
                icon: 'none',
                time: 500
            });
            return;
        }
        //待遇验证
        if (!params.moneyType) {
            wx.showToast({
                title: "请写明待遇",
                icon: 'none',
                time: 500
            });
            return;
        }
        //工作描述验证
        if (!params.jobDescription) {
            wx.showToast({
                title: "请输入工作描述",
                icon: 'none',
                time: 500
            });
            return;
        }
        //工作要求
        if (!params.jobRequire) {
            wx.showToast({
                title: "请输入工作要求",
                icon: 'none',
                time: 500
            });
            return;
        }
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/hospital/release.htm',
            method: 'POST',
            dataType: 'json',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    wx.showToast({
                        title: res.data.description,
                        icon: 'none',
                        time: 1000,
                        success: function () {
                            _this.findReleaseListPage();
                           setTimeout(function(){
                               wx.navigateBack({
                                   url: '../hospitalPublishList/hospitalPublishList',
                               })
                           },500)
                        }
                    });

                } else {
                    wx.showToast({
                        title: res.data.description,
                        icon: 'none',
                        time: 500
                    });
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: res.data.description,
                    icon: 'none',
                    time: 500
                });
            }
        })
    },
    //查询职位信息
    findReleaseListPage: function () {
        let _this = this;
        let openId = wx.getStorageSync('openid');
        let params = {
            hospitalOpenid: openId,
            pageNo: _this.data.pageNo,
            pageSize: 10
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
                    //获取页面栈
                    var pages = getCurrentPages();
                    if (pages.length > 1) {
                        //上一个页面实例对象
                        var prePage = pages[pages.length - 2];
                        //关键在这里
                        prePage.changeData({
                            listDoctorItems: res.data.resultMap.rows,
                            iTotalDisplayRecords: res.data.resultMap.iTotalDisplayRecords
                        })
                    }
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
})