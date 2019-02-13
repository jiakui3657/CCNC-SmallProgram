//logs.js
const app = getApp()
var comment = require('../../../utils/public.js')
var request = require('../../../utils/request.js')

Page({
  data: {
    list: [],
    no: 1,
    size: 10,
    totalSize: null,
    address:null,
    member:null
  },

  // 发布心情
  moodTo:function(){
    wx.navigateTo({
      url: '../mood/mood'
    })
  },

  // 发布活动
  activityTo:function(){
    wx.navigateTo({
      url: '../activity/activity'
    })
  },

  /**
   * 圈子初始化事件的处理函数
   */
  onLoad: function (options) {
    var that = this

    // 页面初始化动画
    comment.loading(true)

    wx.request({
      url: app.apiUrl +'/rest/feed/my.htm',
      data: {
        commerce: 1,
        userToken: app.userToken,
        no: that.data.no,
        size: that.data.size
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data.list,
          totalSize:res.data.totalPage,
          member: res.data.member,
          address: app.address
        })
      }
    })
    
  },

  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    request.loading(true)
    request.drop(this, '/rest/feed/my.htm', 1, this.data.no * this.data.size)
  },

  // 转发

  onShareAppMessage: function (ops) {
    if (app.catalog == 0) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops)
        return {
          title: '陕西园林商会',
          path: 'pages/login/login?type=1&active=' + ops.target.dataset.active + '&id=' + ops.target.id,
          imageUrl: ops.target.dataset.src,
          success: function (res) {
            // 转发成功
            console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function (res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else {
        return {
          title: '陕西园林商会',
          path: 'pages/login/login?type=0',
          success: function (res) {
            // 转发成功
            console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function (res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    } else {
      return {
        title: '陕西园林商会',
        path: 'pages/login/login?type=0',
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */

  onReachBottom: function () {
    var that = this

    // 当前页+1
    var no = that.data.no + 1;

    that.setData({
      no: no,
    })

    if (no <= that.data.totalSize) {

      comment.loading(true)
      
      request.more(that, '/rest/feed/my.htm', that.data.no, that.data.size)

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 加载完成
    comment.loading(false)
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    var that = this
    
    if (app.dynamic==1){

      // 页面初始化动画
      comment.loading(true)

      wx.request({
        url: app.apiUrl + '/rest/feed/my.htm',
        data: {
          commerce: 1,
          userToken: app.userToken,
          no: that.data.no,
          size: that.data.size
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res)
          comment.loading(false)
          that.setData({
            list: res.data.list,
            totalSize: res.data.totalPage,
            member: res.data.member,
            address: app.address
          })
        }
      })
    }
  },
})
