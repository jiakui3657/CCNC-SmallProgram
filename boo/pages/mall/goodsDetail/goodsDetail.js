// pages/mall/goodsDetail/goodsDetail.js
var app = getApp();
var request = require('../../../utils/request.js')
var comment = require('../../../utils/public.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [{
      id: 1,
      src: "/pages/images/chaye6.jpg"
    },
    {
      id: 2,
      src: "/pages/images/chaye5.jpg"
    },
    {
      id: 3,
      src: "/pages/images/chaye3.jpg"
    }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var url = options.url
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      url: app.supplyUrl + url
    })
    var time = setTimeout(function () {
      clearTimeout(time)
      wx.hideLoading()
    }, 1800)
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