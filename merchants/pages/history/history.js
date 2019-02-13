// pages/history/history.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: 1,
    size: 10,
    total:'',
    totalSize:'',
    list:[],
    search:false,
    startStamp:'',
    endStamp:'',
    start: '',
    end: '',
    timeList:[],
    searchNo:1,
    searchSize:10,
    searchTotal:'',
    searchNoTotalSize:'',
    searchFlag: true,
    nameList:[],
    nameTotal:'',
    nameFlag: true,
    nameNo: 1,
    nameSize: 10,
    nameTotalSize: '',
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.hideShareMenu()
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/statisticcheckin.htm',
      data: {
        userToken: app.userToken,
        no: that.data.no,
        size: that.data.size
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          list: res.data.list,
          total: res.data.total,
          totalSize: res.data.totalPage
        })
        wx.hideLoading()
      }
    })
  },
  // 查询搜索
  input: function (e) {
    var that=this
    console.log(e.detail.value)
    wx.request({
      url: app.url + '/hormone/rest/business/statisticcheckin.htm',
      data: {
        userToken: app.userToken,
        beginDate: '',
        endDate: '',
        name: e.detail.value,
        no: that.data.nameNo,
        size: that.data.nameSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          nameList: res.data.list,
          nameTotal: res.data.total,
          nameFlag: false,
          nameTotalSize: res.data.totalPage,
          name: e.detail.value
        })
      }
    })
  },
  timeShow:function(){
    this.setData({
      search: !this.data.search,
      timeList:[],
      searchNo: 1,
      searchSize: 10,
      searchTotal: '',
      searchNoTotalSize: '',
      startStamp: '',
      endStamp: '',
      start: '',
      end: '',
      nameList: [],
      nameTotal: '',
      nameFlag:true,
      searchFlag: true,
    })
  },
  search:function(){
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/statisticcheckin.htm',
      data: {
        userToken: app.userToken,
        beginDate: that.data.startStamp,
        endDate: that.data.endStamp,
        name:'',
        no: that.data.searchNo,
        size: that.data.searchSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          timeList: res.data.list,
          searchTotal: res.data.total,
          searchNoTotalSize: res.data.totalPage,
          searchFlag:false
        })
        wx.hideLoading()
      }
    })
  },
  bindDateChangeStart:function(e){
    var start=new Date(e.detail.value)
    start = start.getTime()
    this.setData({
      start: e.detail.value,
      startStamp: start
    })
    console.log(start)    
  },
  bindDateChangeEnd:function(e){
    var end = new Date(e.detail.value)
    end = end.getTime()
    this.setData({
      end: e.detail.value,
      endStamp: end
    })
    console.log(end)    
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
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    if (that.data.nameFlag){
      if (that.data.searchFlag) {
        console.log(1)
        wx.request({
          url: app.url + '/hormone/rest/business/statisticcheckin.htm',
          data: {
            userToken: app.userToken,
            no: 1,
            size: that.data.no * that.data.size
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            that.setData({
              list: res.data.list,
              total: res.data.total,
              totalSize: res.data.totalPage
            })
            wx.stopPullDownRefresh()
            wx.hideLoading()
          }
        })
      } else {
        console.log(2)
        wx.request({
          url: app.url + '/hormone/rest/business/statisticcheckin.htm',
          data: {
            userToken: app.userToken,
            beginDate: that.data.startStamp,
            endDate: that.data.endStamp,
            name: '',
            no: 1,
            size: that.data.searchNo * that.data.searchSize
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            that.setData({
              timeList: res.data.list,
              searchTotal: res.data.total,
              searchNoTotalSize: res.data.totalPage
            })
            wx.hideLoading()
            wx.stopPullDownRefresh()
          }
        })
      }
    }else{
      wx.request({
        url: app.url + '/hormone/rest/business/statisticcheckin.htm',
        data: {
          userToken: app.userToken,
          beginDate: '',
          endDate: '',
          name: that.data.name,
          no: 1,
          size: that.data.nameNo*that.data.nameSize
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          that.setData({
            nameList: res.data.list,
            nameTotal: res.data.total,
            nameFlag: false,
            nameTotalSize: res.data.totalPage
          })
          wx.hideLoading()
          wx.stopPullDownRefresh()
        }
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.nameFlag){
      if (that.data.searchFlag) {
        // 当前页+1
        var no = that.data.no + 1;

        if (no <= that.data.totalSize) {

          that.setData({
            no: no
          })

          // 请求后台，获取下一页的数据。
          wx.showLoading({
            title: '加载中',
            mask: true,
            success: function () {
              wx.request({
                url: app.url + '/hormone/rest/business/statisticcheckin.htm',
                data: {
                  no: that.data.no,
                  size: that.data.size,
                  userToken: app.userToken
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res)
                  that.setData({
                    list: that.data.list.concat(res.data.list),
                    total: res.data.total,
                    totalSize: res.data.totalPage
                  })
                  wx.hideLoading()
                }
              })
            }
          })
        }
      } else {
        // 当前页+1
        var searchNo = that.data.searchNo + 1;

        if (searchNo <= that.data.searchNoTotalSize) {

          that.setData({
            searchNo: searchNo
          })

          // 请求后台，获取下一页的数据。
          wx.showLoading({
            title: '加载中',
            mask: true,
            success: function () {
              wx.request({
                url: app.url + '/hormone/rest/business/statisticcheckin.htm',
                data: {
                  userToken: app.userToken,
                  beginDate: that.data.startStamp,
                  endDate: that.data.endStamp,
                  name: '',
                  no: that.data.searchNo,
                  size: that.data.searchSize
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res)
                  that.setData({
                    timeList: that.data.timeList.concat(res.data.list),
                    searchTotal: res.data.total,
                    searchNoTotalSize: res.data.totalPage
                  })
                  wx.hideLoading()
                }
              })
            }
          })
        }
      }
    }else{
      // 当前页+1
      var nameNo = that.data.nameNo + 1;

      if (nameNo <= that.data.nameTotalSize) {

        that.setData({
          nameNo: nameNo
        })

        // 请求后台，获取下一页的数据。
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            wx.request({
              url: app.url + '/hormone/rest/business/statisticcheckin.htm',
              data: {
                userToken: app.userToken,
                beginDate: '',
                endDate: '',
                name: that.data.name,
                no: that.data.nameNo,
                size: that.data.nameSize
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
                that.setData({
                  nameList: that.data.nameList.concat(res.data.list),
                  nameTotal: res.data.total,
                  nameFlag: false,
                  nameTotalSize: res.data.totalPage
                })
                wx.hideLoading()
              }
            })
          }
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})