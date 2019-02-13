var plugin = requirePlugin("myPlugin")
Page({
  data:{
    data:{
      name: '小王',   //姓名 必填
      longitude: '108.94882',   //经度 必填
      latitude: '34.222571',   //纬度 必填
      catalog: '2',   //小程序ID 必填
      phone: '134****4686',   //电话 必填
      vipBj: 'https://test.wangtang.com.cn/hormone/dist/img/b1.png',   //vip背景图 必填
      cardLogo: 'https://test.wangtang.com.cn/hormone/dist/img/vip.png',   //个人图像 必填
      userToken: 'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAAKtWKi5NUrJSMjQyMlaqBQCgpJuvDgAAAA.1C3i0BlNbcAlGtm4koDVdT6iCjih7i2PAhkOR8UiScsung4K-2wW8aTSgwHHsaMXZBgTJIs0oqoVJgvHdI8DBg'   //用户Token 必填
    }
  },
  onLoad: function() {
    plugin.getData()
  }
})