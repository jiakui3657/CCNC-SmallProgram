// pages/order/order.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no:1,
    size:10,
    list: [],
    totalPage: ''
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
          url: app.url + '/order/page.htm',
          data: {
            userToken: app.userToken,
            no: that.data.no,
            size: that.data.size
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              list: res.data.list,
              totalPage: res.data.totalPage
            })
            wx.hideLoading()
          }
        })
      }
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
    var that = this
    wx.request({
      url: app.url + '/order/page.htm',
      data: {
        no: 1,
        size: that.data.no * that.data.size,
        userToken: app.userToken
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
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

    if (no <= that.data.totalPage) {

      // 请求后台，获取下一页的数据。
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          wx.request({
            url: app.url + '/order/page.htm',
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