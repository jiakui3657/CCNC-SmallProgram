//logs.js
const app = getApp()

Page({
  data: {

  },

  onLoad: function(e) {
    console.log(e)
    var typec = e.type;
    var id = e.id;
    var active = e.active;
    var value = {
      id: e.id,
      active: e.active
    }


    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {


          //发起网络请求
          wx.request({
            url: app.apiUrl + '/rest/member/loginoauth.htm',
            data: {
              "code": res.code,
              "type": "wxapp",
              "commerce": "1"
            },
            success: function(resback) {
              if (resback.data.code == 0) {
                console.log(resback)
                app.avatar = resback.data.avatar
                app.name = resback.data.name
                app.state = resback.data.owner
                app.change = resback.data.money
                app.companyName = resback.data.companyName
                app.catalog = resback.data.catalog
                app.job = resback.data.job
                app.address = resback.data.address
                app.userToken = resback.data.userToken
                app.phone = resback.data.phone
                app.social = resback.data.title
                console.log(app.catalog)
                wx.setStorage({
                  key: "phone",
                  data: resback.data.phone
                })
                if (app.catalog == 0) {
                  if (typec == 1) {
                    wx.setStorage({
                      key: "key",
                      data: value,
                      success: function() {
                        wx.switchTab({
                          url: '../index/index/index'
                        })
                      }
                    })
                  } else if (typec == 0) {
                    wx.switchTab({
                      url: '../index/index/index'
                    })
                  } else {
                    wx.setStorage({
                      key: "key",
                      data: value,
                      success: function() {
                        wx.switchTab({
                          url: '../index/index/index'
                        })
                      }
                    })
                  }
                } else {
                  wx.switchTab({
                    url: '../index/index/index'
                  })
                }
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})