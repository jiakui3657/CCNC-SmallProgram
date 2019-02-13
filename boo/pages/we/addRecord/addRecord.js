// pages/we/addRecord/addRecord.js
const app = getApp()
var request = require('../../../utils/request.js')
var comment = require('../../../utils/public.js')

Page({
  data: {
    list:[],
    start:null,
    end:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  // 跳转添加会员
  add: function () {
    wx.navigateTo({
      url: '../../we/addMembers/addMembers'
    })
  },
  cancel:function(){
    wx.showModal({
      title: '提示',
      content: '添加人数已到上限',
      showCancel:false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } 
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
    var that = this

    // 加载动画
    comment.loading(true)

    // 添加人员信息
    request.advertising(that, '/rest/commerceapply/page.htm')
    
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