// pages/vip/vip.js
const app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    card:'',
    list:[],
    name:"",
    avatar:"",
    flag: true,
    uid:'',
    shareName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options)    
    var that=this
    that.setData({
      shareName: options.name
    })
    if (options.id == "undefined") {

    } else if (options.id) {
      that.setData({
        flag: false,
        uid: options.id
      })
    }
    console.log(this.data.flag)
    wx.getLocation({
      type:'wgs84',
      success:function(res){
        console.log(res)
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            wx.request({
              url: app.url + '/vipcard/card.htm',
              data: {
                lng: res.longitude,
                lat: res.latitude,
                userToken: app.userToken
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                console.log(res)
                if(res.data.code==0){
                  that.setData({
                    card: res.data,
                    list: res.data.list,
                    name: app.name,
                    avatar: app.avatar,
                    id: res.data.list[0].id
                  })
                  wx.hideLoading()
                }else{
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    showCancel:false,
                    success: function (res) {
                      wx.navigateBack({
                        delta: 1
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  choose:function(e){
    console.log(e.currentTarget.id)
    this.setData({
      id: e.currentTarget.id
    })
  },
  getPhoneNumber:function(e){
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  card:function(e){
    var that=this
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            console.log(that.data.flag)
            if(that.data.flag){
              wx.request({
                url: app.url + '/vipcard/order.htm',
                data: {
                  id: e.currentTarget.id,
                  userToken: app.userToken,
                  payType: 'wxapp',
                  avatar: res.userInfo.avatarUrl,
                  name: res.userInfo.nickName,
                  card: that.data.id
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function (res) {
                  console.log(res)
                  pay(that, res.data.pay)
                  wx.hideLoading()
                }
              })
            }else{
              wx.request({
                url: app.url + '/vipcard/ordershare.htm',
                data: {
                  id: e.currentTarget.id,
                  userToken: app.userToken,
                  payType: 'wxapp',
                  avatar: res.userInfo.avatarUrl,
                  name: res.userInfo.nickName,
                  share: that.data.uid
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function (res) {
                  console.log(res)
                  wx.hideLoading()
                  if(res.data.code==0){
                    pay(that, res.data.pay)
                  }else{
                    wx.showModal({
                      title: '提示',
                      content: res.data.msg,
                      showCancel:false
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
    // console.log(e)
    
    
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
      wx.showModal({
        title: '提示',
        content: '支付成功',
        showCancel: false,
        success: function (res) {
          wx.reLaunch({
            url: '../login/login'
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