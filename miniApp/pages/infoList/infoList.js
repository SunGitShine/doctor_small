const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar:["医生专栏","医院专栏"],
    currentTab:0,
    msg:"this id tabBar",
    listItems:[
      {
        name:"刘海波"
      },{
        name: "刘海波"
      },{
        name:"刘海波"
      }
    ],
    listDoctorItems:[
      {
        name:"刘海波"
      },
      {
        name: "刘海波"
      }
    ]
  },
  // 响应点击导航栏
  navbarTap:function(e){
    var _this = this;
    _this.setData({
      currentTab:e.currentTarget.dataset.idx,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    // wx.request({
    //   url: app.global.commonBaseUrl+"",
    //   method:"GET",
    //   dataType:"json",
    //   data:{},
    //   success:function(res){
    //   }
    // })    
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
    
  },
})