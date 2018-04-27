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
        pageNo_j: 1,//当前职位列表页码，默认为1
        pageNo_d: 1,//当前医生列表页码，默认为1
        iTotalDisplayRecords_d:0,//医生总数量
        iTotalDisplayRecords_j:0,//职位的数量
        pageSize: 10,//默认分页数为10
        flag: "in"//in为职位搜索，job为猎聘专区
    },
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        let _this = this;
        let id = options.id;
        let name = options.name;
        let hot = options.hot;
        _this.findSonDepartment(id, name, hot);
        //设置职位列表容器的高度
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    infoListHeight: (res.windowHeight - 100) + "px"
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
            listDoctorItems: [],
            listItems: [],
            pageNo_j: 1,
            pageNo_d: 1
        });
        //请求职位列表
        if (_this.data.currentTab == 0) {
            _this.findDoctorListPage();
        } else {
            _this.findReleaseListPage();
        }
    },
    //点击侧边栏
    getClassify: function (e) {
        let _this = this;
        let id = e.currentTarget.dataset.id;
        let idy = e.currentTarget.dataset.idy;
        let departmentname = e.currentTarget.dataset.departmentname;
        _this.setData({
            currentClassify: idy,
            departmentId: id,
            departmentName: departmentname,
            listDoctorItems:[],
            listItems:[],
            pageNo_j: 1,
            pageNo_d: 1
        });
        //请求职位列表
        if (_this.data.currentTab == 0) {
            _this.findDoctorListPage();
        } else {
            _this.findReleaseListPage();
        }
    },
    /**
     * 获取二级科室
     */
    findSonDepartment: function (id,name,hot) {
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
                    let sonDepartments = res.data.resultMap.sonDepartments;
                    //没有二级科室，就显示一级科室
                    if (!sonDepartments.length) {
                        _this.setData({
                            workClassify: [{
                                departmentName: name,
                                id:id,
                                parentDepartmentId:id,
                                parentDepartmentName: name
                            }],
                            departmentId: id,
                            departmentName: name
                        });
                    } else {
                         //有二级科室,且为热门科室
                        if (hot != 'undefined'){
                            for (let i = 0; i < sonDepartments.length ; i++){
                                if (hot == sonDepartments[i].id){
                                    _this.setData({
                                        workClassify: sonDepartments,
                                        departmentId: sonDepartments[i].id,
                                        departmentName: sonDepartments[i].departmentName,
                                        currentClassify: i
                                    });
                                }
                            }
                            
                        }else{
                            _this.setData({
                                workClassify: sonDepartments,
                                departmentId: sonDepartments[0].id,
                                departmentName: sonDepartments[0].departmentName
                            });
                        }
                       
                      
                    }
                    //请求职位列表
                    if (_this.data.currentTab == 0) {
                        _this.findDoctorListPage();
                    } else {
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
            pageNo: _this.data.pageNo_j,
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
                        listDoctorItems: (_this.data.listDoctorItems).concat(res.data.resultMap.rows),
                        iTotalDisplayRecords_j: res.data.resultMap.iTotalDisplayRecords
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
    //获取医生列表
    findDoctorListPage: function () {
        let _this = this;
        let params = {
            pageNo: _this.data.pageNo_d,
            pageSize: 5,
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
                        listItems: (_this.data.listItems).concat(res.data.resultMap.rows),
                        iTotalDisplayRecords_d: res.data.resultMap.iTotalDisplayRecords
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
    //上拉刷新
    onReachBottom: function () {
        let _this = this;
        if (_this.data.currentTab == 0){
            if ((this.data.pageNo_d) * 5 + 1 > this.data.iTotalDisplayRecords_d) return;
            let nextPage = _this.data.pageNo_d + 1;
            _this.setData({
                pageNo_d: nextPage
            });
            _this.findDoctorListPage();
        }else{
            if ((this.data.pageNo_j) * 10 + 1 > this.data.iTotalDisplayRecords_j) return;
            let nextPage = _this.data.pageNo_j + 1;
            _this.setData({
                pageNo_j: nextPage
            });
            _this.findReleaseListPage();
        }
       
    }
})