var app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function random_str() {
  var len = 32;
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  var max = chars.length;
  var str = '';
  for (var i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * max));
  }
  return str;
}

// 微信支付
function pay(that, payinfo) {
  console.log(payinfo);
  wx.requestPayment({
    timeStamp: payinfo.timestamp,
    nonceStr: payinfo.noncestr,
    package: payinfo.packageInfo,
    signType: payinfo.signType,
    paySign: payinfo.sign,
    success: function (r) {
      console.log(r)
      wx.showModal({
        title: '提示',
        content: '支付成功',
        showCancel: false,
        success: function (res) {
        }
      })
    },
    fail: function (r) {
      wx.showModal({
        title: '提示',
        content: '支付失败',
        showCancel: false,
        success: function (res) {
        }
      })
    }
  })
}


module.exports = {
  formatTime: formatTime,
  random_str: random_str,
  pay: pay
}