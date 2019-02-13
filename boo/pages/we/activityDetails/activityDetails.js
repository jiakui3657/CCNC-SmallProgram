// pages/we/activityDetails/activityDetails.js
const app = getApp()
var util = require('../../../utils/util.js')
var D = require('../../../utils/D.js')

Page({
  data: {
    flag: false,
    animationData: {},
    data: [],
    money: '',
    num: 1,
    staging: '',
    id: null,
    longstate: null,
    latstate: null
  },
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name
    })
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.hormoneUrl + '/activity/findbyid.htm',
          data: {
            id: options.id,
            userToken: app.hormoneUserToken,
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var money = null
            if (res.data.residue > 0) {
              money = res.data.vip
            } else {
              money = res.data.money
            }
            that.setData({
              data: res.data,
              money: money,
              staging: res.data.money,
              id: res.data.id,
              longstate: options.longstate,
              latstate: options.latstate
            })
            wx.hideLoading()
          }
        })
      }
    })
  },
  securities: function () {
    this.setData({
      flag: true
    })

    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    setTimeout(function () {

      animation.height("510rpx").step()

      this.setData({
        animationData: animation.export()
      })

    }.bind(this), 10)
  },
  down: function () {
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
    animation.height("0rpx").step()

    this.setData({
      animationData: animation.export()
    })
  },
  phone: function (e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  reduction: function () {
    var money = D.Sub(this.data.money, this.data.data.money)
    if (this.data.data.residue == 0) {
      if (this.data.num > 0) {
        this.setData({
          num: this.data.num - 1,
          money: D.Sub(this.data.money, this.data.data.money)
        })
      }
    } else {
      if (this.data.num > 1) {
        this.setData({
          num: this.data.num - 1,
          money: D.Sub(this.data.money, this.data.data.money)
        })
      } else if (this.data.num == 0) {
        this.setData({
          num: this.data.num - 1,
          money: D.Sub(this.data.money, this.data.data.vip)
        })
      }
    }

  },
  add: function () {
    var money = D.Add(this.data.data.money, this.data.money)
    this.setData({
      num: this.data.num + 1,
      money: money
    })
    console.log(this.data.money)
  },
  pay: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.hormoneUrl + '/activity/order.htm',
          data: {
            id: that.data.id,
            nums: that.data.num,
            userToken: app.hormoneUserToken,
            payType: 'wxapp'
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            util.pay(that, res.data.pay)
            wx.hideLoading()
          }
        })
      }
    })
  },
  map: function (e) {
    console.log(e)
    // wx.navigateTo({
    //   url: '../../pages/map/map?longstate=' + this.data.longstate + '&latstate=' + this.data.latstate + '&longend=' + e.currentTarget.dataset.lngend + '&latend=' + e.currentTarget.dataset.latend
    // })
    wx.openLocation({
      latitude: e.currentTarget.dataset.latend,
      longitude: e.currentTarget.dataset.lngend,
      name: this.data.data.name,
      scale: 28
    })
  }
})