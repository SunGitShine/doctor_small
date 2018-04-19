const app = getApp()
Page({
    /* 页面的初始数据*/
    data: {
        navbar: ["医生专栏", "医院专栏"],
        currentTab: 0,
        currentClassify: 0,
        infoListHeight:300,
        msg: "this id tabBar",
        listItems: [
            {
                name: "刘海波"
            }, {
                name: "刘海波"
            }, {
                name: "刘海波"
            }
        ],
        listDoctorItems: [
            {
                name: "刘海波"
            },
            {
                name: "刘海波"
            }
        ],
        workClassify: []
    },
    // 响应点击导航栏
    navbarTap: function (e) {
        var _this = this;
        _this.setData({
            currentTab: e.currentTarget.dataset.idx,
        })
    },
    getClassify: function (e) {
        var _this = this;
        _this.setData({
            currentClassify: e.currentTarget.dataset.idy,
        })
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
              infoListHeight: res.windowHeight-100
            })
            console.log(res.windowHeight)
          }
        })  
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
                d:{
                    parentId: id
                }
            },
            success: function (res) {
                console.log(res);
                if (res.data.code == 'J000000' && res.data.resultMap){
                    _this.setData({
                        workClassify: res.data.resultMap.sonDepartments
                })
                    console.log(_this.data.workClassify)
                }
                
            }
        })
    },
    //获取职位信息
})