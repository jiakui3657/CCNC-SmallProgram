// pages/index/projectDetails/projectDetails.js
const app = getApp()
var comment = require('../../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:null,
    flag:false,
    id:null,
    animationData: {}
  },
  // 展开报名列表
  bounce:function(e){
    console.log(e)
    this.setData({
      flag:!this.data.flag
    })

    if(this.data.flag){
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      this.animation = animation
      setTimeout(function () {

        animation.height("700rpx").step()

        this.setData({
          animationData: animation.export()
        })

      }.bind(this), 10)
    }else{
      var animation = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 1,
        timingFunction: "ease",
        delay: 0
      })
      this.animation = animation
      setTimeout(function () {

        animation.height("0rpx").step()

        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 0)
    }
    
  },
    // 关闭报名列表
  down:function(e){
    this.setData({
      flag: false
    })
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    setTimeout(function () {
      animation.height("0rpx").step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  // 点击报名
  signUp:function(){
    var that=this
    if (that.data.item.haveJoin) {
      wx.showToast({
        title: '已报名',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '../../index/projectSignUp/projectSignUp?id=' + that.data.item.id + '&money=' + that.data.item.money + '&name=' + that.data.item.member.name + '&avatar=' + that.data.item.member.avatar + '&job=' + that.data.item.member.job
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
    var that = this
    comment.loading(true)
    wx.request({
      url: app.apiUrl + '/rest/project/id.htm',
      data: {
        commerce: 1,
        userToken: app.userToken,
        id: that.data.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res);
        comment.loading(false)
        if (res.data.code == 0) {
          that.setData({
            item: res.data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1000
          })
        }
      },
      fail: function () {
        // fail           
        wx.showToast({
          title: '请求失败',
          icon: 'loading',
          duration: 1000
        })
      },
      complete: function () {
        // complete
      }
    })
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
    return {
      title: '陕西园林商会',
      path: 'pages/login/login?type=2&active=' + 3 + '&id=' + this.data.id,
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