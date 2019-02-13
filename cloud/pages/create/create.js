// pages/we/we.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    name:'',
    phone:'',
    company:'',
    job:'',
    id:null
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var that=this
    wx.request({
      url: app.apiUrl + '/member/phone.htm',
      data: {
        userToken: app.userToken,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          phone:res.data.phone
        })
        if (that.data.name != '' && that.data.phone != '') {
          that.setData({
            disabled: false
          })
        } else {
          that.setData({
            disabled: true
          })
        }
      },
      fail: function () {
        
      }
    })
  },
  name:function(e){
    this.setData({
      name: e.detail.value
    })
    if (this.data.name != '' && this.data.phone != ''){
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  company:function(e){
    this.setData({
      company: e.detail.value
    })
  },
  job: function (e) {
    this.setData({
      job: e.detail.value
    })
  },
  submit:function(){
    var that=this
    wx.showLoading({
      title: '加载中'
    })
    console.log(that.data.id)
    if(that.data.id==null){
      wx.request({
        url: app.apiUrl + '/card/create.htm',
        data: {
          userToken: app.userToken,
          name: that.data.name,
          companyName: that.data.company,
          job: that.data.job,
          phone: that.data.phone
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.code==0) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '提交成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../home/home'
                  })
                }
              }
            })
          }
        },
        fail:function() {
          wx.showModal({
            title: '提示',
            content: '提交失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  name: '',
                  phone: '',
                  company: '',
                  job: ''
                })
              }
            }
          })
        }
      })
    }else{
      wx.request({
        url: app.apiUrl + '/card/update.htm',
        data: {
          userToken: app.userToken,
          id: that.data.id,
          name: that.data.name,
          companyName: that.data.company,
          job: that.data.job,
          phone: that.data.phone
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.code==0) {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '修改成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../home/home'
                  })
                }
              }
            })
          }
        },
        fail:function() {
          wx.showModal({
            title: '提示',
            content: '修改失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  name: '',
                  phone: '',
                  company: '',
                  job: ''
                })
              }
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: app.name,
      phone: app.phone,
      company: app.company,
      job: app.job,
      id: options.id
    })
    if (this.data.name != '' && this.data.phone != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
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
  onShareAppMessage: function (res) {
    var str = information.image
    var start = str.lastIndexOf("/") + 1
    var end = str.indexOf("htm") - 1
    var xx = str.substring(start, end)
    return {
      title: '云脉名片',
      path: 'pages/index/index?type=' + 1 + '&xx=' + xx,
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
})