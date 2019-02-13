// pages/activation/activation.js
const app = getApp()
var amapFile = require('../../libs/amap-wx.js')
var config = require('../../libs/config.js');
var timer
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'',
    flag:false,
    state:false,
    list:[],
    name:'',
    time:9,
    vipTimeEnd:''
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options)
    var that=this
    that.setData({
      longitude: options.longitude,
      latitude: options.latitude,
      name:app.name,
      avatar: app.avatar,
      vipTimeEnd: app.vipTimeEnd
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.url + '/venue/page.htm',
          data: {
            lng: options.longitude,
            lat: options.latitude,
            userToken: app.userToken
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            that.setData({
              list: res.data.list
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  moveToLocation:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  about:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  map:function(e){
    console.log(e)
    wx.openLocation({
      latitude: e.currentTarget.dataset.lat,
      longitude: e.currentTarget.dataset.lng,
      name: e.currentTarget.dataset.name
    })
  },
  store: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../pages/storeDetails/storeDetails?name=' + e.currentTarget.dataset.name + '&id=' + e.currentTarget.dataset.id + '&latitude=' + e.currentTarget.dataset.lat + '&longitude=' + e.currentTarget.dataset.lng
    })
  },
  onPageScroll: function () {
    console.log(111)
  },
  card: function () {
    var that=this
    if (app.catalog!=1){
      if (that.data.flag) {
        console.log(111)
        clearTimeout(timer);
        that.setData({
          flag: !that.data.flag,
          state: !that.data.state,
          time: 9
        })
      } else {
        console.log(222)
        wx.request({
          url: app.url + '/member/pay.htm',
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
              src: res.data.url
            })
            that.setData({
              flag: !that.data.flag,
              state: !that.data.state
            })
            if (that.data.src!=''){
              code(that)
            }
          }
        })
      }
    }else{
      wx.navigateTo({
        url: '../../pages/vip/vip?longitude=' + this.data.longitude + '&latitude=' + this.data.latitude
      })
    }
    
  },
  vip: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  phone: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wx.request({
          url: app.url + '/venue/phone.htm',
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
            wx.makePhoneCall({
              phoneNumber: res.data.phone
            })
          }
        })
      }
    })
  },
  we: function () {
    wx.navigateTo({
      url: '../../pages/personal/personal'
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
function code(that) {
  timer = setTimeout(function () {
    if(that.data.time!=0){
      that.setData({
        time:that.data.time-1
      })
      code(that)      
    }else{
      wx.request({
        url: app.url + '/member/pay.htm',
        data: {
          userToken: app.userToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          code(that)
          that.setData({
            src: res.data.url,
            time: 9
          })
        }
      })
    }
  }, 1000);
}