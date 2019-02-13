// pages/we/addankcard/addbankcard.js
const app = getApp()
var request = require('../../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr:[
      {
        place:'银行名称',
        event:'name'
      },
      {
        place: '银行卡号',
        event:'phone'
      },
      {
        place: '持卡人',
        event:'people'
      },
      {
        place: '开户银行',
        event:'bank'
      }
    ],
    name:'',
    phone:'',
    people:'',
    bank:'',
    disabled:true
  },
  //  姓名
  name: function (e) {
    this.setData({
      name:e.detail.value
    })
    if (this.data.name == '' || this.data.phone == '' || this.data.people == '' || this.data.bank == ''){
      this.setData({
        disabled: true
      })
    }else{
      this.setData({
        disabled: false
      })
    }
  },
  // 手机号
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
    if (this.data.name == '' || this.data.phone == '' || this.data.people == '' || this.data.bank == '') {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
  },
  // 持卡人
  people: function (e) {
    this.setData({
      people: e.detail.value
    })
    if (this.data.name == '' || this.data.phone == '' || this.data.people == '' || this.data.bank == '') {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
  },
  // 开户银行
  bank: function (e) {
    this.setData({
      bank: e.detail.value
    })
    if (this.data.name == '' || this.data.phone == '' || this.data.people == '' || this.data.bank == '') {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    }
  },
  // 添加银行卡
  submit:function(){
    var that = this;

    // 添加银行卡
    request.addBankCard(that, '/rest/bankcard/bind.htm', that.data.name, that.data.phone, that.data.people, that.data.bank)
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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