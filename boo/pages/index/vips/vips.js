//logs.js
const app = getApp()
var comment = require('../../../utils/public.js');

Page({
  data: {
    no:1,
    size:10,
    totalSize:null,
    list:[]
  },
  // 跳转会员详情
  navigation:function(e){
    wx.navigateTo({
      url: '../vipIntroduction/vipIntroduction?id=' + e.currentTarget.id 
    })
  },
  
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    comment.loading(true)
    
    wx.request({
      url: app.apiUrl +'/rest/vipstyle/page.htm',
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
          list:res.data.list,
          totalSize: res.data.totalPage
        })
      },
      fail: function () {
        // fail  
        comment.loading(false)

        wx.showToast({
          title: '加载失败',
          icon: 'loading',
          duration: 1000
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    comment.loading(true)
    wx.request({
      url: app.apiUrl + '/rest/vipstyle/page.htm',
      data: {
        commerce: 1,
        userToken: app.userToken,
        no:1,
        size: that.data.no*that.data.size
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)

        comment.loading(false)
        wx.stopPullDownRefresh()

        if(res.data.code==0){
          that.setData({
            list: res.data.list
          })
        }else{
          wx.showToast({
            title: '加载失败',
            icon: 'success',
            duration: 1000
          })
        }       
        
      },
      fail: function () {
        // fail  
        comment.loading(false)
        wx.stopPullDownRefresh()

        wx.showToast({
          title: '加载失败',
          icon: 'loading',
          duration: 1000
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    // 当前页+1
    var no = that.data.no + 1;

    that.setData({
      no: no
    })

    if (no <= that.data.totalSize) {

      // 请求后台，获取下一页的数据。
      comment.loading(true)

      wx.request({
        url: app.apiUrl + '/rest/vipstyle/page.htm',
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
            list: that.data.list.concat(res.data.list)
          })
        },
        fail: function () {
          // fail  
          comment.loading(false)
          
          wx.showToast({
            title: '加载失败',
            icon: 'loading',
            duration: 1000
          })
        }
      })

    }
  }
})
