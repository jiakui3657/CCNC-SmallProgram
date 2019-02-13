// pages/index/activityDetails/activityDetails.js
const app = getApp()
var request = require('../../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    comments:{
      list:[],
      total:null
    },
    praise:{
      list: [],
      total: null
    },
    signUp:{
      list:[],
      total:null
    },
    flag:0,
    switch: false,
    activity:'',
    jump:null,
    liked:null,
    state: null,
    type: null,
    uid:null,
    money:null,
    uid:null,
    click:null,
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    request.loading(true)
    var that=this
    that.setData({
      uid: options.id  
    })
    // 清除本地存储
    wx.removeStorage({
      key: 'key',
      success: function (res) {
        console.log(res.data)
      }
    })
    // 判断是否点击评论
    if (options.index==1){
      that.setData({
        flag: options.index,
        switch:true
      })
    }
    // 判断是否点赞
    if (options.index == 2) {
      that.setData({
        flag: options.index
      })
    }

    // 评论列表
    request.comments('/rest/feed/comments.htm', options.id, that,1,100)
    // 点赞列表
    request.good('/rest/feed/likes.htm', options.id, that,1,100)
    // 报名列表
    wx.request({
      url: app.apiUrl + '/rest/feed/joins.htm',
      data: {
        id: options.id,
        commerce: 1,
        userToken: app.userToken,
        no: 1,
        size: 100
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("222222" + options.id);        
        console.log(res);
        that.setData({
          signUp: {
            list: res.data.list,
            total: res.data.total
          }      
        })
        console.log(that.data.signUp)
      }
    })
  },
  // 查看照片
  preview: function (e) {
    console.log(e);
    var imgs = e.currentTarget.dataset.list;
    var img = [];
    for (var i = 0; i < imgs.length; i++) {
      img.push(imgs[i].url)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: img
    })
  },
  // 分享
  onShareAppMessage: function (ops) {
    if (app.catalog == 0) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops)
      } else {
        return {
          title: '陕西园林商会',
          path: 'pages/login/login?type=1&active=' + 0 + '&id=' + this.data.uid,
          success: function (res) {
            // 转发成功
            console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function (res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    } else {
      return {
        title: '陕西园林商会',
        path: 'pages/login/login?type=0',
        success: function (res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function (res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  },
  // 跳转通讯录详情
  details:function(e){
    wx.navigateTo({
      url: '../../address/details/details?iid=' + e.currentTarget.dataset.iid + '&&name=' + e.currentTarget.dataset.name
    })
  },
  // 点击报名
  signUp:function(){
    var that=this;
    that.setData({
      flag:0
    })
    if (that.data.state){
      wx.showToast({
        title: '已报名',
        icon: 'success',
        duration: 1000
      })
    }else{
      if (that.data.type == 0) {
        wx.navigateTo({
          url: '../../index/pay/pay?id=' + that.data.id + '&money=' + that.data.money + '&name=' + that.data.list.member.name + '&avatar=' + that.data.list.member.avatar + '&job=' + that.data.list.member.job
        })
      } else {
        wx.navigateTo({
          url: '../../index/signUp/signUp?id=' + that.data.id + '&money=' + that.data.money + '&name=' + that.data.list.member.name + '&avatar=' + that.data.list.member.avatar + '&job=' + that.data.list.member.job
        })
      }
    }
  },
  // 关闭评论
  cancel:function(){
    this.setData({
      switch: false
    })
  },
  // 点赞
  addPraise: function (e){
    this.setData({
      flag: 2
    })
    if (e.currentTarget.dataset.isactive){
      wx.showToast({
        title: '已点赞',
        icon: 'success',
        duration: 500
      })
    }else{
      var that = this
      app.dynamic = 1
      that.setData({
        liked: !that.data.liked,
        click: true,
        flag: 2
      })
      wx.request({
        url: app.apiUrl + '/rest/feed/like.htm',
        data: {
          id: that.data.uid,
          commerce: 1,
          userToken: app.userToken,
          no:1,
          size:100
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            request.good('/rest/feed/likes.htm', that.data.uid, that,1,100)
          }
          if (res.data.id != -1) {
            wx.showToast({
              title: '点赞成功',
              icon: 'success',
              duration: 500
            })
          }
        }
      })
    }
    
  },
  // 显示评论
  comment:function(){
    var that = this;
    that.setData({
      switch:true,
      flag:1,
      disabled:true
    })
  },
  // 获取评论内容
  text:function(e){
    this.setData({
      activity: e.detail.value
    })
    if (this.data.activity!=''){
      this.setData({
        disabled: false
      })
    }else{
      this.setData({
        disabled: true
      })
    }
  },
  // 发送评论
  send:function(){
    var that=this;
    console.log(that.data.activity)
    if (that.data.activity!=undefined){
      app.dynamic=1
      wx.request({
        url: app.apiUrl + '/rest/feed/comment.htm',
        data: {
          commerce: 1,
          userToken: app.userToken,
          id: that.data.uid,
          note: that.data.activity,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            that.setData({
              switch: false
            })
            request.comments('/rest/feed/comments.htm', that.data.uid, that,1,100)
          } else {

          }
        },
        fail: function () {
          // fail
        },

        complete: function () {
          // complete
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      })
    }
  },
  // 切换报名
  tab1:function(){
    this.setData({
      flag:0
    })
  },
  // 切换评论
  tab2: function () {
    this.setData({
      flag: 1
    })
  },
  // 切换点赞
  tab3: function () {
    this.setData({
      flag: 2
    })
  },
  // 地图定位
  open: function (e) {
    console.log(e)
    wx.openLocation({
      latitude: e.currentTarget.dataset.latitude,
      longitude: e.currentTarget.dataset.longitude,
      scale: 14
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    request.loading(false)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this 
    if(true){
      request.loading(true)
      wx.request({
        url: app.apiUrl + '/rest/feed/findById.htm',
        data: {
          id: that.data.uid,
          commerce: 1,
          userToken: app.userToken
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            request.loading(false)
            that.setData({
              list: res.data,
              id: res.data.activity.id,
              liked: res.data.liked,
              state: res.data.activity.haveJoin,
              type: res.data.activity.type,
              money: res.data.activity.money
            })
          }
        }
      })
      console.log('1111111111111' + that.data.uid)
      wx.request({
        url: app.apiUrl + '/rest/feed/joins.htm',
        data: {
          id: that.data.uid,
          commerce: 1,
          userToken: app.userToken,
          no: 1,
          size: 10
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          console.log(res);
          that.setData({
            signUp: {
              list: res.data.list,
              total: res.data.total
            }
          })
          console.log(that.data.signUp)
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