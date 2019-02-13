// pages/we/home/home.js
// pages/index/index.js
var amapFile = require('../../../libs/amap-wx.js')
var config = require('../../../libs/config.js');
const app = getApp()
var timer


Page({
  data: {
    store: {
      flag: false,
      title: '',
      money: '',
      introduce: '',
      phone: '',
      id: null
    },
    activity: true,
    vip: false,
    flag: false,
    first: 1,
    latitude: '34.343147',
    longitude: '108.939621',
    latend: '',
    longend: '',
    markers: [],
    markersTwo: [],
    activityData: [],
    catalog: null,
    cardLogo: null,
    vips: {},
    time: 3000,
    name: '',
    VipBj: '',
    setInter:'',
    init:false
  },
  onLoad: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
    var that = this
    var bj = app.hormoneVipBj
    var bjColor = bj.split('/')[6].split('.')[0]
    console.log(bjColor=='b4')
    bj = bj.split('/')[6].split('.')[0]+'_h.png'
    bj ='https://test.wangtang.com.cn/hormone/dist/img/'+bj
    console.log(bj)
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getPoiAround({
      success: function (res) {
        that.setData({
          longitude: res.markers[0].longitude,
          latitude: res.markers[0].latitude,
          catalog: app.hormoneCatalog,
          name: app.name,
          VipBj: bj,
          job:app.job,
          companyName: app.companyName,
          socialJob:app.social,
          bjColor: bjColor
        })
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            wx.request({
              url: app.hormoneUrl + '/venue/searchbycircle.htm',
              data: {
                lng: res.markers[0].longitude,
                lat: res.markers[0].latitude,
                userToken: app.hormoneUserToken
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                var markersData = res.data.list
                var markers_new = []
                markersData.forEach(function (item, index) {
                  markers_new.push({
                    id: item.id,
                    latitude: item.lat,
                    longitude: item.lng,
                    iconPath: item.type,
                    width: 41.5,
                    height: 48.5,
                    name: item.name,
                    logo:item.logo,
                    callout: {
                      content: item.name,
                      color: 'white',
                      fontSize: 12,
                      borderRadius: 40,
                      bgColor: '#9e108c',
                      padding: 5,
                      display: 'ALWAYS'
                    }
                  })
                })
                that.setData({
                  markers: markers_new,
                  markersTwo: markers_new,
                  init:true
                })
                wx.hideLoading()
              }
            })
          }
        })
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            wx.request({
              url: app.hormoneUrl + '/activity/search.htm',
              data: {
                lng: res.markers[0].longitude,
                lat: res.markers[0].latitude,
                userToken: app.hormoneUserToken,
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
                  activityData: res.data.list[0]
                })
                wx.hideLoading()
              }
            })
          }
        })
      }
    })
  },
  store: function (e) {
    wx.navigateTo({
      url: '../../../pages/we/storeDetails/storeDetails?name=' + this.data.store.title + '&id=' + this.data.store.id + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    })
  },
  cancel: function () {
    console.log(1111)
    this.setData({
      activity: true,
      vip: false,
      store: {
        flag: false,
        title: '',
        money: '',
        introduce: ''
      }
    })
    clearTimeout(timer);
  },
  vip: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../../../pages/we/vip/vip?id=' + e.currentTarget.id
    })
  },
  getCenterLocation: function () {
    var that = this
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
  change: function () {
    var that = this
    if(that.data.init){
      if (this.data.first == 1) {
        this.setData({
          first: 2
        })
      } else {
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            that.mapCtx.getCenterLocation({
              success: function (res) {
                console.log(res.longitude + ',' + res.latitude)
                wx.request({
                  url: app.hormoneUrl + '/venue/searchbycircle.htm',
                  data: {
                    lng: res.longitude,
                    lat: res.latitude,
                    userToken: app.hormoneUserToken
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res)
                    var markersData = res.data.list
                    var markers_new = []
                    markersData.forEach(function (item, index) {
                      markers_new.push({
                        id: item.id,
                        latitude: item.lat,
                        longitude: item.lng,
                        iconPath: item.type,
                        width: 41.5,
                        height: 48.5,
                        name: item.name,
                        type: item.type,
                        phone: item.phone,
                        money: item.money,
                        summary: item.summary,
                        callout: {
                          content: item.name,
                          color: 'white',
                          fontSize: 12,
                          borderRadius: 40,
                          bgColor: '#9e108c',
                          padding: 5,
                          display: 'ALWAYS'
                        }
                      })
                    })
                    that.setData({
                      markers: markers_new,
                      markersTwo: markers_new,
                      store: {
                        flag: that.data.store.flag,
                        title: that.data.store.title,
                        money: that.data.store.money,
                        introduce: that.data.store.introduce
                      },
                      activity: that.data.activity,
                      vip: that.data.vip
                    })
                    wx.hideLoading()
                  }
                })
              }
            })
          }
        })
        this.setData({
          first: 1
        })
      }
    }
  },
  moveToLocation: function () {
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
  makertap: function (e) {
    console.log(e)
    var that = this
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
            logo:item.logo
          },
          latend: item.latitude,
          longend: item.longitude
        })
      }
    })
    markersTwo.map((item, index) => {
      console.log(item)
      if (item.id == id) {
        markers_new.push({
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          iconPath: item.iconPath,
          width: 55,
          height: 62,
          name: item.name,
          type: item.type,
          phone: item.phone,
          money: item.money,
          summary: item.summary,
          logo:item.logo,
          callout: {
            content: item.name,
            color: 'white',
            fontSize: 12,
            borderRadius: 40,
            bgColor: '#9e108c',
            padding: 5,
            display: 'ALWAYS'
          }
        })
      } else {
        markers_new.push({
          id: item.id,
          latitude: item.latitude,
          longitude: item.longitude,
          iconPath: item.iconPath,
          width: item.width,
          height: item.height,
          name: item.name,
          type: item.type,
          phone: item.phone,
          money: item.money,
          summary: item.summary,
          logo: item.logo,
          callout: {
            content: item.name,
            color: 'white',
            fontSize: 12,
            borderRadius: 40,
            bgColor: '#9e108c',
            padding: 5,
            display: 'ALWAYS'
          }
        })
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
    clearTimeout(timer);
  },
  about: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.store.phone
    })
  },
  we: function () {
    wx.navigateTo({
      url: '../../../pages/we/we/we'
    })
  },
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: app.hormonePhone
    })
  },
  card: function (e) {
    var that = this
    if (e.target.id != 1) {
      console.log(this.data.vip)
      if (this.data.vip) {
        clearTimeout(timer);
        this.setData({
          activity: true,
          vip: !this.data.vip,
        })
      }else{
        wx.request({
          url: app.hormoneUrl + '/member/pay.htm',
          data: {
            userToken: app.hormoneUserToken
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
            code(that)
          }
        })
        this.setData({
          vip: !this.data.vip,
          activity: false,
          store: {
            flag: false,
            title: '',
            money: '',
            introduce: ''
          },
        })
      }
    } else {
      wx.navigateTo({
        url: '../../../pages/request/request'
      })
    }
  },
  activity: function () {
    wx.navigateTo({
      url: '../../../pages/we/activity/activity?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    })
  },
  map: function () {
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
  }
})
function code(that) {
  timer = setTimeout(function () {
    wx.request({
      url: app.hormoneUrl + '/member/pay.htm',
      data: {
        userToken: app.hormoneUserToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        code(that)
        that.setData({
          vips: {
            src: res.data.url
          }
        })
      }
    })
  }, 30000);
}
