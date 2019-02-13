//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.screenSize();

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })



    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    // 个人信息
    // 用户token
    var openid = ''
    var userToken = ''
    var state = ''
    var change = ''
    var avatar = ''
    var name = ''
    var companyName = ''
    var catalog = ''
    var job = ''
    var address = ''
    var dynamic = ''
    var phone = ''
    var social=''
    // 荷尔盟
    var hormonePhone = ''
    var hormoneName = ''
    var hormoneVipBj = ''
    var hormoneUserToken = ''
    var hormoneAvatar = ''
    var hormoneJob = ''
    var hormoneCompanyName = ''
    var hormoneCatalog = ''
    var hormonePortrait = ''
  },
  //获取屏幕宽高
  screenSize: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    })
  },
  globalData: {
    userInfo: null
  },
  userToken: null,
  apiUrl: 'https://test.wangtang.com.cn/saas',
  supplyUrl: 'https://tsds.niwind.com',
  commerce: 2,
  hormoneUrl: 'https://test.wangtang.com.cn/hormone/rest',
  showLoading: function () {
    wx.showLoading({
      title: '加载中'
    })
  }
})