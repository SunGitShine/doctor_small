//获取应用实例
const app = getApp();
const common = require('../../filter/common');
// pages/hospitalEdit/hospitalEdit.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: "",//医院名称
        address: "",//医院地址
        auditStatus:0,//审核状态
        phone: "",//医院地址
        tag1: "",//医院标签1
        tag2: "",//医院标签2
        businessLicenseSrc: "",//医院营业执照
        introduce: "",//医院介绍
        imgUrl: [],//医院照片
        logoImgUrl: "",//医院logo
        selectedCity: "",//城市列表
        scale: "",
        scaleText: "",
        //公司规模 1: "10人以下";2: "10~50人";3:"50~100人";4:"100~500人";
        scaleItems: [
            { name: "10人以下", value: 1 },
            { name: "10~50人", value: 2 },
            { name: "50~100人", value: 3 },
            { name: "100~500人", value: 4 }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.findByOpneid();
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
                    //医院
                    if (res.data.resultMap.identity == 2) {
                        //去除null的数据
                        for (var key in res.data.resultMap.response) {
                            if (res.data.resultMap.response[key] == null) {
                                res.data.resultMap.response[key] = "";
                            }
                        }
                        let info = res.data.resultMap.response;
                        _this.setData({
                            //医院名字
                            name: info.name,
                            address: info.address,//医院地址
                            auditStatus: info.auditStatus,
                            phone: info.phone,//医院地址
                            tag1: (typeof info.tag == 'string') ? (""): (info.tag[0]),//医院标签1
                            tag2: (typeof info.tag == 'string') ? ("") : (info.tag[1]),//医院标签2
                            businessLicenseSrc: info.businessLicenceUrl,//医院营业执照
                            introduce: info.profile,//医院介绍
                            imgUrl: info.imageUrl || [],//医院照片
                            logoImgUrl: info.logoImgUrl,//医院logo
                            selectedCity: [info.province, info.city],//城市列表
                            scale: info.scale,//规模value
                            scaleText: common.scaleFilter(info.scale)//规模text
                        })
                    }
                }
            }
        })
    },
    //获取医院名称
    hospitalNameInput: function (event) {
        this.setData({
            name: event.detail.value
        })
    },
    //获取医院地址
    hospitalAddressInput: function (event) {
        this.setData({
            address: event.detail.value
        })
    },
    //获取医院联系方式
    hospitalPhoneInput: function (event) {
        this.setData({
            phone: event.detail.value
        })
    },
    //获取医院规模
    bindScaleChange: function (event) {
        let _this = this;
        this.setData({
            scale: _this.data.scaleItems[event.detail.value].value,
            scaleText: _this.data.scaleItems[event.detail.value].name
        })
    },
    //获取荣誉1
    getTag1: function (event) {
        this.setData({
            tag1: event.detail.value
        })
    },
    //获取荣誉2
    getTag2: function (event) {
        this.setData({
            tag2: event.detail.value
        })
    },
    //增加营业执照
    addBusinessLicense: function (event) {
        let _this = this;
        if (_this.data.auditStatus == 1) {
            wx.showToast({
                title: "审核通过后不可更改",
                icon: 'none',
                time: 500
            });
            return;
        }
        wx.chooseImage({
            success: function (res) {
                let tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    header: {
                        "accept": 'application/json'
                    },
                    method: "GET",
                    url: app.globalData.commonBaseUrl + '/common/upload.htm',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'upload': 'upload'
                    },
                    success: function (result) {
                        let tempData = JSON.parse(result.data);
                        if (tempData.code == 'J000000' && tempData.resultMap) {
                            _this.setData({
                                businessLicenseSrc: tempData.resultMap.picPath
                            })
                        }
                    }
                })
            }
        })
    },
    //获取擅长领域
    getIntroduce: function (event) {
        this.setData({
            introduce: event.detail.value
        })
    },
    //增加医院logo
    addLogoImgUrl: function (event) {
        let _this = this;
        wx.chooseImage({
            success: function (res) {
                let tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    header: {
                        "accept": 'application/json'
                    },
                    method: "GET",
                    url: app.globalData.commonBaseUrl + '/common/upload.htm',
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        'upload': 'upload'
                    },
                    success: function (result) {
                        let tempData = JSON.parse(result.data);
                        if (tempData.code == 'J000000' && tempData.resultMap) {
                            _this.setData({
                                logoImgUrl: tempData.resultMap.picPath
                            })
                        }
                    }
                })
            }
        })
    },
    //增加医院照片
    addHospitalImg: function (event) {
        let _this = this;
        wx.chooseImage({
            success: function (res) {
                let tempFilePaths = res.tempFilePaths;
                let tempList = JSON.parse(JSON.stringify(_this.data.imgUrl));
                for (let i = 0; i < tempFilePaths.length ; i++){
                    wx.uploadFile({
                        header: {
                            "accept": 'application/json'
                        },
                        method: "GET",
                        url: app.globalData.commonBaseUrl + '/common/upload.htm',
                        filePath: tempFilePaths[i],
                        name: 'file',
                        formData: {
                            'upload': 'upload'
                        },
                        success: function (result) {
                            let tempData = JSON.parse(result.data);
                            console.log(tempData);
                            if (tempData.code == 'J000000' && tempData.resultMap) {
                                tempList.push(tempData.resultMap.picPath);
                                _this.setData({
                                    imgUrl: tempList
                                });
                            }
                        }
                    })
                }
              
            }
        })
    },
    //删除医院照片
    removeHospitalPic: function (event) {
        let _this = this;
        let tempList = _this.data.imgUrl;
        tempList.splice(event.target.dataset.index, 1);
        _this.setData({
            imgUrl: tempList
        })
        console.log(_this.data.imgUrl);
    },
    //城市picker改变
    bindCityChange: function (event) {
        console.log(event);
        let value = event.detail.value;
        this.setData({
            selectedCity: value
        })
    },
    //提交审核
    submitHospitalInfo: function () {
        let _this = this;
        let params = {
            openid: wx.getStorageSync('openid'),
            name: _this.data.name,//医院名称
            address: _this.data.address,//医院地址
            phone: _this.data.phone,//医院电话
            tag: [_this.data.tag1, _this.data.tag2],//医院标签
            businessLicenceUrl: _this.data.businessLicenseSrc,//医院营业执照
            profile: _this.data.introduce,//医院介绍
            imageUrl: _this.data.imgUrl,//医院照片
            logoImgUrl: _this.data.logoImgUrl,//医院的logo
            province: _this.data.selectedCity[0],//所在省
            city: _this.data.selectedCity[1],//所在市
            scale: _this.data.scale//公司规模
        }
        //医院名称验证
        if (!params.name) {
            wx.showToast({
                title: "请输入医院名字",
                icon: 'none',
                time: 500
            });
            return;
        }
        //地址验证
        if (!params.address) {
            wx.showToast({
                title: "请选择地址",
                icon: 'none',
                time: 500
            });
            return;
        }
        //电话验证
        if (!params.phone) {
            wx.showToast({
                title: "请输入电话",
                icon: 'none',
                time: 500
            });
            return;
        }
        //医院营业执照验证
        if (!params.businessLicenceUrl) {
            wx.showToast({
                title: "请上传营业执照照片",
                icon: 'none',
                time: 500
            });
            return;
        } 
        //医院介绍验证
        if (!params.profile) {
            wx.showToast({
                title: "请输入医院介绍",
                icon: 'none',
                time: 500
            });
            return;
        }
        //医院照片验证
        if (!(params.imageUrl).length) {
            wx.showToast({
                title: "请上传医院照片",
                icon: 'none',
                time: 500
            });
            return;
        }
        //医院logo验证
        if (!params.logoImgUrl) {
            wx.showToast({
                title: "请上传医院logo",
                icon: 'none',
                time: 500
            });
            return;
        }
        // province: _this.data.selectedCity[0],//所在省
        //     city: _this.data.selectedCity[1],//所在市
        //         scale:_this.data.scale//公司规模
        //医院城市验证
        if (!params.province || !params.city) {
            wx.showToast({
                title: "请选择城市",
                icon: 'none',
                time: 500
            });
            return;
        }
        //医院规模验证
        if (!params.scale) {
            wx.showToast({
                title: "请选择医院规模",
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
            url: app.globalData.commonBaseUrl + '/hospital/completeInfo.htm',
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
                        time: 2000
                    });
                    wx.navigateBack({
                        delta: 2
                    })
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