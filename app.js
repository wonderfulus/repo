//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录q
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    allres: 0,
    current_page_s: 0,
    current_page_e: 3,
    unchosed: '#D4D4D4',
    chosed: 'red',
    data_len: 0,
    goto_page: 'toutiao',
    url_api_top: 'http://39.108.67.61:8888/top',
    url_api_shehui: 'http://39.108.67.61:8888/shehui',
    url_api_yule: 'http://39.108.67.61:8888/yule',
    url_api_tiyu: 'http://39.108.67.61:8888/tiyu',
    url_api_keji: 'http://39.108.67.61:8888/keji',
    url_api_junshi: 'http://39.108.67.61:8888/junshi',
    url_api_changeable: 'http://39.108.67.61:8888/top',
  },
  luyin:function(){
      const recorderManager = wx.getRecorderManager()
      const options = {
        duration: 5000,		//这里是录音时长，单位ms
        sampleRate: 16000,
        numberOfChannels: 1,
        format: 'mp3'		//这里指定mp3格式
      }
      recorderManager.start(options);	//开始录音

      recorderManager.onStop((res) => {	//录音结束会自动调用
        const { tempFilePath } = res;
        var that = this;
        //上传录制的音频
        wx.uploadFile({
          url: "http://39.108.67.61:8888/upload/dist", 	//这里是服务器域名
          filePath: tempFilePath,
          name: 'file',
          complete(res) {
           //console.log(res);
            that.globalData.allres = res;
          }
        })
      })
    
    
  }
  
})