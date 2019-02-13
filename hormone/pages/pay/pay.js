// pages/pay/pay.js
var app=getApp()
var D = require('../../utils/D.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [],
    indexList: [],
    init:true,
    id:'',
    money:'',
    addMoney: null,
    payType:[
      {
        name:'余额支付',
        icon:'../../img/hrmpay.png',
        type:'cash'
      },
      {
        name: '微信支付',
        icon: '../../img/wx.png',
        type: 'wxapp'
      }
    ],
    type:'',
    image:'',
    name:'',
    privilege:'',
    moneyToggle: '',
    disabled: false,
    rebate: '',
    paymentType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this    
    console.log(options)
    that.setData({
      id: options.id,
      moneyToggle: app.money
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.url + '/venue/findbyid.htm',
          data: {
            id: options.id,
            userToken: app.userToken,
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            that.setData({
              image: res.data.image[0],
              name: res.data.name,
              privilege: res.data.privilege,
              radioItems: res.data.meals,
              rebate: res.data.rebate
            })
            wx.hideLoading()
          }
        })
      }
    })
    wx.request({
      url: app.url + '/recharge/checkstaff.htm',
      data: {
        userToken: app.userToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        app.paymentType = res.data.catalog
        that.setData({
          paymentType: res.data.catalog
        })
        if (res.data.catalog == 1) {
          that.setData({
            type: "cash"
          })
        } else {
          that.setData({
            type: "wxapp"
          })
        }
      }
    })
  },
  topUp: function () {
    wx.navigateTo({
      url: '../../pages/topUp/topUp?flag=true'
    })
  },
  radioChange: function (e) {
    console.log(e)
    var radioItems = [], that = this
    that.data.radioItems.map(function (value, index, array){
      if (e.currentTarget.dataset.index == index){
        if (value.select) {
          that.data.addMoney = D.Sub(that.data.addMoney, value.money)
          value.select = false
          var index = that.data.indexList.indexOf(e.currentTarget.dataset.index)
          that.data.indexList.splice(index,1)
        }else{
          that.data.addMoney = D.Add(that.data.addMoney, value.money)
          value.select = true
          that.data.indexList.push(e.currentTarget.id)
        }
      }
      radioItems.push(value)
    })
    that.setData({
      indexList: that.data.indexList,
      radioItems: radioItems
    })
    console.log(that.data.indexList)
    if (that.data.indexList.length>0){
      that.setData({
        disabled: true,
        money: '',
        addMoney: that.data.addMoney
      })
    }else{
      that.setData({
        disabled: false,
        money: '',
        addMoney: ''
      })
    }
  },
  pay:function(){
    var that=this
    if(that.data.init){
      that.setData({
        init:false
      })
      if (that.data.money != ''){
        var payment = null
        payment = D.Mul(that.data.money, that.data.rebate)
        payment = D.Div(payment, 10)
        var save = D.Sub(that.data.money, payment)
        wx.showModal({
          title: '提示',
          content: '本次消费' + that.data.money + '元，享受' + that.data.rebate + '折，实际支付' + payment + '元，为您节省' + save + '元。',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
                mask: true,
                success: function () {
                  wx.request({
                    url: app.url + '/recharge/payhormone.htm',
                    data: {
                      id: that.data.id,
                      money: that.data.money,
                      userToken: app.userToken,
                      payType: that.data.type
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      console.log(res)
                      wx.hideLoading()
                      if (res.data.code == 0) {
                        if (that.data.type == 'cash') {
                          var payment = null
                          payment = D.Mul(that.data.money, that.data.rebate)
                          payment = D.Div(payment, 10)
                          wx.showModal({
                            title: '支付成功',
                            content: '您在' + that.data.name + '店铺消费' + that.data.money + '元，实际支付' + payment + '元',
                            showCancel: false,
                            success: function (res) {
                              wx.showLoading({
                                title: '加载中',
                              })
                              wx.request({
                                url: app.url + '/member/info.htm',
                                data: {
                                  userToken: app.userToken
                                },
                                header: {
                                  'content-type': 'application/json'
                                },
                                success: function (res) {
                                  console.log(res)
                                  app.money = res.data.money
                                  app.economize = res.data.economize
                                  that.setData({
                                    init: true
                                  })
                                  wx.navigateBack({
                                    delta: 1
                                  })
                                  wx.hideLoading()
                                }
                              })
                            }
                          })
                        } else {
                          var payment = null
                          payment = D.Mul(that.data.money, that.data.rebate)
                          payment = D.Div(payment, 10)
                          var save = D.Sub(that.data.money, payment)
                          var prompt = {
                            money: that.data.money,
                            name: that.data.name,
                            payment: payment
                          }
                          pay(that, res.data.pay, prompt, true)
                        }
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: res.data.msg,
                          showCancel: false,
                          success: function () {
                            that.setData({
                              init: true
                            })
                          }
                        })
                      }
                    }, fail: function () {
                      wx.hideLoading()
                      wx.showModal({
                        title: '提示',
                        content: '支付失败',
                        showCancel: false
                      })
                    }
                  })
                }
              })
            } else if (res.cancel) {
              that.setData({
                init: true
              })
            }
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '支付金额' + that.data.addMoney + '元',
          success(res) {
            if (res.confirm) {
              wx.showLoading({
                title: '加载中',
                mask: true,
                success: function () {
                  wx.request({
                    url: app.url + '/recharge/payhormone.htm',
                    data: {
                      id: that.data.id,
                      meal: that.data.indexList.join(','),
                      userToken: app.userToken,
                      payType: that.data.type
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      console.log(res)
                      wx.hideLoading()
                      if (res.data.code == 0) {
                        if (that.data.type == 'cash') {
                          wx.showModal({
                            title: '支付成功',
                            content: '本次购买套餐消费' + that.data.addMoney + '元！',
                            showCancel: false,
                            success: function (res) {
                              wx.showLoading({
                                title: '加载中',
                              })
                              wx.request({
                                url: app.url + '/member/info.htm',
                                data: {
                                  userToken: app.userToken
                                },
                                header: {
                                  'content-type': 'application/json'
                                },
                                success: function (res) {
                                  console.log(res)
                                  app.money = res.data.money
                                  app.economize = res.data.economize
                                  that.setData({
                                    init: true
                                  })
                                  wx.navigateBack({
                                    delta: 1
                                  })
                                  wx.hideLoading()
                                }
                              })
                            }
                          })
                        } else {
                          pay(that, res.data.pay, that.data.addMoney, false)
                        }
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: res.data.msg,
                          showCancel: false,
                          success: function () {
                            that.setData({
                              init: true
                            })
                          }
                        })
                      }
                    }, fail: function () {
                      wx.hideLoading()
                      wx.showModal({
                        title: '提示',
                        content: '支付失败',
                        showCancel: false
                      })
                    }
                  })
                }
              })
            } else if (res.cancel) {
              that.setData({
                init: true
              })
            }
          }
        })
      }
    }
  },
  val:function(e){
    console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },
  choose:function(e){
    console.log(e.currentTarget.dataset.type)
    this.setData({
      type: e.currentTarget.dataset.type
    })
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
// 微信支付
function pay(that, payinfo, prompt, state) {
  console.log(payinfo);
  wx.requestPayment({
    timeStamp: payinfo.timestamp,
    nonceStr: payinfo.noncestr,
    package: payinfo.packageInfo,
    signType: payinfo.signType,
    paySign: payinfo.sign,
    success: function (r) {
      console.log(r)
      if (state){
        wx.request({
          url: app.url + '/member/info.htm',
          data: {
            userToken: app.userToken
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            app.economize = res.data.economize
          }
        })
        wx.showModal({
          title: '支付成功',
          content: '您在' + prompt.name + '店铺消费' + prompt.money + '元，实际支付' + prompt.payment + '元',
          showCancel: false,
          success: function (res) {
            that.setData({
              init: true
            })
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }else{
        wx.showModal({
          title: '支付成功',
          content: '本次购买套餐消费' + prompt + '元！',
          showCancel: false
        })
      }
    },
    fail: function (r) {
      wx.showModal({
        title: '提示',
        content: '支付失败',
        showCancel: false,
        success: function (res) {
          that.setData({
            init: true
          })
        }
      })
    }
  })
}