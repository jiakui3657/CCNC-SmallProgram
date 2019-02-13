// pages/home/home.js
const app = getApp()

Page({
  background: '#F3F3F3',

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    information:null
  },
  contact:function(){
    wx.redirectTo({
      url: '../contact/contact'
    })
  },
  create:function(){
    wx.navigateTo({
      url: '../create/create'
    })
  },
  flicking:function(){
    wx.scanCode({
      success: (res) => {
        var str = res.result;
        var start= str.lastIndexOf("/")+1;
        var end = str.indexOf("htm")-1;
        var xx = str.substring(start,end);
        console.log(xx)
        if (xx) {
          wx.reLaunch({
            url: '../information/information?xx=' + xx
          })
        }
      }
    })
  },
  editor:function(){
    wx.navigateTo({
      url: '../create/create?id=' + this.data.information.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.apiUrl + '/card/my.htm',
      data: {
        userToken: app.userToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (resback) {
        console.log(resback)
        if (resback.data.code == 0) {
          that.setData({
            information: resback.data
          })
          app.id = resback.data.id
          app.name = resback.data.name
          app.phone = resback.data.phone
          app.company = resback.data.companyName
          app.job = resback.data.job
        }
      }
    })
    if (options.type==1){
      wx.navigateTo({
        url: '../information/information?xx=' + options.xx
      })
    }
    
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
    // if (app.state){
    //   var that = this
    //   wx.request({
    //     url: app.apiUrl + '/card/my.htm',
    //     data: {
    //       userToken: app.userToken
    //     },
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded' // 默认值
    //     },
    //     method: 'POST',
    //     success: function (resback) {
    //       console.log(resback)
    //       if (resback.data.code == 0) {
    //         that.setData({
    //           information: resback.data
    //         })
    //         app.id = resback.data.id
    //         app.name = resback.data.name
    //         app.phone = resback.data.phone
    //         app.company = resback.data.companyName
    //         app.job = resback.data.job
    //       }
    //     }
    //   })
    // }
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
  onShareAppMessage: function (res) {
    var str = this.data.information.image
    var start = str.lastIndexOf("/") + 1
    var end = str.indexOf("htm") - 1
    var xx = str.substring(start, end)
    console.log(xx)
    return {
      title: '云脉名片',
      path: 'pages/index/index?type=' + 1 +'&xx=' + xx,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})