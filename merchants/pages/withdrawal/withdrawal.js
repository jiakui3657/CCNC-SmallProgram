// pages/withdrawal/withdrawal.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    res:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/cashinfo.htm',
      data: {
        userToken: app.userToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          res:res.data
        })
        wx.hideLoading()
      }
    })
  },
  money:function(e){
    console.log(e)
    this.setData({
      money: e.detail.value
    })
  },
  withdrawal:function(){
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/addcash.htm',
      data: {
        userToken: app.userToken,
        money:that.data.money
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
            success(res) {
              wx.navigateBack({
                delta: 2
              })
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
            success(res) {
            }
          })
        }

      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '提现失败',
          success(res) {

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