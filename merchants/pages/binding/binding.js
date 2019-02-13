// pages/binding/binding.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '34.343147',
    longitude: '108.939621',
    list:[],
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.hideShareMenu()
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '加载中',
        })
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        wx.request({
          url: app.url + '/hormone/rest/business/nearby.htm',
          data: {
            userToken: app.userToken,
            lng: res.longitude,
            lat: res.latitude
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            that.setData({
              list:res.data.list
            })
            wx.hideLoading()
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
  obtain:function(e){
    console.log(e.currentTarget.id)
    this.setData({
      id: e.currentTarget.id
    })
    
  },
  sumbit:function(){
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.url + '/hormone/rest/business/bind.htm',
      data: {
        userToken: app.userToken,
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        if (res.data.code==0){
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1000,
            success:function(){
              wx.reLaunch({
                url: '../../pages/login/login'
              })
            }
          })
        }else{
          wx.showToast({
            title: '绑定失败',
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '绑定失败',
          icon: 'success',
          duration: 1000
        })
      }
    })
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