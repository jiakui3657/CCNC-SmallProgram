// pages/components/mood/mood.js
var app = getApp();

Component({
  
  /**
   * 组件的属性列表
   */
  properties: {
    item: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer: function() {
        this.setData({
          flag: true,
          id: null,
          num: 0,
          togg: false
        })
      }
    },
    toggin: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
    id: null,
    num: 0,
    togg: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function() {
      this.setData({
        flag: true,
        id: null,
        num: 0,
        togg: false
      })
    },
    details: function(e) {
      if (app.catalog == 0) {
        app.dynamic = 1
        wx.navigateTo({
          url: '../../address/details/details?iid=' + e.currentTarget.id + '&name=' + e.currentTarget.dataset.name
        })
      } else if (app.catalog == 2) {
        wx.showToast({
          title: '正在审核中',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../../request/request'
        })
      }
    },
    moodDetails: function(e) {
      console.log(e)
      var that = this
      if (app.catalog == 0) {
        app.dynamic = 0
        wx.navigateTo({
          url: '../../index/moodDetails/moodDetails?id=' + e.currentTarget.id + '&moneyId=' + e.currentTarget.dataset.moneyid
        })
        // setTimeout(function(){
        //   that.setData({
        //     flag: true
        //   })
        // },500)
      } else if (app.catalog == 2) {
        wx.showToast({
          title: '正在审核中',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../../request/request'
        })
      }
    },
    comments: function(e) {
      if (app.catalog == 0) {
        app.dynamic = 0
        wx.navigateTo({
          url: '../../index/moodDetails/moodDetails?index=' + e.currentTarget.dataset.index + '&id=' + e.currentTarget.id + '&moneyId=' + e.currentTarget.dataset.moneyid
        })
      } else if (app.catalog == 2) {
        wx.showToast({
          title: '正在审核中',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../../request/request'
        })
      }
    },
    preview: function(e) {
      console.log(e)
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
    open: function(e) {
      console.log(e)
      if (app.catalog == 0) {
        wx.openLocation({
          latitude: e.currentTarget.dataset.latitude,
          longitude: e.currentTarget.dataset.longitude,
          scale: 18,
          name: e.currentTarget.dataset.name
        })
      } else if (app.catalog == 2) {
        wx.showToast({
          title: '正在审核中',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../../request/request'
        })
      }
    },
    praise: function(e) {
      var that = this
      if (app.catalog == 0) {
        wx.request({
          url: app.apiUrl + '/rest/feed/like.htm',
          data: {
            commerce: 1,
            userToken: app.userToken,
            id: e.currentTarget.id
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res)
            if (res.data.code == 0) {
              that.setData({
                id: e.currentTarget.id,
                flag: !that.data.flag,
                togg: true
              })
            } else {
              // that.setData({
              //   id: e.currentTarget.id,
              //   flag: !that.data.flag,
              //   togg: false
              // })
              wx.navigateTo({
                url: '../../index/moodDetails/moodDetails?id=' + e.currentTarget.id + '&moneyId=' + e.currentTarget.dataset.moneyid + '&index=' + 2
              })
            }
            if (that.data.id != e.currentTarget.id) {

              if (e.currentTarget.dataset.flag) {
                that.setData({
                  togg: !e.currentTarget.dataset.flag
                })
              } else {
                that.setData({
                  togg: !e.currentTarget.dataset.flag
                })
              }

            } else {}
          }
        })
      } else if (app.catalog == 2) {
        wx.showToast({
          title: '正在审核中',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../../request/request'
        })
      }
    },
    openMoney: function(e) {
      console.log("asdda")
      var that = this
      if (app.catalog == 0) {
        wx.request({
          url: app.apiUrl + '/rest/redpacket/open.htm',
          data: {
            id: e.currentTarget.id,
            commerce: 1,
            userToken: app.userToken
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            console.log(res);
            if (res.data.code != 0) {
              wx.navigateTo({
                url: '../../index/moodDetails/moodDetails?index=' + e.currentTarget.dataset.index + '&id=' + e.currentTarget.id + '&moneyId=' + e.currentTarget.dataset.moneyid
              })
              that.setData({
                money: {
                  code: 1
                }
              })
            }
          }
        })
      } else if (app.catalog == 2) {
        wx.showToast({
          title: '正在审核中',
          icon: 'loading',
          duration: 2000
        })
      } else {
        wx.navigateTo({
          url: '../../request/request'
        })
      }
    }
  }
})