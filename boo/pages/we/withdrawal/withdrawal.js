// pages/we/withdrawal/withdrawal.js
const app = getApp();
var request = require('../../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:[],
    flag:null,
    money: wx.getStorageSync('money'),
    rate:null,
    minmoney:null
  },
  // 选择银行卡
  toggin:function(e){
    this.setData({
      flag:e.currentTarget.id
    })
  },
  // 添加银行卡
  jump:function(){
    wx.navigateTo({
      url: '../../we/addankcard/addankcard'
    })
  },
  // 提现金额
  digital: function (e) {
    this.setData({
      digital: e.detail.value
    })
  },
  // 提现
  submit:function(){
    var that = this
    if (parseFloat(that.data.digital) >= parseFloat(that.data.minmoney)){
      wx.request({
        url: app.apiUrl + '/rest/cash/addcash.htm',
        data: {
          commerce: app.commerce,
          userToken: app.userToken,
          bankId: that.data.flag,
          money: that.data.digital
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {

            app.change = res.data.money

            wx.showModal({
              title: '提示',
              content: '三个工作日到账，请注意查收',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        },
        fail: function () {
          console.log(111)
          wx.showModal({
            title: '提示',
            content: '请求失败',
            showCancel: false
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '最小金额：' + that.data.minmoney +'元',
        showCancel: false,
        success: function (res) {
          
        }
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that=this
    request.loading(true)
    wx.request({
      url: app.apiUrl + '/rest/bankcard/page.htm',
      data: {
        commerce: app.commerce,
        userToken: app.userToken,
        no: 1,
        size: 100
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        if (res.data.list.length == 0){
          that.setData({
            arr: res.data.list,
            money: app.change,
            rate: option.rate * 100,
            minmoney: option.minmoney
          })
        }else{
          that.setData({
            flag: res.data.list[0].id,
            arr: res.data.list,
            money: app.change,
            rate: option.rate * 100,
            minmoney: option.minmoney
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    request.loading(false)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (option) {
    var that=this
    if (app.dynamic==1){
      wx.request({
        url: app.apiUrl + '/rest/bankcard/page.htm',
        data: {
          commerce: app.commerce,
          userToken: app.userToken,
          no: 1,
          size: 100
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res);
          that.setData({
            flag: res.data.list[0].id,
            arr: res.data.list,
            money: app.change
          })
        }
      })
    }
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
  // onShareAppMessage: function () {
  
  // }
})