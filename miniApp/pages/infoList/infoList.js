const app = getApp()
Page({
    /* 页面的初始数据*/
    data: {
        navbar: ["医生专栏", "医院专栏"],
        currentTab: 0,//0为医生专栏，1为医院专栏
        infoListHeight: '300px',
        msg: "this id tabBar",
        currentClassify: 0,
        departmentId: "",//当前部门id
        departmentName: "",//当前科室名
        //医生专栏
        listItems: [],
        //医院专栏
        listDoctorItems: [],
        workClassify: [],
        pageNo: 1,//当前页码，默认为1
        pageSize: 10,//默认分页数为10
        flag:"in"//in为职位搜索，job为猎聘专区
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        let _this = this;
        let id = options.id;
        _this.findSonDepartment(id);
        //设置职位列表容器的高度
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    infoListHeight: (res.windowHeight - 100)+"px"
                })
                console.log(res.windowHeight)
            }
        })
    },
    // 响应点击导航栏
    navbarTap: function (e) {
        var _this = this;
        _this.setData({
            currentTab: e.currentTarget.dataset.idx,
        });
        //请求职位列表
        if (_this.data.currentTab == 0) {
            _this.findDoctorListPage();
        } else {
            _this.findReleaseListPage();
        }
    },
    getClassify: function (e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        let idy = e.currentTarget.dataset.idy;
        let departmentname = e.currentTarget.dataset.departmentname;
        _this.setData({
            currentClassify: idy,
            departmentId: id,
            departmentName: departmentname
        });
        //请求职位列表
        if (_this.data.currentTab == 0) {
            _this.findDoctorListPage();
        } else {
            _this.findReleaseListPage();
        }
    },
    /**
     * 获取一级科室
     */
    findSonDepartment: function (id) {
        let _this = this;
        wx.request({
            url: app.globalData.commonBaseUrl + "/department/findSonDepartment.htm",
            method: "GET",
            dataType: "json",
            data: {
                d: {
                    parentId: id
                }
            },
            success: function (res) {
                console.log(res);
                if (res.data.code == 'J000000' && res.data.resultMap) {
                    _this.setData({
                        workClassify: res.data.resultMap.sonDepartments,
                        departmentId: res.data.resultMap.sonDepartments[0].id,
                        departmentName: res.data.resultMap.sonDepartments[0].departmentName
                    });
                    //请求职位列表
                    if (_this.data.currentTab == 0){
                        _this.findDoctorListPage();
                    }else{
                        _this.findReleaseListPage();
                    }
                    
                }

            }
        })
    },
    //获取发布职位信息
    findReleaseListPage: function () {
        let _this = this;
        let params = {
            pageNo: 1,
            pageSize: 10,
            departmentId: _this.data.departmentId
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
                    console.log((_this.data.listDoctorItems).length);
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
    //获取医生列表
    findDoctorListPage: function (){
        let _this = this;
        let params = {
            pageNo: 1,
            pageSize: 10,
            departmentId: _this.data.departmentId
        }
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/doctor/findDoctorListPage.htm',
            method: 'GET',
            dataType: 'json',
            data: {
                d: JSON.stringify(params)
            },
            success: function (res) {
                if (res.data.code == 'J000000') {
                    _this.setData({
                        listItems: res.data.resultMap.rows
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
    }
})