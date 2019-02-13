// pages/we/activation/activation.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    text: ''
  },
  getPhoneNumber: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.hormoneUrl + '/member/activate_phone.htm',
          data: {
            userToken: app.hormoneUserToken,
            no: that.data.text,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            if (res.data.code == 0) {
              wx.showModal({
                title: '提示',
                content: '激活成功',
                showCancel: false,
                success: function (res) {
                  wx.reLaunch({
                    url: '../../../pages/login/login'
                  })
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: '激活失败',
                showCancel: false,
                success: function (res) {

                }
              })
            }
          },
          fail: function (r) {
            wx.showModal({
              title: '提示',
              content: '激活失败',
              showCancel: false,
              success: function (res) {

              }
            })
          }
        })
      }
    })
  },
  content: function (e) {
    this.setData({
      text: e.detail.value
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