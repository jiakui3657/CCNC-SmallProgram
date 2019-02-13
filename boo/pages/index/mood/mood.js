//logs.js
const app = getApp();
var amapFile = require('../../../libs/amap-wx.js');
var utils = require('../../../utils/util.js');
var md5 = require('../../../utils/md5.js');
var comment = require('../../../utils/public.js');
var request = require('../../../utils/request.js');


Page({
  data: {
    place:'',
    mood:'',
    array:[],
    flag:0,
    only:0,
    bool:false,
    money:null,
    num:0,
    lng: null,
    lat: null,
    payType: 'cash',
    number:[],
    disabled:true,
    focus:true,
    pay:[
      {
        src:'../../images/change.png',
        name:'余额',
        money:null
      },
      {
        src: '../../images/WeChat.png',
        name: '微信',
        money: null
      }
    ]
  },
  // 添加图片
  add:function(){
    var that=this;
    var cont=9-this.data.array.length;
    // wx.chooseImage({
    //   count: cont, // 默认9  
    //   sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
    //   success: function (res) {
    //     console.log(res)
    //     // var arr=[]
    //     // for (var i = 0; i < res.tempFilePaths.length;){
    //     //   // obj.path = res.tempFilePaths[i];
    //     //   arr.push(res.tempFilePaths[i])
    //     // }
    //     // console.log(arr)
    //     //  that.setData({
    //     //   array: arr
    //     // })
    //      if (that.data.array.length >= 0) {
    //        that.setData({
    //          disabled: false
    //        })
    //      } else {
    //        that.setData({
    //          disabled: true
    //        })
    //      }
    //   }
    // })
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
          if (that.data.array.length >= 0) {
            that.setData({
              disabled: false
            })
          } else {
            that.setData({
              disabled: true
            })
          }
        }
      }
    })
  },
  // 删除图片
  delete:function(e){
    var a=this.data.array;
    for (var i = parseInt(e.currentTarget.id);i < a.length;i++){
      if (i == a.length - 1) {
        a.splice(i, 1, a[a.length - 1]);
      } else {
        a.splice(i, 1, a[i + 1]);
      }
    }
    a.length=a.length-1;
    this.setData({
      array: a
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
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
      ]
    })
    // 选择金额
    wx.request({
      url: app.apiUrl + '/rest/redpacket/list.htm',
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
  // 心情内容
  moodTextarea: function (e) {
    this.setData({
      mood: e.detail.value
    })
    if(this.data.mood!=''){
      this.setData({
        disabled:false
      })
    }else{
      this.setData({
        disabled: true
      })
    }
  },
  // 发布心情
  activeRequest: function(){
    comment.loading(true)
    var that=this
    that.setData({
      disabled:true
    })
    var images = new Array();
    var xx = 0;
    if (that.data.bool) {
      if (that.data.money == null && that.data.num == 0) {
        console.log(that.data.number);
        var money = that.data.number[that.data.only].money
        var num = that.data.number[that.data.only].num
        if (that.data.array.length > 0) {
          request.file(that, '/file/upload.htm', that.data.array, images, xx, money, num, that.data.payType)
        } else {
          request.mood(that, '/rest/feed/pubfeedjson.htm', that.data.mood, that.data.place, that.data.lng, that.data.lat, images, money, num, that.data.payType)
        }
      } else {
        if (that.data.array.length > 0) {
          request.file(that, '/file/upload.htm', that.data.array, images, xx, parseFloat(that.data.money), parseInt(that.data.num), that.data.payType)
        } else {
          request.mood(that, '/rest/feed/pubfeedjson.htm', that.data.mood, that.data.place, that.data.lng, that.data.lat, images, parseFloat(that.data.money), parseInt(that.data.num), that.data.payType)
        }
      }
    } else {
      if (that.data.array.length > 0) {
        request.file(that, '/file/upload.htm', that.data.array, images, xx, parseFloat(that.data.money), parseInt(that.data.num), that.data.payType)
      } else {
        request.mood(that, '/rest/feed/pubfeedjson.htm', that.data.mood, that.data.place, that.data.lng, that.data.lat, images, parseFloat(that.data.money), parseInt(that.data.num), that.data.payType)
      }
    }
  },
  // 支付方式
  select:function (e){
    if (e.currentTarget.id==0){
      this.setData({
        flag: e.currentTarget.id,
        payType:'cash'
      })
    }else{
      this.setData({
        flag: e.currentTarget.id,
        payType:'wxapp'
      })
    }
  },
  // 获取自定义金额
  money:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  // 红包数量
  num: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  // 选择金额
  moneys:function (e){
    this.setData({
      only: e.currentTarget.id
    })
  },
  // 是否发红包
  toggln:function (e){
    this.setData({
      bool:!this.data.bool
    })
  },
  // 地址选择
  map: function () {
    wx.navigateTo({
      url: '../../map/map'
    })
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: '6353b388f324245c8843c463c10e7c38' });
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data);
        //成功回调
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
})
