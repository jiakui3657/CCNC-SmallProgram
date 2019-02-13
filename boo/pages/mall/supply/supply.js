// pages/mall/supply/supply.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    message: '',//公告消息
    shopCart: { //购物车
      totalSize: 0,
      allMoney: 0,
      shopList: []
    },
    shopCartShow: true, //购物车阴影
    curnTab: 0, // 当前导航项
  },
  /**                        
   * 生命周期函数--监听页面加载   
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.supplyUrl + '/shanghui/shop/getshopList.jspx',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({
          peisongfei: res.data.peisongfei,
          qisongjia: res.data.qisongjia,
          bannerlist: res.data.bannerlist,
          channellist: res.data.channellist,
        })
      }
    })
    //获取公告接口
    wx.request({
      url: app.supplyUrl + '/shanghui/shop/gonggao.jspx',
      success: res => {
        console.log(res)
        
        if (res.data.success == "success") {
          that.setData({
            message: res.data.gonggao.gonggao
          })
          wx.hideLoading()
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //选择类目
  switchTab: function (e) {
    var curnTab = this.data.curnTab;
    var index = e.currentTarget.dataset.index;
    if (index == curnTab) {
      return
    } else {
      this.setData({
        curnTab: index
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var that = this
    that.getShopCart(that)
  },
  //监听页面隐藏
  onHide: function (e) {
    this.setData({
      shopCartShow: true
    })
    wx.setStorage({
      key: 'shopCart',
      data: this.data.shopCart,
    })
  },
  //监听页面卸载
  onUnload: function () {
    wx.setStorage({
      key: 'shopCart',
      data: this.data.shopCart,
    })
  },
  //转商品详情页
  goodsDetail: function (e) {
    wx.navigateTo({
      url: '/pages/index/goodsDetail/goodsDetail?url=' + e.currentTarget.dataset.url
    })
  },

  //增加商品
  addGoods: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    var url = e.currentTarget.dataset.url
    var describe = e.currentTarget.dataset.describe
    var price = Number(e.currentTarget.dataset.price)
    var shopCart = that.data.shopCart
    var list = shopCart.shopList

    if (shopCart.totalSize > 0) {
      var flag = false
      for (var i = 0; i < list.length; i++) {
        if (list[i]['id'] == id) {
          list[i].num += 1
          list[i].totalPrice = that.addDecimal(list[i].totalPrice, price)
          shopCart.totalSize++
          shopCart.allMoney = that.addDecimal(shopCart.allMoney, price)
          flag = true
          break
        }
      }

      if (!flag) {
        list.push({
          id: id,
          name: name,
          url: url,
          describe: describe,
          onePrice: price,
          totalPrice: price,
          num: 1
        })
        shopCart.totalSize++
        shopCart.allMoney = that.addDecimal(shopCart.allMoney, price)
      }
      if (list.length == 1) {
        that.setData({
          shopCartHeight: 80
        })
      } else if (list.length == 2) {
        that.setData({
          shopCartHeight: 130
        })
      } else if (list.length == 3) {
        that.setData({
          shopCartHeight: 180
        })
      } else if (list.length == 4) {
        that.setData({
          shopCartHeight: 230
        })
      } else {
        that.setData({
          shopCartHeight: 230
        })
      }
      that.setData({
        shopCart: shopCart
      })

    } else {
      shopCart.shopList.push({
        id: id,
        name: name,
        url: url,
        describe: describe,
        onePrice: price,
        totalPrice: price,
        num: 1
      })
      shopCart.totalSize++
      shopCart.allMoney = that.addDecimal(shopCart.allMoney, price)

      that.setData({
        shopCart: shopCart
      })

      that.setData({
        shopCartHeight: 80
      })

    }



  },
  //删除商品
  delGoods: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id
    var price = Number(e.currentTarget.dataset.price)
    var shopCart = this.data.shopCart
    var list = shopCart.shopList
    for (var i = 0; i < list.length; i++) {
      if (id == list[i]['id']) {
        if (list[i].num > 1) {
          list[i].num -= 1
          list[i].totalPrice = that.delDecimal(list[i].totalPrice, price)
          shopCart.totalSize--
          shopCart.allMoney = that.delDecimal(shopCart.allMoney, price)

          that.setData({
            shopCart: shopCart
          })
        } else {
          list.splice(i, 1)
          shopCart.totalSize--
          shopCart.allMoney = that.delDecimal(shopCart.allMoney, price)
          if (list.length == 0) {
            that.setData({
              shopCartShow: true,
            })

          } else if (list.length == 1) {

            that.setData({
              shopCartHeight: 80
            })
          } else if (list.length == 2) {
            that.setData({
              shopCartHeight: 130
            })
          } else if (list.length == 3) {
            that.setData({
              shopCartHeight: 180
            })
          } else if (list.length == 4) {
            that.setData({
              shopCartHeight: 230
            })
          } else {
            that.setData({
              shopCartHeight: 230
            })
          }
          that.setData({
            shopCart: shopCart
          })
        }

      }
    }


  },
  //清空购物车
  clearShop: function () {
    var that = this
    wx.setStorage({
      key: 'shopCart',
      data: {
        totalSize: 0,
        allMoney: 0,
        shopList: []
      },
    })
    that.setData({
      shopCartShow: true
    })
    that.getShopCart(that)
  },

  //从缓存获取购物车
  getShopCart(that) {
    wx.getStorage({
      key: 'shopCart',
      success: function (res) {
        that.setData({
          shopCart: res.data
        })
      },
    })
  },

  addDecimal(x, y) {

    return Number((x + y).toFixed(2));
  },
  delDecimal(x, y) {

    return Number((x - y).toFixed(2));
  },

  //点击底部显示购物车
  clickShop: function (e) {
    this.setData({
      shopCartShow: !this.data.shopCartShow
    })
  },
  //转结算页面
  submitOrder: function (e) {
    wx.navigateTo({
      url: '../../mall/order/order?peisongfei=' + this.data.peisongfei,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})