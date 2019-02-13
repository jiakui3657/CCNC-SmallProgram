// pages/contactDetails/contactDetails.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    note:'',
    flag:false,
    temporary:'',
    focus:false
  },
  flicking: function () {
    wx.scanCode({
      success: (res) => {
        var str = res.result;
        var start = str.lastIndexOf("/") + 1;
        var end = str.indexOf("htm") - 1;
        var xx = str.substring(start, end);
        console.log(xx)
        if (xx) {
          wx.reLaunch({
            url: '../information/information?xx=' + xx
          })
        }
      }
    })
  },
  editor:function(){
    this.setData({
      flag:true
    })
    if(this.data.flag){
      this.setData({
        focus:true
      })
    }
  },
  cancel:function(){
    this.setData({
      flag: false
    })
  },
  note:function(e){
    this.setData({
      temporary: e.detail.value
    })
  },
  save:function(){
    var that=this
    wx.request({
      url: app.apiUrl + '/card/remark.htm',
      data: {
        userToken: app.userToken,
        id: that.data.list.id,
        note: that.data.temporary
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if(res.data.code==0){
          that.setData({
            note: that.data.temporary,
            flag: false
          })
          app.state=true
        }
      },
      fail:function() {

      }
    })
  },
  phone: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  delete:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除联系人',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.apiUrl + '/card/delete.htm',
            data: {
              userToken: app.userToken,
              id: that.data.list.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              if (res.data.code == 0) {
                wx.reLaunch({
                  url: '../contact/contact'
                })
              }
            },
            fail: function () {

            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  focusing:function(){
    this.setData({
      focus: true
    })
  },
  scattered: function () {
    this.setData({
      focus: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.state = false
    this.setData({
      list: options,
      note: options.note
    })
    console.log(options)
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
    var str = this.data.list.src
    var start = str.lastIndexOf("/") + 1
    var end = str.indexOf("htm") - 1
    var xx = str.substring(start, end)
    console.log(xx)
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