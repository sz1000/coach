// pages/cityList/cityList.js
var pinyin = require("../../utils/pinyin.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    order_id:null,
    form: {},
    current: null,
    cityList: [],
    cityName: '',
    personList: [],
    oHeight: '',
    sctop: '',
    list:[],
    ser_type:'',
    gender:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      order_id:options.order_id,
      ser_type:options.ser_type,
      gender:options.gender
    })
    // 获取设备高度
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          oHeight: res.windowHeight
        })
      }
    })
    let that = this
    wx.request({
      url: 'https://coachorder.zen-x.com.cn/api/coach/getCity/',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let arr = res.data.result
        const newArr = arr.map(item => ({
          name: item
        }))
        that.setData({
          list: newArr
        })
        that.list()
      }
    })
  },

  // 数据处理函数
  list() {
    let personList = this.data.personList
    let i = 0
    /**
     * 1、调用外部js的方法ChineseToPinYin对数据进行分组
     * 2、分组的结果存在排序有误的情况,例如I组,V组等没有汉字的分组
     */
    this.data.list.forEach((item, index) => {
      let bool = personList.some(ite => {
        return ite.sign == pinyin.ChineseToPinYin(item.name).substr(0, 1)
      })
      if (personList.length == 0 || !bool) {
        personList.push({
          id: i,
          sign: pinyin.ChineseToPinYin(item.name).substr(0, 1),
          name: [item]
        })
        i++
      } else if (bool) {
        let a = pinyin.ChineseToPinYin(item.name).substr(0, 1)
        for (let s in personList) {
          if (a == personList[s].sign) {
            personList[s].name.push(item)
          }
        }
      }
    })
    this.setData({
      personList,
    })
    /**
     * 3、对分组好的数据进行排序
     * 4、根据标志sign的ASCII码进行初次排序筛选
     * 5、如果标志sign不在A到Z之间,则添加到#分组中
     */
    this.data.personList.forEach((item, index) => {
      if ((item.sign.charCodeAt() < 65 || item.sign.charCodeAt() > 90) && item.sign.charCodeAt() != 35) {
        this.data.personList.splice(index, 1, "")
        // 注:此处为防止splice分割后,数组索引index发生变化,故将需要剔除的元素替换为“”,后再将其剔除
        let i = this.data.personList.findIndex(item => {
          return item.sign == '#'
        })
        if (i != -1) {
          item.name.forEach(it => {
            this.data.personList[i].name.push(it)
          })

        } else {
          this.data.personList.push({
            id: 99,
            sign: '#',
            name: item.name
          })
        }
      }
    })
    // 利用filter方法,剔除之前存在的空元素
    personList = this.data.personList.filter(function (s) {
      return s != ''; // 注：IE9(不包含IE9)以下的版本没有trim()方法
    });
    this.setData({
      personList
    })
    // 利用sort方法进行排序
    this.data.personList.sort(this.listSort('sign'))
    // 一般情况下#分组在最下面,在此做以处理
    if (this.data.personList[0].sign == '#') {
      this.data.personList.splice(0, 1).forEach(item => {
        this.data.personList.push(item)
      })
    }
    this.setData({
      personList
    })
  },
  // 排序
  listSort(prop) {
    return function (a, b) {
      var value1 = a[prop].charCodeAt();
      var value2 = b[prop].charCodeAt();
      return value1 - value2
    }
  },
  // 点击列表中的人员
  choose(e) {
    let city = e.currentTarget.dataset.item.name
    // wx.showToast({
    //   title: city,
    // })
    wx.redirectTo({
      url: '../../pages/shopList/shopList?city=' + city+'&order_id='+this.data.order_id+'&ser_type='+this.data.ser_type+'&gender='+this.data.gender
    })
  },
  /**
   * 点击右侧字母
   * 这里使用的是scroll-view中的自身方法,在scroll-view中添加以下属性
   * 1、enable-back-to-top,点击标题回弹
   * 2、scroll-into-view="{{toView}}",滚动到id为toView的位置,动态设置该id即起到切换的左右
   * 3、scroll-y="true",y轴方向滚动
   * 4、scroll-with-animation="true",滚动动画
   * 注:在使用scroll-view时:必须给当前盒子设置固定的高度,否则无法生效
   */
  chooseLetter(e) {
    let currentItem = e.currentTarget.dataset.item;
    this.setData({
      current: currentItem.id
    })
    this.data.personList.forEach(item => {
      if (item.sign == currentItem.sign) {
        this.setData({
          toView: 'inToView' + currentItem.id //滚动条to指定view
        })
      }
    })
  },
  // 点击回到顶部
  backTop: function (e) {
    this.setData({
      sctop: 0
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})