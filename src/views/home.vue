<!--
 * @Description: 用户主界面 包含顶部导航栏和红包雨界面
 * @Autor: 王均祥
 * @Date: 2020-12-24 09:26:20
 * @LastEditors: 王均祥
 * @LastEditTime: 2020-12-24 18:41:10
-->
<template>
  <div>
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">

    <el-container>
      <el-header>
        <el-tooltip :hide-after=2000 effect="dark" content="点击打开抢红包记录" placement="bottom-end">
          <img src="../assets/logo_RedPacket.png" class="logo" @click="handleDrawerOpen">
        </el-tooltip>
      </el-header>
      <el-main>
        <div id="redzone">
          <!-- <el-button @click="createEnvelopeList(envelope.list)">测试各方法</el-button> -->
        </div>
        <div>
          <el-dialog
            :visible.sync="dialogVisible"
            width="17%"
            center
            :show-close='false'
            @close="handleDialogClose">
            <img src="../assets/红包(3).png" @click="handleOpenEnve">
            <span slot="footer" class="dialog-footer">
              <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
              <span v-show="moneyVisible">{{envelopeMoney}}</span>
            </span>
          </el-dialog>
        </div>
        <div>
          <el-drawer
            title="抢红包记录"
            :visible.sync="drawer.visible"
            :before-close="handleDrawerClose"
            size='33%'
            :show-close='false'
            :withHeader='false'>
            <div class="drawerTitle">
              <span>抢红包记录</span>
            </div>
            <el-table
              :data="tableData"
              max-height='600px'
              style="width: 100%"
              show-summary
              :summary-method="getSummaries"
              :default-sort = "{prop: 'getTime', order: 'ascending'}">
              <el-table-column prop="rid" label="红包ID" align='center'></el-table-column>
              <el-table-column prop="getTime" label="抢红包时间" align='center' sortable></el-table-column>
              <el-table-column prop="getMoney" label="金额" align='center' sortable></el-table-column>
            </el-table>
          </el-drawer>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

import axios from 'axios'
import { Button, Dialog, Container, Header, Main, Drawer, Table, TableColumn, Tooltip } from 'element-ui'

