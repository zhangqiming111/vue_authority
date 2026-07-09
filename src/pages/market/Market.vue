<template>
    <div class="market">
        <!-- 手机模板 -->
        <div class="market-mobile">
            <div class="mobile-phone">
                <div class="phone-switch">
                    <el-switch v-model="switchSelect" active-text="抽奖" inactive-text="扫码" />
                    <el-button v-if="switchSelect" type="primary" round size="small" @click="restartCountDown(60)">重新计时
                    </el-button>
                </div>
                <!-- 抽奖跳转页面 -->
                <div class="phone-first" v-if="!switchSelect">
                    <!-- 抽奖二维码 -->
                    <div class="phone-code">
                        <img src="./../../assets/qrcode.png" />
                    </div>
                    <!-- 奖品名单 -->
                    <div class="phone-prize">
                        <div class="prize-title">
                            抽奖奖品
                        </div>
                        <div class="prize-scroll">
                            <div class="scroll-card" v-for="(item, index) in giftList" :key="index">
                                <span>{{ item.level }}</span>
                                <span>{{ item.name }}</span>
                                <span>{{ item.count }} {{ item.unit }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="phone-second" v-else>
                    <div class="second-countdown" v-if="countdown">
                        <label>开奖倒计时:</label>
                        <span>{{ countdown }} 秒</span>
                    </div>
                    <div class="second-gift" v-else>
                        <div class="gift-title">公布开奖结果</div>
                        <div class="gift-subTitle">共获奖人数({{ getGiftList.length }})</div>
                        <div class="gift-list">
                            <div class="list-item" v-for="(item, index) in getGiftList" :key="index">
                                <span>{{ item.getName }}</span>
                                <span>{{ item.getLevel }}</span>
                                <span>{{ item.getGift }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 属性配置 -->
        <div class="market-property">
            <el-tabs v-model="activeName">
                <el-tab-pane label="扫码抽奖" name="first">
                    <div class="property-first">
                        <el-form :model="firstForm">
                            <!-- 中奖逻辑 -->
                            <el-form-item label="中奖逻辑">
                                <el-radio-group v-model="firstForm.winPrizeType">
                                    <el-radio label="随机数" />
                                    <el-radio label="时间取值" />
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="开奖时间">
                                <el-select v-model="firstForm.startPrizeTime" placeholder="请选择开奖时间">
                                    <el-option label="60秒" value="60" />
                                    <el-option label="120秒" value="120" />
                                    <el-option label="180秒" value="180" />
                                    <el-option label="240秒" value="240" />
                                </el-select>
                            </el-form-item>
                            <!-- 二维码 -->
                            <el-form-item label="图片上传">
                                <el-upload class="avatar-uploader"
                                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                                    :show-file-list="false">
                                    <el-icon class="avatar-uploader-icon">
                                        <i class="iconfont icon-plus"></i>
                                    </el-icon>
                                </el-upload>
                            </el-form-item>
                            <!-- 奖品 -->
                            <el-form-item label="奖项设置">
                                <div class="first-setting"><el-button type="primary">添加</el-button></div>
                                <el-table :data="firstForm.prizeTableInfo">
                                    <el-table-column v-for="(item, index) in firstForm.prizeTableColumn" :key="index"
                                        :label="item.label" :prop="item.prop" align="center">
                                    </el-table-column>
                                    <el-table-column label="操作" align="center">
                                        <template>
                                            <!-- 气泡确认框 -->
                                            <el-popconfirm title="这是一段内容确定删除吗?">
                                                <template #reference>
                                                    <el-button type="text">删除</el-button>
                                                </template>
                                            </el-popconfirm>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="转盘活动" name="second">
                    <div class="property-second">
                        <el-form :model="secondForm"></el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { DEFAULT_USERS, MARKET_GIFTS, drawLottery } from '@/constants/lottery';

const activeName = ref('first');
const switchSelect = ref(false);
const timer = ref(null);
const countdown = ref(60);
const userList = DEFAULT_USERS;
const giftList = MARKET_GIFTS;
const getGiftList = ref([]);
const firstForm = ref({
  winPrizeType: '',
  startPrizeTime: '',
  prizeTableInfo: [],
  prizeTableColumn: [
    { label: '奖项类型', prop: 'prizeType' },
    { label: '奖项名称', prop: 'prizeName' },
    { label: '奖项数量', prop: 'prizeNum' },
  ],
});
const secondForm = ref({});

function startCountdown() {
  timer.value = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer.value);
      getGiftList.value = drawLottery(userList, giftList);
    }
  }, 1000);
}

function restartCountDown(seconds) {
  countdown.value = seconds;
  getGiftList.value = [];
  clearInterval(timer.value);
  startCountdown();
}

onMounted(startCountdown);
onBeforeUnmount(() => clearInterval(timer.value));
</script>
<style src="./Market.css" scoped>

</style>