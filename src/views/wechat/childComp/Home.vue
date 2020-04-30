<template>
  <div>
    <van-cell-group
      center
      v-for="(parent, parentIndex) in menus"
      :key="parentIndex"
      :title="parent.title"
    >
      <van-grid>
        <van-grid-item
          v-for="(child, childIndex) in parent.children"
          :key="childIndex"
          :text="child.name"
          :icon="child.icon"
          :to="child.to"
        />
      </van-grid>
    </van-cell-group>
  </div>
</template>

<script>
const raw = {
  productManagerMenus: [
    {
      name: '订单列表',
      icon: 'orders-o',
      to: '/wechat/product'
    },
    {
      name: '近期工序',
      icon: 'todo-list-o',
      to: '/wechat/recentFinishProcess'
    }
  ],
  workerManagerMenus: [],
  workerMenus: []
};

const levelSelect = {
  productManager: {
    productManagerMenus: [0, 1],
    workerManagerMenus: [],
    workerMenus: []
  },
  workerManager: {
    productManagerMenus: [0, 1],
    workerManagerMenus: [],
    workerMenus: []
  },
  worker: {
    productManagerMenus: [],
    workerManagerMenus: [],
    workerMenus: []
  }
};

function distribution(
  productManagerMenus,
  workerManagerMenus,
  workerMenus,
  select
) {
  for (const one of select.productManagerMenus) {
    productManagerMenus.add(one);
  }
  for (const one of select.workerManagerMenus) {
    workerManagerMenus.add(one);
  }
  for (const one of select.workerMenus) {
    workerMenus.add(one);
  }
}

export default {
  name: 'Home',
  props: {
    level: Array
  },
  computed: {
    menus() {
      let admin = false;
      let productManager = false;
      let workerManager = false;
      let worker = false;

      for (const l of this.level) {
        if (l === 'admin') admin = true;
        else if (l === 'product manager') productManager = true;
        else if (l === 'worker manager') workerManager = true;
        else if (l === 'worker') worker = true;
      }

      let menus = [];
      let productManagerMenus = new Set();
      let workerManagerMenus = new Set();
      let workerMenus = new Set();

      if (admin || productManager) {
        distribution(
          productManagerMenus,
          workerManagerMenus,
          workerMenus,
          levelSelect.productManager
        );
      }

      if (admin || workerManager) {
        distribution(
          productManagerMenus,
          workerManagerMenus,
          workerMenus,
          levelSelect.workerManager
        );
      }

      if (admin || worker) {
        distribution(
          productManagerMenus,
          workerManagerMenus,
          workerMenus,
          levelSelect.worker
        );
      }

      if (productManagerMenus.size !== 0) {
        let children = [];
        for (const index of productManagerMenus) {
          children.push(raw.productManagerMenus[index]);
        }
        menus.push({
          title: '生产管理',
          children
        });
      }

      if (workerManagerMenus.size !== 0) {
        let children = [];
        for (const index of workerManagerMenus) {
          children.push(raw.workerManagerMenus[index]);
        }
        menus.push({
          title: '员工管理',
          children
        });
      }

      if (workerMenus.size !== 0) {
        let children = [];
        for (const index of workerMenus) {
          children.push(raw.workerMenus[index]);
        }
        menus.push({
          title: '个人信息',
          children
        });
      }

      return menus;
    }
  }
};
</script>
