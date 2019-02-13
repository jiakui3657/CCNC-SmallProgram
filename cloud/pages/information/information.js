// pages/information/information.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    id:null
  },
  submit:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认保存？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.apiUrl + '/card/follow.htm',
            data: {
              userToken: app.userToken,
              id: that.data.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              if(res.data.code==0){
                wx.reLaunch({
                  url: '../contact/contact'
                })
              }
            },
            fail: function () {

            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var xx
    if (options.q != undefined){
      var str = decodeURIComponent(options.q)
      var start = str.lastIndexOf("/") + 1
      var end = str.indexOf("htm") - 1
      xx = str.substring(start, end)
    }else if (options.xx) {
      xx = options.xx
    }else {
      wx.showToast({
        title: '获取错误',
      })
    }

    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code)
          wx.request({
            url: app.apiUrl + '/member/loginoauth.htm',
            data: {
              type: "wxapp",
              code: res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (resback) {
              console.log(resback)
              app.userToken = resback.data.userToken
              console.log(resback.data.userToken)
              console.log(xx)              
              wx.request({
                url: app.apiUrl + '/card/findbyid.htm',
                data: {
                  userToken: resback.data.userToken,
                  id: xx
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                success: function (res) {
                  console.log(res)
                  that.setData({
                    id:xx,
                    list: res.data
                  })
                },
                fail: function () {
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
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
  // onShareAppMessage: function () {
  
  // }
})