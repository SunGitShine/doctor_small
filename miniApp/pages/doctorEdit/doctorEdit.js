// pages/doctorDetail/doctorDetail.js
//获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //姓名
        name:"",
        //性别列表
        sexItems: [
            { name: '0', value: '男', checked: 'true' },
            { name: '1', value: '女' }
        ],
        //选中的性别
        sex:"0",//0为男，1为女
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
        workTime:"",
        selectedEducation: "",//当前选中的学历
        selectedEducationText:"",//当前学历的text
        selectedBirthday: "",//当前选中的生日
        selectedCity: "",//当前选中的城市
        honor1:"",//荣誉称号
        honor2:"",
        departmentItems: [],
        parentDepartments: [],//一级科室
        selectedParentDepartment: "",//选择的一级科室
        selectedSonDepartment: "",//选择的二级科室
        departmentId:"",
        //教育经历
        eduExperienceList: [{
            start: "",
            end: "",
            school: "",
            major: ""
        }],
        //工作经历
        workExperienceList: [
            {
                start: "",
                end: "",
                hospital: "",
                department: ""
            }
        ],
        //作品展示
        galleryList:[
            {   
                url:"",
                description: ""
            }
        ],
        //医师职称证url
        physicianSrc:"",
        //医师资格证url
        qualificationSrc: "",
        //医师执业证url
        licenseSrc: "",
        //擅长领域
        goodField:"",
        //个人简绍
        profile:"",
        //职称
        title:"",
        //职称text显示
        titleText:"",
        //职称列表
        titleItems:[
            {
                name:"医师",
                value:1
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
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _this = this;
        _this.findParentDepartment()
    },
    //获取姓名
    userNameInput: function (event){
        this.setData({
            name: event.detail.value
        })
    },
    //获取荣誉1
    getHonor1: function (event) {
        this.setData({
            honor1: event.detail.value
        })
    },
    //获取荣誉1
    getHonor2: function (event) {
        this.setData({
            honor2: event.detail.value
        })
    },
    //获取性别
    sexRadioChange: function (event) {
        let _this = this;
        _this.setData({
            sex: event.detail.value
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
    getWorkYear: function (event){
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
    //生日picker改变
    bindBirthdayChange: function (event) {
        console.log(event);
        let value = event.detail.value;
        this.setData({
            selectedBirthday: value
        })
    },
    //城市picker改变
    bindCityChange: function (event) {
        console.log(event);
        let value = event.detail.value;
        this.setData({
            selectedCity: value
        })
    },
    //教育时间
    eduExperienceDayChange: function (event) {
        console.log(event);
        let _this = this;
        let index = event.currentTarget.dataset.index;
        //设置picker得到的值
        if (!_this.data.eduExperienceList[index].start) {
            _this.data.eduExperienceList[index].start = event.detail.value;
        } else {
            _this.data.eduExperienceList[index].end = event.detail.value;
        }
        //加入基本数据里
        _this.setData({
            eduExperienceList: _this.data.eduExperienceList
        });
    },
    //工作时间
    workExperienceDayChange: function (event) {
        console.log(event);
        let _this = this;
        let index = event.currentTarget.dataset.index;
        //设置picker得到的值
        if (!_this.data.workExperienceList[index].start) {
            _this.data.workExperienceList[index].start = event.detail.value;
        } else {
            _this.data.workExperienceList[index].end = event.detail.value;
        }
        //加入基本数据里
        _this.setData({
            workExperienceList: _this.data.workExperienceList
        });
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
        if (event.detail.value[1] == null) { event.detail.value[1] = 0;}
        let sonDepartment = (_this.data.departmentItems[1])[event.detail.value[1]];
        let departmentId = "";
        if (sonDepartment){
            departmentId = sonDepartment.id
        }else{
            departmentId = parentDepartment.id
        }
        _this.setData({
            selectedParentDepartment: parentDepartment.departmentName,
            selectedSonDepartment: (sonDepartment)?sonDepartment.departmentName:"",
            departmentId: departmentId
        })
    },
    //增加教育经历
    addEduExperience: function (event) {
        let _this = this;
        if ((_this.data.eduExperienceList).length > 4) return;
        _this.setData({
            eduExperienceList: (_this.data.eduExperienceList).concat([{
                school: "",
                major: "",
                start: "",
                end: ""
            }])
        })
    },
    //增加工作经历
    addWorkExperience: function (event) {
        let _this = this;
        if ((_this.data.workExperienceList).length > 4) return;
        _this.setData({
            workExperienceList: (_this.data.workExperienceList).concat([{
                hospital: "",
                department: "",
                start: "",
                end: ""
            }])
        })
    },
    //增加医师职称证
    addPhysician: function (event) {
        let _this = this;
        wx.chooseImage({
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    header: {
                        "accept": 'application/json'
                    },
                    method: "GET",
                    url: app.globalData.commonBaseUrl + '/common/upload.htm', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'upload': 'upload'
                    },
                    success: function (result) {
                        let tempData = JSON.parse(result.data);
                        if (tempData.code == 'J000000' && tempData.resultMap) {
                            _this.setData({
                                physicianSrc: tempData.resultMap.picPath
                            })
                        }
                    }
                })
            }
        })
    },
    //增加医师资格证
    addQualification: function (event) {
        let _this = this;
        wx.chooseImage({
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    header: {
                        "accept": 'application/json'
                    },
                    method: "GET",
                    url: app.globalData.commonBaseUrl + '/common/upload.htm', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'upload': 'upload'
                    },
                    success: function (result) {
                        let tempData = JSON.parse(result.data);
                        if (tempData.code == 'J000000' && tempData.resultMap) {
                            _this.setData({
                                qualificationSrc: tempData.resultMap.picPath
                            })
                        }
                    }
                })
            }
        })
    },
    //增加医师执业证
    addLicense: function (event) {
        let _this = this;
        wx.chooseImage({
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    header: {
                        "accept": 'application/json'
                    },
                    method: "GET",
                    url: app.globalData.commonBaseUrl + '/common/upload.htm', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'upload': 'upload'
                    },
                    success: function (result) {
                        let tempData = JSON.parse(result.data);
                        if (tempData.code == 'J000000' && tempData.resultMap) {
                            _this.setData({
                                licenseSrc: tempData.resultMap.picPath
                            })
                        }
                    }
                })
            }
        })
    },
    //增加作品展示
    addGallery: function (event) {
        let _this = this;
        if ((_this.data.galleryList).length > 4) return;
        _this.setData({
            galleryList: (_this.data.galleryList).concat([{
                url:"",
                text:""
            }])
        })
    },
    //添加作品的照片
    getGallery: function (event) {
        let _this = this;
        wx.chooseImage({
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    header: {
                        "accept": 'application/json'
                    },
                    method: "GET",
                    url: app.globalData.commonBaseUrl + '/common/upload.htm', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'upload': 'upload'
                    },
                    success: function (result) {
                        let tempData = JSON.parse(result.data);
                        if (tempData.code == 'J000000' && tempData.resultMap) {
                            let index = event.currentTarget.dataset.index;
                            //设置picker得到的值
                            _this.data.galleryList[index].url = tempData.resultMap.picPath;
                            //加入基本数据里
                            _this.setData({
                                galleryList: _this.data.galleryList
                            });
                        }
                    }
                })
            }
        })
    },
    //获取擅长领域
    getGoodField: function (event) {
        this.setData({
            googField: event.detail.value
        })
    },
    //获取个人介绍
    getProfile: function (event) {
        this.setData({
            profile: event.detail.value
        })
    },
    //提交审核
    submitDoctorInfo: function (){
        let _this = this;
        //教育经历
        let educationExperience = [];
        for (let i = 0; i < (_this.data.eduExperienceList).legnth ; i++){
            educationExperience.push({
                "major": _this.data.eduExperienceList[i].major,
                "school": _this.data.eduExperienceList[i].school,
                "time": _this.data.eduExperienceList[i].start + "~" + _this.data.eduExperienceList[i].end
            })
        }
        //工作经历
        let workExperience = [];
        for (let j = 0; j < (_this.data.workExperienceList).legnth; j++) {
            educationExperience.push({
                "department": _this.data.workExperienceList[j].department,
                "company": _this.data.workExperienceList[j].hospital,
                "time": _this.data.workExperienceList[j].start + "~" + _this.data.workExperienceList[j].end
            })
        }
        let params = {
            "openid": wx.getStorageSync('openid'),
            "birthday": _this.data.selectedBirthday,
            "call": [_this.data.honor1, _this.data.honor2],
            "departmentId": _this.data.departmentId,
            "departmentName": _this.data.selectedParentDepartment,
            "education": _this.data.selectedEducation,
            "educationExperience": educationExperience,
            "goodField": _this.data.goodField,
            "headImgUrl": app.globalData.userInfo.avatarUrl,
            "name": _this.data.name,
            "practiceCardUrl": _this.data.licenseSrc,
            "professionCardUrl": _this.data.physicianSrc,
            "profile": _this.data.profile,
            "province": _this.data.selectedCity[0],
            "city": _this.data.selectedCity[1],
            "qualificationCardUrl": _this.data.qualificationSrc,
            "sex": _this.data.sex,
            "title": _this.data.title,
            "workExperience": workExperience,
            "workTime": _this.data.workTime,
            "works": _this.data.galleryList
        }
        console.log(params)
        wx.request({
            header: {
                "accept": 'application/json',
                "content-Type": "application/x-www-form-urlencoded"
            },
            url: app.globalData.commonBaseUrl + '/doctor/completeInfo.htm',
            method: 'POST',
            dataType: 'json',
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
                }
            },
            fail: function (res) {
                
            }
        })
    }
})