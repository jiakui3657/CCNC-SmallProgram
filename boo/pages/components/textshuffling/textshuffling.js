Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    text:{
      type: String
    },
    // 滚动方向
    orientation: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: 'left' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 初始的滚动距离
    marqueeDistance: {
      type: Number,
      value: 0
    },
    // 文字大小
    size: {
      type: Number,
      value: 14
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {

    marqueePace: 1, //滚动速度

    marqueeDistance: 0, //初始滚动距离

    marqueeDistance2: 0,

    marquee2copy_status: false,

    marquee2_margin: 60,

    size: 14,//字体大小

    orientation: 'left', //滚动方向css3

    interval: 20 // 时间间隔
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    onLoad: function () {
      this.data.text // 页面参数 text 的值
    },
    onShow: function () {
      // 页面显示

      var that = this;

      var length = that.data.text.length * that.data.size; //文字长度

      var windowWidth = app.globalData.ww; // 屏幕宽度
      that.setData({

        length: length,

        windowWidth: windowWidth,

        marquee2_margin: length < windowWidth ? windowWidth - length : that.data.marquee2_margin //当文字长度小于屏幕长度时，需要增加补白

      });
      that.run1(); // 水平一行字滚动完了再按照原来的方向滚动

      that.run2(); // 第一个字消失后立即从右边出现

    },

    run1: function () {

      var that = this;
      var interval = setInterval(function () {
        // 让滚动距离负着走(向左边走)
        if (-that.data.marqueeDistance < that.data.length) {
          // 滚动距离减去移动的速度再赋给data中的距离
          that.setData({

            marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,

          });
        } else { //当循环一圈的时候距离就为630清除定时器再把屏幕宽赋给距离
          clearInterval(interval);

          that.setData({

            marqueeDistance: that.data.windowWidth

          });

          that.run1();

        }

      }, that.data.interval);

    },

    run2: function () {

      var that = this;

      var interval = setInterval(function () {

        if (-that.data.marqueeDistance2 < that.data.length) {

          // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示

          that.setData({

            marqueeDistance2: that.data.marqueeDistance2 - that.data.marqueePace,

            marquee2copy_status: that.data.length + that.data.marqueeDistance2 <= that.data.windowWidth + that.data.marquee2_margin,

          });

        } else {

          if (-that.data.marqueeDistance2 >= that.data.marquee2_margin) { // 当第二条文字滚动到最左边时

            that.setData({

              marqueeDistance2: that.data.marquee2_margin // 直接重新滚动

            });

            clearInterval(interval);

            that.run2();

          } else {

            clearInterval(interval);

            that.setData({

              marqueeDistance2: -that.data.windowWidth

            });

            that.run2();

          }

        }

      }, that.data.interval);

    }
  }
})