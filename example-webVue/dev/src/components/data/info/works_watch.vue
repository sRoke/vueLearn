<template>
  <el-dialog ref="dialog" >
    <div class="bg1">
      <div class="bg-wh p-a-30 m-b-20">
        <div class="m-b-20">
          <div class="inline-block fw-b c-black">{{form.name}}</div>
        </div>
          <div v-for="(item,index) in showAlbum" label="index">
            <img :src="item" class="watch_img" />
          </div>
      </div>
      <div class="bg-wh p-a-30 m-b-20">
        <div class="c-black tx-c fw-b m-b-20">作品描述</div>
        <div class="c-black fz-14" v-html="form.description"></div>
        <xmp></xmp>
      </div>
    </div>
  </el-dialog>
</template>
<style>
.watch_img{
  width: 100%
}
.p-a-30{
  padding: 30px;
}
.bg1{
  background: #EEEEEE;
  padding: 10px
}
.box-shadow-none {
  box-shadow: 0 1px 3px rgba(0,0,0,0);
}
.big-img {
  max-width: 700px;
  max-height: 540px;
}
</style>
<script>
  import http from '../../../assets/js/http'
  export default {
    props: ['info'],
    data() {
      return {
        showAlbum: [],
        imgUrl: '',
        form: []
      }
    },
    methods: {
      open(form) {
        if (typeof (form) == 'object') {
          this.form = form
          console.log(this.form)
          this.$refs.dialog.open(form)
          this.showAlbum = []
          for (var i = 0; i < this.form.album.length; i++) {
            let x = {}
            x = window.imgUrl + this.form.album[i]
            this.showAlbum.push(x)
          }
        } else if (typeof (form) == 'number') {
          this.form.id = form
          console.log(this.form.id)
          this.$refs.dialog.open(form)
          this.apiGet('projects/' + this.form.id).then((res) => {
            this.form = res.data
            console.log(this.form.album.length)
            this.showAlbum = []
            console.log(this.form.album.length)
            for (var f = 0; f < this.form.album.length; f++) {
              let x = {}
              x = window.imgUrl + this.form.album[f]
              this.showAlbum.push(x)
            }
          })
        }
        this.imgUrl = window.HOST + 'Upload'
      }
    },
    mixins: [http]
  }
</script>