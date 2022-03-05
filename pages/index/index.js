const app = getApp()
Page({
  data: {
    yw_count: 0,
    fw_count: 0,
    // userInfo: {},
    // hasUserInfo: false,
    // canIUseGetUserProfile: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    currentTab: '1',
    tabList: []
  },
  //  tabs切换逻辑
  swichNav: function (e) {
    let that = this;
    let login_key = wx.getStorageSync('login_key')
    switch (e.currentTarget.dataset.current) {
      case '1':
        that.setData({
          currentTab: e.currentTarget.dataset.current,
        });
        wx.request({
          url: 'https://coachorder.zen-x.com.cn/api/coach/showorder/',
          data: {
            code: this.data.currentTab, //1已预约4未预约
            login_key: login_key
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.status === 0) {
              let tabs = res.data.results
              that.setData({
                yw_count: res.data.yw_count,
                tabList: tabs
              })
            }
          }
        })
        break;
      case '4':
        that.setData({
          currentTab: e.currentTarget.dataset.current,
        });
        wx.request({
          url: 'https://coachorder.zen-x.com.cn/api/coach/showorder/',
          data: {
            code: this.data.currentTab, //1已预约4未预约
            login_key: login_key
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            if (res.data.status === 0) {
              let tabs = res.data.results
              that.setData({
                fw_count: res.data.fw_count,
                yw_count: res.data.yw_count,
                tabList: tabs
              })
            }
          }
        })
        break;
    }
  },
  finishPage(e) {
    let order_status = e.currentTarget.dataset.order_status
    let rec_id = e.currentTarget.dataset.rec_id
    let service = e.currentTarget.dataset.service
    if (order_status === '已预约') {
      wx.navigateTo({
        url: '../../pages/order/order?rec_id=' + rec_id+'&service='+service,
      })
    }
  },
  getList() {
    let that = this;
    let login_key = wx.getStorageSync('login_key')
    // https://coachorder.zen-x.com.cn/api/coach/getPhone/
    if (login_key) {
      wx.request({
        url: 'https://coachorder.zen-x.com.cn/api/coach/showorder/',
        data: {
          code: this.data.currentTab, //1已预约4未预约
          login_key: login_key
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.status === 0) {
            let tabs = res.data.results
            that.setData({
              yw_count: res.data.yw_count,
              fw_count: res.data.fw_count,
              tabList: tabs
            })
          }
        }
      })
    }
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo.avatarUrl) {
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onShow() {
    this.getList()
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let login_key = wx.getStorageSync('login_key')
        wx.request({
          url: 'https://coachorder.zen-x.com.cn/api/coach/login/getUserInfo/',
          method: 'post',
          data: {
            encryptedData: res.encryptedData,
            iv: res.iv,
            login_key: login_key,
            userInfo: {
              avatarUrl: res.userInfo.avatarUrl,
              city: res.userInfo.city,
              country: res.userInfo.country,
              gender: res.userInfo.gender,
              language: res.userInfo.language,
              nickName: res.userInfo.nickName,
              province: res.userInfo.province
            }
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {}
        })
        wx.setStorageSync('userInfo', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onPullDownRefresh: function (e) {},
})