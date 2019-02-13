const app = getApp()
var comment = require('./public.js')

function advertising(that,url){
  var _that=this
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      // 广告列表
      if (url == '/rest/ad/list.htm'){
        that.setData({
          imgUrls: res.data.list
        })
      }
      // 头条文章
      else if (url == '/rest/article/page.htm'){
        that.setData({
          singular: res.data.list
        })
      } 
      // 每日最大红包
      else if (url=='/rest/redpacket/max.htm'){
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            money: {
              name: res.data.member.name,
              companyName: res.data.member.companyName,
              code: res.data.code,
              id: res.data.id
            }
          })
          // _that.advertising(that, '/rest/redpacket/showday.htm')
        }
      } 
      // 红包列表
      else if (url == '/rest/redpacket/page.htm'){
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            minMoney: {
              name: res.data.list[0].member.name,
              companyName: res.data.list[0].member.companyName,
              code: res.data.code,
              id: res.data.list[0].id
            }
          })
        }else{
          that.setData({
            minMoney: {
              name: null,
              companyName: null,
              code: res.data.code,
              id: null
            }
          })
        }
      } 
      // 获取联系人
      else if (url == '/rest/leaguer/list.htm'){
        that.setData({
          list: res.data.list
        })
      } 
      // 已抢红包
      else if (url == '/rest/redpacket/showday.htm'){
        console.log(res)
      }
      // 本企业入会人员列表
      else if(url == '/rest/commerceapply/page.htm'){
        console.log(res)
        comment.loading(false)
        that.setData({
          list: res.data.list,
          start: res.data.total,
          end:res.data.num
        })
      }
    }
  })
}

// 添加银行卡
function addBankCard(that, url, bankName, bankNo, name, initBank){
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      bankName: bankName,
      bankNo: bankNo,
      name: name,
      initBank: initBank
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res);
      if (res.data.code == 0) {
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
              app.dynamic=1
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } 
          }
        })
      }
    }
  })
}

// 首页 *　点赞
function good(url,id,that,no,size){
  wx.request({
    url: app.apiUrl + url,
    data: {
      id: id,
      commerce: 1,
      userToken: app.userToken,
      no: no,
      size: size
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      // console.log(res);
      that.setData({
        praise: {
          list: res.data.list,
          total: res.data.total
        }
      })
    }
  })
}

// 评论
function comments(url,id,that,no,size){
  wx.request({
    url: app.apiUrl + url,
    data: {
      id: id,
      commerce: 1,
      userToken: app.userToken,
      no:no,
      size:size
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res)
      that.setData({
        comments: {
          list: res.data.list,
          total: res.data.total
        }
      })
    }
  })
}

// 更新用户基本信息
function my(url){
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res);
      app.change = res.data.money
    }
  })
}

// 个人入会申请
function personal(url, phone,/* companyName, job,*/ image){
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      applyType: 'person',
      phone: phone,
      // companyName: companyName,      
      // job: job,
      image: image
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res)
      comment.loading(false)
      if(res.data.code==0){
        wx.showModal({
          title: '提示',
          content: '提交成功,我们会在48小时内审核',
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            } 
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function () {
      // fail
      comment.loading(false)
      wx.showModal({
        title: '提示',
        content: '请求异常',
        showCancel: false
      })
    },
    complete: function () {
      // complete
     
    }
  })
}

// 企业入会申请
function enterprise(url, phone,image){
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      applyType: 'company',
      phone: phone,
      image: image
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res)
      comment.loading(false)
      if (res.data.code == 0) {
        wx.showModal({
          title: '提示',
          content: '提交成功,我们会在48小时内审核',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false
        })
      }
    },
    fail: function () {
      // fail
      comment.loading(false)
      wx.showModal({
        title: '提示',
        content: '请求异常',
        showCancel: false
      })
    },
    complete: function () {
      // complete
    }
  })
}

// 企业添加个人入会

