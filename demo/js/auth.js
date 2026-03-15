/**
 * 登录与权限（Demo 前端模拟，使用 sessionStorage 存当前用户）
 * 需求：管理人员由超级管理员授权登录；竞拍人自助注册后登录
 */

const Auth = {
  KEY: 'auction_demo_user',

  getCurrentUser() {
    try {
      const raw = sessionStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) sessionStorage.setItem(this.KEY, JSON.stringify(user));
    else sessionStorage.removeItem(this.KEY);
  },

  logout() {
    this.setCurrentUser(null);
  },

  /** 管理员登录：账号、密码，校验 adminUsers */
  loginAdmin(login, password) {
    const u = (typeof MockData !== 'undefined' && MockData.adminUsers) ? MockData.adminUsers.find(a => (a.login === login || a.login === login.trim()) && a.password === password) : null;
    if (!u) return null;
    const user = { role: u.role === 'superadmin' ? 'superadmin' : 'admin', id: u.id, name: u.name, login: u.login, permissions: u.permissions || [] };
    this.setCurrentUser(user);
    return user;
  },

  /** 竞拍人登录：账号、密码，校验 bidderAccounts */
  loginBidder(login, password) {
    const u = (typeof MockData !== 'undefined' && MockData.bidderAccounts) ? MockData.bidderAccounts.find(b => (b.login === login || b.login === login.trim()) && b.password === password) : null;
    if (!u) return null;
    const user = { role: 'bidder', id: u.id, name: u.name, login: u.login };
    this.setCurrentUser(user);
    return user;
  },

  /** 统一登录：先尝试管理员，再尝试竞拍人（用于单一登录框）；或由 type 指定 'admin'|'bidder' */
  login(login, password, type) {
    if (type === 'admin') return this.loginAdmin(login, password);
    if (type === 'bidder') return this.loginBidder(login, password);
    const admin = this.loginAdmin(login, password);
    if (admin) return admin;
    return this.loginBidder(login, password);
  },

  /** 竞拍人注册：写入 bidderAccounts，并可选自动登录 */
  registerBidder(login, password, name, contact, idNo) {
    if (typeof MockData === 'undefined' || !MockData.bidderAccounts) return { ok: false, msg: '数据未加载' };
    if (!login || !password || !name) return { ok: false, msg: '请填写登录名、密码和姓名' };
    if (MockData.bidderAccounts.some(b => b.login === login.trim())) return { ok: false, msg: '该登录名已存在' };
    const id = Math.max(0, ...MockData.bidderAccounts.map(b => b.id)) + 1;
    const newAccount = { id, login: login.trim(), password, name: name.trim(), contact: (contact || '').trim(), idNo: (idNo || '').trim() };
    MockData.bidderAccounts.push(newAccount);
    MockData.bidders.push({ id, name: newAccount.name, contact: newAccount.contact, idNo: newAccount.idNo });
    const user = { role: 'bidder', id, name: newAccount.name, login: newAccount.login };
    this.setCurrentUser(user);
    return { ok: true, user };
  },

  /** 是否有管理权限（超级管理员或普通管理员） */
  isAdmin() {
    const u = this.getCurrentUser();
    return u && (u.role === 'admin' || u.role === 'superadmin');
  },

  /** 是否超级管理员 */
  isSuperAdmin() {
    const u = this.getCurrentUser();
    return u && u.role === 'superadmin';
  },

  /** 是否竞拍人 */
  isBidder() {
    const u = this.getCurrentUser();
    return u && u.role === 'bidder';
  },

  /** 是否有某模块权限（管理员）。superadmin 全部；admin 看 permissions */
  hasPermission(moduleId) {
    const u = this.getCurrentUser();
    if (!u || (u.role !== 'admin' && u.role !== 'superadmin')) return false;
    if (u.role === 'superadmin' || (u.permissions && u.permissions.indexOf('*') >= 0)) return true;
    return u.permissions && u.permissions.indexOf(moduleId) >= 0;
  },

  /** 页面要求角色：不满足则跳转对应登录页。requiredRole: 'admin' | 'bidder' | 'adminOrBidder' | null */
  requireRole(requiredRole, options) {
    const returnUrl = (options && options.returnUrl) || (typeof location !== 'undefined' ? location.href : '');
    const prefix = (typeof location !== 'undefined' && location.pathname && location.pathname.indexOf('/pages/') >= 0) ? '../' : '';
    const user = this.getCurrentUser();
    if (requiredRole === 'admin') {
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        if (typeof location !== 'undefined') location.href = prefix + 'login-admin.html?returnUrl=' + encodeURIComponent(returnUrl);
        return false;
      }
      return true;
    }
    if (requiredRole === 'bidder') {
      if (!user || user.role !== 'bidder') {
        if (typeof location !== 'undefined') location.href = prefix + 'login-bidder.html?returnUrl=' + encodeURIComponent(returnUrl);
        return false;
      }
      return true;
    }
    if (requiredRole === 'adminOrBidder') {
      if (!user || (user.role !== 'bidder' && user.role !== 'admin' && user.role !== 'superadmin')) {
        if (typeof location !== 'undefined') location.href = prefix + 'login-bidder.html?returnUrl=' + encodeURIComponent(returnUrl);
        return false;
      }
      return true;
    }
    return true;
  }
};
