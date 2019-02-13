// pages/topUp/topUp.js
const app = getApp()
var util = require('../../utils/util.js')
var D = require('../../utils/D.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    list: [],
    index:'',
    name:'',
    avatar:'',
    money:'',
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options)
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      name: app.name,
      avatar: app.avatar,
      money: app.money,
      flag: options.flag
    })
    wx.request({
      url: app.url + '/recharge/page.htm',
      data: {
        userToken: app.userToken,
        type: 'recharge'
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          list:res.data.list,
          index: 0,
          id: res.data.list[0].id
        })
        wx.hideLoading()
      }
    })
  },
  shareList:function(){
    wx.navigateTo({
      url: '../../pages/shareList/shareList'
    })
  },
  shareDetails:function(){
    wx.navigateTo({
      url: '../../pages/shareDetails/shareDetails'
    })
  },
  money:function(e){
    console.log(e)
    this.setData({
      id: e.currentTarget.id,
      index: e.currentTarget.dataset.index
    })
  },
  choose: function (e) {
    console.log(e.currentTarget.id)
    this.setData({
      id: e.currentTarget.id
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  card: function (e) {
    var that = this
    console.log(that.data.list[0].id, that.data.id)
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.url + '/recharge/recharge.htm',
          data: {
            id: that.data.id,
            userToken: app.userToken,
            payType: 'wxapp'
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
  onShareAppMessage: function (res) {
    wx.hideShareMenu()
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
      return {
        title:'荷尔盟，分泌快乐！',
        path:'pages/login/login?id='+app.id+'&name='+app.name,
        imageUrl:'../../img/screenshot.png'
      }
    }
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
          if(that.data.flag){
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
              moneyToggle: res.data.money
            })
            app.money = res.data.money
          }else{
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
              money: res.data.money
            })
            app.money = res.data.money
          }
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