//login.js
//获取应用实例
const app = getApp()
var comment = require('../../utils/public.js')
var request = require('../../utils/request.js')

Page({
  data: {
    navTab:[
      {
        name:"个人入会"
      },
      {
        name:"企业入会"
      }
    ],
    selected: 0,
    tempFilePaths:'',
    tempFilePaths2: '',
    disabled:true,
    information:{
      phone:'',
      // nameInstitution:'',
      // jobTitle:''
    },
    enterprise:{
      phone: '',
      name:''
    }
  },
  // 入会方式
  selected: function (e) {
    if (this.data.selected != e.target.id){
      this.setData({
        selected: e.target.id,
        // information: {
        //   phone: '',
        //   nameInstitution: '',
        //   jobTitle: ''
        // },
        enterprise: {
          phone: ''
        },
        tempFilePaths: '',
        tempFilePaths2: '',        
        disabled: true
      })
    }
  },

  // 企业*手机号
  enterprisephone:function(e){
    this.data.enterprise.phone = e.detail.value;
    console.log(this.data.enterprise.phone)
    if (this.data.enterprise.phone == '' /*|| this.data.enterprise.name == '' */|| this.data.tempFilePaths == '' /*|| this.data.tempFilePaths2 == ''*/) {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        disabled: false
      })
    } 
  },
  // 个人名片
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        if (that.data.information.phone == '' /*|| that.data.information.nameInstitution == '' || that.data.information.jobTitle == ''*/ || that.data.tempFilePaths == '') {
          that.setData({
            disabled: true
          })
        } else {
          that.setData({
            disabled: false
          })
        } 
      }
    })
  },
  // 企业营业执照
  chooseimage1: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        if (that.data.enterprise.phone == ''/* || that.data.enterprise.name == '' */|| that.data.tempFilePaths == ''/* || that.data.tempFilePaths2 == ''*/) {
          that.setData({
            disabled: true
          })
        } else {
          that.setData({
            disabled: false
          })
        } 
      }
    })
  },

  // 个人入会申请
  addapply:function(image){
    var that = this
    var url = '/rest/commerceapply/apply.htm'
    var phone = that.data.information.phone
    // var companyName = that.data.information.nameInstitution
    // var job = that.data.information.jobTitle
    request.personal(url, phone/*, companyName, job*/, image)  
  },
  // 企业入会申请
  addapply2: function (/*logo,*/image) {
    var that = this;
    var url = '/rest/commerceapply/apply.htm'
    var phone = that.data.enterprise.phone  
    // var name = that.data.enterprise.name  
    request.enterprise(url, phone,/* name, logo, */image)  
  },
  // 上传个人名片
  submit1:function(){
    var that=this;
    comment.loading(true)
    wx.uploadFile({
      url: app.apiUrl + '/file/upload.htm',
      filePath: that.data.tempFilePaths[0],
      name: 'file',
      success: function (res) {
        console.log(JSON.parse(res.data));
        if (JSON.parse(res.data).code==0){
          that.addapply(JSON.parse(res.data).url)
        }
      }
    })
  },
  // 上传企业营业执照
  submit:function(){
    var that = this
    comment.loading(true)
    wx.uploadFile({
      url: app.apiUrl + '/file/upload.htm',
      filePath: that.data.tempFilePaths[0],
      name: 'file',
      success: function (res) {
        console.log(JSON.parse(res.data));
        var logo = JSON.parse(res.data).url
        that.addapply2(logo/*, url*/)
      }
    })
  },
  // 获取个人手机号码
  getPhoneNumber: function(e) {
    var that = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          console.log('no');            
        }
      })
      } else {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '同意授权',
          success: function (res) {
            wx.request({
              url: app.apiUrl + '/rest/member/phone.htm',
              data: {
                commerce: 1,
                userToken: app.userToken,
                encryptedData:e.detail.encryptedData,
                iv: e.detail.iv
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: function (res) {
                console.log(res.data.phone)   
                // if (that.data.selected==0){               
                  that.setData({
                    information: {
                      name: that.data.information.name,
                      idCard: that.data.information.idCard,
                      phone: res.data.phone,
                      nameInstitution: that.data.information.nameInstitution,
                      institutionAddress: that.data.information.institutionAddress,
                      jobTitle: that.data.information.jobTitle
                    }
                  })
                  if (that.data.information.phone == '' /*|| that.data.information.nameInstitution == '' || that.data.information.jobTitle == '' */|| that.data.tempFilePaths == '') {
                    that.setData({
                      disabled: true
                    })
                  } else {
                    that.setData({
                      disabled: false
                    })
                  }
                // }
            
              },
              fail: function () {
               // fail
              },

              complete: function () {
               // complete
              
              }
            })
          }
        })
      }
    }
  
})
