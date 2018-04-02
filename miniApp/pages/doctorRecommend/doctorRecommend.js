// pages/doctorRecommend/doctorRecommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listDoctorItems: [
      {
        name: "刘海波"
      },
      {
        name: "谢强"
      }
    ],
    currentTab:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentTab, titleName;
    currentTab = options.currentTab;
    console.log(currentTab);
    
    if (currentTab == "0"){
      titleName = "推荐医院";
      this.setData({ currentTab: parseInt("1") });
    }else{
      titleName = "推荐医生";
      this.setData({ currentTab: parseInt("0") });
    }
    wx.setNavigationBarTitle({
      title: titleName,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})