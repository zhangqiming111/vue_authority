<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { DEFAULT_USERS, QRCODE_GIFTS, drawLottery } from '@/constants/lottery';

const timer = ref(null);
const countdown = ref(60);
const userList = DEFAULT_USERS;
const giftList = QRCODE_GIFTS;
const getGiftList = ref([]);

function startCountdown() {
  timer.value = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer.value);
      getGiftList.value = drawLottery(userList, giftList);
    }
  }, 1000);
}

onMounted(startCountdown);
onBeforeUnmount(() => clearInterval(timer.value));
</script>

<template>
  <div class="qrcode-mobile">
    <div class="mobile-phone">
      <div class="phone-countdown" v-if="countdown">
        <label>开奖倒计时:</label>
        <span>{{ countdown }} 秒</span>
      </div>
      <div class="phone-gift" v-else>
        <div class="gift-title">公布开奖结果</div>
        <div class="gift-subTitle">共获奖人数 {{ getGiftList.length }} 位</div>
        <div class="gift-list">
          <div class="list-item" v-for="(item, index) in getGiftList" :key="index">
            <span>{{ item.getName }}</span>
            <span>{{ item.getLevel }}</span>
            <span>荣获一台{{ item.getGift }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.mobile-phone {
  margin: 50px 0;
  text-align: center;
}

.phone-countdown > label {
  letter-spacing: 1px;
  font-size: 20px;
  font-weight: 600;
}

.phone-countdown > span {
  font-size: 25px;
  padding: 0 0 0 10px;
  color: #e31b1b;
  font-weight: 600;
}

.phone-gift {
  margin: 10px;
  max-height: 600px;
  overflow: auto;
}

.gift-title {
  padding: 10px 0;
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 600;
  color: #0b9d4c;
}

.gift-subTitle {
  padding: 0 0 10px;
  font-size: 13px;
}

.list-item {
  padding: 20px 10px;
  font-size: 17px;
  display: flex;
  justify-content: space-between;
}

.list-item:nth-child(2n) {
  background: #d8d8d8;
}

.list-item:nth-child(2n + 1) {
  background: #f0ecec;
}

.list-item > span:nth-child(2) {
  color: #1e80ff;
}

.list-item > span:nth-child(3) {
  color: #e30b0b;
}
</style>
