<template>
  <el-dialog :title="title" :visible="show" v-on:close="$emit('close')">
    <el-table :data="finishSet">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form inline>
            <el-form-item label="订单编号">
              <ul>
                <li v-for="o of props.row.list" :key="o.productId">
                  {{ o.serial }}
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="完成时间">
              <ul>
                <li v-for="o of props.row.list" :key="o.productId">
                  {{ new Date(o.finishTime).toLocaleDateString() }}
                </li>
              </ul>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="完成工序名" />
      <el-table-column prop="num" label="完成数量" />
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'WorkloadDetail',
  props: ['show', 'data', 'month'],
  methods: {
    timeFormatter(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
    }
  },
  computed: {
    title() {
      const options = { year: 'numeric', month: 'long' };
      if (this.data) {
        if (this.month) {
          return (
            this.data.name +
            ' ' +
            this.month.toLocaleDateString('zh-cn', options)
          );
        } else {
          return (
            this.data.name +
            ' ' +
            new Date().toLocaleDateString('zh-cn', options)
          );
        }
      } else return '';
    },
    finishSet() {
      if (this.data) return this.data.finishSet;
      else return [];
    }
  }
};
</script>
