<template>
  <div>
    <div style="margin-bottom:20px">
      <!-- 问题题目 -->
      <el-card>
        <div>
          <h4>什么是斐波那契数列？</h4>
        </div>
        <!-- 问题详情 -->
        <div></div>
        <!-- 发布者信息 -->
        <div>
          <el-row
            style="font-size:14px;line-height:20px;height:20px;color:#a3acc3;margin-top:40px;margin-bottom:10px"
          >
            <el-col :span="1">
              <el-avatar :size="20" :src="circleUrl"></el-avatar>
            </el-col>
            <el-col :span="6">
              <p>发布者：王冠锐</p>
            </el-col>
            <el-col :span="6">
              <p>科目：高等数学A1</p>
            </el-col>
            <el-col :span="11">
              <p>发布时间：2020 02 02</p>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
        <!-- 我来回答 -->
    <div style="margin-bottom:20px">
      <el-card>
        <div style="text-align:right">
          <el-button @click="answerFlag = !answerFlag">{{answerFlag?'收起回答↓':'我来回答↑'}}</el-button>
        </div>
        <div v-if="answerFlag">
          <quill-editor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          ></quill-editor>
          <div style="text-align:right">
            <el-button type="primary">发布答案</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 问题回答 -->
    <h5>最新回答：</h5>
    <div style="margin-bottom:20px">
      <!-- 回答者信息 -->
      <el-card shadow="hover" class="question-item">
        <div>
          <el-row style="font-size:14px;line-height:20px;height:20px;max-height:20px">
            <el-col :span="1">
              <el-avatar :size="20" :src="circleUrl"></el-avatar>
            </el-col>
            <el-col :span="23">
              <p style="margin-bottom:0px">王冠锐</p>
            </el-col>
          </el-row>
          <p class="answer-time">2020 02 02 回答</p>
        </div>
        <div>这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解</div>
        <div style="text-align:right">
          <el-button type="danger">删除</el-button>
          <el-button type="success">采纳</el-button>
        </div>
      </el-card>
    </div>
    <div style="margin-bottom:20px">
      <!-- 回答者信息 -->
      <el-card shadow="hover" class="question-item">
        <div>
          <el-row style="font-size:14px;line-height:20px;height:20px;max-height:20px">
            <el-col :span="1">
              <el-avatar :size="20" :src="circleUrl"></el-avatar>
            </el-col>
            <el-col :span="23">
              <p style="margin-bottom:0px">王冠锐</p>
            </el-col>
          </el-row>
          <p class="answer-time">2020 02 02 回答</p>
        </div>
        <div>这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解</div>
        <div style="text-align:right">
          <el-button type="danger">删除</el-button>
          <el-button type="success">采纳</el-button>
        </div>
      </el-card>
    </div>
    <div style="margin-bottom:20px">
    
      <!-- 回答者信息 -->
      <el-card shadow="hover" class="question-item">
        <div>
          <el-row style="font-size:14px;line-height:20px;height:20px;max-height:20px">
            <el-col :span="1">
              <el-avatar :size="20" :src="circleUrl"></el-avatar>
            </el-col>
            <el-col :span="23">
              <p style="margin-bottom:0px">王冠锐</p>
            </el-col>
          </el-row>
          <p class="answer-time">2020 02 02 回答</p>
        </div>
        <div>这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解这个题目无解</div>
        <div style="text-align:right">
          <el-button type="danger">删除</el-button>
          <el-button type="success">采纳</el-button>
        </div>
      </el-card>
    </div>

  </div>
</template>

<style>
.center {
  text-align: center;
}
.answer-time {
  color: #a3acc3;
  margin: 0px !important;
}
</style>

<script>
import { quillEditor } from "vue-quill-editor";
export default {
  name: "NewProblem",
  components: {
    quillEditor
  },

  data() {
    return {
      content: `<p>问题详情</p>`,
      editorOption: {},
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      answerFlag: false
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  methods: {
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveHtml: function(event) {
      alert(this.content);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

