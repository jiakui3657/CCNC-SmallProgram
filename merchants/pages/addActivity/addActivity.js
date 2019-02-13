// pages/addActivity/addActivity.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    max:9,
    multiArray: [],
    multiIndex: [],
    startTime:'',
    startState:false,
    startTimeStamp:'',
    endState:false,
    endTime: '',
    endTimeStamp: '',
    src:[],
    name:'',
    money:'',
    vip:'',
    note:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var multiArray=[]
    var multiIndex=[]
    var years = [], month = [], day = [], when = [], seconds=[];
    // 年
    for(var i=1900;i<=2100;i++){
      years.push(i)
    }
    years.map((item,index)=>{
      if (item == new Date().getFullYear()) {
        multiIndex.push(index)
      }
    })
    // 月
    for (var i = 1; i <= 12; i++) {
      if(i<10){
        i='0'+i
        month.push(i)
      }else{
        month.push(i)
      }
    }
    month.map((item, index) => {
      if (item == new Date().getMonth()+1) {
        multiIndex.push(index)
      }
    })
    // 日
    for (var i = 1; i <= app.day();i++){
      if (i < 10) {
        i = '0' + i
        day.push(i)
      } else {
        day.push(i)
      } 
    }
    day.map((item, index) => {
      if (item == new Date().getDate()) {
        multiIndex.push(index)
      }
    })
    // 时
    for (var i = 1; i <= 23; i++) {
      if (i < 10) {
        i = '0' + i
        when.push(i)
      } else {
        when.push(i)
      }
    }
    when.map((item, index) => {
      if (item == new Date().getHours()) {
        multiIndex.push(index)
      }
    })
    // 分
    for (var i = 1; i <= 59; i++) {
      if (i < 10) {
        i = '0' + i
        seconds.push(i)
      } else {
        seconds.push(i)
      }
    }
    seconds.map((item, index) => {
      if (item == new Date().getMinutes()) {
        multiIndex.push(index)
      }
    })
    multiArray.push(years)
    multiArray.push(month)
    multiArray.push(day)
    multiArray.push(when)
    multiArray.push(seconds)
    this.setData({
      multiArray: multiArray,
      multiIndex: multiIndex
    }) 
    console.log(this.data.multiIndex)
    console.log(this.data.multiArray)
  },
  open:function(){
    var that = this
    console.log(that)
    wx.chooseImage({
      count: that.data.max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        if (res.errMsg == "chooseImage:ok") {
          var promiseList = res.tempFilePaths.map((item, index) => {
            return new Promise(function (resolve, reject) {
              console.log(item)
              wx.uploadFile({
                url: app.url + '/file/upload.htm',
                filePath: item,
                name: 'file',
                success: function (res) {
                  console.log(JSON.parse(res.data))
                  var data = JSON.parse(res.data).url
                  resolve(data)
                }
              })
            })
          })
          Promise.all(promiseList).then((res) => {
            console.log(res)
            that.setData({
              src: that.data.src.concat(res)
            })
          }).catch((error) => {
            console.log(error);
          })
        }
      }
    })
  },
  bindMultiPickerChange:function(e){
    var multiArray=this.data.multiArray
    var years = multiArray[0][e.detail.value[0]]
    var month = multiArray[1][e.detail.value[1]]
    var day = multiArray[2][e.detail.value[2]]
    var when = multiArray[3][e.detail.value[3]]
    var seconds = multiArray[4][e.detail.value[4]]
    var str = years + '-' + month + '-' + day + ' ' + when + ':' + seconds
    var date = new Date(str)
    this.setData({
      startTime:str,
      startState:true,
      startTimeStamp: date.getTime()
    })
  },
  bindMultiPickerChangeTwo:function(e){
    console.log(e)
    var multiArray = this.data.multiArray
    var years = multiArray[0][e.detail.value[0]]
    var month = multiArray[1][e.detail.value[1]]
    var day = multiArray[2][e.detail.value[2]]
    var when = multiArray[3][e.detail.value[3]]
    var seconds = multiArray[4][e.detail.value[4]]
    var str = years + '-' + month + '-' + day + ' ' + when + ':' + seconds
    var date = new Date(str)
    this.setData({
      endTime: str,
      endState: true,
      endTimeStamp: date.getTime()
    })
  },
  name:function(e){
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  money:function(e){
    console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },
  vip:function(e){
    console.log(e.detail.value)
    this.setData({
      vip: e.detail.value
    })
  },
  note:function(e){
    this.setData({
      note: e.detail.value
    })
  },
  addActivity:function(){
    var that=this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/addactivity.htm',
      data: {
        userToken: app.userToken,
        images:that.data.src,
        name: that.data.name,
        money: that.data.money,
        vip: that.data.vip,
        begin: that.data.startTimeStamp,
        end: that.data.endTimeStamp,
        note:that.data.note
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 5000,
          success:function(){
            wx.redirectTo({
              url: '../../pages/login/login'
            })
          }
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
  onShareAppMessage: function () {
  
  }
})