// pages/index/activityDetails/activityDetails.js
const app = getApp()
var request = require('../../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    comments: {
      list: [],
      total: null

    },
    praise: {
      list: [],
      total: null
    },
    wallet: {
      list: null
    },
    flag: 0,
    id: null,
    switch: false,
    activity: '',
    liked: null,
    money: null,
    moneyId: null,
    code: null,
    opend: null,
    click: null,
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this
    // 是否点红包
    if (options.index == 0) {
      that.setData({
        flag: 0
      })
    }
    // 是否点击评论
    if (options.index == 1) {
      that.setData({
        flag: options.index,
        switch: true
      })
    } else if (options.index == 2){
      that.setData({
        flag: options.index
      })
    }else{
      that.setData({
        flag: 0
      })
    }
    
    // 是否点赞
    // if (options.index == 2) {
      
    // }
    // 加载动画
    request.loading(true)
    // 清除本地存储
    wx.removeStorage({
      key: 'key',
      success: function(res) {
        console.log(res.data)
      }
    })
    // 个人动态详情
    wx.request({
      url: app.apiUrl + '/rest/feed/findById.htm',
      data: {
        id: options.id,
        commerce: 1,
        userToken: app.userToken
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res);
        // if (options.index == 0) {
        //   that.setData({
        //     flag: 0
        //   })
        // } else if (res.data.haveRedPacket == 0) {
        //   that.setData({
        //     flag: 1
        //   })
        // }
        if (options.index != 0 && options.index != 1 && options.index != 2 &&res.data.haveRedPacket == 0){
          that.setData({
            flag: 1
          })
        }
        if (options.index != 0 && options.index != 1 && options.index != 2 && res.data.haveRedPacket == 1) {
          that.setData({
            flag: 0
          })
        }
        that.setData({
          list: res.data,
          id: options.id,
          liked: res.data.liked,
          moneyId: options.moneyId,
          opend: res.data.opend
        })
      }
    })
    // 评论列表
    request.comments('/rest/feed/comments.htm', options.id, that, 1, 100)
    // 点赞列表
    request.good('/rest/feed/likes.htm', options.id, that, 1, 100)
    // 报名列表
    wx.request({
      url: app.apiUrl + '/rest/feed/opens.htm',
      data: {
        commerce: 1,
        userToken: app.userToken,
        id: options.id,
        no: 1,
        size: 100
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res);
        that.setData({
          wallet: {
            data: res.data
          }
        })
      }
    })
  },
  // 分享
  onShareAppMessage: function(ops) {
    if (app.catalog == 0) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops)
      } else {
        return {
          title: '陕西园林商会',
          path: 'pages/login/login?type=1&active=' + 1 + '&id=' + this.data.id,
          success: function(res) {
            // 转发成功
            console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    } else {
      return {
        title: '陕西园林商会',
        path: 'pages/login/login?type=0',
        success: function(res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function(res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  },
  // 关闭评论
  cancel: function() {
    this.setData({
      switch: false
    })
  },
  // 点赞
  addPraise: function(e) {
    this.setData({
      flag: 2
    })
    if (e.currentTarget.dataset.isactive) {
      wx.showToast({
        title: '已点赞',
        icon: 'success',
        duration: 500
      })
    } else {
      var that = this
      app.dynamic = 1
      that.setData({
        liked: !that.data.liked,
        click: true,
        flag: 2
      })
      wx.request({
        url: app.apiUrl + '/rest/feed/like.htm',
        data: {
          id: that.data.id,
          commerce: 1,
          userToken: app.userToken
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          console.log(res);
          if (res.data.code == 0) {
            request.good('/rest/feed/likes.htm', that.data.id, that, 1, 100)
          }
          if (res.data.id != -1) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 500
            })
          }
        }
      })
    }
  },
  // 显示评论
  comment: function() {
    var that = this;
    that.setData({
      switch: true,
      flag: 1,
      disabled: true
    })
  },
  // 跳转通讯录详情
  details: function(e) {
    wx.navigateTo({
      url: '../../address/details/details?iid=' + e.currentTarget.dataset.iid + '&&name=' + e.currentTarget.dataset.name
    })
  },
  // 评论内容
  text: function(e) {
    this.setData({
      activity: e.detail.value
    })
    if (this.data.activity != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  // 发送评论
  send: function() {
    var that = this;
    if (that.data.activity != undefined) {
      app.dynamic = 1
      wx.request({
        url: app.apiUrl + '/rest/feed/comment.htm',
        data: {
          commerce: 1,
          userToken: app.userToken,
          id: that.data.id,
          note: that.data.activity,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          console.log(res);
          if (res.data.code == 0) {
            that.setData({
              switch: false
            })
            request.comments('/rest/feed/comments.htm', that.data.id, that, 1, 100)
          } else {

          }
        },
        fail: function() {
          // fail
        },

        complete: function() {
          // complete
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      })
    }

  },
  // 切换红包
  tab1: function() {
    this.setData({
      flag: 0
    })
  },
  // 切换评论
  tab2: function() {
    this.setData({
      flag: 1
    })
  },
  // 切换点赞
  tab3: function() {
    this.setData({
      flag: 2
    })
  },
  // 查看照片
  preview: function(e) {
    console.log(e);
    var imgs = e.currentTarget.dataset.list;
    var img = [];
    for (var i = 0; i < imgs.length; i++) {
      img.push(imgs[i].url)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: img
    })
  },
  // 抢红包
  signUp: function() {
    var that = this
    that.setData({
      flag: 0
    })
    wx.request({
      url: app.apiUrl + '/rest/redpacket/open.htm',
      data: {
        commerce: 1,
        userToken: app.userToken,
        id: that.data.moneyId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res);
        if (res.data.code == 0) {
          wx.request({
            url: app.apiUrl + '/rest/feed/opens.htm',
            data: {
              commerce: 1,
              userToken: app.userToken,
              id: that.data.id
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              console.log(res);
              that.setData({
                wallet: {
                  data: res.data
                }
              })
            }
          })
          wx.request({
            url: app.apiUrl + '/rest/feed/findById.htm',
            data: {
              id: that.data.id,
              commerce: 1,
              userToken: app.userToken
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function(res) {
              console.log(res);
              that.setData({
                list: res.data,
                liked: res.data.liked,
                opend: res.data.opend
              })
            }
          })
        } else {
          wx.showToast({
            title: '已抢过红包',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },
  // 地图定位
  open: function(e) {
    wx.openLocation({
      latitude: e.currentTarget.dataset.latitude,
      longitude: e.currentTarget.dataset.longitude,
      scale: 14
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    request.loading(false)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})