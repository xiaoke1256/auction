/**
 * 拍卖系统 Demo - 模拟数据（不连接数据库）
 * 刷新页面会恢复初始状态
 */

const MockData = {
  // 管理人员（超级管理员创建并授权，不开放自助注册）
  // 演示账号：admin/admin 超级管理员；manager/123 普通管理员
  adminUsers: [
    { id: 1, login: 'admin', password: 'admin', role: 'superadmin', name: '超级管理员', permissions: ['*'] },
    { id: 2, login: 'manager', password: '123', role: 'admin', name: '普通管理员', permissions: ['consignor', 'lots', 'auction', 'results', 'contract', 'refund'] }
  ],

  // 竞拍人账号（自助注册后可登录；演示预置 2 个）
  bidderAccounts: [
    { id: 1, login: '13900002001', password: '123', name: '李女士', contact: '139****2001', idNo: '310***********101' },
    { id: 2, login: '13600002002', password: '123', name: '王先生', contact: '136****2002', idNo: '310***********102' }
  ],

  // 委托人
  consignors: [
    { id: 1, name: '张先生', contact: '138****1001', idNo: '310***********001', bankAccount: '6222****001', status: 'approved' },
    { id: 2, name: '某某文化公司', contact: '021-12345678', idNo: '9131***********002', bankAccount: '6222****002', status: 'approved' }
  ],

  // 拍卖委托书（委托人与平台签署，按拍品）
  commissionContracts: [
    { id: 1, lotId: 1, lotName: '清乾隆青花缠枝莲纹瓶', consignorName: '张先生', signed: true, signedAt: '2025-02-28' },
    { id: 2, lotId: 2, lotName: '当代油画《山居图》', consignorName: '某某文化公司', signed: true, signedAt: '2025-03-08' },
    { id: 3, lotId: 3, lotName: '翡翠手镯', consignorName: '张先生', signed: false, signedAt: null }
  ],

  // 拍品（状态: draft | pending | published | auction | sold | unsold）
  lots: [
    { id: 1, name: '清乾隆青花缠枝莲纹瓶', category: '瓷器', desc: '品相完好，来源清晰。', image: 'https://via.placeholder.com/300x200?text=Lot1', reservePrice: 500000, startPrice: 500000, minIncrement: 10000, consignorId: 1, consignorName: '张先生', status: 'published', publishStart: '2025-03-01', publishEnd: '2025-03-20', auctionStart: '2025-03-21 10:00', auctionEnd: '2025-03-21 12:00', depositRate: 0.2 },
    { id: 2, name: '当代油画《山居图》', category: '书画', desc: '作者某某，2020年作。', image: 'https://via.placeholder.com/300x200?text=Lot2', reservePrice: 80000, startPrice: 80000, minIncrement: 5000, consignorId: 2, consignorName: '某某文化公司', status: 'auction', publishStart: '2025-03-10', publishEnd: '2025-03-25', auctionStart: '2025-03-25 14:00', auctionEnd: '2025-03-25 16:00', depositRate: 0.2 },
    { id: 3, name: '翡翠手镯', category: '珠宝', desc: '天然A货，附鉴定证书。', image: 'https://via.placeholder.com/300x200?text=Lot3', reservePrice: 120000, startPrice: 120000, minIncrement: 2000, consignorId: 1, consignorName: '张先生', status: 'draft', publishStart: '', publishEnd: '', auctionStart: '', auctionEnd: '', depositRate: 0.2 }
  ],

  // 竞拍人
  bidders: [
    { id: 1, name: '李女士', contact: '139****2001', idNo: '310***********101' },
    { id: 2, name: '王先生', contact: '136****2002', idNo: '310***********102' }
  ],

  // 保证金（status: pending_review 到账待审核 | approved 审核通过 | rejected 已拒绝 | refund_pending | refunded）
  deposits: [
    { id: 1, lotId: 1, lotName: '清乾隆青花缠枝莲纹瓶', bidderId: 1, bidderName: '李女士', amount: 100000, status: 'approved', paidAt: '2025-03-15 09:00', serialNo: 'DEP202503150001', reviewedAt: '2025-03-15 10:00' },
    { id: 2, lotId: 1, lotName: '清乾隆青花缠枝莲纹瓶', bidderId: 2, bidderName: '王先生', amount: 100000, status: 'refund_pending', paidAt: '2025-03-16 10:00', serialNo: 'DEP202503160002', reviewedAt: '2025-03-16 11:00' },
    { id: 3, lotId: 2, lotName: '当代油画《山居图》', bidderId: 1, bidderName: '李女士', amount: 16000, status: 'approved', paidAt: '2025-03-24 11:00', serialNo: 'DEP202503240003', reviewedAt: '2025-03-24 12:00' },
    { id: 4, lotId: 2, lotName: '当代油画《山居图》', bidderId: 2, bidderName: '王先生', amount: 16000, status: 'refunded', paidAt: '2025-03-24 12:00', serialNo: 'DEP202503240004', reviewedAt: '2025-03-24 13:00', refundedAt: '2025-03-26 10:00', refundSerial: 'REF202503260001' },
    { id: 5, lotId: 2, lotName: '当代油画《山居图》', bidderId: 1, bidderName: '李女士', amount: 16000, status: 'pending_review', paidAt: '2025-03-25 09:00', serialNo: 'DEP202503250005' }
  ],

  // 出价记录（lotId, bidderId, amount, time）
  bids: [
    { id: 1, lotId: 1, bidderId: 1, bidderName: '李女士', amount: 520000, time: '2025-03-21 10:15' },
    { id: 2, lotId: 1, bidderId: 2, bidderName: '王先生', amount: 550000, time: '2025-03-21 10:28' },
    { id: 3, lotId: 1, bidderId: 1, bidderName: '李女士', amount: 560000, time: '2025-03-21 11:00' },
    { id: 4, lotId: 2, bidderId: 1, bidderName: '李女士', amount: 90000, time: '2025-03-25 14:10' },
    { id: 5, lotId: 2, bidderId: 2, bidderName: '王先生', amount: 95000, time: '2025-03-25 14:35' }
  ],

  // 拍卖结果（lotId, winnerBidderId, winnerName, price, soldAt, isUnsold）
  results: [
    { id: 1, lotId: 1, lotName: '清乾隆青花缠枝莲纹瓶', winnerBidderId: 1, winnerName: '李女士', price: 560000, soldAt: '2025-03-21 12:00', isUnsold: false },
    { id: 2, lotId: 2, lotName: '当代油画《山居图》', winnerBidderId: 2, winnerName: '王先生', price: 95000, soldAt: '2025-03-25 16:00', isUnsold: false }
  ],

  // 成交书（resultId, signed: boolean, signedAt）
  contracts: [
    { id: 1, resultId: 1, lotName: '清乾隆青花缠枝莲纹瓶', winnerName: '李女士', price: 560000, paymentDeadline: '2025-04-21', signed: true, signedAt: '2025-03-22 10:00' },
    { id: 2, resultId: 2, lotName: '当代油画《山居图》', winnerName: '王先生', price: 95000, paymentDeadline: '2025-04-25', signed: false, signedAt: null }
  ]
};

// 便于在控制台或页面内修改状态（仅内存）
function getLotById(id) {
  return MockData.lots.find(l => l.id === parseInt(id, 10));
}
function getBidsByLotId(lotId) {
  return MockData.bids.filter(b => b.lotId === parseInt(lotId, 10)).sort((a, b) => new Date(b.time) - new Date(a.time));
}
function getCurrentPrice(lotId) {
  const list = getBidsByLotId(lotId);
  const lot = getLotById(lotId);
  if (!lot) return lot.startPrice;
  return list.length ? list[0].amount : lot.startPrice;
}