export default {
  name: 'hongbao',
  components: {
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Container.name]: Container,
    [Header.name]: Header,
    [Main.name]: Main,
    [Drawer.name]: Drawer,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tooltip.name]: Tooltip
  },
  data () {
    return {
      envelope: {
        list: [
          {
            rid: 1,
            totalMoney: 1,
            count: 1,
            createTime: '--',
            status: 1
          }
        ], // 所有红包列表，包括已抢完的和未抢的
        idList: [1, 2, 3, 1, 5, 6], // 所有未抢红包id，根据envelope.list筛选得出
        page: 1,
        totalPage: 1,
        total: 1
      },
      currentRid: 0, // 当前点击的红包id
      envelopeMoney: 0,
      dialogVisible: false,
      moneyVisible: false,
      uid: 19,
      drawer: {
        visible: false,
        totalRedCount: 0,
        totalMoney: 0
      },
      tableData: [
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        },
        {
          rid: 1,
          getTime: '--',
          getMoney: 1
        }
      ]
    }
  },
  computed: {},
  methods: {
    addBao: function (left, height, src, id) {
      var div = document.createElement('div')
      var img = document.createElement('img')
      img.className = 'roll'
      img.src = src
      div.appendChild(img)
      div.style.left = left + 'px'
      div.style.paddingTop = '60px'
      // 不设置div的高度
      // div.style.height = height + 'px'
      div.className = 'redBox'
      div.id = id
      div.onclick = this.handleEnvelopeClick
      document.getElementById('redzone').appendChild(div)
      console.log('红包ID：' + div.id)
      div.addEventListener('animationend', function () {
        if (document.body.contains(div)) {
          console.log('销毁前divid：')
          console.log(div.id)
          document.getElementById('redzone').removeChild(div)
        }
      })
    },
    /**
     * @description: 获取所有红包信息方法，同BasixMes接口调用
     * @param {*}
     * @return {envelopeList}
     * @author: 王均祥
     */
    getEnvelope (page, size) {
      return new Promise(function (resolve, reject) {
        axios({
          method: 'post',
          url: '/api/getpageallred',
          data: {
            currentPage: page,
            pageSize: size
          }
        }).then(res => {
          if (res.data.code === 200) {
            resolve(res)
          } else {
            reject(res.data.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getSummaries (param) {
      // const { columns, data } = param
      const sums = []
      sums[0] = '合计'
      sums[1] = this.drawer.totalRedCount + '个'
      sums[2] = this.drawer.totalMoney + '元'
      // columns.forEach((column, index) => {
      //   if (index === 0) {
      //     sums[index] = '合计'
      //     return
      //   }
      //   const values = data.map(item => Number(item[column.property]))
      //   if (!values.every(value => isNaN(value))) {
      //     sums[index] = values.reduce((prev, curr) => {
      //       const value = Number(curr)
      //       if (!isNaN(value)) {
      //         return prev + curr
      //       } else {
      //         return prev
      //       }
      //     }, 0)
      //     sums[index] += ' 元'
      //   } else {
      //     sums[index] = this.drawer.totalRedCount + '个'
      //   }
      // })
      return sums
    },
    handleDrawerClose (done) {
      done()
    },
    handleDrawerOpen () {
      axios({
        method: 'post',
        url: '/api/user/reddetails',
        params: {
          uid: this.uid
        }
      }).then(res => {
        this.tableData = res.data.data.list
        this.drawer.totalRedCount = res.data.data.totalRedCount
        this.drawer.totalMoney = res.data.data.totalMoney
        this.drawer.visible = true
      }).catch(function (error) {
        console.log(error)
      })
    },
    handleEnvelopeClick () {
      // console.log('点击ID：' + event.currentTarget.id)
      // this.envelopeMoney++
      // 将div id赋值给所要抢的红包id
      this.currentRid = event.currentTarget.id
      // 点击后暂停红包下落
      document.getElementById(this.currentRid).style.animationPlayState = 'paused'
      this.dialogVisible = true
      // var oDiv = document.getElementsByClassName('box-out')[0]
      // 开红包后删除该元素
      // document.getElementById('redzone').removeChild(event.currentTarget)
    },
    handleOpenEnve () {
      // console.log(this.removeByIndex(this.envelope.idList, 1))
      axios({
        method: 'post',
        url: '/api/getred',
        data: {
          rid: this.currentRid,
          uid: this.uid
        }
      }).then(res => {
        if (res.data.code === 20007) {
          this.envelopeMoney = '恭喜您抢到' + res.data.data + '元'
          this.moneyVisible = true
        } else {
          this.envelopeMoney = '啊哦 ' + res.data.message
          this.moneyVisible = true
          console.error(res.data.message)
        }
        document.getElementById('redzone').removeChild(document.getElementById(this.currentRid))
      }).catch(error => {
        console.error(error)
      })
    },
    handleDialogClose () {
      this.envelopeMoney = 0
      this.moneyVisible = false
      if (document.getElementById(this.currentRid)) {
        document.getElementById(this.currentRid).style.animationPlayState = 'running'
      }
      console.log(this.envelopeMoney)
    },
    // 根据数组元素 寻找下标
    indexOfList (list, item) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] === item) {
          return i
        }
      }
      return -1
    },
    // 根据数组下标 删除对应位置元素
    removeByIndex (list, item) {
      var index = this.indexOfList(list, item)
      if (index > -1) {
        list.splice(index, 1)
        return '删除成功'
      }
      return -1
    },
    /**
     * @description: 定时创建红包雨函数 根据后端‘正在抢’的红包
     * @param {*} list
     * @return {*}
     * @author: 王均祥
     */
    createEnvelopeList (list) {
      console.log('list长度：' + list.length)
      let envelopeCount = 0
      var that = this
      // 筛选出所有正在抢的红包
      var intervalId = setInterval(function () {
        if (list.length === envelopeCount) {
          clearInterval(intervalId)
          return
        }
        // 状态为正在抢的红包
        console.log('status:' + list[envelopeCount])
        if (list[envelopeCount].status === 1) {
          var left = Math.random() * document.body.scrollWidth
          var height = Math.random() * document.body.scrollHeight
          // 根据后台红包ID设置红包雨divID
          var id = list[envelopeCount].rid
          console.log('分配红包ID：' + id)
          // assets中的资源，在js中使用，路径要经过webpack中的file-loader编译，故路径不能直接写
          var src = require('../assets/redpacket.png')
          // static下的文件不会被webpack处理，会被直接复制到最终的打包目录下面，所以必须使用绝对路径来引用这些文件
          // var src = '/static/img/redpacket.png'
          that.addBao(left, height, src, id)
        }
        envelopeCount++
      }, 1500)
    }
  },
  mounted () {
    // 1.获取所有数据 2.调用定时器
    let that = this
    that.getEnvelope(that.envelope.page, 1).then(function (res) {
      that.envelope.total = res.data.data.total
      // 获取到红包总信息数
      that.getEnvelope(that.envelope.page, that.envelope.total).then(function (res) {
        that.envelope.list = res.data.data.pageRecode
        console.log('mounted阶段：' + that.envelope.list.length)
        // 根据红包列表动态创建红包
        that.createEnvelopeList(that.envelope.list)
      }).catch(function (error) {
        console.error(error)
      })
    }).catch(function (error) {
      console.error(error)
    })
  }
}
</script>

<style>
.el-dialog__header {
  background: #bfcddf;
}
.el-header {
  background-color: #bfcddf;
  color: #333;
  line-height: 60px;
}
/* .el-main {
  background-color: #c8a75f;
  height: 661px;
} */
.el-drawer .drawerTitle {
  height: 60px;
  padding: 20px 20px 0 20px;
  background-color: #bfcddf;
  font-weight: bold;
  color: #4e4e4e;
  font-size: 18px;
}
/* 解决Drawer中title出现黑色选择框效果 */
:focus {
  outline: 0;
}
.logo{
  margin: 10px;
  float: right;
  width: 40px;
  height: 40px;
}
@keyframes redImgRain {
  /* 使用百分比比from-to能够获得最佳的浏览器支持 */
  0% {
    top:0;
  }
  100% {
    top: 76%;
  }
}
.redBox {
  position: absolute;
  /* opacity: 0;*/
  /* z-index: 10000; */
  animation: redImgRain 6s linear;
  /* 适配各浏览器 */
  -webkit-animation: redImgRain 6s linear;
  -moz-animation: redImgRain 6s linear;
  -ms-animation: redImgRain 6s linear;
  -o-animation: redImgRain 6s linear;
}
.redBox img {
  display: block;
  /* width: 1rem;
  height: 1.3rem; */
  width: 80px;
  height: 80px;
}
.redBox:hover{
  transform: scale(1.1);
  /* animation-play-state: paused; */
}
</style>
