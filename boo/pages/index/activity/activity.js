//logs.js
const app = getApp();
var amapFile = require('../../../libs/amap-wx.js');
var request = require('../../../utils/request.js');
var pickerFile = require('../../components/picker/picker.js');

Page({
  data: {
    place:'',
    time:'',
    number:'',
    money:'',
    activity:'',
    positioning: '',
    mood: '',
    array: [],
    lng: null,
    lat: null,
    disabled:true,
    focus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(e){

    // 初始化时间选择器
    this.datetimePicker = new pickerFile.pickerDatetime({
      page: this,
      animation: 'slide',
      duration: 300,
      delay: 0
    }); 
  },

  /**
  * 生命周期函数--监听页面显示
  */

  onShow: function () {
    if (this.data.activity != '' && this.data.time != '' && this.data.place != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  // 获取地址
  map:function(){
    wx.navigateTo({
      url: '../../map/map?id='+1
    })
  },
  // 获取时间
  date: function (e) {
    // this.setData({
    //   time: this.datetimePicker.setPicker('time')
    // })
    this.datetimePicker.setPicker('time')
    if (this.data.activity != '' && this.data.time != '' && this.data.place != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  // 获取内容
  moodTextarea: function (e) {
    this.setData({
      activity: e.detail.value,
    })
    if (this.data.activity != '' && this.data.time != '' && this.data.place != ''){
      this.setData({
        disabled:false
      })
    }else{
      this.setData({
        disabled: true
      })
    }
  },
  // 报名费用
  money:function(e){
    this.setData({
      money: e.detail.value
    })
    if (this.data.activity != '' && this.data.time != '' && this.data.place != '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  // 人数限制
  num:function(e){
    this.setData({
      number: e.detail.value
    })
  },
  // 发布活动
  launchEvent: function(){
    var that = this;
    request.loading(true)
    that.setData({
      disabled:true
    })
    console.log(that.data.time)
    var f = new Date(Date.parse(that.data.time.replace(/-/g, "/"))).getTime();
    console.log(f)
    var time = new Date(Date.parse(that.data.time.replace(/-/g, "/"))).getTime();
    console.log(time);
    var images=new Array();
    var xx=0;
    // if (that.data.array.length > 0) {
    //   // request.file(that, '/file/upload.htm', that.data.array, images, xx, that.data.money, that.data.number, time, false)
    //   request.activity(that, '/rest/feed/pubactivityjson.htm', that.data.activity, that.data.place, that.data.lng, that.data.lat, that.data.array, that.data.money, that.data.number, time)
    // } else {
    //   request.activity(that, '/rest/feed/pubactivityjson.htm', that.data.activity, that.data.place, that.data.lng, that.data.lat, that.data.array, that.data.money, that.data.number, time)
    // }
    request.activity(that, '/rest/feed/pubactivityjson.htm', that.data.activity, that.data.place, that.data.lng, that.data.lat, that.data.array, that.data.money, that.data.number, time)
  },
  // 添加图片
  add: function () {
    var that = this;
    var cont = 9 - that.data.array.length
    wx.chooseImage({
      count: cont,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        if (res.errMsg == "chooseImage:ok") {
          var promiseList = res.tempFilePaths.map((item, index) => {
            return new Promise(function (resolve, reject) {
              console.log(item)
              wx.uploadFile({
                url: app.apiUrl + '/file/upload.htm',
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
              array: that.data.array.concat(res)
            })
          }).catch((error) => {
            console.log(error);
          })
        }
      }
    })
  },
  // 删除照片
  delete: function (e) {
    var a = this.data.array;
    for (var i = parseInt(e.currentTarget.id); i < a.length; i++) {
      console.log(i);
      if (i == a.length-1){
        a.splice(i, 1, a[a.length - 1]);
      }else{
        a.splice(i, 1, a[i+1]);
      }
    }
    a.length = a.length - 1;
    this.setData({
      array: a
    });
  }
})
