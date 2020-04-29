<template>
  <el-card body-style="overflow: auto;">
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>未完成订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="product-toolbar">
      <div class="button-box">
        <el-button-group>
          <el-button @click="loadAll">所有</el-button>
          <el-button @click="loadTodayCreate">今天创建</el-button>
          <el-button @click="loadEnd(0)">今天出货</el-button>
          <el-button @click="loadEnd(1)">明天出货</el-button>
          <el-button @click="loadEnd(2)">后天出货</el-button>
        </el-button-group>
        <el-button-group>
          <el-button
            v-if="multipleSelection.length !== 0"
            @click="downloadQrCode"
            >下载二维码</el-button
          >
          <el-button @click="createByExcelDialogFormVisible = true"
            >使用Excel导入</el-button
          >
          <el-button @click="$router.push('/product/create')">新建</el-button>
        </el-button-group>
      </div>
      <el-form inline ref="queryForm" class="query-box" :model="queryForm">
        <el-form-item prop="serial">
          <el-input
            clearable
            v-model="queryForm.serial"
            placeholder="序号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item prop="beginTime">
          <el-date-picker
            clearable
            unlink-panels
            v-model="queryForm.beginTime"
            type="daterange"
            range-separator="至"
            start-placeholder="下单日期范围开始"
            end-placeholder="下单日期范围结束"
            :editable="false"
          />
        </el-form-item>
        <el-form-item prop="demandTime">
          <el-date-picker
            clearable
            unlink-panels
            v-model="queryForm.demandTime"
            type="daterange"
            range-separator="至"
            start-placeholder="需求日期范围开始"
            end-placeholder="需求日期范围结束"
            :editable="false"
          />
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker
            clearable
            unlink-panels
            v-model="queryForm.endTime"
            type="daterange"
            range-separator="至"
            start-placeholder="出货日期范围开始"
            end-placeholder="出货日期范围结束"
            :disabled="end"
            :editable="false"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe :data="products" @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column fixed sortable prop="id" label="ID" />
      <el-table-column sortable prop="serial" label="序号" />
      <el-table-column sortable prop="igt" label="IGT号" />
      <el-table-column sortable prop="erp" label="ERP号" />
      <el-table-column sortable prop="central" label="central号" />
      <el-table-column sortable prop="area" label="地区" />
      <el-table-column sortable prop="design" label="花色" />
      <el-table-column
        sortable
        prop="beginTime"
        label="下单时间"
        :formatter="timeFormatter"
      />
      <el-table-column
        sortable
        prop="demandTime"
        label="需求时间"
        :formatter="timeFormatter"
      />
      <el-table-column
        sortable
        prop="endTime"
        label="出货时间"
        :formatter="timeFormatter"
      />

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="$router.push('/product/detail/' + scope.row.id)"
              >编辑</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="padding-top: 10px; text-align: right; margin-bottom: 20px"
      layout="sizes, prev, pager, next"
      :current-page="pageNumber + 1"
      :page-count="total"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handlePageNumberChange"
    />
    <CreateByExcel
      :show="createByExcelDialogFormVisible"
      @close="createByExcelDialogFormVisible = false"
    />
  </el-card>
</template>

<script>
import QRCode from 'qrcodejs2';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import CreateByExcel from './childComp/CreateByExcel';

