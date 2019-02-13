// pages/mall/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType: 0, //0表示微信支付方式,1是余额支付
    flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var peisongfei = Number(options.peisongfei)
    console.log(typeof (peisongfei))
    wx.getStorage({
      key: 'shopCart',
      success: function (res) {
        var list = res.data.shopList
        var idarr = ''
        var numarr = ''
        for (var i = 0; i < list.length; i++) {
          idarr = idarr + list[i].id + ','
          numarr = numarr + list[i].num + ','
        }
        that.setData({
          peisongfei: peisongfei,
          idarr: idarr,
          numarr: numarr,
          shopCart: res.data,
          allMoney: Number((peisongfei + res.data.allMoney).toFixed(2))
        })
      },
    })
    wx.getStorage({
      key: 'phone',
      success: function (res) {
        that.setData({
          phone: res.data
        })
      },
    })
    that.upChange() //更新零钱
    that.setData({
      name: app.name,
      companyName: app.companyName,
      address: app.address
    })
    that.setData({
      pay: [{
        src: '../../images/WeChat.png',
        name: '微信',
        money: ''
      }, {
        src: '../../images/change.png',
        name: '余额',
        money: app.change
      }]
    })

  },
  //地址输入
  inputAddress: function (e) {
    var address = e.detail.value
    this.setData({
      address: address
    })
  },

  // 支付方式
  select: function (e) {
    if (e.currentTarget.id == 0) {
      this.setData({
        flag: e.currentTarget.id,
        payType: 0
      })
    } else {
      this.setData({
        flag: e.currentTarget.id,
        payType: 1
      })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 提交订单
   */

  formSubmit: function (e) {
    var that = this
    var payType = this.data.payType
    var userToken = app.userToken
    console.log(app.openid)
    var commerce = 1
    var name = this.data.name
    var phone = this.data.phone
    var address = this.data.address
    var idarr = this.data.idarr
    var numarr = this.data.numarr
    if (name && phone && address) {
      if (payType == 1) {
        wx.showModal({
          title: '提示',
          content: '是否确认支付？',
          success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '支付中',
              })
              wx.request({
                url: app.supplyUrl + '/shanghui/wx/appgdwxxaidan.jspx',
                data: {
                  paytype: payType,
                  userToken: userToken,
                  commerce: commerce,
                  openid: app.openid,
                  name: name,
                  phone: phone,
                  address: address,
                  ids: idarr,
                  nums: numarr
                },
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                  if (res.data.success == "success") {
                    that.payBack()
                  } else {
                    wx.hideLoading()
                    wx.showToast({
                      title: '您的余额不足',
                      image: "../../images/tanhao.png"
                    })
                  }
                }
              })
            }
          }
        })
      } else {
        wx.showLoading({
          title: '支付中',
        })
        wx.request({
          url: app.supplyUrl + '/shanghui/wx/appgdwxxaidan.jspx',
          data: {
            paytype: payType,
            userToken: userToken,
            commerce: commerce,
            openid: app.openid,
            name: name,
            phone: phone,
            address: address,
            ids: idarr,
            nums: numarr
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            var prepay_id = res.data.prepay_id
            that.signOrder(prepay_id)

          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({
              title: '订单交易失败',
              image: "../../images/tanhao.png"
            })
          }
        })
      }

    } else {
      wx.showToast({
        title: '请完善信息',
      })
    }

  },
  //签名
  signOrder: function (prepay_id) {
    var that = this;
    wx.request({
      url: app.supplyUrl + '/shanghui/wx/appwxrepeatsign.jspx',
      method: 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        prepay_id: prepay_id,
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        that.requestPayment(res.data);
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '签名失败',
        })
      }
    })
  },
  //申请支付
  requestPayment: function (obj) {
    var that = this
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        if (res.data.success == "success") {
          that.payBack()
        } else {
          wx.showToast({
            title: '支付失败',
            image: "../../images/tanhao.png"
          })
        }

      },
      'fail': function (res) {
        wx.hideLoading()
        wx.showToast({
          title: "支付失败",
          image: "../../images/tanhao.png"
        })
      }
    })
  },
  //更新零钱
  upChange: function () {
    wx.request({
      url: app.apiUrl + '/rest/cash/page.htm?',
      data: {
        commerce: 1,
        userToken: app.userToken,
        no: 1,
        size: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        app.change = res.data.money
      }
    })
  },
  //购买成功后执行的方法

  payBack: function () {
    var that = this
    wx.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2500
    })
    var timer = setTimeout(function () {
      that.upChange()
      wx.setStorage({
        key: 'shopCart',
        data: {
          totalSize: 0,
          allMoney: 0,
          shopList: []
        },
      })
      clearTimeout(timer)
      wx.navigateBack({
        delta: 1
      })

    }, 2500)
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