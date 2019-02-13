// pages/components/dynamic/dynamic.js
const app = getApp();

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    item: {            // 属性名
      type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      observer:function(){
        this.setData({
          flag:true,
          togg:false
        })
      }
    },
    toggin:String
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    flag:true,
    animationData: {}
  },
  attached: function () { 
    console.log(this.data.key)
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    activityDetails: function (e) {
      var that=this
      if (app.catalog == 0) {
        app.dynamic=0
        wx.navigateTo({
          url: '../../index/activityDetails/activityDetails?id=' + e.currentTarget.id
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
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    open: function (e) {
      if (app.catalog == 0) {
        wx.openLocation({
          latitude: e.currentTarget.dataset.latitude,
          longitude: e.currentTarget.dataset.longitude,
          scale: 14
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
    preview:function(e){
      var imgs = e.currentTarget.dataset.list;
      var img=[];
      for(var i=0;i<imgs.length;i++){
        img.push(imgs[i].url)
      }
      wx.previewImage({
        current: e.currentTarget.dataset.src, 
        urls: img
      })
    },
    praise: function (e) {
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
          success: function (res) {
            console.log(res);
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
              // console.log(e)
              wx.navigateTo({
                url: '../../index/activityDetails/activityDetails?id=' + e.currentTarget.id + '&index=' + 2
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

            } else {
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
    },
    details:function(e){
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
    comments:function(e){
      if (app.catalog == 0) {
        app.dynamic=0
        wx.navigateTo({
          url: '../../index/activityDetails/activityDetails?index=' + e.currentTarget.dataset.index + '&id=' + e.currentTarget.id
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

    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _cancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() {
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }
  }
})