// pages/we/wallet/wallet.js
const app = getApp();
var request = require('../../../utils/request.js')
var comment = require('../../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    no:1,
    size:10,
    money:null,
    rate:null,
    minmoney:null
  },
  // 跳转提现
  withdrawal:function(){

    // 更新余额
    app.change=this.data.money


    wx.navigateTo({
      url: '../../we/withdrawal/withdrawal?rate=' + this.data.rate + '&minmoney=' + this.data.minmoney
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 更新余额
    this.setData({
      money: app.change
    })

    // 加载动画
    request.loading(true)

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
  onShow: function () {
    var that = this;

    // 资金流水列表
    request.firstLoading(that, '/rest/cash/page.htm', 1, that.data.no * that.data.size)
    
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
    var that = this

    // 当前页+1
    var no = that.data.no + 1;

    that.setData({
      no: no
    })

    if (no <= that.data.size) {
      comment.loading(true)

      // 请求后台，获取下一页的数据。
      request.more(that, '/rest/cash/page.htm', that.data.no, that.data.size)
      
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // }
})