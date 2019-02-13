//index.js
//获取应用实例
var app = getApp();
var request = require('../../../utils/request.js')
var comment = require('../../../utils/public.js')
const updateManager = wx.getUpdateManager()
Page({
  data: {
    tab: [{
        event: 'introduce',
        src: '../../images/indexTab1.png',
        text: '商会简介'
      },
      {
        event: 'vips',
        src: '../../images/indexTab2.png',
        text: '会员风采'
      },
      {
        event: 'project',
        src: '../../images/indexTab3.png',
        text: '合作项目'
      },
      {
        event: 'industry',
        src: '../../images/indexTab4.png',
        text: '商会专供'
      }
    ],
    imgUrls: [],
    singular: [],
    list: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    no: 1,
    size: 10,
    totalSize: null,
    image: null,
    money: {
      name: null,
      companyName: null,
      code: null,
      id: null
    },
    minMoney: {
      name: null,
      companyName: null,
      code: null,
      id: null
    }
  },

  /**
   * 跳转商会简介
   */

  introduce: function() {
    wx.navigateTo({
      url: '../../index/introduce/introduce'

    })
  },

  /**
   * 会员风采
   */

  vips: function() {
    wx.navigateTo({
      url: '../../index/vips/vips'
    })
  },

  // 合作项目
  project: function() {
    wx.navigateTo({
      url: '../../index/project/project'
    })
  },

  //商会专供
  industry: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../mall/supply/supply'
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
  /**
   * 跳转头条列表
   */

  headlinesTo: function() {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../index/headlines/headlines'

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

  /**
   * 跳转圈子
   */

  circle: function(e) {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../../index/circle/circle'
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

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {

    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    wx.request({
      url: app.hormoneUrl + '/member/loginfromcommerce.htm',
      data: {
        phone: app.phone,
        companyName: app.companyName,
        name: app.name,
        job: app.job,
        avatar: app.avatar
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
        app.hormonePhone = res.data.phone
        app.hormoneName = res.data.name
        app.hormoneVipBj = res.data.background
        app.hormoneUserToken = res.data.userToken
        app.hormoneAvatar = res.data.avatar
        app.hormoneJob = res.data.job
        app.hormoneCompanyName = res.data.companyName
        app.hormoneCatalog = res.data.catalog
        // app.hormonePortrait = ''
      }
    })

    wx.getStorage({
      key: 'key',
      success: function(res) {
        console.log(res)
        if (res.data.active == '0') {
          wx.navigateTo({
            url: '../../index/activityDetails/activityDetails?id=' + res.data.id
          })
        } else if (res.data.active == '1') {
          wx.navigateTo({
            url: '../../index/moodDetails/moodDetails?id=' + res.data.id
          })
        } else if (res.data.active == '2') {
          wx.navigateTo({
            url: '../../index/headlinesDetails/headlinesDetails?id=' + res.data.id
          })
        } else if (res.data.active == '3') {
          wx.navigateTo({
            url: '../../index/projectDetails/projectDetails?id=' + res.data.id
          })
        }
      }
    })

    var that = this;

    // 个人图像
    that.setData({
      image: app.avatar
    })

    // 加载
    comment.loading(true)

    // 定位
    comment.positioning(that)

    // 广告
    request.advertising(that, '/rest/ad/list.htm')

    // 头条
    request.advertising(that, '/rest/article/page.htm')

    if (app.catalog == 0) {

      // 每日最大红包
      request.advertising(that, '/rest/redpacket/max.htm')

      // 红包列表
      request.advertising(that, '/rest/redpacket/page.htm')

    }

    // 心情、活动列表
    request.firstLoading(that, '/rest/feed/page.htm', that.data.no, that.data.size)

  },

  /**
   * 下拉刷新
   */

  onPullDownRefresh: function() {
    var that = this
    comment.loading(true)
    request.drop(that, '/rest/feed/page.htm', 1, that.data.no * that.data.size)

  },

  /**
   * 触底加载
   */

  onReachBottom: function() {
    var that = this

    // 当前页+1
    var no = that.data.no + 1;

    that.setData({
      no: no
    })

    if (no <= that.data.totalSize) {
      comment.loading(true)
      // 请求后台，获取下一页的数据。

      request.more(that, '/rest/feed/page.htm', that.data.no, that.data.size)

    }
  },

  // 转发

  onShareAppMessage: function(ops) {
    if (app.catalog == 0) {
      if (ops.from === 'button') {
        // 来自页面内转发按钮
        console.log(ops)
        return {
          title: '陕西园林商会',
          path: 'pages/login/login?type=1&active=' + ops.target.dataset.active + '&id=' + ops.target.id,
          imageUrl: ops.target.dataset.src,
          success: function(res) {
            // 转发成功
            console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      } else {
        return {
          title: '陕西园林商会',
          path: 'pages/login/login?type=0',
          success: function(res) {
            // 转发成功
            console.log("转发成功:" + JSON.stringify(res));
          },
          fail: function(res) {
            // 转发失败
            console.log("转发失败:" + JSON.stringify(res));
          }
        }
      }
    } else {
      return {
        title: '陕西园林商会',
        path: 'pages/login/login?type=0',
        success: function(res) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(res));
        },
        fail: function(res) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(res));
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function() {
    comment.loading(false)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this

    // 个人图像
    if (app.catalog == 0) {

      // 红包list
      that.setData({
        minMoney: {
          name: null,
          companyName: null,
          code: null,
          id: null
        }
      })
      request.advertising(that, '/rest/redpacket/page.htm')

    }

    if (app.dynamic == 1) {

      console.log(that.data.flag)
      request.loading(true)

      // 心情、活动列表
      request.firstLoading(that, '/rest/feed/page.htm', 1, that.data.no * that.data.size)
      that.setData({
        image: app.avatar
      })
    }
  },

  // 关闭今日红包

  cancel: function() {
    if (app.catalog == 0) {
      this.setData({
        money: {
          code: null,
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

  // 打开红包跳转心情详情

  open: function(e) {
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
          if (res.data.code == 0) {
            wx.navigateTo({
              url: '../../index/moodDetails/moodDetails?id=' + res.data.feedId
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
  },

  // 打开所有红包

  minmoney: function(e) {
    if (app.catalog == 0) {
      if (e.currentTarget.dataset.flag == 0) {
        request.advertising(this, '/rest/redpacket/page.htm')
        this.setData({
          money: {
            name: this.data.minMoney.name,
            companyName: this.data.minMoney.companyName,
            code: this.data.minMoney.code,
            id: this.data.minMoney.id,
            moneyId: this.data.minMoney.moneyId
          }
        })
      }
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

  // 跳转头条详情
  headlinesDetails: function(e) {
    if (app.catalog == 0) {
      wx.navigateTo({
        url: '../headlinesDetails/headlinesDetails?id=' + e.currentTarget.id
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
})