export default {
  name: 'Product',
  components: { CreateByExcel },
  data() {
    return {
      queryForm: {
        serial: '',
        beginTime: [],
        demandTime: [],
        endTime: []
      },

      end: false,

      params: {
        serial: null,
        createTimeAfter: null,
        createTimeBefore: null,
        beginTimeAfter: null,
        beginTimeBefore: null,
        demandTimeAfter: null,
        demandTimeBefore: null,
        endTimeAfter: null,
        endTimeBefore: null
      },

      pageSize: 20,
      pageNumber: 0,
      total: 0,

      products: [],
      editDialogFormVisible: false,
      editIndex: 0,
      multipleSelection: [],
      imgList: new Map(),

      createByExcelDialogFormVisible: false
    };
  },
  created() {
    this.refreshData();
  },
  methods: {
    clear() {
      this.pageNumber = 0;
      this.end = false;

      this.queryForm.serial = '';
      this.queryForm.beginTime = [];
      this.queryForm.demandTime = [];
      this.queryForm.endTime = [];

      Object.keys(this.params).forEach(key => (this.params[key] = null));
    },
    loadAll() {
      this.clear();
      this.refreshData();
    },
    loadTodayCreate() {
      let today = new Date(new Date().toLocaleDateString());

      this.clear();

      this.params.createTimeAfter = today;
      this.params.createTimeBefore = new Date(today);
      this.params.createTimeBefore.setDate(today.getDate() + 1);

      this.refreshData();
    },
    loadEnd(num) {
      let today = new Date(new Date().toLocaleDateString());
      this.clear();
      this.end = true;

      this.params.endTimeAfter = new Date(today);
      this.params.endTimeAfter.setDate(today.getDate() + num);
      this.params.endTimeBefore = new Date(today);
      this.params.endTimeBefore.setDate(today.getDate() + num + 1);

      this.refreshData();
    },
    submitQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          if (this.queryForm.serial) {
            this.params.serial = this.queryForm.serial;
          } else {
            this.params.serial = null;
          }

          if (
            this.queryForm.beginTime &&
            this.queryForm.beginTime.length === 2
          ) {
            this.params.beginTimeAfter = this.queryForm.beginTime[0];
            this.params.beginTimeBefore = this.queryForm.beginTime[1];
          } else {
            this.params.beginTimeAfter = null;
            this.params.beginTimeBefore = null;
          }

          if (
            this.queryForm.demandTime &&
            this.queryForm.demandTime.length === 2
          ) {
            this.params.demandTimeAfter = this.queryForm.demandTime[0];
            this.params.demandTimeBefore = this.queryForm.demandTime[1];
          } else {
            this.params.demandTimeAfter = null;
            this.params.demandTimeBefore = null;
          }

          if (!this.end) {
            if (this.queryForm.endTime && this.queryForm.endTime.length === 2) {
              this.params.endTimeAfter = this.queryForm.endTime[0];
              this.params.endTimeBefore = this.queryForm.endTime[1];
            } else {
              this.params.endTimeAfter = null;
              this.params.endTimeBefore = null;
            }
          }

          this.pageNumber = 0;
          this.refreshData();
        } else {
          return false;
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.pageNumber = 0;
      this.refreshData();
    },
    handlePageNumberChange(pageNumber) {
      this.pageNumber = pageNumber - 1;
      this.refreshData();
    },
    refreshData() {
      let _this = this;
      const data = this.params;

      let params = {};

      Object.keys(data).forEach(key => {
        params[key] = data[key];
      });

      params['pageSize'] = this.pageSize;
      params['pageNumber'] = this.pageNumber;

      this.axios
        .request({
          url: '/api/product',
          method: 'get',
          params
        })
        .then(res => {
          const data = res.data.data;

          _this.pageSize = data.size;
          _this.total = data.total;
          _this.products = data.products;
        });
    },
    timeFormatter(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    downloadQrCode() {
      this.imgList.clear();

      for (const select of this.multipleSelection) {
        let tmp = document.createElement('div');
        new QRCode(tmp, location.host + '/product/' + select.id);
        this.imgList.set(select.serial, tmp.getElementsByTagName('img')[0]);
      }

      this.lengthTmp = this.imgList.size;
      setTimeout(this.downloadQrCodeCallback, 10 * this.imgList.size);
    },
    downloadQrCodeCallback() {
      let tmp = 0;

      for (const value of this.imgList.values()) {
        if (value.src.length !== 0) {
          tmp++;
        }
      }

      if (this.lengthTmp !== tmp) {
        setTimeout(
          this.downloadQrCodeCallback,
          10 * (this.lengthTmp - this.imgList.size)
        );
        return;
      }

      if (this.imgList.size === 1) {
        const data = this.imgList.values().next().value.src;
        const serial = this.imgList.keys().next().value;
        saveAs(data, serial + '.png');
      } else {
        let zip = new JSZip();

        for (const key of this.imgList.keys()) {
          let arr = this.imgList.get(key).src.split(',');
          let mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
          let bytes = window.atob(arr[1]);
          let ab = new ArrayBuffer(bytes.length);
          let ia = new Uint8Array(ab);

          for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
          }

          zip.file(
            key + '.png',
            new Blob([ab], {
              type: mime
            })
          );
        }
        zip.generateAsync({ type: 'blob' }).then(function(content) {
          saveAs(content, '二维码.zip');
        });
      }
    }
  }
};
</script>

<style>
.product-toolbar {
  display: flex;
  flex-direction: column;
}

.button-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
