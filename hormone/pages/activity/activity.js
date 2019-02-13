// pages/activity/activity.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    longstate:'',
    latstate:'',
    no:1,
    size:10,
    totalSize:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options)
    this.setData({
      longstate: options.longitude,
      latstate: options.latitude
    })
    var that=this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.url + '/activity/search.htm',
          data: {
            lng: options.longitude,
            lat: options.latitude,
            userToken: app.userToken,
            no: that.data.no,
            size: that.data.size
          },
          method:'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              list:res.data.list,
              totalSize: res.data.totalPage
            })
            wx.hideLoading()
          }
        }) 
      }
    })
  },
  activityDetails:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../../pages/activityDetails/activityDetails?id=' + e.currentTarget.id + '&longstate=' + e.currentTarget.dataset.longstate + '&latstate=' + e.currentTarget.dataset.latstate + '&name=' + e.currentTarget.dataset.name
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
    var that = this
    console.log(that.data.longstate, that.data.latstate)
    wx.request({
      url: app.url + '/activity/search.htm',
      data: {
        lng: that.data.longstate,
        lat: that.data.latstate,
        userToken: app.userToken,
        no: 1,
        size: that.data.no * that.data.size
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          list: res.data.list
        })
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(111)
    var that = this

    // 当前页+1
    var no = that.data.no + 1;

    that.setData({
      no: no
    })

    if (no <= that.data.totalSize) {

      // 请求后台，获取下一页的数据。
      wx.showLoading({
        title: '加载中',
        mask: true,
        success: function () {
          wx.request({
            url: app.url + '/activity/search.htm',
            data: {
              lng: that.data.longstate,
              lat: that.data.latstate,
              userToken: app.userToken,
              no: that.data.no,
              size: that.data.size
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              that.setData({
                list: that.data.list.concat(res.data.list)
              })
              wx.hideLoading()
            }
          })
        }
      })
      

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
})