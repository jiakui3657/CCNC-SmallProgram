// pages/login/login.js
const app = getApp()

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
    wx.login({
      success: function (res) {
        console.log(res)
        wx.request({
          url: app.url + '/hormone/rest/business/login.htm',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            app.userToken = res.data.userToken
            app.code = res.data.qrcode
            app.logo = res.data.logo
            setTimeout(function () {
              if (res.data.code == 1) {
                wx.reLaunch({
                  url: '../../pages/binding/binding'
                })
              } else {
                wx.reLaunch({
                  url: '../../pages/index/index?name=' + res.data.name + '&checkins=' + res.data.checkins + '&nums=' + res.data.nums
                })
              }
            }, 1000)
            
          }
        })
      }
    });
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