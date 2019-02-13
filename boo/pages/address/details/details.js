// pages/address/details/details.js
const app = getApp()
var comment = require('../../../utils/public.js')
var request = require('../../../utils/request.js')
var timer; // 计时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moodImg: [],
    list: [],
    no: 1,
    size: 10,
    totalSize: null,
    member: null,
    address:null,
    id:null
  },
  // 拨打电话
  open:function(e){
    wx.makePhoneCall({
      phoneNumber: '' + e.currentTarget.dataset.phone + '' //仅为示例，并非真实的电话号码
    })
    clearTimeout(timer);
    
  },

  amplification:function(e){
    var img = []
    img.push(e.currentTarget.dataset.src)
    wx.previewImage({
      urls: img
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Countdown();
    console.log(options.iid)
    comment.loading(true)
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.setData({
      id : options.iid
    })

    // 初始化通讯录 * 详情

    request.firstLoading(this, '/rest/feed/user.htm', this.data.no, this.data.size, this.data.id)
    
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: app.apiUrl +'/rest/feed/user.htm',
      data: {
        commerce: 1,
        userToken: app.userToken,
        user: that.data.id,
        no: 1,
        size: that.data.no*that.data.size
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        that.setData({
          list: res.data.list
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.stopPullDownRefresh()
      }
    })
  },

  // 转发

  onShareAppMessage: function (ops) {
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 当前页+1
    var no = that.data.no + 1;

    that.setData({
      no: no,
    })

    if (no <= that.data.totalSize) {
      
      wx.showLoading({
        title: '加载中',
      })

      // 请求后台，获取下一页的数据。
      wx.request({
        url: app.apiUrl +'/rest/feed/user.htm',
        data: {
          commerce: 1,
          userToken: app.userToken,
          user: that.data.id,
          no: that.data.no,
          size: that.data.size
        },
        success: function (res) {
          console.log(res);
          wx.hideLoading()
          // 将新获取的数据 res.data.list，concat到前台显示的showlist中即可。
          that.setData({
            list: that.data.list.concat(res.data.list)
          })
        },
        fail: function (res) {
          wx.hideLoading()
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    comment.loading(false)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.dynamic==1){
      comment.loading(true)
      request.firstLoading(this, '/rest/feed/user.htm', this.data.no, this.data.size, this.data.id)
    }
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
   * 用户点击右上角分享
   */
  
})
// 倒计时
function Countdown() {
  timer = setTimeout(function () {
    console.log("----Countdown----");
    Countdown();
  }, 1000);
};