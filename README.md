# vueLearn

  ## vue+element 问题
    1：el-tab有时切换时会出现白色背景闪烁 解决方法：在每个plan下加v-if控制
    2：Dialog内select tree等组件在点击箭头时有虚晃 
       暂时解决：//暂时性解决dialog 问题 https://github.com/ElemeFE/element/issues/2461
        .el-dialog {
          transform: none;
          left: 0;
          position: relative;
          margin: 0 auto;
        }
