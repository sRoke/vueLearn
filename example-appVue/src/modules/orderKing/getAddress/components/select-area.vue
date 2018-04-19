<template>
  <!-- show address picker -->
  <div class="page rgba4" @click="close" v-if="show">
   <image class="liner" resize="cover" :src="liner"></image>
   <div class ="header">
        <div class="icon-btn" @click="close">
            <image class="back" :src="back"></image>
        </div>
        <text class="font42 font-gray33">选择省市区</text>
        <div class="icon-btn" @click="sure">
            <image class="conf" :src="conf"></image>
        </div>
   </div>
    <div class ="addresslist">
        <scroller class = "addresslistitem" show-scrollbar="false" scroll-direction="vertical">        
            <div v-for="item in provices" @click="selectprovice(item.provice)">
                <text class ="itemstyle"  :style="{color:item.color}">{{item.provice}}</text>
            </div>            
        </scroller>
        <scroller class= "addresslistitem" show-scrollbar="false" scroll-direction="vertical"> 
              <div v-for="item in cities" @click="selectcity(item.city)">
                  <text class ="itemstyle" :style="{color:item.color}">{{item.city}}</text>
              </div>
        </scroller>
        <scroller class = "addresslistitem" show-scrollbar="false" scroll-direction="vertical"> 
            <div v-for="item in areas" @click="selectarea(item.area)">
                <text class ="itemstyle" :style ="{color:item.color}">{{item.area}}</text>
            </div>    
        </scroller>
        </div>
    </div>
    </div>
</template>

<script>
  import addressmap from './area.js'
  import ordericon from '../../../../assets/orderIcon/icon.js'
  module.exports = {
    data(){
      return{
        liner: ordericon.liner,
        back: ordericon.itemBack,
        conf: ordericon.confAction,
        showaddress: false,
        proviceindex:0,
        cityindex:0,
        areaindex:0,
        provice:"北京",
        city:"北京市",
        area:"东城区",
        street:"东直门东方银座23D",
        provices:["北京"],
        cities:["市辖区"],
        areas:["东城区"]
      }  
    },
    props:['show'],
    mounted:function(){
        var self= this       
        self.provices = [];
        var tempprovices = addressmap.address.Items["0"];
        var index = 0;
        for(var provice in  addressmap.address.Items["0"]){            
            var tempprovice = {};
            tempprovice.index = index;
            tempprovice.color = "#333333";
            tempprovice.provice = addressmap.address.Items["0"][provice];
            self.provices.push(tempprovice);
            index++;
        }
        self.cities = [{city:"请选择"}];
        self.areas = [{area:"请选择"}];
    },
     methods: {
         /*select provice*/
         selectprovice:function(e){
              this.provice = e
              for(var provice of this.provices){
                  if(provice.provice == this.provice){
                      this.proviceindex = provice.index;
                      provice.color = "#cf411b";
                  }else{
                       provice.color = "#333333";
                  }
              }
              var citynum = "0_"+ this.proviceindex;
              this.cities = [];
              var index = 0;
              for(var city in addressmap.address.Items[citynum]){            
                  var tempcity = {};
                  tempcity.index = index;
                  tempcity.color = "#333333";
                  tempcity.city = addressmap.address.Items[citynum][city];
                  this.cities.push(tempcity);
                  index++;
              }
               this.areas = [{area:"请选择"}];
               this.city = '';
               this.area = '';
         },
          selectcity:function(e){
              this.city = e
              for(var city of this.cities){
                  if(city.city == this.city){
                      this.cityindex = city.index;
                      city.color = "#cf411b";
                  }else{
                       city.color = "#333333";
                  }
              } 
              var areanum = "0_"+ this.proviceindex+"_"+ this.cityindex;
              this.areas = [];
               var index = 0;
              for(var area in addressmap.address.Items[areanum]){         
                  var temparea = {};
                  temparea.index = index;
                  temparea.color = "#333333";
                  temparea.area = addressmap.address.Items[areanum][area];
                  this.areas.push(temparea);
                  index++;
              }
         },
          selectarea:function(e){
              this.area = e
              for(var area of this.areas){
                  if(area.area == this.area){
                      this.areaindex = area.index;
                      area.color = "#cf411b";
                  }else{
                       area.color = "#333333";
                  }
              }
              //this.areaindex = this.areas.indexOf(this.area);
              //console.log(this.areas.indexOf(this.area));
         },
         sure:function(){
             this.$emit('getresult',this.provice,this.city,this.area)

             this.$emit('close')           
         },
         stop: function(){

         },
         close(){
          this.$emit('close')
         }
      },
  }
</script>

<style scoped>
.page{
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    justify-content: flex-end;
}
.header{
    width: 750px;
    height: 150px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-bottom-width: 1px;
    border-bottom-color: #D8D8D8;
}
.icon-btn{
    padding: 25px;
}
.icon-btn:active{
    background-color: #d8d8d8;
}
.font42{
    font-size: 42px;
}
.font-gray33{
    color: #333;
}
.close{
    width: 24px;
    height: 24px;
}
.conf{
    width: 41px;
    height: 31px;
}
.back{
    width: 17px;
    height: 31px;
}
.liner{
    width: 750px;
    height: 9px;
}
.rgba4{
    background-color: rgba(0,0,0,0.4)
}
.itemstyle{
  font-size:30px;
  margin:10px;
  text-align:center;
  color: #333333;
}
.addresslist{
  padding-top:30px;
  padding-bottom:30px;
  flex-direction:row;
  width: 750px;
  background-color: #fff;
}
.addresslistitem{
    flex-direction:column;
    height: 400px;
    width: 250px;
}
</style>