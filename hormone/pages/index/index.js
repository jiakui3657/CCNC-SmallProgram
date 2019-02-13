// pages/index/index.js
var amapFile = require('../../libs/amap-wx.js')
var config = require('../../libs/config.js');
const app = getApp()
var timer
Page({
  data: {
    store:{
      flag:false,
      title:'',
      money:'',
      introduce:'',
      phone:'',
      id:null
    },
    activity:true,
    vip:false,
    flag:false,
    first:1,
    latitude: '34.343147',
    longitude: '108.939621',
    latend:'',
    longend:'',
    markers: [],
    markersTwo:[],
    markersThree:[],
    activityData:[],
    catalog: null,
    cardLogo:null,
    vips:{},
    time:9,
    name:'',
    init:false,
    photo:'',
    scale:'16',
    vipTimeEnd:'',
    latitude1: '',
    longitude1: '',
  },
  onLoad: function (e) {
    console.log(e)
    if (e.q) {
      if (app.catalog != 1){
        wx.navigateTo({
          url: '../../pages/pay/pay?id=' + e.q
        })
      }else{
        wx.navigateTo({
          url: '../../pages/vip/vip'
        })
      }
    }
    
    if(e.id=="undefined"){
      
    }else if(e.id){
      wx.navigateTo({
        url: '../../pages/vip/vip?id=' + e.id+'&name='+e.name
      })
    }
    
    // 更新提示
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    this.mapCtx = wx.createMapContext('myMap')
    var that = this
    var key = config.Config.key
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getPoiAround({
      success:function(res){
        console.log(res)
        that.setData({
          longitude: res.markers[0].longitude,
          latitude: res.markers[0].latitude,
          longitude1: res.markers[0].longitude,
          latitude1: res.markers[0].latitude,
          catalog: app.catalog,
          cardLogo: app.cardLogo,
          name:app.name,
          vipBj: app.vipBj,
          photo: app.avatar,
          vipTimeEnd: app.vipTimeEnd
          // bjFlag: bjFlag
        })
        wx.showLoading({
          title:'加载中',
          mask:true,
          success:function(){
            wx.request({
              url: app.url + '/venue/searchbycircle.htm',
              data: {
                lng: res.markers[0].longitude,
                lat: res.markers[0].latitude,
                userToken: app.userToken
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                var markersData = res.data.list
                var markers_new = []
                that.mapCtx.getScale({
                  success: function (res) {
                    console.log(res.scale)
                    markersData.forEach(function (item, index) {
                      if (item.zoom <=res.scale) {
                        if (item.wellknown) {
                          markers_new.push({
                            wellknown: item.wellknown,
                            id: item.id,
                            latitude: item.lat,
                            longitude: item.lng,
                            latitude1: item.lat,
                            longitude1: item.lng,
                            iconPath: item.type,
                            // iconPath:"../../img/ce.png",
                            width: 33.2,
                            height: 42,
                            name: item.name,
                            logo: item.logo,
                            phone: item.phone,
                            summary: item.summary,
                            zIndex: 1111,
                            callout: {
                              content: '',
                              color: '#fff',
                              fontSize: 12,
                              borderRadius: 40,
                              bgColor: 'rgba(0,0,0,0)',
                              padding: 0,
                              display: 'ALWAYS'
                            }
                          })
                        } else {
                          markers_new.push({
                            wellknown: item.wellknown,
                            id: item.id,
                            latitude: item.lat,
                            longitude: item.lng,
                            iconPath: item.type,
                            // iconPath:"../../img/ce.png",
                            width: 33.2,
                            height: 42,
                            name: item.name,
                            logo: item.logo,
                            phone: item.phone,
                            summary: item.summary,
                            zIndex: 111,
                            callout: {
                              content: item.name,
                              color: '#fff',
                              fontSize: 12,
                              borderRadius: 40,
                              bgColor: '#9e108c',
                              padding: 5,
                              display: 'ALWAYS'
                            }
                          })
                        }
                      }
                    })
                    that.setData({
                      markers: markers_new,
                      markersTwo: markers_new,
                      markersThree: markersData,
                      init: true
                    })
                    wx.hideLoading()
                  }
                })
              }
            }) 
          }
        })
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            wx.request({
              url: app.url + '/activity/search.htm',
              data: {
                lng: res.markers[0].longitude,
                lat: res.markers[0].latitude,
                userToken: app.userToken,
                no: 1,
                size: 1
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
                that.setData({
                  activityData:res.data.list[0]
                })
                wx.hideLoading()
              }
            })
          }
        })  
      }
    })
  },
  store:function(e){
    wx.navigateTo({
      url: '../../pages/storeDetails/storeDetails?name=' + this.data.store.title + '&id=' + this.data.store.id + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    })
  },
  cancel:function(){
    this.setData({
      activity: true,
      vip: false,
      store: {
        flag: false,
        title: '',
        money: '',
        introduce: ''
      },
      time:9,
      markers: this.data.markersTwo
    })
    clearTimeout(timer)
  },
  vip:function(e){
    wx.navigateTo({
        url: '../../pages/activation/activation?longitude=' + this.data.longitude + '&latitude=' + this.data.latitude
    })
  },
  sweep: function () {
    wx.scanCode({
      success: (res) => {
        console.log(res.result)
        var id = res.result.split('/')[5]
        id=id.split('.')[0]
        console.log(id)
        if (this.data.catalog != 1) {
          wx.navigateTo({
            url: '../../pages/pay/pay?id=' + id
          })
        } else {
          wx.navigateTo({
            url: '../../pages/vip/vip'
          })
        }
      }
    })
  },
  sweep1: function () {
    wx.navigateTo({
      url: '../../pages/pay/pay'
    })
  },
  getCenterLocation: function () {
    var that=this
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  change:function(e){
    console.log(e.causedBy)
    var that = this
    if (e.causedBy == "drag" || e.causedBy == "update") {
      that.mapCtx.getCenterLocation({
        success: function (res) {
          console.log(that.data.longitude1 + ',' + that.data.latitude1)
          console.log(res.longitude + ',' + res.latitude)
          var lat = [that.data.latitude1, res.latitude]
          var lng = [that.data.longitude1, res.longitude]
          var R = 6378137;
          var dLat = (lat[1] - lat[0]) * Math.PI / 180;
          var dLng = (lng[1] - lng[0]) * Math.PI / 180;
          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = R * c;
          console.log(d)
          if (d > 5000) {
            that.setData({
              latitude1: res.latitude,
              longitude1: res.longitude
            })
            wx.showLoading({
              title: '加载中',
              mask: true,
              success: function () {
                wx.request({
                  url: app.url + '/venue/searchbycircle.htm',
                  data: {
                    lng: res.longitude,
                    lat: res.latitude,
                    userToken: app.userToken
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res)
                    var markersData = res.data.list
                    var markers_new = []
                    that.mapCtx.getScale({
                      success: function (res) {
                        console.log(res.scale)
                        markersData.forEach(function (item, index) {
                          if (item.zoom <=res.scale){
                            if (item.wellknown) {
                              markers_new.push({
                                wellknown: item.wellknown,
                                id: item.id,
                                latitude: item.lat,
                                longitude: item.lng,
                                iconPath: item.type,
                                // iconPath: "../../img/ce.png",
                                width: 33.2,
                                height: 42,
                                name: item.name,
                                logo: item.logo,
                                phone: item.phone,
                                summary: item.summary,
                                zIndex: 1111,
                                callout: {
                                  content: '',
                                  color: '#fff',
                                  fontSize: 12,
                                  borderRadius: 40,
                                  bgColor: 'rgba(0,0,0,0)',
                                  padding: 0,
                                  display: 'ALWAYS'
                                }
                              })
                            } else {
                              markers_new.push({
                                wellknown: item.wellknown,
                                id: item.id,
                                latitude: item.lat,
                                longitude: item.lng,
                                iconPath: item.type,
                                // iconPath: "../../img/ce.png",
                                width: 33.2,
                                height: 42,
                                name: item.name,
                                logo: item.logo,
                                phone: item.phone,
                                summary: item.summary,
                                zIndex: 111,
                                callout: {
                                  content: item.name,
                                  color: '#fff',
                                  fontSize: 12,
                                  borderRadius: 40,
                                  bgColor: '#9e108c',
                                  padding: 5,
                                  display: 'ALWAYS'
                                }
                              })
                            }
                          } 
                        })
                        that.setData({
                          markers: markers_new,
                          markersTwo: markers_new,
                          markersThree: markersData
                        })
                        wx.hideLoading()
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
    if (e.causedBy == "scale" || e.causedBy == "update"){
      var that = this
      var scale = null
      that.mapCtx.getScale({
        success: function (res) {
          console.log(res.scale)
          scale = res.scale;
          if (that.data.init) {
            console.log(that.data.markersThree)        
            var markersData = that.data.markersThree
            var markers_new = []
            console.log(scale)
            markersData.forEach(function (item, index) {
              if (item.zoom <= scale) {
                if (item.wellknown) {
                  markers_new.push({
                    wellknown: item.wellknown,
                    id: item.id,
                    latitude: item.lat,
                    longitude: item.lng,
                    iconPath: item.type,
                    // iconPath: "../../img/ce.png",
                    width: 33.2,
                    height: 42,
                    name: item.name,
                    logo: item.logo,
                    phone: item.phone,
                    summary: item.summary,
                    zIndex: 1111,
                    callout: {
                      content: '',
                      color: '#fff',
                      fontSize: 12,
                      borderRadius: 40,
                      bgColor: 'rgba(0,0,0,0)',
                      padding: 0,
                      display: 'ALWAYS'
                    }
                  })
                } else {
                  markers_new.push({
                    wellknown: item.wellknown,
                    id: item.id,
                    latitude: item.lat,
                    longitude: item.lng,
                    iconPath: item.type,
                    // iconPath: "../../img/ce.png",
                    width: 33.2,
                    height: 42,
                    name: item.name,
                    logo: item.logo,
                    phone: item.phone,
                    summary: item.summary,
                    zIndex: 111,
                    callout: {
                      content: item.name,
                      color: '#fff',
                      fontSize: 12,
                      borderRadius: 40,
                      bgColor: '#9e108c',
                      padding: 5,
                      display: 'ALWAYS'
                    }
                  })
                }
              }
            })
            console.log(markers_new)
            that.setData({
              markers: markers_new,
              markersTwo: markers_new
            })
          }
        }
      })
      
    }
  },
  moveToLocation: function () {
    this.setData({
      scale:16
    })
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },
  showMarkerInfo: function (data, i) {
    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  makertap:function(e){
    console.log(e)
    var that = this   
    if(that.data.init) {
      var id = e.markerId
      var markers = this.data.markers
      var markersTwo = this.data.markersTwo
      var markers_new = []
      var flag = 0
      markers.map((item, index) => {
        if (item.id == id) {
          console.log(item)
          that.setData({
            activity: false,
            vip: false,
            store: {
              flag: !that.data.flag,
              title: item.name,
              money: item.money,
              introduce: item.summary,
              phone: item.phone,
              id: item.id,
              logo: item.logo,
              summary: item.summary
            },
            latend: item.latitude,
            longend: item.longitude
          })
        }
      })
      markersTwo.map((item, index) => {
        console.log(item)
        if (item.id == id) {
          if (item.wellknown){
            markers_new.push({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              iconPath: item.iconPath,
              // iconPath: "../../img/ce.png",
              width: 41.5,
              height: 52.5,
              name: item.name,
              type: item.type,
              phone: item.phone,
              money: item.money,
              summary: item.summary,
              logo: item.logo,
              zIndex: 11111,
              callout: {
                content: '',
                color: '#fff',
                fontSize: 12,
                borderRadius: 40,
                bgColor: 'rgba(0,0,0,0)',
                padding: 0,
                display: 'ALWAYS'
              }
            })
          }else{
            markers_new.push({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              iconPath: item.iconPath,
              // iconPath: "../../img/ce.png",
              width: 41.5,
              height: 52.5,
              name: item.name,
              type: item.type,
              phone: item.phone,
              money: item.money,
              summary: item.summary,
              logo: item.logo,
              zIndex: 0,
              callout: {
                content: item.name,
                color: '#fff',
                fontSize: 12,
                borderRadius: 40,
                bgColor: '#9e108c',
                padding: 5,
                display: 'ALWAYS'
              }
            })
          }
        } else {
          if (item.wellknown){
            markers_new.push({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              iconPath: item.iconPath,
              // iconPath: "../../img/ce.png",
              width: item.width,
              height: item.height,
              name: item.name,
              type: item.type,
              phone: item.phone,
              money: item.money,
              summary: item.summary,
              logo: item.logo,
              zIndex: 1111,
              callout: {
                content: '',
                color: '#fff',
                fontSize: 12,
                borderRadius: 40,
                bgColor: 'rgba(0,0,0,0)',
                padding: 0,
                display: 'ALWAYS'
              }
            })
          }else{
            markers_new.push({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              iconPath: item.iconPath,
              // iconPath: "../../img/ce.png",
              width: item.width,
              height: item.height,
              name: item.name,
              type: item.type,
              phone: item.phone,
              money: item.money,
              summary: item.summary,
              logo: item.logo,
              zIndex: 111,
              callout: {
                content: item.name,
                color: '#fff',
                fontSize: 12,
                borderRadius: 40,
                bgColor: '#9e108c',
                padding: 5,
                display: 'ALWAYS'
              }
            })
          }
          
        }
        flag = 1
      })
      if (flag == 1) {
        console.log(markers_new)
        that.setData({
          markers: markers_new
        })
        flag = 0
      }
      that.setData({
        time:9
      })
      clearTimeout(timer);
    }
  },
  about:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.store.phone
    })
  },
  we:function(){
    wx.navigateTo({
      url: '../../pages/personal/personal'
    })
  },
  phone:function(){
    var that=this
    that.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude + ',' + res.latitude)
        wx.request({
          url: app.url + '/venue/phone.htm',
          data: {
            lng: res.longitude,
            lat: res.latitude,
            userToken: app.userToken
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            wx.makePhoneCall({
              phoneNumber: res.data.phone
            })
          }
        })
      }
    })
    
  },
  card:function(e){
    console.log(e)
    var that=this
    if (e.target.id!=1){    
      if (this.data.vip) {
        clearTimeout(timer);
        this.setData({
          activity: true,
          vip: !this.data.vip,
          time:9
        })
      }else{
        wx.request({
          url: app.url + '/member/pay.htm',
          data: {
            userToken: app.userToken
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            that.setData({
              vips: {
                src: res.data.url
              }
            })
            that.setData({
              vip: !that.data.vip,
              activity: false,
              store: {
                flag: false,
                title: '',
                money: '',
                introduce: ''
              },
            })
            if(that.data.vips.src!=''){
              code(that)
            }
          }
        })
        
      }
    }else{
      wx.navigateTo({
        url: '../../pages/vip/vip'
      })
    }
  },
  activity:function(){
    wx.navigateTo({
      url: '../../pages/activity/activity?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    })
  },
  map:function(){
    console.log(this.data.latend, this.data.longend)
    console.log(this.data.latitude, this.data.longitude)    
    // wx.navigateTo({
    //   url: '../../pages/map/map?latend=' + this.data.latend + '&longend=' + this.data.longend + '&latstate=' + this.data.latitude + '&longstate=' + this.data.longitude
    // })
    wx.openLocation({
      latitude: this.data.latend,
      longitude: this.data.longend,
      name: this.data.store.title
    })
  },
  onShow: function () {
    this.setData({
      photo: app.avatar
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮

    } else {
      return {
        title: '荷尔盟',
        path: 'pages/login/login',
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
  }
})
function code(that) {
  var _that=that
  timer = setTimeout(function () {
    if (_that.data.time!=0){
      _that.setData({
        time: _that.data.time - 1
      })
      code(_that)
    }else{
      wx.request({
        url: app.url + '/member/pay.htm',
        data: {
          userToken: app.userToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          code(_that)
          _that.setData({
            vips: {
              src: res.data.url
            },
            time:9
          })
        }
      })
    }
  }, 1000);
}
