// pages/we/storeDetails/storeDetails.js
const app = getApp()

Page({
  data: {
    flag: false,
    data: {},
    longstate: null,
    latstate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name
    })
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.hormoneUrl + '/venue/findbyid.htm',
          data: {
            id: options.id,
            userToken: app.hormoneUserToken,
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              data: res.data,
              longstate: options.longitude,
              latstate: options.latitude
            })
            wx.hideLoading()
          }
        })
      }
    })
  },

  securities: function () {
    wx.makePhoneCall({
      phoneNumber: data.phone
    })
  },
  map: function () {
    // wx.navigateTo({
    //   url: '../../pages/map/map?longstate=' + this.data.longstate + '&latstate=' + this.data.latstate + '&longend=' + this.data.data.lng + '&latend=' + this.data.data.lat
    // })
    wx.openLocation({
      latitude: this.data.data.lat,
      longitude: this.data.data.lng,
      name: this.data.data.name,
      scale: 28
    })
  }
})