// pages/hospitalPublish/hospitalPublish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
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