// pages/trip/trip.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: 1,
    size: 10,
    list: [],
    totalSize:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.url + '/venue_checkin/page.htm',
      data: {
        no: that.data.no,
        size: that.data.size,
        userToken: app.userToken
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          list: res.data.list,
          totalSize: res.data.totalPage
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    wx.request({
      url: app.url + '/venue_checkin/page.htm',
      data: {
        no: 1,
        size: that.data.no * that.data.size,
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
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(111)
    var that = this

    // 当前页+1
    var no = that.data.no + 1;

    that.setData({
      no: no
    })

    if (no <= that.data.totalSize) {

      // 请求后台，获取下一页的数据。
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          wx.request({
            url: app.url + '/venue_checkin/page.htm',
            data: {
              no: that.data.no,
              size: that.data.size,
              userToken: app.userToken
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              that.setData({
                list: that.data.list.concat(res.data.list)
              })
              wx.hideLoading()
            }
          })
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})