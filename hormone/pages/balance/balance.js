// pages/balance/balance.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    no:1,
    size:10,
    totalPage:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.url + '/member/running.htm',
          data: {
            userToken: app.userToken
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              list: res.data.list
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function () {
  },
  gorecharge: function () {
    wx.navigateTo({
      url: '../../pages/topUp/topUp',
    })
  }
})