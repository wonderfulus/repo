// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color: {
      toutiao: 'red',
      shehui: '#D4D4D4',
      yule: '#D4D4D4',
      tiyu: '#D4D4D4',
      keji: '#D4D4D4',
      junshi: '#D4D4D4'
    },
    array: [{
      title: 'Title1',
      author_name: 'Author1',
      source: 'Source1',
      picture: '',
      url: '',
    }, {
        title: 'Title2',
        author_name: 'Author2',
        source: 'Source2',
        picture: '',
        url: ''
    }, {
        title: 'Title3',
        author_name: 'Author3',
        source: 'Source3',
        picture: '',
        url: ''
      },],
    animationData1: "",
    animationData2: "",
    animationStatus: false,
    do_flag : true,
    command_1: '1.头条 2.社会  3.娱乐  4.体育  5.科技  6.军事',
    command_2: '5.第一条  6.第二条  7.第三条  8.下翻页' ,
    command_3: '',
    outcome: '',
    color_mic: 'rgb(74, 231, 95)',
    state:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: getApp().globalData.url_api_changeable, // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        getApp().globalData.data_len = res.data.data.length
      
        for (var i = getApp().globalData.current_page_s,k=0; i < getApp().globalData.current_page_e;k++,i++){
          var title = 'array[' + k + '].title';
          var author_name = 'array[' + k + '].author_name';
          var source = 'array[' + k + '].source';
          var pic = 'array[' + k + '].picture';
          var url = 'array[' + k + '].url';
          that.setData({
            [title] : res.data.data[i].title,   //数据路径key必须带''号
            [author_name]: res.data.data[i].author_name,
            [source]: res.data.data[i].category,
            [pic]: res.data.data[i].pic,
            [url]: res.data.data[i].url
          })
        }
      },
      fail(res) {
        console.log("failed")
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
      if(that.data.do_flag){
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
            state: '正在识别,请稍等......'
          })
        }, 5000);
        var outcome = JSON.parse(getApp().globalData.allres.data).data;
        console.log(outcome);
        that.setData({
          outcome: outcome,
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

  _seeDetail:function(e){
    this.seeDetail(e.currentTarget.dataset.url);
  },

  seeDetail: function(url){
    this.data.do_flag = false;
    clearInterval();
    var that = this;
    wx.navigateTo({
      url: '../detail/detail?url=' + url,
    })
  },

  switchNav: function(event){
    this.dofunc(event.currentTarget.dataset.current);
  },

  dofunc: function(outcome){
    var i = 0;
    var that = this;
    if (outcome == "第一条"){
      i = 0;
    }
    else if (outcome == "第二条"){
      i = 1;
    }
    else if (outcome == "第三条") {
      i = 2;
    }
    else if (outcome == "社会") {
      getApp().globalData.url_api_changeable = getApp().globalData.url_api_shehui;
      getApp().globalData.current_page_s = 0;
      getApp().globalData.current_page_e = 3;
      var change = 'color.' + getApp().globalData.goto_page;
      that.setData({
        [change]: getApp().globalData.unchosed,
        'color.shehui': getApp().globalData.chosed
      });
      getApp().globalData.goto_page = 'shehui';
      this.onLoad();
      return ;
    }
    else if (outcome == "娱乐"){
      getApp().globalData.url_api_changeable = getApp().globalData.url_api_yule;
      getApp().globalData.current_page_s = 0;
      getApp().globalData.current_page_e = 3;
      var change = 'color.' + getApp().globalData.goto_page;
      that.setData({
        [change]: getApp().globalData.unchosed,
        'color.yule': getApp().globalData.chosed
      });
      getApp().globalData.goto_page = 'yule';
      this.onLoad();
      return ;
    }
    else if (outcome == "体育") {
      getApp().globalData.url_api_changeable = getApp().globalData.url_api_tiyu;
      getApp().globalData.current_page_s = 0;
      getApp().globalData.current_page_e = 3;
      var change = 'color.' + getApp().globalData.goto_page;
      that.setData({
        [change]: getApp().globalData.unchosed,
        'color.tiyu': getApp().globalData.chosed
      });
      getApp().globalData.goto_page = 'tiyu';
      this.onLoad();
      return;
    }
    else if (outcome == "科技") {
      getApp().globalData.url_api_changeable = getApp().globalData.url_api_keji;
      getApp().globalData.current_page_s = 0;
      getApp().globalData.current_page_e = 3;
      var change = 'color.' + getApp().globalData.goto_page;
      that.setData({
        [change]: getApp().globalData.unchosed,
        'color.keji': getApp().globalData.chosed
      });
      getApp().globalData.goto_page = 'keji';
      this.onLoad();
      return;
    }
    else if (outcome == "军事") {
      getApp().globalData.url_api_changeable = getApp().globalData.url_api_junshi;
      getApp().globalData.current_page_s = 0;
      getApp().globalData.current_page_e = 3;
      var change = 'color.' + getApp().globalData.goto_page;
      that.setData({
        [change]: getApp().globalData.unchosed,
        'color.junshi': getApp().globalData.chosed
      });
      getApp().globalData.goto_page = 'junshi';
      this.onLoad();
      return;
    }
    else if (outcome == "头条") {
      getApp().globalData.url_api_changeable = getApp().globalData.url_api_top;
      getApp().globalData.current_page_s = 0;
      getApp().globalData.current_page_e = 3;
      var change = 'color.' + getApp().globalData.goto_page;
      that.setData({
        [change]: getApp().globalData.unchosed,
        'color.toutiao': getApp().globalData.chosed
      });
      getApp().globalData.goto_page = 'toutiao';
      this.onLoad();
      return;
    }
    else if (outcome == "下翻页") {
      if ((getApp().globalData.current_page_e + 3) > getApp().globalData.data_len){
        getApp().globalData.current_page_s = 0;
        getApp().globalData.current_page_e = 3;
      }
      else{
        console.log("执行!");
        getApp().globalData.current_page_s += 3;
        getApp().globalData.current_page_e += 3;
      }
      if (getApp().globalData.current_page_s > 0){
        var that = this;
        that.setData({
          command_3: '9.上翻页',
        });
      }
      this.onLoad();
      return;
    }
    else if (outcome == "上翻页" && getApp().globalData.current_page_s > 0){
      getApp().globalData.current_page_s -= 3;
      getApp().globalData.current_page_e -= 3;
      if (getApp().globalData.current_page_s == 0) {
        var that = this;
        that.setData({
          command_3: '',
        });
      }
      this.onLoad();
      return;
    }
    else{
      console.log("说的话不在命令中");
      var that = this;
      that.setData({
        outcome: '"' + outcome + '"指令无法识别，请重试!'
      })
      return ;
    }
    console.log("suc");
    this.seeDetail(this.data.array[i].url);
  }
})