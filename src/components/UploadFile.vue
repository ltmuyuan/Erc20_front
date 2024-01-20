<template>
  <a-upload-dragger v-model:fileList="fileList" name="file" :max-count="1" multiple="false" @change="handleChange"
    @drop="handleDrop" :before-upload="beforeUpload">
    <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <p class="ant-upload-text">Click or drag abi file to this area to upload</p>
  </a-upload-dragger>
</template>
<script>
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  components: {
    InboxOutlined,
  },
  setup(props, ctx) {
    const handleChange = info => {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    };

    const beforeUpload = file => {
      console.log("beforeUpload", file);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        ctx.emit('abiData', reader.result)
      }
      return false;
    }


    return {
      handleChange,
      beforeUpload,
      fileList: ref([]),
      handleDrop: e => {
        console.log(e);
      },
    };
  },
});
</script>
<style>
.ant-upload.ant-upload-drag {
  height:unset !important;
}
</style>