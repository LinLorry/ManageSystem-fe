<template>
  <div>
    <keep-alive>
      <component
        :is="currentTabComponent"
        :value="tmp"
        @showDetail="showDetail($event)"
        @close="currentTabComponent = list"
      />
    </keep-alive>
  </div>
</template>

<script>
import WorkloadList from './childComp/WorkloadList';
import WorkloadDetail from './childComp/WorkloadDetail';

export default {
  name: 'WorkloadStatistics',
  components: { WorkloadList, WorkloadDetail },
  data() {
    return {
      tmp: {},
      list: WorkloadList,
      detail: WorkloadDetail,
      currentTabComponent: WorkloadList
    };
  },
  methods: {
    showDetail(data) {
      this.currentTabComponent = this.detail;
      this.tmp = data;
    }
  }
};
</script>
