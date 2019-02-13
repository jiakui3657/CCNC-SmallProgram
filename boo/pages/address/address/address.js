//index.js
//获取应用实例
const app = getApp()
var request = require('../../../utils/request.js')

Page({
  data: {
    list: [],
    array: [],
    active: false,
    val: '',
    str: [{
        name: 'a',
        id: null
      },
      {
        name: 'b',
        id: null
      },
      {
        name: 'c',
        id: null
      },
      {
        name: 'd',
        id: null
      },
      {
        name: 'e',
        id: null
      },
      {
        name: 'f',
        id: null
      },
      {
        name: 'g',
        id: null
      },
      {
        name: 'h',
        id: null
      },
      {
        name: 'i',
        id: null
      },
      {
        name: 'j',
        id: null
      },
      {
        name: 'k',
        id: null
      },
      {
        name: 'l',
        id: null
      },
      {
        name: 'm',
        id: null
      },
      {
        name: 'n',
        id: null
      },
      {
        name: 'o',
        id: null
      },
      {
        name: 'p',
        id: null
      },
      {
        name: 'q',
        id: null
      },
      {
        name: 'r',
        id: null
      },
      {
        name: 's',
        id: null
      },
      {
        name: 't',
        id: null
      },
      {
        name: 'u',
        id: null
      },
      {
        name: 'v',
        id: null
      },
      {
        name: 'w',
        id: null
      },
      {
        name: 'x',
        id: null
      },
      {
        name: 'y',
        id: null
      },
      {
        name: 'z',
        id: null
      }
    ],
    toView: null,
    letter: null,
    list1: null,
    flag: false
  },
  onLoad: function(options) {
    var that = this
    // 初始化加载动画
    request.loading(true)

    // 获取联系人
    // request.advertising(this, '/rest/leaguer/list.htm')
    var str1 = that.data.str

    wx.request({
      url: app.apiUrl + '/rest/leaguer/list.htm',
      data: {
        commerce: 1,
        userToken: app.userToken
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res)
        var list = []
        var flag = null
        var str = 'abcdefghijklmnopqrstuvwxyz'.split('')
        for (var i = 0; i < res.data.list.length; i++) {
          var firstLetter = res.data.list[i].headChar.split('')[0]
          console.log(firstLetter)
          for (var j = 0; j < str.length; j++) {
            if (firstLetter != '') {
              if (str[j] == firstLetter) {
                if (list.length == 0) {
                  var obj = {
                    iid: res.data.list[i].id,
                    id: "i" + res.data.list[i].id,
                    letter: firstLetter,
                    name: res.data.list[i].name,
                    list: [res.data.list[i]]
                  }
                  console.log(2222)
                  console.log(str.indexOf(firstLetter))
                  console.log(2222)
                  str1[str.indexOf(firstLetter)].id = 'i' + res.data.list[i].id
                  list.push(obj)
                } else {
                  for (var x = 0; x < list.length; x++) {
                    if (list[x].letter == firstLetter) {
                      list[x].list.push(res.data.list[i])
                      flag = null
                      break
                    }
                    flag = 0
                  }
                  if (flag == 0) {
                    console.log(str.indexOf(firstLetter))
                    var obj1 = {
                      iid: res.data.list[i].id,
                      id: "i" + res.data.list[i].id,
                      letter: firstLetter,
                      name: res.data.list[i].name,
                      list: [res.data.list[i]]
                    }
                    console.log(2222)
                    console.log(str1.indexOf(firstLetter))
                    str1[str.indexOf(firstLetter)].id = 'i' + res.data.list[i].id
                    console.log(2222)
                    list.push(obj1)
                  }
                }
              }
            }

          }
        }
        that.setData({
          list: list,
          str: str1,
          list1: res.data.list
        })
        wx.hideLoading()
      }
    })
  },
  scroll: function(e) {

    console.log(e.detail)
  },

  // 跳转详情
  jump: function(e) {
    if (app.catalog == 0) {
      console.log(e)
      wx.navigateTo({
        url: '../../address/details/details?iid=' + e.currentTarget.dataset.iid + '&&name=' + e.currentTarget.dataset.name
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

  letter: function(e) {
    console.log(e)
    var that = this
    if (e.currentTarget.id != '') {
      that.setData({
        toView: e.currentTarget.id,
        letter: e.currentTarget.dataset.name,
        val: null
      })
      setTimeout(function() {
        that.setData({
          letter: null
        })
      }, 1000)
      console.log(that.data.toView)
    }
  },

  // 拨打电话
  call: function(e) {
    if (app.catalog == 0) {
      wx.makePhoneCall({
        phoneNumber: '' + e.currentTarget.dataset.phone + '' //仅为示例，并非真实的电话号码
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

  // 查询搜索
  input: function(e) {
    this.setData({
      val: e.detail.value
    })
    if ((/[\u4e00-\u9fa5]+/).test(this.data.val)) {
      var arr = [];
      var record = null;
      for (var i = 0; i < this.data.list1.length; i++) {
        console.log(this.data.val)
        if (this.data.list1[i].name.indexOf(this.data.val) > -1) {
          console.log(this.data.list1[i].name.slice(0, this.data.val.length))
          arr.push(this.data.list1[i])
        } else {

        }
        if (this.data.list1[i].companyName != '' && this.data.list1[i].companyName != null) {
          if (this.data.list1[i].companyName.indexOf(this.data.val) > -1) {
            arr.push(this.data.list1[i])
          }
        }
      }
      if (this.data.val.length != 0) {
        console.log(arr)
        this.setData({
          flag: true,
          active: true,
          array: arr
        })
      }
    } else {
      this.setData({
        flag: false,
        active: false
      })
    }
  },

  // 关闭加载动画
  onReady: function() {

  }
})