// pages/we/addMembers/addMembers.js
const app = getApp()
var comment = require('../../../utils/public.js')
var request = require('../../../utils/request.js')

Page({
  data: {
    tempFilePaths: '',
    disabled:true,
    personal: {
      name: '',
      phone: '',
      jobTitle: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      personal: {
        name: '',
        idCard: '',
        phone: '',
        jobTitle: '',
        company: app.companyName,
        address:app.address
      }
    })
  },

  // 姓名
  writeName: function (e) {
    this.data.personal.name = e.detail.value
    if (this.data.personal.name == '' /*|| this.data.personal.idCard == '' */|| this.data.personal.phone == '' || this.data.personal.jobTitle == '' /*|| this.data.tempFilePaths == ''*/){
      this.setData({
        disabled:true
      })
    }else{
      this.setData({
        disabled: false
      })
    }
  },

  // 电话号码
  writePhone: function (e) {
    this.data.personal.phone = e.detail.value
    if (this.data.personal.name == '' /*|| this.data.personal.idCard == '' */ || this.data.personal.phone == '' || this.data.personal.jobTitle == '' /*|| this.data.tempFilePaths == ''*/) {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
  },

  // 职务
  writeJobTitle: function (e) {
    this.data.personal.jobTitle = e.detail.value
    if (this.data.personal.name == '' /*|| this.data.personal.idCard == '' */ || this.data.personal.phone == '' || this.data.personal.jobTitle == '' /*|| this.data.tempFilePaths == ''*/) {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
  },

  // 添加会员
  addapply: function () {
    var that = this;
    var url = '/rest/commerceapply/addmy.htm'
    var name = that.data.personal.name
    var phone = that.data.personal.phone
    var job = that.data.personal.jobTitle
    comment.loading(true)
    wx.request({
      url: app.apiUrl + '/rest/commerceapply/addmy.htm',
      data: {
        commerce: app.commerce,
        userToken: app.userToken,
        applyType: 'person',
        name: name,
        phone: phone,
        job: job,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        comment.loading(false)        
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      },
      fail: function () {
        // fail
        comment.loading(false)                
        wx.showModal({
          title: '提示',
          content: '请求失败',
          showCancel: false
        })
      },
      complete: function () {
        // complete

      }
    })
  }
})