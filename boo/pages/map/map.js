var amapFile = require('../../libs/amap-wx.js');
// var config = require('../../libs/config.js');

Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    pois: [],
    flag: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this;
    var keywords = null;
    var myAmapFun = new amapFile.AMapWX({ key: '6353b388f324245c8843c463c10e7c38' });
    myAmapFun.getRegeo({
      // iconPathSelected: '../images/marker.png',
      iconPath: "../images/marker.png",
      iconWidth: 22,
      iconHeight: 32,
      success: function (data) {
        console.log(data)
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        that.setData({
          markers: marker
        })
        console.log(that.data.marker)
        that.setData({
          latitude: data[0].latitude
        })
        that.setData({
          longitude: data[0].longitude
        })
        that.setData({
          pois: data[0].regeocodeData.pois
        })
        that.setData({
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        })
        console.log(that.data.pois);
      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    })

  },
  // 根据内容显示相关区域
  bindInput: function (e) {
    var that = this
    var keywords = e.detail.value
    var myAmapFun = new amapFile.AMapWX({ key: '6353b388f324245c8843c463c10e7c38' })
    myAmapFun.getInputtips({
      iconPath: "../images/marker.png",
      keywords: keywords,
      location: '',
      latitude: '',
      success: function (data) {
        console.log(data);
        var address = data.tips[0].location.split(",")
        if (data && data.tips) {
          that.setData({
            pois: data.tips,
            longitude: parseFloat(address[0]),
            latitude: parseFloat(address[1]),
            markers: data.tips[0]
          });
        }
      }
    })
  },
  // 点击获取相关地址信息
  map: function (e) {
    this.setData({
      flag: e.currentTarget.id
    })
    wx.navigateBack();
    console.log(e);
    // 往上一级页面传参
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一级页面

    // 直接调用上一级页面Page对象，存储数据到上一级页面中
    var str = e.currentTarget.dataset.value;
    var lng = e.currentTarget.dataset.location.split(',')[0]
    var lat = e.currentTarget.dataset.location.split(',')[1]

    prevPage.setData({
      place: str,
      lng: lng,
      lat: lat
    });
  }
})
