//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list:[
      {
        icon:'../image/today.png',
        text:'今日统计',
        jump:'Today'
      },
      {
        icon: '../image/history.png',
        text: '历史统计',
        jump: 'history'
      },
      {
        icon: '../image/activity.png',
        text: '活动统计',
        jump: 'activity'
      },
      {
        icon: '../image/sweep.png',
        text: '贵宾扫码',
        jump: 'sweep'
      },
      {
        icon: '../image/financial.png',
        text: '财务统计',
        jump: 'financial'
      },
      {
        icon: '../image/store.png',
        text: '店铺信息',
        jump: 'store'
      },
      {
        icon: '../image/code.png',
        text: '收款码',
        jump: 'code'
      }
    ],
    name:'',
    checkins:'',
    nums:'',
    codeToggle:false,
    logo:'',
    code:''
  },
  onLoad: function (e) {
    // 更新提示
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

   console.log(e)
    wx.hideShareMenu()
   this.setData({
     name: e.name,
     checkins: e.checkins,
     nums: e.nums,
     logo: app.logo,
     code: app.code
   })
  },
  Today:function(){
    wx.navigateTo({
      url: '../../pages/today/today'
    })
  },
  history:function(){
    wx.navigateTo({
      url: '../../pages/history/history'
    })
  },
  activity:function(){
    wx.navigateTo({
      url: '../../pages/activity/activity'
    })
  },
  sweep:function(){
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        var arr = res.result.split("/")
        var id=arr[5]
        var code=arr[6].split(".")[0]
        wx.navigateTo({
          url: '../../pages/entrance/entrance?id='+id+'&code='+code
        })
      }
    })
  },
  financial:function(){
    wx.navigateTo({
      url: '../../pages/financial/financial'
    })
  },
  store:function(){
    wx.navigateTo({
      url: '../../pages/store/store'
    })
  },
  code:function(){
    this.setData({
      codeToggle: !this.data.codeToggle
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/venueinfo.htm',
      data: {
        userToken: app.userToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          checkins: res.data.checkins,
          nums: res.data.nums
        })
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }
    })

  }
})
