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
        value: 4,
        name: '博士'
      },
      {
        value: 3,
        name: '硕士'
      },
      {
        value: 2,
        name: '本科'
      },
      {
        value: 1,
        name: '大专'
      },
      {
        value: 5,
        name: '其他'
      },
    ],
    //工作时长
    workTime: "",
    selectedEducation: "",//当前选中的学历
    selectedEducationText: "",//当前学历的text
    selectedCity: "",//当前选中的城市
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
    jobDay:"",
    //薪资福利列表
    moneyItems:[
      {name:"面议",value:"0"},
      { name: "具体金额", value: "1"}
    ],
    //薪资选项
    moneyFlag:"",
    //薪资输入框是否禁止
    moneyInputDisable:false,
    //薪资值
    moneyVal:"",
    //职位描述
    jobDescription:"",
    //职位要求
    jobRequire:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
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
          })
        }
      },
      fail: function (res) {
        console.log(res)
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
  //生日picker改变
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
    if (event.detail.value == 1){
      _this.setData({
        moneyInputDisable:false
      })
    }else{
      _this.setData({
        moneyInputDisable: true
      })
    }
  },
  //获取职位描述
  getJobDescription: function (event) {
    this.setData({
      jobDescription: event.detail.value
    })
  },
  //获取职位要求
  getJobRequire: function () {
    this.setData({
      jobRequire: event.detail.value
    })
  },
  //发布信息
  publishInfo:function(){
    wx.request({
      url: app.globalData.commonBaseUrl +'/hospital/completeInfo.htm',
      data:{
        d:{
          "openid": "18380448932",
          "name": "csc",
          "phone": "18380448933",
          "logoImgUrl": "http://www.baidu.com",
          "province": "四川省",
          "city": "成都市",
          "address": "中和镇xx街",
          "scale": 4,
          "tag": ["好医院", "社保定点医院"],
          "businessLicenceUrl": "http://www.baidu.com",
          "profile": "简介",
          "imageUrl": ["http://www.baidu.com", "http://www.baidu.com"]
        }
      },
      success:function(res){
        wx.showToast({
          title: res.description,
        })
        console.log(res);
      }
    })
  }
})