<template>
  <el-dialog ref="dialog" >
    <div class="bg-wh p-l-30 p-r-30 m-b-20">
      <div class="c-black fw-b p-t-30 p-b-30 fz-22 bor-b-3e" v-html="form.title"></div>
      <div class="c-black fz-14 p-t-30 p-b-30" v-html="form.content"></div>
    </div>
  </el-dialog>
</template>
<style>
.box-shadow-none {
  box-shadow: 0 1px 3px rgba(0,0,0,0);
}
.big-img {
  max-width: 700px;
  max-height: 540px;
}
.bor-b-3e {
  border-bottom: 1px solid #eee
}
</style>
<script>
  import http from '../../../assets/js/http'
  export default {
    props: ['info'],
    data() {
      return {
        form: {
          title: '',
          content: ''
        }
      }
    },
    methods: {
      open(form) {
        // console.log('1111')
        if (typeof (form) == 'object') {
          this.form = form
          // this.form.description = (this.form.description).html()
          console.log(this.form)
          this.$refs.dialog.open(form)
        } else if (typeof (form) == 'number') {
          this.form.id = form
          console.log(this.form.id)
          this.$refs.dialog.open(form)
          this.apiGet('news/' + this.form.id).then((res) => {
            this.form = res.data
            console.log(this.form)
          })
        }
        this.imgUrl = window.HOST + 'Upload'
      }
    },
    mixins: [http]
  }
</script>