// pages/financial/financial.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: 1,
    size: 10,
    list:[],
    totalSize:'',
    money:'',
    search:false,
    startTime:'',
    endTime:'',
    searchList:[],
    searchTotalSize:'',
    startTimeStamp:'',
    endTimeStamp:'',
    searchNo: 1,
    searchSize: 10,
    searchFlag:true
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
      url: app.url + '/hormone/rest/business/financialstatistics.htm',
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
          list:res.data.list,
          money:res.data.money,
          totalSize: res.data.totalPage
        })
        wx.hideLoading()
      }
    })
  },
  withdrawal:function(){
    wx.navigateTo({
      url: '../../pages/withdrawal/withdrawal'
    })
  },
  switch:function(){
    this.setData({
      search: !this.data.search,
      searchNo: 1,
      searchSize: 10,
      searchList: [],
      searchFlag: true
    })
  },
  bindDateChangeStart:function(e){
    var start = new Date(e.detail.value)
    start = start.getTime()
    this.setData({
      startTime: e.detail.value,
      startTimeStamp: start
    })
  },
  bindDateChangeEnd:function(e){
    var end = new Date(e.detail.value)
    end = end.getTime()
    this.setData({
      endTime: e.detail.value,
      endTimeStamp: end
    })
  },
  search:function(){
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.url + '/hormone/rest/business/financialstatistics.htm',
      data: {
        userToken: app.userToken,
        no: that.data.searchNo,
        size: that.data.searchSize,
        bengin: that.data.startTimeStamp,
        end: that.data.endTimeStamp
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          searchList: res.data.list,
          searchTotalSize: res.data.totalPage,
          searchFlag: false
        })
        wx.hideLoading()
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
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    if (!that.data.search){
      wx.request({
        url: app.url + '/hormone/rest/business/financialstatistics.htm',
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
            money: res.data.money,
            totalSize: res.data.totalPage
          })
          wx.stopPullDownRefresh()
          wx.hideLoading()
        }
      })
    }else{
      wx.request({
        url: app.url + '/hormone/rest/business/financialstatistics.htm',
        data: {
          userToken: app.userToken,
          no: 1,
          size: that.data.searchNo*that.data.searchSize,
          bengin: that.data.startTimeStamp,
          end: that.data.endTimeStamp
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          that.setData({
            searchList: res.data.list,
            searchTotalSize: res.data.totalPage
          })
          wx.stopPullDownRefresh()
          wx.hideLoading()
        }
      })
    }
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (!that.data.search){
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
              url: app.url + '/hormone/rest/business/financialstatistics.htm',
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
                  money: res.data.money,
                  totalSize: res.data.totalPage
                })
                wx.hideLoading()
              }
            })
          }
        })
      }
    }else{
      // 当前页+1
      var searchNo = that.data.searchNo + 1;

      if (searchNo <= that.data.searchTotalSize) {

        that.setData({
          searchNo: searchNo
        })

        // 请求后台，获取下一页的数据。
        wx.showLoading({
          title: '加载中',
          mask: true,
          success: function () {
            wx.request({
              url: app.url + '/hormone/rest/business/financialstatistics.htm',
              data: {
                no: that.data.searchNo,
                size: that.data.searchSize,
                userToken: app.userToken,
                bengin: that.data.startTimeStamp,
                end: that.data.endTimeStamp
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
                that.setData({
                  searchList: that.data.searchList.concat(res.data.list),
                  searchTotalSize: res.data.totalPage
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