// pages/vip/vip.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    text: ''
  },
  ability: function () {
    wx.navigateTo({
      url: '../../../pages/we/ability/ability'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id != 1) {
      wx.setNavigationBarTitle({
        title: '升级会员'
      })
      this.setData({
        text: '购买升级'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '荷尔蒙会员'
      })
      this.setData({
        text: '联系客服购买'
      })
    }
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.hormoneUrl + '/vipcard/list.htm',
          data: {
            userToken: app.hormoneUserToken
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
            console.log(that.data.list)
            wx.hideLoading()
          }
        })
      }
    })
  },
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: app.hormonePhone
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