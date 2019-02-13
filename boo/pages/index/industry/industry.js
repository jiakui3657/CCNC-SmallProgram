// pages/offer/offer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paylist: [{
      name: "货到付款30%+一年内结算70%"
    },
    {
      name: "货到付款30%+一年内结算70%"
    },
    {
      name: "货到付款30%+一年内结算70%"
    },
    {
      name: "货到付款30%+一年内结算70%"
    }, {
      name: "货到付款30%+一年内结算70%"
    }],
    payl: "plist",
    pays: "pay",
    cl: "",
    time: [{
      t: "一周"
    }, {
      t: "二周"
    }, {
      t: "三周"
    }, {
      t: "四周"
    }],
    time2: [{
      t: "一月内"
    }, {
      t: "三月内"
    }, {
      t: "半年内"
    }, {
      t: "一年内"
    }],
    tview: "tview",
    tview2: "tview"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  pay: function (e) {
    this.setData({
      payl: "plist2",
      pays: "pay2"
    })
  },
  pay2: function (e) {
    this.setData({
      payl: "plist",
      pays: "pay"
    })
  },
  pd: function (e) {
    var id = e.currentTarget.id;
    console.log(id)
    this.setData({
      key: id
    })
  },
  tt: function (e) {
    var i = e.currentTarget.id;
    console.log(i)
    this.setData({
      val: i,
      tview: "tview2"
    })
  },
  ts: function (e) {
    var j = e.currentTarget.id;
    console.log(j)
    this.setData({
      v: j,
      tview2: "tview2"
    })
  },
  industry:function(){
    wx.redirectTo({
      url: '../../index/industry/industry'
    })
  },
  results:function(){
    wx.redirectTo({
      url: '../../index/results/results'
    })
  },
  contract:function(){
    wx.redirectTo({
      url: '../../index/contract/contract'
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
  // onShareAppMessage: function () {

  // }
})