Component({
  /**
   * 组件的属性列表
   * 从父组件传递过来的数据
   */
  properties: {
    // 要接受的数据的名称
    tabs: {
      // type 要接受的数据的类型
      type: Array,
      // value 默认值
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hanldeItemTap(e) {
      console.log(e);
      // 1.绑定点击事件 需要在methods中绑定
      //  2 获取被点击的索引
      const {
        index
      } = e.currentTarget.dataset;
      //5 触发父组件的自定义事件 同时传递数据给 父组件
      this.triggerEvent("itemChange", {
        index
      });
    },
  }
})