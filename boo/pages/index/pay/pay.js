// pages/index/pay/pay.js
const app = getApp()
var comment = require('../../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{},
    only: 0,
    flag: 0,
    payType:'cash',
    disabled:false,
    state:null,
    pay: [
      {
        src: '../../images/change.png',
        name: '余额',
        money: '998'
      },
      {
        src: '../../images/WeChat.png',
        name: '微信',
        money: ''
      }
    ],
    number: [
      {
        amount: '10元'
      },
      {
        amount: '50元'
      },
      {
        amount: "100元"
      },
      {
        amount: '100元'
      },
      {
        amount: '150元'
      },
      {
        amount: '200元'
      }
    ],
  },
  // moneys: function (e) {
  //   this.setData({
  //     only: e.currentTarget.id
  //   })
  // },
  // 支付方式
  select: function (e) {
    console.log(e.currentTarget.id)
    if (e.currentTarget.id==0){
      this.setData({
        flag: e.currentTarget.id,
        payType:'cash'
      })
    }else{
      this.setData({
        flag: e.currentTarget.id,
        payType: 'wxapp'
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: options,
      state: options.money,
      pay: [
        {
          src: '../../images/change.png',
          name: '余额',
          money: app.change
        },
        {
          src: '../../images/WeChat.png',
          name: '微信',
          money: ''
        }
      ]
    })
  },
  // 活动报名
  submit:function(){
    var that=this
    that.setData({
      disabled:true
    })
    if(that.data.state=='0'){
      wx.request({
        url: app.apiUrl + '/rest/activity/attend.htm',
        data: {
          id: that.data.list.id,
          commerce: 1,
          userToken: app.userToken
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res)
          if(res.data.code==0){
            wx.showModal({
              title: '提示',
              content: '报名成功',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack()
                } 
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    disabled: false
                  })
                }
              }
            })
          }
        }
      })
    }else{
      wx.request({
        url: app.apiUrl + '/rest/activity/attend.htm',
        data: {
          id: that.data.list.id,
          commerce: 1,
          userToken: app.userToken,
          money: parseFloat(that.data.list.money),
          payType: that.data.payType
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (that.data.payType == 'cash') {
            if (res.data.code == 0) {
              wx.showModal({
                title: '提示',
                content: '报名成功',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack()
                  }
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    that.setData({
                      disabled: false
                    })
                  }
                }
              })
            }
          } else {
            comment.pay(that,res.data.pay)
          }
        }
      })
    }
   
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
