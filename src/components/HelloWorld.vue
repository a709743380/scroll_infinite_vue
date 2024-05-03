<template>

<div class="container">
  <div class="styleButton" >
    <!-- <button>Nomal</button><button>桌面版面</button> <button>手機版面</button>  -->
  </div>
 
    <div  :class="{base: true,scorll:isMobile}">
      <div v-if="!isMobile" class="page"><span  v-on:click="pre"> < </span>{{ page+"/" }}{{ Math.ceil(data.total/getcount) }} <span  v-on:click="add" > > </span></div>

    <p  class="containerItem" v-for="(user, index) in data.users" :key="index">
      <div> {{user.firstName +"  "+user.lastName }}</div>
      <small> {{user.email}}</small>
    </p>

    <div v-if="state.IsHasMore && isMobile" ref="show">IsHasMore</div>
    <div v-if="state.Iserror">...Error</div>
    <div v-if="!isMobile"  class="page"><span v-on:click="pre"> < </span>{{ page+"/" }}{{ Math.ceil(data.total/getcount) }} <span  v-on:click="add"> > </span></div>
  </div>

</div>

</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import useGetApiData from "./getDataAPI";
// import {showStatus} from "./showStatus"
const getcount = ref(5);


const isMobile = ref(handleResize())
const page = ref(1);
const { data, state } = useGetApiData(page.value, getcount.value,isMobile.value);
const show = ref();

const intersectionObserver = new IntersectionObserver((entries) => {
  if (!isMobile.value||!state.IsHasMore ) {
    return;
  }
  if (entries[0].intersectionRatio <= 0) return;
  add();
});

onMounted(() => {
  const handleResizeChange = () => {
    isMobile.value = handleResize()
  };
      window.addEventListener('resize', handleResizeChange);
      // 在組件被銷毀前，移除resize事件監聽
      onUnmounted(() => {
        window.removeEventListener('resize', handleResizeChange);
      });

      if(isMobile.value){
        intersectionObserver.observe(show.value);
      }
});


watch(isMobile,(_,__)=>{
  //切換裝置
  state.IsHasMore = true;
  page.value = 1;
  data.users = [];
  data.total = 100;
  useGetApiData(page.value, getcount.value,isMobile.value);
})
//換頁
const add = () => {
  let max =  Math.ceil(data.total/getcount.value)
  if(max <=page.value ){
    return;
  }
  page.value++;
  useGetApiData(page.value, getcount.value,isMobile.value);
};
//前一頁
const pre = () => {
  if(page.value ==1){
    return;
  }
  page.value--;
  useGetApiData(page.value, getcount.value,isMobile.value);
};
//const 定義方法有順序問題
function  handleResize(){
    let check = false
    if(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))
    {
      getcount.value=8;
      check=true;
    }
    else{
      getcount.value=5;
    }
    return check;
  };
</script>



<style scoped>
body{
  background-color: #222222;
}
.containerItem{
  background-color: #9e434c;
  color:white ;
  border-radius: 10px;
  padding: 10px;
}
.scrollable-container {
  width: 100%;
  height: 200px; /* 假設是固定高度的容器 */
}
.base{

  font-size: 18px;
  text-align: left;
  width: 800px;
  height: auto; /* 或者是你想要的高度 */
}
.scorll {

  overflow-y: scroll;

}

.page{
  display: block;
  text-align: right;
}
.page span{
  cursor: pointer;
}
.styleButton{
    display: flex;
    justify-content: center;
    gap: 91px;
}
.styleButton button{
  width: 100px;
  border-radius: 5px;
  background-color: rgb(56, 152, 236);


}
</style>
