export const DEFAULT_USERS = [
  { userId: 10081, phone: '15387138023', name: '张三' },
  { userId: 10083, phone: '15387138024', name: '李三' },
  { userId: 10085, phone: '15387138025', name: '王二' },
  { userId: 10080, phone: '15387138031', name: '刘东' },
  { userId: 10082, phone: '15387138032', name: '李四' },
  { userId: 10079, phone: '15387138033', name: '张北' },
  { userId: 10076, phone: '15387138035', name: '赵南' },
  { userId: 10074, phone: '15387138045', name: '吴柳' },
  { userId: 10073, phone: '15387138043', name: '张峰' },
  { userId: 10032, phone: '15387138041', name: '孙圣' },
];

export const MARKET_GIFTS = [
  { level: '一等奖', count: 1, name: '苹果电脑', unit: '台' },
  { level: '二等奖', count: 1, name: '华为手机', unit: '台' },
  { level: '三等奖', count: 1, name: '小米音箱', unit: '台' },
];

export const QRCODE_GIFTS = [
  { level: '一等奖', count: 1, name: '苹果电脑', unit: '台' },
  { level: '二等奖', count: 2, name: '华为手机', unit: '台' },
  { level: '三等奖', count: 3, name: '小米音箱', unit: '台' },
];

export function drawLottery(userList, giftList) {
  const shuffled = [...userList].sort(() => Math.random() - 0.5);
  const winners = [];
  let offset = 0;

  giftList.forEach((gift) => {
    shuffled.slice(offset, offset + gift.count).forEach((user) => {
      winners.push({
        getName: user.name,
        getLevel: gift.level,
        getGift: gift.name,
      });
    });
    offset += gift.count;
  });

  return winners;
}
