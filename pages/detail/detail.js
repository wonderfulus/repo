// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    do_flag: true,
    data_type_1: '',
    data_type_2: '',
    title: '',
    author: '',
    page_s: 0,
    page_e: 1,
    text: {},
    text_1: '',
    text_2: '',
    command_1: '1.返回  2.下翻页',
    command_2: '',
    outcome: '',
    color_mic: 'rgb(74, 231, 95)',
    state: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.url);
    wx.request({
      url: options.url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        var start = that.data.page_s;
        var end = that.data.page_e;
        that.setData({
          text: res.data,
        })
        if(res.data.body.length == 1){
          var t1 = that.data.text.body[start][1].replace(/enTer/g, '\n');
          that.setData({
            title: that.data.text.title,
            author: that.data.text.author_name,
            data_type_1: that.data.text.body[start][0],
            text_1: t1,
          })
          console.log(t1);
        }
        else{
          that.show_news(that.data.page_s, that.data.page_e);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.setData({
      color_mic: 'rgb(74, 231, 95)',
      state: '正在录音......',
    })
    this.recodeClick();
    getApp().luyin();
    setTimeout(function () {
      that.recodeEnd();
      that.setData({
        color_mic: 'red',
        state: '正在识别,请稍等......',
      })
    }, 5000);
    setInterval(function () {
      if (that.data.do_flag) {
        that.recodeClick();
        that.setData({
          color_mic: 'rgb(74, 231, 95)',
          state: '正在录音......',
        })
        getApp().luyin();
        setTimeout(function () {
          that.recodeEnd();
          that.setData({
            color_mic: 'red',
            state: '正在识别,请稍等......',
          })
        }, 5000);
        var outcome = JSON.parse(getApp().globalData.allres.data).data;
        console.log(outcome);
        that.setData({
          outcome: outcome
        })
        that.dofunc(outcome);
      }
    }, 10000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.do_flag = true;
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  animationFun: function (animationData) {
    if (!this.data.animationStatus) {
      return
    }
    var animation = wx.createAnimation({
      duration: 1000
    })
    animation.opacity(0).scale(2, 2).step();
    this.setData({
      [`${animationData}`]: animation.export()
    })
  },
  animationEnd: function (animationData) {
    var animation = wx.createAnimation({
      duration: 0
    })
    animation.opacity(1).scale(1, 1).step();
    this.setData({
      [`${animationData}`]: animation.export()
    })
  },
  recodeEnd: function () {
    //动画1结束
    var animation1 = wx.createAnimation({
      duration: 0
    })
    animation1.opacity(1).scale(1, 1).step();
    //动画2结束
    var animation2 = wx.createAnimation({
      duration: 0
    })
    animation2.opacity(1).scale(1, 1).step();
    this.setData({
      animationData1: animation1.export(),
      animationData2: animation2.export(),
      animationStatus: false
    })
  },
  recodeClick: function () {
    this.setData({
      animationStatus: true
    })
    this.animationFun('animationData1')
    setTimeout(() => {
      this.animationFun('animationData2')
    }, 500)
    setTimeout(() => {
      this.animationRest()
    }, 1000)
  },
  animationRest: function () {
    //动画重置
    this.animationEnd('animationData1')
    setTimeout(() => {
      this.animationEnd('animationData2')
    }, 500)
    setTimeout(() => {
      if (this.data.animationStatus) {
        this.recodeClick()
      }
    }, 100)

  },

  fallback:function(){
    this.data.do_flag = false;
    clearInterval();
    wx.navigateTo({
      url: '../main/main',
    })
  },

  dofunc:function(outcome){
    var that = this;
    if(outcome == '返回 '){
      that.fallback();
    }
    else if(outcome == '下翻页'){
      if ((that.data.page_e + 1) > that.data.text.body.length) {
        that.setData({
          page_s: 0,
          page_e: 1,
          command_2: '',
        })
      }
      else {
        console.log('执行')
        var start = that.data.page_s;
        var end = that.data.page_e;
        that.setData({
          page_s: start + 2,
          page_e: end + 2,
          command_2: '3.上翻页',
        })
      }
      that.show_news(that.data.page_s, that.data.page_e);
      console.log(that.data.page_s)
      console.log(that.data.page_e)
    }
    else if(outcome == '上翻页' && (that.data.page_s - 2) >= 0){
      var start = that.data.page_s;
      var end = that.data.page_e;
      that.setData({
        page_s: start - 2,
        page_e: end - 2,
        command_2: '',
      })
      that.show_news(that.data.page_s, that.data.page_e);
    }
    else{
      console.log("说的话不在命令中");
      that.setData({
        outcome: '"' + outcome + '"指令无法识别，请重试!'
      })
      return;
    }
    console.log("suc");
  },

  show_news:function(start,end){
    var that = this;
    var t1 = that.data.text.body[start][1].replace(/enTer/g, '\n');
    var t2 = that.data.text.body[end][1].replace(/enTer/g, '\n');
    that.setData({
      title: that.data.text.title,
      author: that.data.text.author_name,
      data_type_1: that.data.text.body[start][0],
      text_1: t1,
      data_type_2: that.data.text.body[end][0],
      text_2: t2
    })
    console.log(t1);
  }
})
