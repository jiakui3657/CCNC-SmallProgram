// pages/entrance/entrance.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    res:{},
    id:'',
    list:[],
    only:'',
    tickets:[],
    num:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.hideShareMenu()
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/info.htm',
      data: {
        userToken: app.userToken,
        code: options.code,
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if(res.data.code!=0){
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel:false,
            success: function (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          var arr = []
          res.data.list.map((item, index) => {
            arr.push({
              companyName: item.companyName,
              date: item.date,
              id: item.id,
              job: item.job,
              name: item.name,
              phone: item.phone,
              state: false
            })
          })
          that.setData({
            res: res.data,
            id: res.data.id,
            list: arr
          })
          wx.hideLoading()
        }
        
      }
    })
  },
  entrance:function(){
    var that = this
    console.log(that.data.tickets)
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/checkin.htm',
      data: {
        userToken: app.userToken,
        tickets: that.data.tickets,
        id: that.data.id
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '入场成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            wx.redirectTo({
              url: '../../pages/login/login'
            })
          }
        })
        wx.hideLoading()
      }
    })
  },
  selected:function(e){
    console.log(e)
    console.log(this.data.list)
    var arr=[]
    var num=this.data.num
    var tickets = this.data.tickets
    this.data.list.map((item,index)=>{
      if(e.currentTarget.dataset.index==index){
        arr.push({
          companyName: item.companyName,
          date: item.date,
          id: item.id,
          job: item.job,
          name: item.name,
          phone: item.phone,
          state: !item.state
        })
        if(!item.state){
          tickets.push(item.id)
          num++
        }else{
          tickets.splice(index,1)
          num--
        }
      }else{
        arr.push({
          companyName: item.companyName,
          date: item.date,
          id: item.id,
          job: item.job,
          name: item.name,
          phone: item.phone,
          state: item.state
        })
      }
      
    })
    this.setData({
      list:arr,
      tickets: tickets,
      num:num
    })
    console.log(this.data.tickets)
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