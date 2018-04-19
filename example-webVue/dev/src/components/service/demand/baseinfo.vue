<template>
  <div id="main-content"
       v-cloak>
    <div v-show="coo_model"></div>
    <category ref="category"
              type="edit"
              v-if="categoryVisable"
              :handleEdit="editCategory"
              :sourceData="categoryList">
    </category>
    <div v-if="isEdit"
         class="gray-14 fz-14">
      <el-row :gutter="20">
        <el-col :span="10"
                :offset="1">
          <div><span class="labelTitle">需求方：</span>{{detail.demander}}</div>
        </el-col>
        <el-col :span="10"
                :offset="2">
          <div><span class="labelTitle">需求编号：</span>{{detail.number}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="10"
                :offset="1">
          <div><span class="labelTitle">联系人：</span>{{detail.user_name}}</div>
        </el-col>
        <el-col :span="10"
                :offset="2">
          <div><span class="labelTitle">生成时间：</span>{{detail.create_time}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="10"
                :offset="1">
          <div><span class="labelTitle">网站账号：</span>{{detail.account}}</div>
        </el-col>
        <el-col :span="10"
                :offset="2">
          <div><span class="labelTitle">公司地址：</span>{{detail.province}}{{detail.city}}{{detail.zone}}{{detail.address}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="10"
                :offset="1">
          <div><span class="labelTitle">目标费用：</span>{{detail.budget_min}} - {{detail.budget_max}} 元</div>
        </el-col>
        <el-col :span="10"
                :offset="2">
          <div><span class="labelTitle">产品类别：</span>
            <p v-for="(item,index) in category"
               :class="{'m-a-0':!index,'p-l-120':index,'inline-block':!index}">
              {{ item }}
            </p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="22"
                :offset="1">
          <div><span class="labelTitle">需求标题：</span>{{detail.title}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-10">
        <el-col :span="22"
                :offset="1">
          <div>
            <span class="labelTitle fl m-t-10">需求标签：</span>
            <div class="fl">
              <div class="detail-label bor-ra-5 fl m-t-10"
                   v-for="la in detail.label">{{la.label_name}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="22"
                :offset="1">
          <div><span class="labelTitle">需求备注：</span>{{detail.remark}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="22"
                :offset="1">
          <div>
            <span class="labelTitle">合作模式：</span>
            <el-radio class="radio"
                      v-model="detail.coo_model"
                      label="1"
                      disabled="isEdit">项目制</el-radio>
            <el-radio class="radio"
                      v-model="detail.coo_model"
                      label="2"
                      disabled="isEdit">销量提成</el-radio>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="22"
                :offset="1">
          <div>
            <span class="labelTitle fl">设计方案：</span>
            <div class="w-300 fl m-l-5">
              <el-checkbox v-model="checked1"
                           class="w-120"
                           disabled="isEdit">外观设计及数据</el-checkbox>
              <el-checkbox v-model="checked2"
                           class="w-120"
                           disabled="isEdit">外观手板</el-checkbox>
              <el-checkbox v-model="checked3"
                           class="w-120 m-l-0  m-t-10"
                           disabled="isEdit">内部结构设计</el-checkbox>
              <el-checkbox v-model="checked4"
                           class="w-120 m-t-10"
                           disabled="isEdit">功能手板</el-checkbox>
            </div>
          </div>
        </el-col>
      </el-row>
  
      <el-row :gutter="20"
              class="m-t-20">
        <el-col :span="22"
                :offset="1"
                class="p-b-20">
          <div>
            <span class="labelTitle fl">需求金额：</span>
            <div class="fl w-80P">
              <div class="fl w-80P">
                <div class="fl c-blue">外部设计</div>
                <div class="fl m-l-10">预付款 <span class="money-red">￥{{detail.outward_pre_pay}}</span></div>
                <div class="fl m-l-20"
                     v-if="!showBonus">尾款 <span class="money-red">￥{{detail.outward_balance_amount}}</span></div>
                <div class="fl m-l-20"
                     v-if="showBonus">提成周期 <span class="money-red">3个月<span class="fz-12">(按季度计算)</span></span>
                </div>
                <div class="fl m-l-20"
                     v-if="showBonus">提成时长 <span class="money-red">{{detail.bonus_duration}}个月</span></div>
              </div>
              <div class="fl w-80P"
                   v-if="showBonus">
                <div class="fl m-t-20">提成方案</div>
                <div class="fl m-l-20 m-t-20">
                  <div class="p-b-10">
                    <span class="money-red">0</span> 至 <span class="money-red">{{bonus1.end_count}}</span> 台(单位)，提成费为<span class="money-red">￥{{bonus1.amount}}</span>元/台(单位)
                  </div>
                  <div class="line-t p-b-10 p-t-10"
                       v-if="bonus2.show">
                    <span class="money-red">{{bonus2.start_count}}</span> 至 <span class="money-red">{{bonus2.end_count}}</span> 台(单位)，提成费为<span class="money-red">￥{{bonus2.amount}}</span>元/台(单位)
                  </div>
                  <div class="line-t p-t-10"
                       v-if="bonus3.show">
                    <span class="money-red">{{bonus3.start_count}}</span> 台(单位)以上，提成费为<span class="money-red">￥{{bonus3.amount}}</span>元/台(单位)
                  </div>
                </div>
              </div>
              <div class="fl w-80P m-t-10">
                <span class="c-blue">内部结构</span>
                <span class="m-l-10">预付款：</span>
                <span class="money-red">￥{{ detail.internal_pre_pay }}</span>
                <span class="m-l-10">尾款：</span>
                <span class="money-red">￥{{ detail.internal_balance_amount }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="width: 100%"
           class="tx-c m-t-10"
           v-show="allEdit">
        <el-button type="primary"
                   @click="showEdit()"
                   v-show="isEditBtn&&canEdit">编辑需求</el-button>
      </div>
    </div>
    <div v-else>
      <el-form ref="form"
               :model="up"
               :rules="rules"
               label-width="100px">
        <el-row :gutter="20">
          <el-col :span="10"
                  :offset="1">
            <el-form-item label="需求方:"
                          prop="demander">
              <el-input v-model.trim="up.demander"
                        :disabled='true'
                        class="h-40 w-200"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10"
                  :offset="2">
            <div class="m-t-10 gray-14 fz-14"><span class="labelTitle">需求编号：</span>{{detail.number}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10"
                  :offset="1">
            <el-form-item label="联系人信息:"
                          prop="contact">
              <!--<el-input v-model.trim="up.user_name" class="h-40 w-200"></el-input>-->
              <el-input v-model.trim="up.contact.name"
                        class="inline-block h-40 w-100"
                        placeholder="联系人姓名"></el-input>
              <el-select filterable
                         class="contact"
                         v-model="up.contact.phone"
                         @change="handleSelectContact"
                         placeholder="联系人手机号">
                <el-option v-for="item in contactOptions"
                           :label="item.phone"
                           :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model.trim="up.contact.email"
                        class="inline-block h-40 w-200"
                        placeholder="联系人邮箱"></el-input>
              <el-button type="primary"
                         @click="openContactDialog()">添加联系人</el-button>
            </el-form-item>
            <contact ref="contact"
                     :type="openType"
                     :handleSubmit="addContact"
                     v-if="contactVisible"> </contact>
          </el-col>
          <el-col :span="10"
                  :offset="2">
            <div class="m-t-10 gray-14 fz-14"><span class="labelTitle">生成时间：</span>{{detail.create_time}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10"
                  :offset="1">
            <el-form-item label="网站账号:"
                          prop="account">
              <el-input v-model.trim="up.account"
                        class="h-40 w-200"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10"
                  :offset="2">
            <!-- el-input v-model.trim="up.address" class="h-40 w-200"></el-input> -->
            <el-form-item label="公司地址：">
              <el-row type='flex'
                      justify='start'>
                <div>
                  <!-- <el-cascader :options="proCityList"
                                                     v-model="proCityVal"
                                                     @change="handleChangeCity">
                                        </el-cascader disabled="true"> -->
                  <span>{{detail.province}}{{detail.city}}{{detail.zone}}{{detail.address}}</span>
                </div>
                <div>
                  <!-- <el-input class='m-l-15'
                                                  v-model="up.address"
                                                  placeholder="请输入详细地址" disabled="true"></el-input> -->
                  <span>{{address}}</span>
                </div>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10"
                  :offset="1">
            <el-form-item label="目标费用：">
              <el-input type="number"
                        v-model="up.budget_min"
                        class="h-40 w-80"></el-input> -
              <el-input type="number"
                        v-model="up.budget_max"
                        class="h-40 w-80"></el-input> 元
            </el-form-item>
          </el-col>
          <el-col :span="10"
                  :offset="2">
            <el-form-item label="产品类别：">
              <p v-for="(item,index) in category"
                 :class="{'m-a-0':true,'m-l-20':index}">
                {{ item }}
                <el-button type="text"
                           class="m-l-20"
                           v-if="index === 0"
                           @click="openCategoryDialog"
                           v-show="categoryData.length">编辑
                </el-button>
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="需求标题:"
                          prop="title">
              <el-input v-model.trim="up.title"
                        class="h-40 w-200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="需求标签:">
              <div class="fl w-400 m-t-5">
                <div class="bor-ra-5 edit_label fl"
                     v-for="la in detail.label">{{la.label_name}}</div>
                <el-button type="primary"
                           size="small"
                           class="fl m-l-10"
                           @click="openTag(0)">选择</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="需求备注:">
              <el-input type="textarea"
                        v-model.trim="up.remark"
                        :rows="4"
                        class="w-400"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22"
                  :offset="1">
            <el-form-item label="合作模式:">
              <el-radio-group v-model="up.coo_model">
                <el-radio label="1">项目制</el-radio>
                <el-radio label="2"
                          :disabled="!hasAppDesign">销量提成（专指外观设计）</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="7"
                  :offset="1">
            <div class="w-400 fl">
              <el-form-item label="设计方案:">
                <el-checkbox-group v-model="up.design_way">
                  <el-checkbox label="10"
                               class="w-120 m-l-10"
                               name="design_way">外观设计及数据</el-checkbox>
                  <el-checkbox label="20"
                               class="w-120"
                               name="design_way"
                               :disabled="!hasAppDesign">外观手板</el-checkbox>
                  <el-checkbox label="30"
                               class="w-120 m-l-10"
                               v-bind:class="{'m-t-270': showBonus,'m-t-80':hasAppDesign}"
                               name="design_way">内部结构设计</el-checkbox>
                  <el-checkbox label="40"
                               class="w-120"
                               v-bind:disabled="!hasStructDesign"
                               name="design_way">功能手板</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="10"
                  :offset="2">
            <div class="fl form-bg"
                 v-if="hasAppDesign">
              <div class="fl"
                   style="width: 100%">
                <div class="fl">
                  <el-form-item label="预付款"
                                prop="outward_pre_pay">
                    <el-input v-model.trim="up.outward_pre_pay"
                              class="h-40 w-80"></el-input> 元
                  </el-form-item>
                </div>
                <div class="fl"
                     v-show="!showBonus">
                  <el-form-item label="尾款"
                                prop="outward_balance_amount">
                    <el-input v-model.trim="up.outward_balance_amount"
                              class="h-40 w-80"></el-input> 元
                  </el-form-item>
                </div>
                <div class="fl"
                     v-show="showBonus">
                  <el-form-item label="提成周期">
                    3个月<span class="fz-12">(按季度计算)</span>
                  </el-form-item>
                </div>
                <div class="fl"
                     v-show="showBonus">
                  <el-form-item label="提成时长">
                    <el-input v-model.trim="up.bonus_duration"
                              class="h-40 w-80"></el-input> 个月
                  </el-form-item>
                </div>
              </div>
              <div class="fl"
                   v-show="showBonus">
                <div class="fl w-600">
                  <el-form-item label="提成方案">
                    <div class="fl">
                      <span class="tx-c w-80"
                            style="display: inline-block;">0</span> 至
                      <el-input class="h-40 w-80"
                                type="number"
                                :min="1"
                                v-model.trim="bonus1.end_count"></el-input> 台(单位)，提成费为
                      <el-input class="h-40 w-80"
                                type="number"
                                :min="1"
                                v-model.trim="bonus1.amount"></el-input> 元/台(单位)
                    </div>
                    <div class="fl">
                      <el-input class="h-40 w-80"
                                type="number"
                                :min="1"
                                v-model.trim="bonus2.start_count"></el-input> 至
                      <el-input class="h-40 w-80"
                                type="number"
                                :min="1"
                                v-model.trim="bonus2.end_count"></el-input> 台(单位)，提成费为
                      <el-input class="h-40 w-80"
                                type="number"
                                :min="1"
                                v-model.trim="bonus2.amount"></el-input> 元/台(单位)
                    </div>
                    <div class="fl">
                      <el-input class="h-40 w-80"
                                type="number"
                                :min="1"
                                v-model.trim="bonus3.start_count"></el-input> 台(单位)以上，提成费为
                      <el-input class="h-40 w-80"
                                v-model.trim="bonus3.amount"></el-input> 元/台(单位)
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
  
            <div class="fl m-t-20 form-bg"
                 v-if="hasStructDesign">
              <div class="fl">
                <el-form-item label="预付款"
                              prop="in_pre_pay">
                  <el-input :min="1"
                            v-model.trim="in_pre_pay"
                            class="h-40 w-80"></el-input> 元
                </el-form-item>
              </div>
              <div class="fl">
                <el-form-item label="尾款"
                              prop="in_balance_amount">
                  <el-input :min="1"
                            v-model.trim="in_balance_amount"
                            class="h-40 w-80"></el-input> 元
                </el-form-item>
              </div>
            </div>
          </el-col>
        </el-row>
  
      </el-form>
      <div style="width: 100%"
           class="tx-c m-t-30">
        <el-button type="primary"
                   v-if="canEdit"
                   @click="saveData()"
                   :loading="flagTrans('saveData')">保存需求</el-button>
      </div>
    </div>
    <el-row :gutter="20"
            class="m-t-30">
      <el-col :span="22"
              :offset="1"
              class="bg-gray bor-ra-5 p-all-15">
        <div>
          <div class="fl m-l-30 status-sel w-200 m-tb-8">{{detail.status_name}} <span class="fz-16"
                  v-show="(showDeadline) && (deadline == 0)">(已截止)</span></div>
          <div class="fl m-l-30"
               v-show="allEdit">
            <el-button size="large"
                       @click="upStatus(demandStatus.btn1.status)"
                       v-if="demandStatus.btn1.show&&canEdit"
                       :loading="flagTrans(demandStatus.btn1.status)">{{demandStatus.btn1.name}}</el-button>
            <el-button type="primary"
                       @click="upStatus(demandStatus.btn2.status)"
                       size="large"
                       v-if="demandStatus.btn2.show&&canEdit"
                       :loading="flagTrans(demandStatus.btn2.status)">{{demandStatus.btn2.name}}</el-button>
          </div>
          <div class="fr m-r-30 m-tb-8 status-sel"
               v-show="(showDeadline) && (deadline > 0)">倒计时：<span>{{timeCalc}}</span></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20"
            class="m-t-30"
            v-show="showSerout"
            v-if="hasAppDesign">
      <el-col :span="22"
              :offset="1">
        <div class="service-table">
          <div class="finance-title fl m-r-10">外观设计</div>
          <el-table :data="outService"
                    class="w-720 fl tx-c">
            <el-table-column prop="u_name"
                             label="服务方"
                             width="250">
            </el-table-column>
            <el-table-column label="标签"
                             width="260">
              <template scope="scope">
                <span v-for="item in scope.row.label"
                      class="detail-label bor-ra-5">{{item}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status_attr"
                             label="状态"
                             width="80">
            </el-table-column>
            <el-table-column label="操作"
                             width="130">
              <template scope="scope">
                <el-button type="text"
                           size="small"
                           @click="serHandle(scope, 0)"
                           v-show="allEdit&&canEdit">
                  {{scope.row.handle}}
                </el-button>
                <el-button type="text"
                           size="small"
                           class="m-l-10"
                           @click="newSer(scope.row)"
                           v-show="(allEdit) && (scope.row.status == 60)&&canEdit">
                  重新邀请
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="fl m-l-10"
                     @click="openSer(0, 0)"
                     v-show="allEdit&&canEdit">添加服务方</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20"
            class="m-t-30"
            v-show="showSerin"
            v-if="hasStructDesign">
      <el-col :span="22"
              :offset="1">
        <div class="service-table">
          <div class="finance-title fl m-r-10">内部结构</div>
          <el-table :data="inService"
                    class="w-720 fl tx-c">
            <el-table-column prop="u_name"
                             label="服务方"
                             width="250">
            </el-table-column>
            <el-table-column label="标签"
                             width="260">
              <template scope="scope">
                <span v-for="item in scope.row.label"
                      class="detail-label bor-ra-5">{{item}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status_attr"
                             label="状态"
                             width="80">
            </el-table-column>
            <el-table-column label="操作"
                             width="130">
              <template scope="scope">
                <el-button type="text"
                           size="small"
                           @click="serHandle(scope, 1)"
                           v-show="allEdit&&canEdit">
                  {{scope.row.handle}}
                </el-button>
                <el-button type="text"
                           size="small"
                           class="m-l-10"
                           @click="newSer(scope.row)"
                           v-show="(allEdit) && (scope.row.status == 60)&&(canEdit)">
                  重新邀请
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button class="fl m-l-10"
                     @click="openSer(1, 0)"
                     v-show="allEdit&&canEdit">添加服务方</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20"
            class="m-t-30"
            v-show="showMatch">
      <el-col :span="7"
              :offset="1"
              v-if="hasAppDesign">
        <div class="fl gray-14">
          <span class="labelTitle">外观设计：</span>
          <el-button type="text">{{detail.out_servicer}}</el-button>
        </div>
      </el-col>
      <el-col :span="4"
              v-if="hasAppDesign">
        <el-button type="primary"
                   size="small"
                   @click="openTag(1, 0)">匹配记录</el-button>
        <el-button type="primary"
                   size="small"
                   @click="openSer(0, 1)"
                   v-show="(detail.out_orderstatus == 101)">重新选择</el-button>
      </el-col>
      <el-col :span="7"
              v-show="detail.in_servicer != ''">
        <div class="fl gray-14">
          <span class="labelTitle">内部结构：</span>
          <el-button type="text">{{detail.in_servicer}}</el-button>
        </div>
      </el-col>
      <el-col :span="4"
              v-show="detail.in_servicer != ''">
        <el-button type="primary"
                   size="small"
                   @click="openTag(1, 1)">匹配记录</el-button>
        <el-button type="primary"
                   size="small"
                   @click="openSer(1, 1)"
                   v-show="(detail.in_orderstatus == 101)">重新选择</el-button>
      </el-col>
    </el-row>
    <tabInfo ref="tabInfo"
             :isOne="isOne"
             :status="tabData"
             :info="tabMsg"
             :conId="conId"></tabInfo>
    <editInfo :title="up.title"
              :label="labelList"
              ref="editInfo"></editInfo>
    <servicer :isIn="isInSer"
              :isNewSer="isNewSer"
              :inData="inService"
              :outData="outService"
              ref="servicer"></servicer>
    <recordInfo ref="recordInfo"
                :type="reType"></recordInfo>
  </div>
</template>
<style type="text/css">
.gray-14 .labelTitle {
  display: inline-block;
  width: 100px;
  text-align: right;
  color: #5e6d82;
  font-weight: normal;
}

.edit_label {
  min-width: 60px;
  height: 18px;
  line-height: 18px;
  padding: 5px 8px;
  margin-left: 5px;
  margin-bottom: 5px;
  text-align: center;
  background: #cccccc;
  font-size: 14px;
  font-weight: normal;
}

.w-80 {
  width: 80px;
}

.w-120 {
  width: 120px;
}

.w-600 {
  width: 600px;
}

.w-720 {
  width: 720px;
}

.x1 {
  padding: 0 !important
}

.m-tb-8 {
  margin: 8px 0;
}

.form-bg {
  width: 600px;
  padding-top: 30px;
  background: #cccccc;
}

.service-table .cell {
  text-align: center;
}

.service-table .detail-label {
  display: inline-block;
  margin-top: 3px;
  margin-bottom: 3px;
  padding: 0 5px;
}

.agreed-btn {
  position: absolute;
  right: 45px;
  top: 0;
}

.w-80P {
  width: 80%;
}

.el-select.contact .el-input {
  width: 140px;
}
</style>
<script>
import address from 'assets/js/city-data.json'
// import contactOptions from 'assets/json/mock-contact.json'
import http from 'assets/js/http'
import tabInfo from './tab.vue'
import editInfo from './edit.vue'
import servicer from './servicer.vue'
import recordInfo from './record.vue'
import category from '../../common/dialog/category.vue'
import contact from '../../common/contact.vue'
export default {
  data() {
    var isZero = (rule, value, cb) => {
      if (value == 0) {
        return cb(new Error('该款项不能为0'))
      } else {
        cb()
      }
    }
    return {
      contactOptions: [],
      user_id: null,
      openType: '', // 类型为添加联系人还是编辑联系人
      contactVisible: false, // 联系人可见
      categoryData: [],
      postArr: [],  //  按钮限制的数组
      loadingItem: '',
      showSerin: false,
      showSerout: false,
      showMatch: false,
      categoryVisable: false, // 营业品类可见
      isEdit: true,
      form: {},
      proCityList: address,
      proCityVal: [],
      detail: {
        outward_pre_pay: 0,
        internal_pre_pay: 0,
        outward_balance_amount: 0,
        internal_balance_amount: 0
      },
      up: {
        name: '',
        phone: null,
        email: ''
      },
      area: null,
      rules: {
        demander: [
          { required: true, message: '请输入需求方名称', trigger: 'blur' }
        ],
        contact: [
          { required: true, type: 'object', message: '请选择联系人', trigger: 'change' }
        ],
        account: [
          { required: true, message: '请输入网站账号', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '需求标题', trigger: 'blur' }
        ]
        // outward_pre_pay: [
        //   { required: true, message: '请填写预付款', trigger: 'blur' },
        //   { validator: isZero, trigger: 'blur' }
        // ],
        // outward_balance_amount: [
        //   { required: true, message: '请填写尾款', trigger: 'blur' },
        //   { validator: isZero, trigger: 'blur' }
        // ],
        // in_pre_pay: [
        //   { required: true, message: '请填写预付款', trigger: 'blur' },
        //   { validator: isZero, trigger: 'blur' }
        // ],
        // in_balance_amount: [
        //   { required: true, message: '请填写尾款', trigger: 'blur' },
        //   { validator: isZero, trigger: 'blur' }
        // ]
      },
      demandStatus: {
        btn1: {
          name: '',
          show: false,
          status: 0
        },
        btn2: {
          name: '',
          show: false,
          status: 0
        }
      },
      outService: [],
      inService: [],
      selectArr: [],
      authList: Lockr.get('authList'),
      id: null,
      bonus1: {},
      bonus2: {},
      bonus3: {},
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      in_balance_amount: null,
      in_pre_pay: null,
      isEditBtn: false,
      isOne: '未匹配服务方及签订合同，里程碑为空',
      tabData: {
        isThree: false,
        isCon: false,
        isConEdit: false,
        isBonus: false
      },
      tabMsg: {
        tabIndex: '1',
        model: '1'
      },
      conId: null,
      labelList: [],
      isInSer: 0,
      isNewSer: 0,
      outOldSer: null,
      inOldSer: null,
      outMatchId: null,
      inMatchId: null,
      reType: 0,
      allEdit: false,
      timeCalc: '',
      deadline: null,
      showDeadline: false,
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      categoryList: [],
      editData: {
        design: [],
        design_type: '',
        design_output: [],
        applicable_people: [],
        market: [],
        position: '',
        material: '',
        control_panel: '',
        competitors: '',
        detail: '',
        dimensions: '',
        cost: {
          end: null,
          start: null
        },
        end_time: '',
        market_time: '',
        price: {
          end: null,
          start: null
        },
        sales: {
          after_third: null,
          first: null,
          second: null,
          third: null
        },
        buyout_1: null,
        buyout_2: null,
        buyout_3: null,
        reach_month: null
      }
    }
  },
  methods: {
    // removeCategory() {
    //   this.categoryData = []
    // },
    editCategory(data) { // 编辑品类
      // let categorys = this.categoryData
      // let { key } = categorys[index].data[0]
      // let data = [{ ...res.data }]
      //       this.$set(categorys, index, { index: index + 1, ...res.data, data })
      //       this.$refs.category.destory()
      this.categoryData = []
      this.categoryData.push(data)
      this.categoryVisable = false
    },
    openContactDialog() { // 打开添加联系人弹窗
      this.openType = 'add'
      this.contactVisible = true
      this.$nextTick(() => this.$refs.contact.toggle())
    },
    addContact(contact) { // 添加联系人
      this.$refs.contact.destory()
      this.contactOptions.push(contact)
      this.up.contact.name = contact.name
      this.up.contact.phone = contact.phone
      this.up.contact.email = contact.email
    },
    // 编辑标签弹窗/匹配记录弹窗/上传文件弹窗
    openTag(num, type) {
      switch (num) {
        case 0:
          this.labelList = _g.s2j(_g.j2s(this.detail.label))
          this.$refs.editInfo.open()
          break
        case 1:
          if (type == 1) {
            this.reType = 1
          } else {
            this.reType = 0
          }
          this.$refs.recordInfo.open()
          break
      }
    },
    // 添加服务方弹窗
    openSer(num, type) {
      if (num == 1) {
        this.isInSer = 1
      } else {
        this.isInSer = 0
      }
      if (type == 1) {
        this.isNewSer = 1
      } else {
        this.isNewSer = 0
      }
      this.$refs.servicer.open()
    },
    areaChange() {
      let item = _.filter(this.selectArr, (o) => {
        return o.id == this.up.area
      })
      this.up.area = this.area
    },
    //  获取产品类别
    getOption() {
      // this.apiGet('product_types').then((res) => {
      //   if (res.code == 200) {
      //     this.selectArr = this.selectArr.concat(res.data)
      //   } else {
      //     this.$message.error(res.error)
      //   }
      // })
    },
    // 获取需求详情
    getData() {
      this.apiGet('requires/' + this.id).then((res) => {
        if (res.code == 200) {
          this.cid = res.data.customer_id
          this.uid = res.data.user_id
          let query = { userid: this.uid }
          this.cid ? query.dsu_id = this.cid : null
          this.$router.push({ query })
          this.user_id = res.data.user_id
          this.fetchContacts()
          this.checked1 = false
          this.checked2 = false
          this.checked3 = false
          this.checked4 = false
          this.conId = res.data.contract_id
          this.tabMsg.model = res.data.coo_model
          if ((res.data.status / 10) > 5) {
            this.isOne = ''
            if (res.data.status == 260) {
              this.isOne = '里程碑为空'
            }
          }
          if ((res.data.status / 10) > 6) {
            this.tabData.isCon = true
            if ((res.data.status / 10) > 9) {
              this.tabData.isThree = true
            }
            if ((res.data.status / 10) == 8) {
              this.tabData.isThree = true
            }
          }
          // 转换合作模式为字符串
          if (res.data.coo_model != null) {
            res.data.coo_model = res.data.coo_model.toString()
          }
          this.detail = res.data
          this.area = this.detail.area
          if (JSON.stringify(res.data.area) !== '{}') {
            this.categoryData = []
            this.categoryData.push(res.data.area)
          }
          // this.categoryData.push(res.data.area)
          // 提成方案
          let program = res.data.bonus_program
          if (program.length > 0) {
            this.bonus1 = program[0]
            if ((program.length == 3) && (program[2].start_count != null)) {
              this.bonus2 = program[1]
              this.bonus3 = program[2]
              this.bonus3.show = true
              this.bonus2.show = true
            } else if ((program.length == 3) && (program[1].start_count != null)) {
              this.bonus2 = program[1]
              this.bonus2.show = true
              this.bonus3.show = false
            } else {
              this.bonus2.show = false
              this.bonus3.show = false
            }
          }
          this.in_balance_amount = res.data.internal_balance_amount
          this.in_pre_pay = res.data.internal_pre_pay
          // 判断设计方案的选定
          _(res.data.design_way).forEach((val, key) => {
            switch (val) {
              case '10':
                this.checked1 = true
                break
              case '20':
                this.checked2 = true
                break
              case '30':
                this.checked3 = true
                break
              case '40':
                this.checked4 = true
                break
            }
          })
          // 设置表单信息
          this.up = {
            action_type: 'updateInfo',
            bonus_cycle: 3,
            bonus_duration: res.data.bonus_duration,
            bonus_program: [],
            budget_max: res.data.budget_max,
            budget_min: res.data.budget_min,
            coo_model: res.data.coo_model,
            demander: res.data.demander,
            design_way: res.data.design_way,
            internal_balance_amount: 0,
            internal_pre_pay: 0,
            label: [],
            province: res.data.province || '',
            city: res.data.city || '',
            zone: res.data.zone || '',
            address: res.data.address,
            outward_balance_amount: res.data.outward_balance_amount,
            outward_pre_pay: res.data.outward_pre_pay,
            remark: res.data.remark,
            title: res.data.title,
            account: res.data.account,
            contact: {
              name: res.data.user_name,
              phone: res.data.user_phone,
              email: res.data.user_email
            }
          }
          if (this.up.coo_model == '0' || this.up.coo_model == 0) {
            this.up.coo_model = '1'
          }
          this.proCityVal = [this.up.province, this.up.city, this.up.zone]
          // 设置需求状态
          this.setStatus(res.data.status)
          this.loadingItem.close()
        } else {
          _g.dealError(this, res)
        }
      })
    },
    fetchContacts() { // 获取联系人列表
      let id = this.user_id
      this.apiGet(`demand_user/${id}/contacts`).then(res => {
        this.contactOptions = res.data
      })
    },
    // 设置需求状态
    setStatus(status) {
      this.isEdit = true
      this.showMatch = true
      switch (status) {
        case 10:
          this.demandStatus = {
            btn1: {
              name: '审核不通过',
              show: true,
              status: 20
            },
            btn2: {
              name: '审核通过',
              show: true,
              status: 40
            }
          }
          this.isEdit = false
          this.getOption()
          this.showMatch = false
          break
        case 20:
          this.demandStatus.btn1 = {
            name: '取消需求',
            show: true,
            status: 30
          }
          this.showMatch = false
          break
        case 30:
          this.showMatch = false
          break
        case 40:
          this.demandStatus = {
            btn1: {
              name: '取消需求',
              show: true,
              status: 30
            },
            btn2: {
              name: '匹配服务方',
              show: true,
              status: 50
            }
          }
          this.isEditBtn = true
          this.getOption()
          this.showMatch = false
          break
        case 50:
          this.demandStatus = {
            btn1: {
              name: '取消需求',
              show: true,
              status: 30
            },
            btn2: {
              name: '确认匹配',
              show: true,
              status: 60
            }
          }
          this.isEdit = true
          this.isEditBtn = true
          this.getOption()
          this.getServicer()
          this.showSerin = false
          this.showSerout = true
          _(this.detail.design_way).forEach((res, key) => {
            if (res == '30') {
              this.showSerin = true
            }
          })
          this.showMatch = false
          this.showDeadline = true
          this.deadline = this.detail.match_deadline
          break
        case 60:
          this.demandStatus.btn2 = {
            name: '发起合同',
            show: true,
            status: 70
          }
          this.tabData.isConEdit = true
          break
        case 70:
          this.demandStatus.btn2 = {
            name: '查看合同',
            show: true,
            status: 1
          }
          break
        case 90:
          if (!this.allEdit) {
            this.tabData.isConEdit = false
          } else {
            this.tabData.isConEdit = true
          }
          this.isEditBtn = true
          this.getOption()
          this.demandStatus.btn2 = {
            name: '查看合同',
            show: true,
            status: 70
          }
          break
        case 91:
          this.demandStatus.btn2 = {
            name: '查看首款',
            show: true,
            status: 2
          }
          break
        case 100:
          if (this.detail.have_orders != 1) {
            this.demandStatus.btn2 = {
              name: '生成订单',
              show: true,
              status: 110
            }
          }
          break
        case 150:
          this.showDeadline = true
          this.deadline = this.detail.effect_time
          break
        case 171:
          this.demandStatus.btn2 = {
            name: '查看尾款',
            show: true,
            status: 2
          }
          break
        case 190:
          this.showDeadline = true
          this.deadline = this.detail.three_dimensional_time
          break
        case 230:
          this.showDeadline = true
          this.deadline = this.detail.structure_time
          break
        case 250:
          this.tabData.isBonus = true
          break
        case 217:
          this.demandStatus.btn2 = {
            name: '查看尾款',
            show: true,
            status: 2
          }
          break
      }
      if (!this.allEdit) {
        this.isEdit = true
        this.getOption()
      }
      if (this.showDeadline) {
        this.calcTime()
      }
    },
    // 获取匹配服务方列表
    getServicer() {
      this.apiGet('requires/' + this.id + '/services').then((res) => {
        if (res.code == 200) {
          this.outService = res.data.out
          this.inService = res.data.in
          this.setServicerHandle(this.outService)
          this.setServicerHandle(this.inService)
        } else {
          _g.dealError(this, res)
        }
      })
    },
    // 设置服务方操作
    setServicerHandle(obj) {
      _(obj).forEach((res, key) => {
        switch (res.status) {
          case 10:
            obj[key].handle = '删除'
            break
          case 20:
            obj[key].handle = '删除'
            break
          case 30:
            obj[key].handle = '选定'
            break
          case 60:
            obj[key].handle = '删除'
            break
        }
      })
    },
    // 匹配服务方相关操作
    serHandle(obj, type) {
      if ((obj.row.status == 10) || (obj.row.status == 20) || (obj.row.status == 60)) {
        this.$confirm('确认删除该服务方?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.apiDelete('requires/' + this.id + '/services/', obj.row.match_id).then((res) => {
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '删除成功')
              setTimeout(() => {
                this.getServicer()
              }, 200)
            } else {
              _g.dealError(this, res)
            }
          })
        }).catch(() => {
        })
      } else if (obj.row.status == 30) {
        obj.row.handle = ''
        obj.row.status_attr = '已选定'
        if (type == 0) {
          if (this.outOldSer != null) {
            this.outService[this.outOldSer].handle = '选定'
            this.outService[this.outOldSer].status_attr = '已参与'
          }
          this.outOldSer = obj.$index
          this.outMatchId = obj.row.match_id
        } else {
          if (this.inOldSer != null) {
            this.inService[this.inOldSer].handle = '选定'
            this.inService[this.inOldSer].status_attr = '已参与'
          }
          this.inOldSer = obj.$index
          this.inMatchId = obj.row.match_id
        }
      }
    },
    // 进入编辑需求状态
    showEdit() {
      this.isEdit = false
    },
    // 修改标签
    setLabel() {
      this.detail.label = this.labelList
    },
    // 保存需求
    saveData() {
      this.$refs.form.validate((pass) => {
        if (pass) {
          // 根据合作模式设置外观设计付款方式
          this.up.user_name = this.up.contact.name
          this.up.user_email = this.up.contact.email
          this.up.user_phone = this.up.contact.phone
          if (this.up.coo_model == 1) {
            this.up.bonus_program = []
            this.up.bonus_cycle = 3
            this.up.bonus_duration = ''
            // this.up.user_name = this.up.contact.name
            // this.up.user_email = this.up.contact.email
            // this.up.user_phone = this.up.contact.phone
            delete this.up.contact
          } else if (this.up.coo_model == 2) {
            this.up.outward_balance_amount = 0
            if ((typeof (this.bonus1.end_count) == 'undefined') || (this.bonus1.end_count < 1)) {
              _g.toastMsg(this, 'warning', '请输入完整的提成方案')
              return
            } else if ((typeof (this.bonus1.amount) == 'undefined') || (this.bonus1.amount < 0)) {
              _g.toastMsg(this, 'warning', '请输入完整的提成方案')
              return
            }
            if ((this.bonus1.end_count - this.bonus2.start_count > 0) || (this.bonus2.end_count - this.bonus3.start_count > 0) || (this.bonus2.start_count - this.bonus2.end_count > 0)) {
              _g.toastMsg(this, 'warning', '提成方案输入错误')
              return
            }
          } else if (this.up.coo_model == null) {
            _g.toastMsg(this, 'warning', '请选择合作模式')
            return
          }
          // 设置提成方案
          this.up.bonus_program[0] = {
            start_count: 0,
            end_count: this.bonus1.end_count,
            amount: this.bonus1.amount
          }
          if ((typeof (this.bonus2.start_count) != 'undefined') && (typeof (this.bonus2.end_count) != 'undefined') && (typeof (this.bonus2.amount) != 'undefined')) {
            this.up.bonus_program[1] = {
              start_count: this.bonus2.start_count,
              end_count: this.bonus2.end_count,
              amount: this.bonus2.amount
            }
          }
          if ((typeof (this.bonus3.start_count) != 'undefined') && (typeof (this.bonus3.amount) != 'undefined')) {
            this.up.bonus_program[2] = {
              start_count: this.bonus3.start_count,
              end_count: '',
              amount: this.bonus3.amount
            }
          }
          // 根据设计方案判断是否内部结构的付款
          _(this.up.design_way).forEach((val, key) => {
            if (val == '30') {
              if ((this.in_balance_amount != null) || (this.in_balance_amount != '')) {
                this.up.internal_balance_amount = this.in_balance_amount
              } else {
                _g.toastMsg(this, 'warning', '请输入内部结构预付款')
                return
              }
              if ((this.in_pre_pay != null) || (this.in_pre_pay != '')) {
                this.up.internal_pre_pay = this.in_pre_pay
              } else {
                _g.toastMsg(this, 'warning', '请输入内部结构尾款')
                return
              }
            }
          })
          this.up.area = this.categoryData[0]
          _(this.detail.label).forEach((res, key) => {
            this.up.label.push(res.label_id)
          })
          this.postArr.push('saveData')
          this.apiPut('requires/' + this.id + '?action_type=updateInfo', '', this.up).then((res) => {
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '编辑成功')
              setTimeout(() => {
                this.getData()
                this.postArr.splice(_.indexOf(this.postArr, 'saveData'), 1)
              }, 300)
            } else {
              this.postArr.splice(_.indexOf(this.postArr, 'saveData'), 1)
              _g.dealError(this, res)
            }
          }, (res) => {
            this.postArr.splice(_.indexOf(this.postArr, 'saveData'), 1)
          })
        } else {
          _g.toastMsg(this, 'warning', '请将带 * 号内容填写完整')
          let win = document.getElementsByClassName('panel-c-c')[0]
          win.scrollTop = 0
        }
      })
    },
    // 需求状态按钮操作
    upStatus(num) {
      if (num == 1) {
        this.tabMsg.tabIndex = '2'
      } else if (num == 2) {
        this.tabMsg.tabIndex = '3'
      } else if (num == 70) {
        this.tabMsg.tabIndex = '2'
        this.tabData.isCon = true
      } else if (num == 110) {
        this.postArr.push(num)
        this.apiPost('orders', { re_id: this.id }).then((res) => {
          if (res.code == 200) {
            _g.toastMsg(this, 'success', '生成订单成功')
            setTimeout(() => {
              _g.reloadPage(this)
            }, 1000)
          } else {
            this.postArr.splice(_.indexOf(this.postArr, num), 1)
            _g.dealError(this, res)
          }
        }, (res) => {
          this.postArr.splice(_.indexOf(this.postArr, num), 1)
        })
      } else {
        let putData = {
          status: num,
          action_type: 'updateStatus'
        }
        if (num == 60) {
          putData.match_id = []
          if (this.hasAppDesign) {
            if (this.outMatchId != null) {
              putData.match_id.push(this.outMatchId)
            } else {
              _g.toastMsg(this, 'warning', '请选定外观设计服务方')
              return
            }
          }
          if (this.showSerin == true) {
            if (this.inMatchId != null) {
              putData.match_id.push(this.inMatchId)
            } else {
              _g.toastMsg(this, 'warning', '请选定内部结构服务方')
              return
            }
          }
        }
        this.postArr.push(num)
        this.apiPut('requires/' + this.id, '', putData).then((res) => {
          if (res.code == 200) {
            _g.toastMsg(this, 'success', '操作成功')
            setTimeout(() => {
              _g.reloadPage(this)
            }, 1000)
          } else {
            this.postArr.splice(_.indexOf(this.postArr, num), 1)
            _g.dealError(this, res)
          }
        }, (res) => {
          this.postArr.splice(_.indexOf(this.postArr, num), 1)
        })
      }
    },
    handleChangeCity(val) {
      this.up.province = val[0]
      this.up.city = val[1]
      this.up.zone = val[2]
    },
    // 倒计时
    calcTime() {
      if (this.deadline == 0) {
        return
      }
      let _this = this
      let deadlineDay = parseInt(((this.deadline) / 3600) / 24)
      let deadlineHour = parseInt(((this.deadline) / 3600) % 24)
      let deadlineMin = parseInt(((this.deadline) % 3600) / 60)
      let deadlineSec = parseInt(((this.deadline) % 3600) % 60)
      if (deadlineHour < 10) {
        deadlineHour = '0' + deadlineHour
      }
      if (deadlineMin < 10) {
        deadlineMin = '0' + deadlineMin
      }
      if (deadlineSec < 10) {
        deadlineSec = '0' + deadlineSec
      }
      this.timeCalc = deadlineDay + '天' + deadlineHour + '时' + deadlineMin + '分' + deadlineSec + '秒'
      setTimeout(() => {
        _this.deadline = _this.deadline - 1
        _this.calcTime()
      }, 1000)
    },
    // 重新邀请服务方
    newSer(row) {
      this.apiPut('requires/' + this.id + '/services/', row.match_id, { status: 10 }).then((res) => {
        if (res.code == 200) {
          _g.toastMsg(this, 'success', '邀请成功')
          setTimeout(() => {
            this.getServicer()
            this.getData()
          }, 200)
        } else {
          _g.dealError(this, res)
        }
      })
    },
    flagTrans(val) {
      return _.includes(this.postArr, val)
    },
    openCategoryDialog() { // 编辑品类
      this.categoryVisable = true
      this.categoryList = this.categoryData[0]
      this.$nextTick(() => this.$refs.category.render())
    },
    setCategory(arr) {
      this.categoryList = []
      this.categoryList = arr
    },
    handleSelectContact(id) { // 选择联系人
      let info = {}
      this.contactOptions.forEach((item, index) => {
        if (item.id == id) {
          info = item
          this.$set(this.up.contact, 'name', info.name)
          this.$set(this.up.contact, 'phone', info.phone)
          this.$set(this.up.contact, 'email', info.email)
        }
      })
    }
  },
  created() {
    let options = {
      text: '正在加载中',
      fullscreen: false,
      lock: true,
      customClass: 'loading-modal'
    }
    // this.contactOptions = contactOptions
    this.conMarket = window.conMarket
    this.conPosition = window.conPosition
    this.conPeople = window.conPeople
    this.conMaterial = window.conMaterial
    this.conPanel = window.conPanel
    this.conDesignType = window.conDesignType
    this.conDesignOutput = window.conDesignOutput
    this.loadingItem = this.$loading(options)
    // 获取权限列表
    let auth = Lockr.get('authList')
    // 获取当前页面地址名
    let name = this.$route.name
    if (auth) {
      // 需求管理的需求详情
      if ((name == 'demandDetail') || (name == 'historyDetail')) {
        if (typeof (auth.demand_edit) != 'undefined') {
          this.allEdit = true
        }
      }
      // 我的客户的需求详情
      if (name == 'myClienDemand') {
        if (typeof (auth.myClient_edit) != 'undefined') {
          this.allEdit = true
        }
      }
      // 公海客户的需求详情
      if (name == 'publicClienDemand') {
        if (typeof (auth.publicClient_edit) != 'undefined') {
          this.allEdit = true
        }
      }
      // 服务商列表的需求详情
      if (name == 'serviceDemandDetail' || name == 'demandDemandDetail') {
        if (typeof (auth.service_edit) != 'undefined') {
          this.allEdit = true
        }
      }
    } else {
      this.allEdit = true
    }
    this.id = this.$route.params.id
    this.getData()
  },
  computed: {
    showBonus() {
      return this.up.coo_model == 2
    },
    coo_model() {
      if (this.up.coo_model == 1) {
        this.bonus1 = {}
        this.bonus2 = {}
        this.bonus3 = {}
      } else {
        this.up.outward_balance_amount = null
      }
      return this.up.coo_model
    },
    hasAppDesign() {
      if (!_.includes(this.up.design_way, '10')) {
        this.up.coo_model = '1'
        this.up.outward_pre_pay = null
        this.up.outward_balance_amount = null
        if (_.includes(this.up.design_way, '20')) {
          this.up.design_way = _.remove(this.up.design_way, (val) => {
            return val != '20'
          })
        }
        return false
      } else {
        return true
      }
    },
    hasStructDesign() {
      if (!_.includes(this.up.design_way, '30')) {
        this.in_pre_pay = null
        this.in_balance_amount = null
        if (_.includes(this.up.design_way, '40')) {
          this.up.design_way = _.remove(this.up.design_way, (val) => {
            return val != '40'
          })
        }
        return false
      } else {
        return true
      }
    },
    canEdit() {
      return this.authList == null || this.authList['demand_edit']
    },
    category() {
      // let categories = []
      // this.categoryData ? categories.concat(this.categoryData) : null
      return [..._g.formatCategory(this.categoryData)][0]
    }
  },
  components: {
    tabInfo,
    editInfo,
    servicer,
    recordInfo,
    category,
    contact
  },
  mixins: [http]
}
</script>