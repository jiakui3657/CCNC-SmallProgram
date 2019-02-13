//index.js
//获取应用实例
const app = getApp()
var request = require('../../../utils/request.js')
var comment = require('../../../utils/public.js')

Page({
  data: {
    array: [
      {
        event: 'wallet',
        icon: '../../images/wallet.png',
        text: '我的钱包'
      },
      {
        event: 'record',
        icon: '../../images/weMoney.png',
        text: '红包记录'
      },
      {
        event: 'order',
        icon: '../../images/order.png',
        text: '我的订单'
      },
      {
        event: 'trip',
        icon: '../../images/trip.png',
        text: '行程交易'
      },
      {
        event: 'vouchers',
        icon: '../../images/vouchers.png',
        text: '消费券'
      }
    ],
    personal: {
      state: null,
      avatar: null,
      name: null,
      companyName: null,
      catalog: null,
      job: null
    },
    modal: false
  },
  onLoad: function(options) {
    var that = this

    // 初始化加载动画
    comment.loading(true)

    // 初始化个人信息
    that.setData({
      personal: {
        state: app.state,
        avatar: app.avatar,
        name: app.name,
        companyName: app.companyName,
        catalog: app.catalog,
        job: app.job
      }
    })


  },
  // 修改图片
  chooseimage: function(e) {
    var that = this

    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {
        console.log(res)

        // 初始化加载动画
        comment.loading(true)
        that.setData({
          modal: false
        })

        if (res.errMsg == "chooseImage:ok") {
          wx.uploadFile({
            url: app.apiUrl + '/file/upload.htm',
            filePath: res.tempFilePaths[0],
            name: 'file',
            success: function(res) {
              console.log(JSON.parse(res.data));
              if (JSON.parse(res.data).code == 0) {
                wx.request({
                  url: app.apiUrl + '/rest/member/updateavatar.htm',
                  data: {
                    commerce: app.commerce,
                    userToken: app.userToken,
                    avatar: JSON.parse(res.data).url
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function(res) {
                    console.log(res)

                    // 初始化加载动画
                    comment.loading(false)

                    if (res.data.code == 0) {
                      // 修改成功
                      wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 1000
                      })

                      that.setData({
                        personal: {
                          state: res.data.owner,
                          avatar: res.data.avatar,
                          name: res.data.name,
                          companyName: res.data.companyName,
                          catalog: res.data.catalog,
                          job: res.data.job
                        }
                      })
                      app.avatar = res.data.avatar
                      app.dynamic = 1
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
  open: function() {
    this.setData({
      modal: !this.data.modal
    })
  },
  wx: function() {
    var that = this

    // 初始化加载动画
    comment.loading(true)
    that.setData({
      modal: false
    })

    wx.getUserInfo({
      success: function(res) {
        console.log(res.userInfo)
        wx.request({
          url: app.apiUrl + '/rest/member/updateavatar.htm',
          data: {
            commerce: app.commerce,
            userToken: app.userToken,
            avatar: res.userInfo.avatarUrl
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res)

            // 初始化加载动画
            comment.loading(false)

            if (res.data.code == 0) {

              // 修改成功
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })

              that.setData({
                personal: {
                  state: res.data.owner,
                  avatar: res.data.avatar,
                  name: res.data.name,
                  companyName: res.data.companyName,
                  catalog: res.data.catalog,
                  job: res.data.job
                }
              })
              app.avatar = res.data.avatar
              app.dynamic = 1
            } else {

              // 修改失败
              wx.showToast({
                title: '修改失败',
                icon: 'success',
                duration: 1000
              })

            }

            // wx.redirectTo({
            //   url: '../../login/login'
            // })
          }
        })
      }
    })
  },
  // 添加会员
  add: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../we/addRecord/addRecord'
      })
    } else if (app.catalog == 2) {
      wx.showToast({
        title: '正在审核中',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../request/request'
      })
    }
  },

  // 我的钱包
  wallet: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../we/wallet/wallet'
      })
    } else if (app.catalog == 2) {
      wx.showToast({
        title: '正在审核中',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../request/request'
      })
    }
  },

  // 行程交易
  trip: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../we/trip/trip'
      })
    } else if (app.catalog == 2) {
      wx.showToast({
        title: '正在审核中',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../request/request'
      })
    }

  },

  // 红包记录
  record: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../we/record/record'
      })
    } else if (app.catalog == 2) {
      wx.showToast({
        title: '正在审核中',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../request/request'
      })
    }

  },

  // 消费券
  vouchers: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../we/vouchers/vouchers'
      })
    } else if (app.catalog == 2) {
      wx.showToast({
        title: '正在审核中',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../request/request'
      })
    }
  },

  // 入会申请
  request: function() {
    wx.navigateTo({
      url: '../../request/request'
    })
  },

  // 激活会员
  getPhoneNumber: function(e) {
    var that = this
    console.log(e)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function(res) {
          console.log('no');
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function(res) {
          wx.request({
            url: app.apiUrl + '/rest/member/activate.htm',
            data: {
              commerce: app.commerce,
              userToken: app.userToken,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(resback) {
              console.log(resback)
              if (resback.data.code == 0) {
                wx.reLaunch({
                  url: '../../login/login'
                })
              } else {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: resback.data.msg,
                  success: function(res) {

                  }
                })
              }
            },
            fail: function() {
              // fail
            },

            complete: function() {
              // complete

            }
          })
        }
      })
    }
  },
  order: function() {
    wx.navigateTo({
      url: '../../we/orders/orders',
    })
  },

  // 入会信息
  time: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../we/time/time'
      })
    } else if (app.catalog == 2) {
      wx.showToast({
        title: '正在审核中',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../request/request'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onReady: function() {
    comment.loading(false)
  }
})