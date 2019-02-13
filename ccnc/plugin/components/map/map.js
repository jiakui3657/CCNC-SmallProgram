var app = require('../../api/data.js')
var timer
Component({
  properties: {
    initData: {
      type: Object,
      value: 'default value',
    }
  },
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
    init: false
  },
  attached: function(){
    console.log(this.properties.initData)
    this.mapCtx = wx.createMapContext('myMap')
    var that = this
    if (that.properties.initData.catalog != 1) {
      var bjFlag = that.properties.initData.vipBj.split('/')[6].split('.')[0]
      console.log(bjFlag)
    }
    that.setData({
      longitude: that.properties.initData.longitude,
      latitude: that.properties.initData.latitude,
      catalog: that.properties.initData.catalog,
      cardLogo: that.properties.initData.cardLogo,
      name: that.properties.initData.name,
      vipBj: that.properties.initData.vipBj,
      bjFlag: bjFlag
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
      success: function () {
        wx.request({
          url: app.url + '/venue/searchbycircle.htm',
          data: {
            lng: that.properties.initData.longitude,
            lat: that.properties.initData.latitude,
            userToken: that.properties.initData.userToken
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
                logo: item.logo,
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
            })
            that.setData({
              markers: markers_new,
              markersTwo: markers_new,
              init: true
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
          url: app.url + '/activity/search.htm',
          data: {
            lng: that.properties.initData.longitude,
            lat: that.properties.initData.latitude,
            userToken: that.properties.initData.userToken,
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
  },
  methods:{
    store: function(e) {
      wx.navigateTo({
        url: '../../pages/storeDetails/storeDetails?name=' + this.data.store.title + '&id=' + this.data.store.id + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
      })
    },
    cancel: function() {
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
      clearTimeout(timer)
    },
    vip: function(e) {
      console.log(e)
      wx.navigateTo({
        url: '../../pages/vip/vip?id=' + e.currentTarget.id
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
    showMarkerInfo: function (data, i) {
      var that = this;
      that.setData({
        textData: {
          name: data[i].name,
          desc: data[i].address
        }
      });
    },
    makertap: function(e) {
      console.log(e)
      var that = this
      if (that.data.init) {
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
              logo: item.logo,
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
                color: '#fff',
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
      }
    },
    about: function() {
      wx.makePhoneCall({
        phoneNumber: this.data.store.phone
      })
    },
    we: function() {
      wx.navigateTo({
        url: '../../pages/personal/personal'
      })
    },
    phone: function() {
      wx.makePhoneCall({
        phoneNumber: this.properties.initData.phone
      })
    },
    card: function(e) {
      console.log(e)
      var that = this
      if (e.target.id != 1) {
        if (this.data.vip) {
          clearTimeout(timer);
          this.setData({
            activity: true,
            vip: !this.data.vip,
          })
        } else {
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
          url: '../../pages/activation/activation'
        })
      }
    },
    activity: function() {
      wx.navigateTo({
        url: '../../pages/activity/activity?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
      })
    },
    map: function() {
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
  }
})
function code(that) {
  timer = setTimeout(function () {
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