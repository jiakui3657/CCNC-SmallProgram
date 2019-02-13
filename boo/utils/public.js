const app = getApp()
var amapFile = require('../libs/amap-wx.js')
var utils = require('./util.js')
var md5 = require('./md5.js')

// 获取输入框的值
function input(that, value, name) {
  var name = that.data.personal.name;
  this.setData({
    name: value
  })
  that.data.personal.name = name
}

// 初始化 * 定位
function positioning(that) {
  var myAmapFun = new amapFile.AMapWX({
    key: '6353b388f324245c8843c463c10e7c38'
  });
  myAmapFun.getRegeo({
    success: function(data) {
      //成功回调
    },
    fail: function(info) {
      //失败回调
    }
  })
}

//网络请求失败弹窗

function requestFail() {
  wx.showToast({
    title: '网络请求失败',
    image: '/pages/images/fail.png',
    duration: 1500,
    mask: true

  })
}

// 加载动画
function loading(flag) {
  if (flag) {
    wx.showLoading({
      title: '加载中',
    })
  } else {
    wx.hideLoading()
  }
}

// 微信支付
function pay(that, payinfo) {
  this.loading(false)
  console.log(payinfo);
  wx.requestPayment({
    timeStamp: payinfo.timestamp,
    nonceStr: payinfo.noncestr,
    package: payinfo.packageInfo,
    signType: payinfo.signType,
    paySign: payinfo.sign,
    success: function(r) {
      console.log(r)
      wx.showModal({
        title: '提示',
        content: '支付成功',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
    },
    fail: function(r) {
      wx.showModal({
        title: '提示',
        content: '支付失败',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            that.setData({
              disabled: false
            })
          }
        }
      })
    }
  })
}

module.exports = {
  input: input,
  positioning: positioning,
  requestFail: requestFail,
  loading: loading,
  pay: pay
}