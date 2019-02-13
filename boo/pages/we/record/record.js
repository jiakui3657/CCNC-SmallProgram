// pages/we/record/record.js
const app = getApp()
var request = require('../../../utils/request.js')
var comment = require('../../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: [
      {
        name: "我发出的"
      },
      {
        name: "我抢到的"
      }
    ],
    selected: 0,
    initiateTotalSize: null,
    initiateList: [],
    initiateNo: 1,
    participateTotalSize: null,
    participateList: [],
    participateNo: 1,
    size:10,
    height: 0,
    flag:null,
    bb:false,
    initiate:{
      money:null,
      number:null
    },
    participate:{
      money: null,
      number: null
    }
  },
  
  // tab切换
  selected: function (e) {
    this.setData({
      selected: e.target.id,
      flag:null
    })
  },
  // 打开和收起
  open:function(e){
    if (this.data.flag == e.currentTarget.id){
      this.setData({
        flag: null
      })
    }else{
      this.setData({
        flag: e.currentTarget.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    comment.loading(true)

    // 我发布的红包
    request.firstLoading(that, '/rest/center/mypub.htm', that.data.initiateNo, that.data.size)

    // 我抢到的红包
    request.firstLoading(that, '/rest/center/myopen.htm', that.data.participateNo, that.data.size)
    
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
    var that = this;
    if (that.data.selected == 0) {
      wx.request({
        url: app.apiUrl +'/rest/center/mypub.htm',
        data: {
          commerce: app.commerce,
          userToken: app.userToken,
          no: 1,
          size: 20
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          that.setData({
            initiateList: res.data.list
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
    } else {
      wx.request({
        url: app.apiUrl +'/rest/center/myopen.htm',
        data: {
          commerce: app.commerce,
          userToken: app.userToken,
          no: 1,
          size: 20
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          that.setData({
            participateList: res.data.list
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
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this    
    console.log(that.data.selected)
    if (that.data.selected == '0') {
      // 当前页+1
      var no = that.data.initiateNo + 1;

      that.setData({
        initiateNo: no,
      })

      if (no <= that.data.initiateTotalSize) {
        comment.loading(true)
        // 请求后台，获取下一页的数据。
        wx.request({
          url: app.apiUrl +'/rest/center/mypub.htm',
          data: {
            commerce: app.commerce,
            userToken: app.userToken,
            no: that.data.initiateNo,
            size: that.data.size
          },
          success: function (res) {
            console.log(res)
            comment.loading(false)
           
            // 将新获取的数据 res.data.list，concat到前台显示的showlist中即可。
            that.setData({
              initiateList: that.data.initiateList.concat(res.data.list)
            })
          },
          fail: function (res) {
            wx.hideLoading()
          }
        })
      }
    } else {
      // 当前页+1
      console.log(that.data.participateTotalSize)
      var participateNo = that.data.participateNo + 1;

      that.setData({
        participateNo: participateNo,
      })

      if (participateNo <= that.data.participateTotalSize) {
        wx.showLoading({
          title: '加载中',
        })
        // 请求后台，获取下一页的数据。
        wx.request({
          url: app.apiUrl +'/rest/center/myopen.htm',
          data: {
            commerce: app.commerce,
            userToken: app.userToken,
            no: that.data.participateNo,
            size: that.data.size
          },
          success: function (res) {
            console.log(res);
            wx.hideLoading()
            // 将新获取的数据 res.data.list，concat到前台显示的showlist中即可。
            that.setData({
              participateList: that.data.participateList.concat(res.data.list)
            })
          },
          fail: function (res) {
            wx.hideLoading()
          }
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})