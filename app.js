// app.js
App({
  // data: {
  //   loaded :false
  // },
  onLaunch() {
    // let that = this
    // wx.loadFontFace({
    //   global: true, // 版本 2.10.0 后 全局app.js 使用
    //   family: 'font',
    //   source: 'url("https://coachorder.zen-x.com.cn/media/fonts/SourceHanSansCN-Light.otf")',
    //   success: (res) => {
    //     // console.log(res)
    //     // that.setData({ loaded: true })
    //   },
    //   fail: function (res) {
    //     // that.setData({ loaded: false })
    //   },
    //   complete: function (res) {

    //   }
    // });
    // wx.loadFontFace({
    //   family: 'FZSuXSLSJW',
    //   source: 'url("https://coachorder.zen-x.com.cn/media/fonts/SourceHanSansCN-Bold.otf")',
    //   success: res => {
    //     console.log('font load success', res)
    //   },
    //   fail: err => {
    //     console.log('font load fail', err)
    //   }
    // })

    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: function (res) {
        console.log(res)
        // let that = this
        // var header = {
        //   'content-type': 'application/x-www-form-urlencoded',
        //   'token': wx.getStorageSync('token') //读取cookie 拿到登录之后异步保存的token值
        // };
        const accountInfo = wx.getAccountInfoSync();
        if (res.code) {
          wx.request({
            url: 'https://coachorder.zen-x.com.cn/api/coach/login/',
            data: {
              code: res.code,
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              console.log(res)
              let login_key = res.data.data.login_key
              // console.log(login_key)
              wx.setStorageSync('login_key', login_key)
              // let openid = res.data.openid; //登录之后返回的openid
              // let session_key = res.data.session_key

              // that.setData({
              //   openid: openid,
              //   session_key: session_key
              // });
              // console.log(that.data)
              // console.log(openid, session_key + '我的openid')
              // wx.setStorageSync('openid', openid) //储存openid
              // wx.setStorageSync('session_key', session_key) //储存session_key
              if (login_key != null & login_key != undefined) {

                wx.getUserInfo({
                  success: function (res) {
                    // console.log(res)
                    wx.setStorageSync('encryptedData', res.encryptedData);
                    wx.setStorageSync('iv', res.iv)
                    wx.request({
                      url: 'https://coachorder.zen-x.com.cn/api/coach/login/getUserInfo/',
                      method: 'post',
                      data: {
                        encryptedData: res.encryptedData,
                        iv: res.iv,
                        login_key: login_key
                      },
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success(res) {
                        console.log(res.data)
                      }
                    })
                  },
                  fail: function (res) {
                    // console.info('用户拒绝授权');
                  }
                });
              } else {
                // console.info('获取用户openid失败');
              }
            },
            fail: function (error) {
              // console.info('获取用户openid失败');
              // console.log(error);
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  }
})