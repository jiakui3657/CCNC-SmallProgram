// pages/login/login.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options)
    wx.login({
      success: function (res) {
        wx.request({
          url: app.url+'/member/loginoauth.htm',
          data: {
            code: res.code,
            type: 'wxapp'
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            app.userToken = res.data.userToken,
            app.portrait = res.data.avatar,
            app.catalog = res.data.catalog,
            app.phone = res.data.phone,
            app.cardLogo = res.data.cardLogo,
            app.name = res.data.name,
            app.companyName = res.data.companyName,
            app.job = res.data.job,
            app.avatar = res.data.avatar
            app.vipBj = res.data.background
            app.vipTimeEnd = res.data.expireDate
            app.money = res.data.money
            app.economize = res.data.economize
            app.id = res.data.id
            setTimeout(function(){
              if (res.data.code == 0) {
                if (options.q){
                  console.log('1111')
                  var arr = options.q.split('%2F')
                  var id = arr[arr.length - 1].split('.')[0]
                  wx.reLaunch({
                    url: '../../pages/index/index?q=' + id
                  })
                }else{
                  wx.reLaunch({
                    url: '../../pages/index/index?id=' + options.id + '&name=' + options.name
                  })
                }
              }
            },1000)
          }
        })
      }
    });
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
  onShareAppMessage: function () {
  
  }
})