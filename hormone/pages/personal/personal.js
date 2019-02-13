// pages/personal/personal.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        src: '../../img/order.png',
        text: '我的订单',
        event: 'order'
      },
      {
        src:'../../img/trip.png',
        text:'我的行程',
        event:'trip'
      },
      {
        src: '../../img/vouchers.png',
        text: '消费券',
        event: 'vouchers'
      },
      {
        src: '../../img/message.png',
        text: '消息中心',
        event: 'message'
      }
    ],
    name:'',
    companyName:'',
    job:'',
    avatar:"",
    modal:false,
    money: '',
    economize: ''
  },
  order:function(){
    wx.navigateTo({
      url: '../../pages/order/order'
    })
  },
  trip:function(){
    wx.navigateTo({
      url: '../../pages/trip/trip'
    })
  },
  vouchers:function(){
    wx.navigateTo({
      url: '../../pages/vouchers/vouchers'
    })
  },
  balance:function(){
    wx.navigateTo({
      url: '../../pages/balance/balance'
    })
  },
  message:function(){
    wx.navigateTo({
      url: '../../pages/message/message'
    })
  },
  topUp:function(){
    wx.navigateTo({
      url: '../../pages/topUp/topUp'
    })
  },
  employees:function(){
    wx.request({
      url: app.url + '/recharge/checkstaff.htm',
      data: {
        userToken: app.userToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.catalog == 0) {
          wx.navigateTo({
            url: '../../pages/employees/employees'
          })
        } else {
          wx.navigateTo({
            url: '../../pages/topUp/topUp'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      name: app.name,
      companyName: app.companyName,
      job: app.job,
      avatar: app.avatar,
      money: app.money,
      economize: app.economize
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  open: function () {
    this.setData({
      modal: !this.data.modal
    })
  },
  wx: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      modal: false
    })
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo)
        wx.request({
          url: app.url+'/member/updateavatar.htm',
          data: {
            avatar: res.userInfo.avatarUrl,
            userToken: app.userToken
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                that.setData({
                  avatar: res.data.avatar
                })
                app.avatar = res.data.avatar
              }
            })
            console.log(res.data.avatar)
          }
        })
      }
    })
  },
  // 修改图片
  chooseimage: function (e) {
    var that = this
    wx.chooseImage({
      count: 1,  
      sizeType: ['original', 'compressed'],  
      sourceType: ['album', 'camera'], 
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '加载中',
        })
        that.setData({
          modal: false
        })
        if (res.errMsg == "chooseImage:ok") {
          wx.uploadFile({
            url: app.url1 + '/file/upload.htm',
            filePath: res.tempFilePaths[0],
            name: 'file',
            success: function (res) {
              console.log('1111')              
              console.log(res)
              if (JSON.parse(res.data).code == 0) {
                wx.request({
                  url: app.url + '/member/updateavatar.htm',
                  data: {
                    userToken: app.userToken,
                    avatar: JSON.parse(res.data).url
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.data.code == 0) {
                      // 修改成功
                      
                      wx.hideLoading()
                      wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 1000,
                        success:function(){
                          that.setData({
                            avatar: res.data.avatar
                          })
                          app.avatar = res.data.avatar
                        }
                      })
                      
                    } else {
                      // 修改失败
                      wx.showToast({
                        title: '修改失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
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