//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onLoad: function (e) {
    console.log(e)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code)
        console.log(app.apiUrl)
        if (res.code) {
          //发起网络请求
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
              if (e.type==1){
                var flag=null
                wx.request({
                  url: app.apiUrl + '/card/page.htm',
                  data: {
                    userToken: resback.data.userToken
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log(res)
                    if (res.data.code == 0) {
                      for (var i=0;i<res.data.list.length;i++){
                        if (res.data.list[i].cardId == e.xx){
                          console.log(111111)
                          flag=true
                          wx.redirectTo({
                            url: '../contact/contact?type=' + e.type + '&name=' + res.data.list[i].name + '&companyName=' + res.data.list[i].companyName + '&job=' + res.data.list[i].job + '&phone=' + res.data.list[i].phone + '&id=' + res.data.list[i].id + '&note=' + res.data.list[i].note + '&src=' + res.data.list[i].image
                          })
                        }
                        
                      }
                      if(flag==null){
                        wx.redirectTo({
                          url: '../home/home?type='+e.type+'&xx='+e.xx
                        })
                      }
                    }
                  },
                  fail: function () {
                   
                  }
                })
              }else{
                wx.redirectTo({
                  url: '../home/home'
                })
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