function firstLoading(that,url,no,size,user) {
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      no: no,
      size: size,
      user:user
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      // console.log(res);
      // 初始化活动与心情
      if (url == '/rest/feed/page.htm'){
        comment.loading(false) 
        console.log(res)               
        if (res.data.code == 0) {
          app.dynamic=''
          that.setData({
            list: res.data.list,
            totalSize: res.data.totalPage
          })
        } else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      } 
      // 获取会员动态
      else if (url == '/rest/feed/user.htm'){
        comment.loading(false)                
        if (res.data.code == 0){
          app.dynamic = ''
          that.setData({
            list: res.data.list,
            totalSize: res.data.totalPage,
            member: res.data.member
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      }
      // 初始化资金流水
      else if (url == '/rest/cash/page.htm') {
        comment.loading(false)        
        if (res.data.code == 0) {
          that.setData({
            list: res.data.list,
            money: res.data.money,
            rate: res.data.fee,
            minmoney: res.data.minCash
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      } 
      // 初始化个人信息
      else if (url == '/rest/feed/my.htm'){
        comment.loading(false)        
        if(res.data.code==0){
          that.setData({
            list: res.data.list,
            totalSize: res.data.totalPage,
            member: res.data.member,
            address: app.address
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
        
      }
      // 我发布的红包
      else if (url == '/rest/center/mypub.htm'){       
        console.log(res);
        comment.loading(false)        
        if(res.data.code==0){
          that.setData({
            participate: {
              money: res.data.money,
              number: res.data.total
            },
            initiateList: res.data.list,
            initiateTotalSize: res.data.totalPage
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      }
      // 我抢到的红包
      else if (url == '/rest/center/myopen.htm'){
        console.log(res)
        comment.loading(false)
        if(res.data.code==0){
          that.setData({
            initiate: {
              money: res.data.money,
              number: res.data.total
            },
            participateList: res.data.list,
            participateTotalSize: res.data.totalPage
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      }
    },
    fail: function () {
      // fail
      comment.loading(false)      
      wx.showToast({
        title: '加载失败',
        duration: 1000
      })
    },
  })
}

function drop(that, url, no, size) {
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      no: no,
      size: size
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res);
      // 下拉刷新首页活动与心情
      if (url == '/rest/feed/page.htm'){
        wx.stopPullDownRefresh()
        comment.loading(false)
        if (res.data.code == 0) {
          that.setData({
            list: res.data.list
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      } 
      // 下拉刷新个人信息
      else if (url == '/rest/feed/my.htm'){
        wx.stopPullDownRefresh()
        comment.loading(false)
        if(res.data.code==0){
          that.setData({
            list: res.data.list
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      }
      
    },
    fail: function () {
      // fail
      wx.stopPullDownRefresh()      
      comment.loading(false)                    
      wx.showToast({
        title: '加载失败',
        icon: 'success',
        duration: 1000
      })
    }
  })
}  

function more(that, url, no, size) {
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      no: no,
      size: size
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success: function (res) {
      console.log(res)
      // 触底加载首页心情与活动
      if (url == '/rest/feed/page.htm'){
        comment.loading(false)        
        if (res.data.code == 0) {
          that.setData({
            list: that.data.list.concat(res.data.list),
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      } 
      // 触底加载资金列表
      else if (url == '/rest/cash/page.htm'){
        comment.loading(false)
        if(res.data.code==0){
          that.setData({
            list: that.data.list.concat(res.data.list)
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      }
      // 触底加载个人信息
      else if (url == '/rest/feed/my.htm'){
        comment.loading(false)
        if(res.data.code==0){
          that.setData({
            list: that.data.list.concat(res.data.list)
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
          })
        }
      }
    },
    fail: function () {
      // fail
      comment.loading(false)              
      wx.showToast({
        title: '加载失败',
        duration: 1000
      })
    },
    complete: function () {
      // complete
       
    }
  })
}

function loading(flag){
  if(flag){
    wx.showLoading({
      title: '加载中',
    })
  }else{
    wx.hideLoading()
  }
}

// 发布心情
function mood(that, url, note, address, lng, lat, images, money, num, payType){
  var _that = this
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      note: note,
      address: address,
      lng: lng,
      lat: lat,
      images:images,
      money: money,
      num: num,
      payType: payType
    },
    method: 'POST',
    success: function (res) {
      console.log(res);
      if (payType =='cash'){
        if (res.data.code == 0) {
          comment.loading(false)
          app.dynamic=1
          _that.my('/rest/member/my.htm')          
          wx.switchTab({
            url: '../index/index'
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000,
            success:function(){
              setTimeout(function(){
                that.setData({
                  disabled: false
                })
              },2000)
            }
          })
        }
      }else{
        comment.pay(that,res.data.pay)
      }
    },
    fail: function () {
      that.setData({
        disabled: false
      })
    },
    complete: function () {
      // complete
    }
  })
}

// 上传图片
function file(that, url, array, images, xx, money, num, payType, start){
  var _that=this
  let promiseList = array.map((item) => {
    return new Promise(resolve => {
      wx.uploadFile({
        url: app.apiUrl + url,
        filePath: item,
        name: 'file',
        success: (res) => {
          var data = JSON.parse(res.data).url
          resolve(data)
        }
      });
    });
  })
  Promise.all(promiseList).then((res) => {
    images=res
    if (start == null) {
      _that.mood(that, '/rest/feed/pubfeedjson.htm', that.data.mood, that.data.place, that.data.lng, that.data.lat, images, money, num, payType)
    }else{
      _that.activity(that, '/rest/feed/pubactivityjson.htm', that.data.activity, that.data.place, that.data.lng, that.data.lat, images, money, num, payType)
  }
  }).catch((error) => {
    console.log(error);
  });
  // for (var i = 0; i < array.length; i++) {
  //   wx.uploadFile({
  //     url: app.apiUrl + url,
  //     filePath: array[i],
  //     name: 'file',
  //     success: function (res) {
  //       var data = JSON.parse(res.data);
  //       images.push(data.url);
  //       xx++;
  //       if (xx == array.length) {
  //         if (start==null){
  //           _that.mood(that, '/rest/feed/pubfeedjson.htm', that.data.mood, that.data.place, that.data.lng, that.data.lat, images, money, num, payType)
  //         }else{
  //           _that.activity(that, '/rest/feed/pubactivityjson.htm', that.data.activity, that.data.place, that.data.lng, that.data.lat, images, money, num, payType)
  //         }
  //       }
  //     }
  //   })
  // }
}

// 发布活动
function activity(that, url, note, address, lng, lat, images, money, num, beginDate){
  wx.request({
    url: app.apiUrl + url,
    data: {
      commerce: 1,
      userToken: app.userToken,
      note: note,
      address: address,
      lng: lng,
      lat: lat,
      money: money,
      num: num,
      beginDate: beginDate,
      images: images
    },
    method: 'POST',
    success: function (res) {
      console.log(res);
      if (res.data.code == 0) {
        comment.loading(false)
        app.dynamic = 1
        wx.switchTab({
          url: '../index/index'
        })
      }
    },
    fail: function () {
      // fail
      comment.loading(false)
      that.setData({
        disabled: false
      })
    },
    complete: function () {
      // complete
    }
  })
}

module.exports = {
  advertising: advertising,
  good: good,
  comments: comments,
  firstLoading: firstLoading,
  drop: drop,
  more: more,
  loading: loading,
  mood: mood,
  file: file,
  activity: activity,
  my:my,
  personal: personal,
  enterprise: enterprise,
  addBankCard: addBankCard
}