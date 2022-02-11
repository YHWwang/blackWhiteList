<template>
  <div class="app-container home">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="机型" prop="whiteBlackModel">
        <el-input
          v-model="queryParams.whiteBlackModel"
          placeholder="请输入机型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应用名" prop="applicationName">
        <el-input
          v-model="queryParams.applicationName"
          placeholder="请输入应用名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
       <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['system:operation:importData']"
          >导入</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:operation:export']"
          >全部导出</el-button
        >
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="ID" width="" prop="id"></el-table-column>
      <el-table-column label="机型" sortable width="" prop="whiteBlackModel">
      </el-table-column>
      <el-table-column label="应用名称" sortable width="" prop="applicationName">
      </el-table-column>
      <el-table-column
        label="自启动状态"
        width=""
        prop="selfDriveStatus"
        :formatter="selfStatus"
      ></el-table-column>
      <el-table-column
        label="杀进程状态"
        width=""
        prop="killStatus"
        :formatter="killStatus"
      ></el-table-column>
      <el-table-column label="包名" width="180" show-overflow-tooltip prop="packageName">
      </el-table-column>
      <el-table-column label="Imei" width="" prop="whiteBlackImei">
      </el-table-column>
      <el-table-column
        label="版本号"
        width=""
        prop="whiteBlackVersion"
      ></el-table-column>
      <el-table-column label="备注" width="" prop="remark"></el-table-column>
      <el-table-column
        label="创建时间"
        width=""
        prop="creDate"
      ></el-table-column>
      <el-table-column
        label="修改时间"
        width=""
        prop="upDate"
      ></el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="12">
        <div style="margin-top: 20px">
          <el-button @click="toggleSelection()">全选</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
           @pagination="getList"
        />
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="编号" v-if="disable" prop="id">
          <el-input v-model="form.id" placeholder="编号" />
        </el-form-item>
        <el-form-item label="版本id" v-if="disable" prop="manageId">
          <el-input v-model="form.manageId" placeholder="版本id" />
        </el-form-item> -->
        <el-form-item label="机型" prop="whiteBlackModel">
          <el-input
            v-model="form.whiteBlackModel"
            :disabled="disable"
            placeholder="机型"
          />
        </el-form-item>
        <el-form-item label="应用名称" prop="applicationName">
          <el-input v-model="form.applicationName" placeholder="应用名称" />
        </el-form-item>
        <el-form-item label="自启动状态" prop="selfDriveStatus">
          <el-select v-model="form.selfDriveStatus" placeholder="自启动状态">
            <el-option
              v-for="dict in commentOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="杀进程状态" prop="killStatus">
          <el-select v-model="form.killStatus" placeholder="杀进程状态">
            <el-option
              v-for="dict in commentOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="包名" prop="packageName">
          <el-input v-model="form.packageName" placeholder="包名" />
        </el-form-item>
        <el-form-item label="IMEI" prop="whiteBlackImei">
          <el-input
            v-model="form.whiteBlackImei"
            :disabled="disable"
            placeholder="IMEI"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的用户数据
          </div> -->
          <span>仅允许导入xls、xlsx格式文件。</span>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  delData,
  addData,
  getData,
  updateData,
  exportXlsx,
} from "@/api/blackWhiteList";
import { getToken } from "@/utils/auth";

export default {
  name: "blackwhite",
  dicts: ["sys_blackwhite_status"],
  data() {
    return {
      loading: true,
      exportLoading: false,
      tableData: [],
      total: 0,
      open: false,
      disable: false,
      ids: [],// 选中数组
      title: "",
      commentOptions: "",
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/operation/importData",
      },
      queryParams: {
        whiteBlackModel: "",
        applicationName: "",
        pageNum: 1,
        pageSize: 10,
      },
      form: {},
      rules: {
        manageId: [
          { required: true, message: "版本ID不能为空", trigger: "blur" },
        ],
        id: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        applicationName: [
          { required: true, message: "应用名称不能为空", trigger: "blur" },
        ],
        packageName: [
          { required: true, message: "包名不能为空", trigger: "blur" },
        ],
        selfDriveStatus: [
          {
            required: true,
            message: "自我启动状态0黑名单1白名单",
            trigger: "blur",
          },
        ],
        killStatus: [
          {
            required: true,
            message: "杀进程状态0黑名单1白名单",
            trigger: "blur",
          },
        ],
        whiteBlackModel: [
          { required: true, message: "机型不能为空", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "操作备注不能为空", trigger: "blur" },
        ],
        whiteBlackImei: [
          { required: false, message: "序列号不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_blackwhite_status").then((response) => {
      this.commentOptions = response.data;
    });
  },
  methods: {
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    toggleSelection() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    handleSelectionChange(selection) {
       //选中列表数据
       this.ids = selection.map(item => item.id)
       this.multiple = !selection.length
    },
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal
        .confirm("是否确认导出所有黑白名单数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.exportLoading = true;
          return exportXlsx(queryParams);
        })
        .then((response) => {
          this.$download.name(response.msg);
          this.exportLoading = false;
        });
    },
    selfStatus(row, column) {
      return this.selectDictLabel(
        this.dict.type.sys_blackwhite_status,
        row.selfDriveStatus
      );
    },
    killStatus(row, column) {
      return this.selectDictLabel(
        this.dict.type.sys_blackwhite_status,
        row.killStatus
      );
    },
    handleAdd() {
      this.resetForm("form");
      this.open = true;
      this.disable = false;
      this.form = {};
      this.title = "新增数据";
    },
    handleEdit(row) {
      this.resetForm("form");
      this.form = JSON.parse(JSON.stringify(row));
      this.open = true;
      this.disable = true;
      this.title = "编辑数据";
    },
    resetForm(refName) {
      if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
      }
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id == null) {
            addData(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          } else {
            updateData(this.form).then((response) => {
              this.$modal.msgSuccess("编辑成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delData(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        });
    },
    cancel() {
      this.open = false;
    },
    getList() {
      getData(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>

