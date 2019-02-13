// pages/index/signUp/signUp.js
const app = getApp();
var comment = require('../../../utils/public.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{},
    bool: true,
    only:0,
    flag: 0,
    money:null,
    payType: 'cash',
    pay: [],
    number: [],
    disabled:false,
    active:true,
    init:false,
    index:0
  },
  // 是否发红包
  // toggln: function (e) {
  //   if(this.data.list.money==0){
  //     this.setData({
  //       bool: !this.data.bool,
  //       init:true
  //     })
  //   }
  // },
  // 选择金额
  moneys: function (e) {
    if (this.data.only==-1){

    }else{
      this.setData({
        only: e.currentTarget.id,
        index: e.currentTarget.id
      })
    }
  },
  // 支付方式
  select: function (e) {
    this.setData({
      flag: e.currentTarget.id
    })
    console.log(e.currentTarget.id)
    if (e.currentTarget.id == '0') {
      this.setData({
        flag: e.currentTarget.id,
        payType: 'cash'
      })
    }else{
      this.setData({
        flag: e.currentTarget.id,
        payType: 'wxapp'
      })
    }
  },
  // 自定义金额
  amount:function(e){
    if (e.detail.value!=''){
      this.setData({
        only: -1
      })
    }else{
      this.setData({
        only: this.data.index
      })
    }
    this.setData({
      money: e.detail.value
    })
  },
  // 提交报名
  submit:function(){
    var that = this
    comment.loading(true)
    that.setData({
      disabled: true
    })
    if (that.data.money == null) {
      var money = that.data.number[that.data.only].money
      if (parseFloat(that.data.list.money) <= money) {
        wx.request({
          url: app.apiUrl + '/rest/activity/attend.htm',
          data: {
            id: that.data.list.id,
            commerce: 1,
            userToken: app.userToken,
            money: money,
            payType: that.data.payType
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res)
            comment.loading(false)
            if (that.data.payType == 'cash') {
              if (res.data.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '报名成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack()
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      that.setData({
                        disabled: false
                      })
                    }
                  }
                })
              }
            } else {
              comment.pay(that, res.data.pay)
            }
          }
        })
      } else {
        comment.loading(false)
        wx.showModal({
          title: '提示',
          content: '报名费用：' + parseFloat(that.data.list.money) + '元',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.setData({
                disabled: false
              })
            }
          }
        })
      }
    } else {
      if (parseFloat(that.data.list.money) <= that.data.money) {
        wx.request({
          url: app.apiUrl + '/rest/activity/attend.htm',
          data: {
            id: that.data.list.id,
            commerce: 1,
            userToken: app.userToken,
            money: that.data.money,
            payType: that.data.payType
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            console.log(res)
            comment.loading(false)
            if (that.data.payType == 'cash') {
              if (res.data.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '报名成功',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack()
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      that.setData({
                        disabled: false
                      })
                    }
                  }
                })
              }
            } else {
              comment.pay(that, res.data.pay)
            }
          }
        })
      } else {
        comment.loading(false)
        wx.showModal({
          title: '提示',
          content: '报名费用：' + parseFloat(that.data.list.money) + '元',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.setData({
                disabled: false
              })
            }
          }
        })
      }

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;    
    console.log(options)
    // if (options.money=='0'){
    //   that.setData({
    //     bool:false,
    //     active:false
    //   })
    // }
    that.setData({
      pay: [
        {
          src: '../../images/change.png',
          name: '余额',
          money: app.change
        },
        {
          src: '../../images/WeChat.png',
          name: '微信',
          money: ''
        }
      ],
      list: options
    }),     
      wx.request({
      url: app.apiUrl + '/rest/activity/config.htm',
        data: {
          commerce: 1,
          userToken: app.userToken
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res);
          that.setData({
            number: res.data.list
          })
        }
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
  // onShareAppMessage: function () {
  
  // }
})