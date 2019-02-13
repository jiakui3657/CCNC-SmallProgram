// pages/phone/phone.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    list1:null,
    flag:true,
    val:'',
    active:true
  },
  // flicking:function(){
  //   wx.navigateTo({
  //     url: '../information/information'
  //   })
  // },
  flicking: function () {
    wx.scanCode({
      success: (res) => {
        var str = res.result;
        var start = str.lastIndexOf("/") + 1;
        var end = str.indexOf("htm") - 1;
        var xx = str.substring(start, end);
        console.log(xx)
        if (xx) {
          wx.reLaunch({
            url: '../information/information?xx=' + xx
          })
        }
      }
    })
  },
  contactDetails:function(e){
    var index = parseInt(e.currentTarget.id)
    var name = this.data.list[index].name
    var companyName = this.data.list[index].companyName
    var job = this.data.list[index].job
    var phone = this.data.list[index].phone
    var id = this.data.list[index].id
    var note = this.data.list[index].note
    var src = this.data.list[index].image
    console.log(name, companyName, job, phone, id)
    wx.navigateTo({
      url: '../contactDetails/contactDetails?name=' + name + '&companyName=' + companyName + '&job=' + job + '&phone=' + phone + '&id=' + id + '&note='+note+'&src=' + src
    })
  },
  phone:function(e){
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  obtain:function(){
    if(this.data.val==''){
      this.setData({
        flag: false,
        active: false
      })
    }
  },
  lose:function(){
    if(this.data.val==''){
      this.setData({
        flag: true,
        active:true
      })
    }
  },
  search:function(e){
    console.log(e.detail.value)
    this.setData({
      val: e.detail.value
    })
    var val=e.detail.value
    if (val!='') {
      var arr = [];
      var record = null;
      for (var i = 0; i < this.data.list.length; i++) {
        if (this.data.list[i].name.indexOf(val)!=-1) {
          arr.push(this.data.list[i])
        } else if (this.data.list[i].companyName.indexOf(val) != -1){
          arr.push(this.data.list[i])          
        } else if (this.data.list[i].job.indexOf(val) != -1){
          arr.push(this.data.list[i])          
        }
      }
      if (arr.length != 0) {
        console.log(arr)
        this.setData({
          list:arr
        })
      }
    }else{
      this.setData({
        list: this.data.list1
      })
    }
  },
  // 滚动
  scroll:function(e){
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type==1){
      console.log(33333333)
      console.log(options)
      wx.navigateTo({
        url: '../contactDetails/contactDetails?name=' + options.name + '&companyName=' + options.companyName + '&job=' + options.job + '&phone=' + options.phone + '&id=' + options.id + '&note=' + options.note + '&src=' + options.src
      })
    }
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.apiUrl + '/card/page.htm',
      data: {
        userToken: app.userToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.data.code == 0) {
          that.setData({
            list: res.data.list,
            list1: res.data.list
          })
        }
      },
      fail: function () {

      }
    })
  },
  home:function(){
    wx.redirectTo({
      url: '../home/home'
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
    var that = this
    if (app.state){
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.apiUrl + '/card/page.htm',
        data: {
          userToken: app.userToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          wx.hideLoading()
          if (res.data.code == 0) {
            that.setData({
              list: res.data.list,
              list1: res.data.list
            })
          }
        },
        fail: function () {

        }
      })
    }
    
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