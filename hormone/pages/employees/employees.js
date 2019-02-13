// pages/employees/employees.js
const app = getApp()
var util = require('../../utils/util.js')
var D = require('../../utils/D.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: '',
    date: {},
    name: "",
    avatar: "",
    phone:'',
    no:''
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
          url: app.url + '/recharge/checkstaff.htm',
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
              date: res.data,
              name: res.data.name,
              phone: res.data.phone,
              no: res.data.no
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  name: function (e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  phone: function(e){
    console.log(e)
    this.setData({
      phone: e.detail.value
    })
  },
  no: function(e){
    console.log(e)
    this.setData({
      no: e.detail.value
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  card: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true, 
      success: function () {
        wx.request({
          url: app.url + '/recharge/rechargeforstaff.htm',
          data: {
            id: that.data.date.card,
            userToken: app.userToken,
            payType: 'wxapp',
            name: that.data.name,
            phone: that.data.phone,
            no: that.data.no            
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            pay(that, res.data.pay)
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
function pay(that, payinfo) {
  console.log(payinfo);
  wx.requestPayment({
    timeStamp: payinfo.timestamp,
    nonceStr: payinfo.noncestr,
    package: payinfo.packageInfo,
    signType: payinfo.signType,
    paySign: payinfo.sign,
    success: function (r) {
      console.log(r)
      wx.request({
        url: app.url + '/member/info.htm',
        data: {
          userToken: app.userToken
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            money: res.data.money
          })
          app.money = res.data.money
          app.paymentType = 1
        }
      })
      wx.showModal({
        title: '提示',
        content: '支付成功',
        showCancel: false,
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    },
    fail: function (r) {
      wx.showModal({
        title: '提示',
        content: '支付失败',
        showCancel: false,
        success: function (res) {
        }
      })
    }
  })
}