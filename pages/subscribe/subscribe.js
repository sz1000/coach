import WxValidate from '../../utils/WxValidate'
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    show: false,
    store: '', //对比门店是否变化  选中之后名字
    order_id: null,
    index: 0,
    parms: {},
    cityInfo: {},
    ser_type: '',
    city: '',
    latitude: '',
    longitude: '',
    form: {
      "is_choosable": false,
      'is_connection': false,
    },
    startTime: null,
    endTime: null,
    array: [],
    // array: ["10:00-14:00", "14:00-18:00", "18:00-22:00"],
    authPhone: '授权手机号',
    // contacts: '获取联系人',
    btnFlag: false,
    getCodeText: '获取验证码',
    sendColor: '#FF0000',
    waitTime: 60,
    title: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    checked: true,
    gender: '0',
    is_connection: false,
    is_choosable: false,
    items: [{
        name: '先生',
        value: '1',
      },
      {
        name: '女士',
        value: '0',
        checked: 'true'
      },
    ]
  },
  radioChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      gender: e.detail.value,
      ['form.gender']: e.detail.value
    })
    wx.setStorageSync("form", this.data.form)
  },
  clickRadio() {
    let check = this.data.checked;
    if (check) {
      check = false;

      console.log("已取消选中");
    } else {
      check = true;
      console.log("已选中");
    }
    this.setData({
      "checked": check,
    });
  },
  closeMask(e) {
    const {
      show
    } = e.detail;
    // console.log(e)
    // console.log('子组件传过来得 ' + show)
    // console.log('父组件得值 ' + this.data.show)
    this.setData({
      show: show
    })
  },
  readPolicy() {
    console.log(1111)
    this.setData({
      show: true
    })
  },

  //获取当前位置信息
  getLocation() {
    let that = this
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //拒绝页跳转
          console.log('console.log(that.data.gender)   ' + that.data.gender)
          wx.navigateTo({
            url: '../../pages/shopList/shopList?order_id=' + that.data.order_id + '&ser_type=' + that.data.ser_type + '&gender=' + that.data.gender,
          })
          // wx.showModal({
          //   title: '请求授权当前位置',
          //   content: '需要获取您的地理位置，请确认授权',
          //   success: function (res) {
          //     if (res.cancel) {
          //       wx.showToast({
          //         title: '拒绝授权',
          //         icon: 'none',
          //         duration: 1000
          //       })
          //     } else if (res.confirm) {
          //       wx.openSetting({
          //         success: function (dataAu) {
          //           if (dataAu.authSetting["scope.userLocation"] == true) {
          //             wx.showToast({
          //               title: '授权成功',
          //               icon: 'success',
          //               duration: 1000
          //             })
          //             //再次授权，调用wx.getLocation的API
          //             that.getToLocation()
          //           } else {
          //             wx.showToast({
          //               title: '授权失败',
          //               icon: 'none',
          //               duration: 1000
          //             })
          //           }
          //         }
          //       })
          //     }
          //   }
          // })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getToLocation()
        } else {
          //调用wx.getLocation的API
          that.getToLocation()
        }
      }
    })
  },
  // 微信获得经纬度
  getToLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.getLocal(latitude, longitude)
      },
      fail: function (err) {
        console.log('console.log(that.data.gender)   ' + that.data.gender)
        wx.navigateTo({
          url: '../../pages/shopList/shopList?order_id=' + that.data.order_id + '&ser_type=' + that.data.ser_type + '&gender=' + that.data.gender,
        })
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let str = res.result.ad_info.city;
        let city = res.result.ad_info.city.slice(0, str.length - 1)
        that.setData({
          city: city,
          ser_type: that.data.ser_type,
          latitude: latitude,
          longitude: longitude
        })

        let cityInfo = {
          city: that.data.city,
          ser_type: that.data.ser_type,
          latitude: latitude,
          longitude: longitude,
        }
        wx.setStorageSync('cityInfo', cityInfo)
        console.log(that)
        console.log('console.log(that.data.gender)   ' + that.data.gender)
        wx.navigateTo({
          // url: '../../pages/shopList/shopList?order_id=' + that.data.order_id + '&ser_type=' + that.data.ser_type + '&gender=' + that.data.gender + '&is_connection=' + that.data.is_connection,
          url: '../../pages/shopList/shopList?order_id=' + that.data.order_id +
            '&cityInfo=' +
            JSON.stringify(cityInfo) + '&ser_type=' + that.data.ser_type + '&gender=' + that.data.gender,
        })
      },
      fail: function (res) {},
      complete: function (err) {}
    });
  },
  goShop(e) { //跳转门店列表
    this.getLocation()

  },
  getTime(parms) {
    let that = this
    console.log(this.data.store)
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/showtime/',
      method: 'POST',
      data: {
        store_name: parms
      },
      header: {
        'content-type': 'application/json;' // 默认值
      },
      success(res) {
        console.log(res.data.results)
        let timeArr = res.data.results;
        let newTime;
        newTime = Array.from(timeArr, item => item.timequantum);
        that.setData({
          array: newTime,
          // index:0
        })
        let index = that.data.array.indexOf(that.data.form.time)
        console.log(index)
        that.setData({
          index,
        })
        console.log(that.data.array)
      }
    })
  },
  checkConnectionChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e)
    var check = this.data.form.is_connection;
    if (check) {
      this.data.form.is_connection = false;
      console.log("已取消选中");
    } else {
      this.data.form.is_connection = true;
      console.log("已选中");
    }
    this.setData({
      'is_connection': this.data.form.is_connection,
      ['form.is_connection']: this.data.form.is_connection,
    });
    wx.setStorageSync("form", this.data.form)
  },
  checkChoosableChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var check = this.data.is_choosable;
    if (check) {
      this.data.is_choosable = false;
      console.log("已取消选中");
    } else {
      this.data.is_choosable = true;
      console.log("已选中");
    }
    this.setData({
      'is_choosable': this.data.is_choosable,
      ['form.is_choosable']: this.data.is_choosable,
    });
    wx.setStorageSync("form", this.data.form)
  },
  clickTime(e) {
    // console.log(this.data.flag)
    if (this.data.flag) {
      console.log("可以选择")
    } else {
      wx.showToast({
        title: '请先选择门店',
        duration: 2000
      })
      return
    }
  },
  // 改变下拉选项时间
  bindPickerChange: function (e) {
    console.log("触发了");
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      index: e.detail.value,
      ['form.time']: this.data.array[e.detail.value]
    })
    wx.setStorageSync("form", this.data.form)
  },
  bindDateChange: function (e) { //日期
    let that = this;
    that.setData({
      ['form.date']: e.detail.value
    })
    wx.setStorageSync("form", this.data.form)
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/selectdate/',
      method: 'GET',
      data: {
        date: e.detail.value
      },
      header: {
        'content-type': 'application/json;' // 默认值
      },
      success(res) {}
    })
  },
  getPhoneNumber(e) { //获取手机号
    let that = this;
    let encryptedData = e.detail.encryptedData
    let iv = e.detail.iv
    let login_key = wx.getStorageSync("login_key")
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/getPhone/',
      data: {
        encryptedData,
        iv,
        login_key
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        that.setData({
          ['form.phone']: res.data.user_info.phoneNumber
        })
        wx.setStorageSync('phoneNumber', res.data.user_info.phoneNumber)
      }
    })
  },
  bindphone(e) { //手机号
    this.setData({
      ['form.phone']: e.detail.value
    })
    wx.setStorageSync("form", this.data.form)
  },
  bindContacts(e) { //联系人
    this.setData({
      ['form.contacts']: e.detail.value
    })
    wx.setStorageSync("form", this.data.form)
  },
  bindremark(e) { //备注
    this.setData({
      ['form.remark']: e.detail.value
    })
    wx.setStorageSync("form", this.data.form)
  },
  getVerificationCode(e) { //获取验证码
    // 60秒后重新获取验证码
    var inter = setInterval(function () {
      this.setData({
        btnFlag: true,
        sendColor: '#F00',
        getCodeText: this.data.waitTime + 's后重发',
        waitTime: this.data.waitTime - 1
      });
      if (this.data.waitTime < 0) {
        clearInterval(inter)
        this.setData({
          sendColor: '#000',
          getCodeText: '获取验证码',
          waitTime: 60,
          btnFlag: false
        });
      }
    }.bind(this), 1000);
    // 写自己的服务器和接口- - 
    wx.request({
      url: "https://api.it120.cc/tz/shop/goods/list",
      data: {
        mobiles: this.data.tel,
      },
      method: "POST",
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success(res) {
        if (res.data.success) {
          that.toast('短信验证码发送成功，请注意查收');
        }
      }
    })
  },
  getUserProfile(e) {
    let that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let login_key = wx.getStorageSync('login_key')
        that.setData({
          ['form.nickName']: res.userInfo.nickName
        })
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
  // 报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
  // 验证函数
  initValidate() {
    const rules = {
      phone: {
        required: true,
        tel: true
      },
      contacts: {
        required: true,
        minlength: 1
      },
      gender: {
        required: true,
        minlength: 1
      },
      store: {
        required: true,
        minlength: 2
      },
      date: {
        required: true,
        minlength: 2
      },
      time: {
        required: true,
        minlength: 2
      },
    }
    const messages = {
      phone: {
        required: '请填写手机号',
        tel: '请填写正确的手机号'
      },
      contacts: {
        required: '请填写联系人',
        minlength: '请输入正确的姓氏'
      },
      gender: {
        required: '请填写性别',
        minlength: 1
      },
      store: {
        required: '请填写门店',
        minlength: '请输入正确的门店'
      },
      date: {
        required: '请填写日期',
        minlength: '请输入正确的日期'
      },
      time: {
        required: '请填写时间',
        minlength: '请输入正确的时间'
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  // 调用验证函数
  formSubmit: function (e) {
    let login_key = wx.getStorageSync('login_key')
    let params = Object.assign(this.data.form, {
      login_key: login_key,
    })
    // let params = Object.assign(this.data.form, {
    //   login_key: login_key,
    // }, e.detail.value)
    console.log(e.detail.value)
    console.log(params)
    console.log(this.data.form)
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    if (!this.data.is_choosable) {
      this.setData({
        ['form.is_choosable']: this.data.is_choosable,
      })
    }
    if (!this.data.is_connection) {
      wx.showToast({
        title: '请勾选阅读协议',
        duration: 2000
      })
      return
    }

    let that = this;
    if (this.data.order_id != 'undefined' && this.data.order_id != null) {
      const datas = Object.assign(that.data.form, {})
      wx.request({
        url: 'https://coachorder.zen-x.com.cn/api/coach/updatetorder/',
        method: 'PUT',
        data: datas,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.status === 0) {
            let data = res.data.result
            that.setData({
              parms: data
            })
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../../pages/index/index'
              })
            }, 1000)
          } else {
            that.showModal({
              msg: res.data.msg
            })
          }
        }
      })
    } else {
      let datas = that.data.form
      wx.request({
        url: 'https://coachorder.zen-x.com.cn/api/coach/submitorder/', //仅为示例，并非真实的接口地址
        data: datas,
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.status === 0) {
            let data = res.data.result
            that.setData({
              parms: data
            })
            let parms = JSON.stringify(data)
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '../../pages/order/order?parms=' + encodeURIComponent(parms)
              })
            }, 1000)
          } else {
            that.showModal({
              msg: res.data.msg
            })
          }
        }
      })
    }
  },

  formReset(e) {
    this.setData({})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onLoad: function (options) {
    console.log(options)
    let form = wx.getStorageSync("form")
    console.log(form)
    let index;
    // if (form.time) {
    //   index = this.data.array.indexOf(form.time)
    // } else {
    //   index = -1
    // }
    console.log(index)
    let store = options.sto_name ? options.sto_name : ''
    let sto_phone = options.sto_phone ? options.sto_phone : ''
    let sto_addr = options.sto_addr ? options.sto_addr : ''
    this.setData({
      form,
      // index: index,
      ['form.ser_type']: options.ser_type,
      ['form.store']: store,
      ['form.sto_phone']: sto_phone,
      ['form.sto_addr']: sto_addr,
      ['form.order_id']: options.order_id,
      order_id: options.order_id,
      ser_type: options.ser_type,
      gender: options.gender,
      ['form.gender']: options.gender,
    })
    console.log(this.data.gender)
    console.log(this.data.form, options.gender)
    if (options.ser_type && options.add === "add") { //新增
      this.setData({
        ['form.ser_type']: options.ser_type,
        gender: '0',
        ['form.gender']: '0',
      })
      console.log(this.data.gender,this.data.form)
    }
    console.log(this.data.gender)
    if (this.data.order_id != 'undefined' && this.data.order_id != null) { //修改
      let that = this;
      let login_key = wx.getStorageSync('login_key')
      wx.request({
        url: 'https://coachorder.zen-x.com.cn/api/coach/showorder/',
        method: 'GET',
        data: {
          rec_id: options.order_id,
          login_key
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          // console.log(that.data.array)
          let results = res.data.results
          // let index = that.data.array.indexOf(results.rec_time)
          that.setData({
            // index: index,
            ['form.res_id']: results.res_id,
            ['form.store']: results.res__sto__sto_name,
            ['form.phone']: results.rec_phone,
            ['form.date']: results.rec_reserve_time,
            ['form.time']: results.rec_time,
            ['form.w_week']: results.rec_week,
            ['form.remark']: results.rec_remark,
            ['form.sto_addr']: results.res__sto__sto_addr,
            ['form.sto_phone']: results.res__sto__sto_phone,
            ['form.ser_type']: results.res__ser__ser_type,
            ['form.order_id']: options.order_id,
            ['form.is_choosable']: results.is_choosable,
            ['form.is_connection']: results.is_connection,
            ['form.contacts']: results.full_name,
            is_choosable: results.is_choosable,
            is_connection: results.is_connection,
            ['form.gender']: results.gender,
            gender: results.gender
          })
          console.log(that.data.form.gender, that.data.gender)
          console.log(that.data.store)
          if (that.data.store != '') {
            that.setData({
              ['form.store']: that.data.store,
            })
          }
          wx.setStorageSync("index", index)
          console.log(that.data.form)
          wx.setStorageSync("form", that.data.form)
        }
      })
    }
    this.setData({
      store: store,
    })
    console.log(this.data.form)
    console.log(this.data.form.time)
    if (options.editstore) { //修改预约订单
      console.log(options.editstore)
      let time = this.data.form.time
      console.log(time)
      this.getTime(options.editstore);

      this.setData({
        index: this.data.index,
        flag: true
      })
    } else if (this.data.form.store != '') {
      console.log(this.data.form.store != '')
      this.setData({
        flag: true
      })
    }
    if (this.data.form.store) {
      this.getTime(this.data.store);
    }


    // 获取明天日期
    // startTime
    var day3 = new Date();
    //获取明天日期
    let tomorrowDate = day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000);
    var getTomorrowDate = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
    //获取未来14天内的日期
    let futureDate = day3.setTime(day3.getTime() + 14 * 24 * 60 * 60 * 1000);
    var getFutureDateDate = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();

    this.setData({
      startTime: getTomorrowDate,
      endTime: getFutureDateDate
    })
    this.initValidate() //验证规则函数
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    qqmapsdk = new QQMapWX({
      key: 'NO7BZ-3CT6S-RZ6OA-6FAHG-MHF6Z-QEB5N'
    });
    if (this.data.form.store) {
      this.setData({
        ['form.store']: this.data.form.store
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {

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

  }
})