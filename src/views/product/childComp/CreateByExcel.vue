<template>
  <el-dialog title="编辑用户" :visible="show" @close="$emit('close')">
    <div style="text-align: center">
      <el-upload
        drag
        action="/api/product/analysisExcel"
        ref="uploadExcel"
        :headers="headers"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
      >
        <i class="el-icon-upload" />
        <div>将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <el-table
      ref="importProducts"
      v-if="products.length !== 0"
      :data="products"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed type="selection" />
      <el-table-column prop="serial" label="序号" />
      <el-table-column prop="IGT" label="IGT号" />
      <el-table-column prop="ERP" label="ERP号" />
      <el-table-column prop="central" label="central号" />
      <el-table-column prop="area" label="地区" />
      <el-table-column prop="design" label="花色" />
      <el-table-column
        prop="beginTime"
        label="下单时间"
        :formatter="timeFormatter"
      />
      <el-table-column
        prop="demandTime"
        label="需求时间"
        :formatter="timeFormatter"
      />
      <el-table-column
        prop="endTime"
        label="出货时间"
        :formatter="timeFormatter"
      />
    </el-table>

    <div slot="footer" class="dialog-footer">
      <span style="margin-right: 1em">生产流程</span>
      <el-select
        style="padding-right: 20px;"
        v-model="workId"
        placeholder="请选择生产流程"
      >
        <el-option
          v-for="item in works"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button
        v-if="multipleSelection.length !== 0 && workId > 0"
        type="primary"
        @click="createAll"
        >导入选中的</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreateByExcel',
  props: ['show'],
  data() {
    const headers = {
      Authorization: 'manage ' + localStorage.getItem('token')
    };
    return {
      headers,
      works: [],
      workId: '',
      productFileMap: {},
      multipleSelection: []
    };
  },
  created() {
    let _this = this;
    let pageNumber = 0;
    let total = 0;
    const url = '/api/work?pageSize=50&pageNumber=';

    let callback = res => {
      total = res.data.data.total;
      pageNumber++;
      _this.works.push.apply(_this.works, res.data.data.works);
      if (pageNumber < total) {
        _this.axios(url + pageNumber).then(callback);
      } else {
        _this.works.sort((p1, p2) => {
          return p1.id - p2.id;
        });
      }
    };
    this.axios(url + pageNumber).then(callback);
  },
  methods: {
    beforeUpload(file) {
      if (file.size > 1048576) {
        this.$message({
          message: '文件太大, 文件大小不能超过1M',
          type: 'error',
          showClose: true,
          center: true
        });
        return false;
      }
    },
    handleSuccess(res, file, fileList) {
      if (res.status === 1) {
        let data = {};

        data[file.uid] = res.data;
        this.productFileMap = Object.assign({}, this.productFileMap, data);
      } else {
        fileList.splice(
          fileList.findIndex(f => f === file),
          1
        );
        this.$message({
          message: res.message,
          type: 'error',
          showClose: true,
          center: true
        });
      }
    },
    handleRemove(file) {
      delete this.productFileMap[file.uid];
      this.productFileMap = Object.assign({}, this.productFileMap);
      if (this.$refs.importProducts) {
        this.$refs.importProducts.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    createAll() {
      let _this = this;
      let data = [];
      for (let product of this.multipleSelection) {
        product.workId = this.workId;
        data.push(product);
      }
      this.$axios.post('/api/product/createAll', data).then(res => {
        _this.$message({
          message: res.data.message,
          type: res.data.status === 1 ? 'success' : 'error',
          showClose: true,
          center: true
        });
        _this.$emit('close');
      });
    },
    timeFormatter(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
    }
  },
  computed: {
    products() {
      let products = [];
      for (const key of Object.keys(this.productFileMap)) {
        products.push.apply(products, this.productFileMap[key]);
      }

      return products;
    }
  },
  watch: {
    show() {
      for (const key of Object.keys(this.productFileMap)) {
        delete this.productFileMap[key];
      }
      this.productFileMap = Object.assign({}, this.productFileMap);

      if (this.$refs.importProducts) {
        this.$refs.importProducts.clearSelection();
      }

      if (this.$refs.uploadExcel) {
        this.$refs.uploadExcel.clearFiles();
      }
      this.workId = '';
    }
  }
};
</script>
