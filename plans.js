'use strict';
(() => {
  const plans={
    trial:{name:'1元体验',price:1,unit:'次',quota:'1 次单集创作',term:'建议开通后 7 天',rule:'每账号限购一次，不自动续费'},
    monthly:{name:'月度会员',price:49,unit:'月',quota:'每月 10 次单集创作',term:'正式开通起 1 个月',rule:'一次性购买，不自动续费'},
    annual:{name:'年度会员',price:490,unit:'年',quota:'12 个月，每月发放 10 次',term:'正式开通起 12 个月',rule:'计划待服务稳定后开放，不提前收年费'}
  };
  // Preview state is deliberately in memory only, isolated from script versions and paid entitlements.
  let preview=null;
  const $=s=>document.querySelector(s);
  const statuses={SELECTED:'待付款（演示）',VERIFYING:'待核实（演示）',ACTIVATED:'开通效果（演示）',CLOSED:'已关闭（演示）'};
  function createPreview(key){
    if(!plans[key])return;
    if(!preview||preview.plan!==key||preview.status==='CLOSED')preview={id:'DEMO-'+Date.now().toString(36).toUpperCase(),plan:key,status:'SELECTED'};
    $('#member-dialog').close();
    renderCheckout();
    if(!$('#checkout-dialog').open)$('#checkout-dialog').showModal();
  }
  function renderCheckout(){
    const p=plans[preview.plan],status=preview.status;
    let copy,action;
    if(status==='SELECTED'){copy='当前没有真实订单或收款码。下面的按钮仅演示付款后如何进入核实状态，不会付款。';action='<button class="button dark" id="demo-next">演示下一步：付款核实 →</button>';}
    else if(status==='VERIFYING'){copy='正式上线时需核实到账后才可开通。此处只是状态演示，没有提交付款申请，也没有查询真实交易。';action='<button class="button dark" id="demo-next">演示下一步：查看开通效果 →</button>';}
    else if(status==='ACTIVATED'){copy='这里只展示未来开通后的样式；没有真实到账，没有开通会员或发放可用额度。返回工作台仍是免费案例演示。';action='<button class="button dark" id="demo-member">查看会员展示效果 →</button>';}
    else{copy='这份本地预览已关闭，没有订单、付款或退款发生。';action='<button class="button dark" id="demo-restart">重新预览套餐 →</button>';}
    $('#checkout-body').innerHTML=`<div class="checkout-alert"><b>仅为选购演示 · 暂未开放收款</b><br>价格与额度为试算方案，不能付款，不会开通真实权益。</div><div class="checkout-columns"><div><h3 class="checkout-plan">${p.name}</h3><div class="checkout-price">¥${p.price}<small> / ${p.unit} · 试算价</small></div><dl class="checkout-specs"><div><dt>拟定额度</dt><dd>${p.quota}</dd></div><div><dt>拟定有效期</dt><dd>${p.term}</dd></div><div><dt>账户</dt><dd>演示访客，未绑定真实账号</dd></div><div><dt>续费与开放</dt><dd>${p.rule}</dd></div></dl><p class="checkout-id">预览编号：${preview.id}<br>编号仅用于本页演示，不是支付订单号。</p></div><div class="qr-side"><div class="qr-placeholder" aria-label="收款码尚未配置，没有二维码"><span class="lock" aria-hidden="true">▣</span><b>收款码待配置</b><small>暂无可扫描二维码</small><small>本页不会收款</small></div><button class="button" disabled>扫码支付 · 暂未开放</button><p>正式开放时再按使用设备提供支付方式。<br>当前无需扫码，也无需上传付款截图。</p></div></div><div class="checkout-status" role="status"><div class="status-heading"><span class="pill">演示状态</span><b>${statuses[status]}</b></div><p>${copy}</p><div class="toolbar">${action}${!['CLOSED','ACTIVATED'].includes(status)?'<button class="button" id="demo-cancel">关闭本次预览</button>':''}</div></div>`;
    $('#demo-next')?.addEventListener('click',()=>{preview.status=preview.status==='SELECTED'?'VERIFYING':'ACTIVATED';renderCheckout();});
    $('#demo-cancel')?.addEventListener('click',()=>{preview.status='CLOSED';renderCheckout();});
    $('#demo-restart')?.addEventListener('click',()=>createPreview(preview.plan));
    $('#demo-member')?.addEventListener('click',()=>{ $('#checkout-dialog').close();showMember();});
  }
  function showMember(){
    const p=preview?plans[preview.plan]:null;
    $('#member-body').innerHTML=`<div class="member-summary"><h3>当前：免费演示</h3><p>未登录真实账号，没有已购买的会员。</p><div class="member-metrics"><div><span>真实生成额度</span><b>未开通</b></div><div><span>会员有效期</span><b>未开通</b></div></div></div>${preview?`<div class="demo-order-row"><h3>${p.name} · ¥${p.price} / ${p.unit}</h3><p>${statuses[preview.status]} · 本地预览记录</p><p>${preview.id}</p>${preview.status==='ACTIVATED'?`<p>拟定权益展示：${p.quota}；${p.term}。</p><p><b>以上均不可用于真实生成，没有扣款或发放额度。</b></p>`:'<p>还没有真实订单，不需要支付任何费用。</p>'}<button class="button small" id="member-open-order">查看选购演示 →</button></div>`:'<p class="fine">还没有选购预览。可前往官网查看三个套餐。</p>'}<div class="member-actions"><button class="button primary" id="member-plans">查看会员方案 →</button><button class="button" id="member-return">继续免费体验</button></div><p class="fine">选购预览仅保留在本页，刷新即重置；不会改写剧本版本或真实权益。</p>`;
    $('#member-open-order')?.addEventListener('click',()=>createPreview(preview.plan));
    $('#member-plans').onclick=()=>{$('#member-dialog').close();location.hash='#pricing';};
    $('#member-return').onclick=()=>{$('#member-dialog').close();location.hash='#studio';};
    if(!$('#member-dialog').open)$('#member-dialog').showModal();
  }
  document.querySelectorAll('[data-plan]').forEach(b=>b.onclick=()=>createPreview(b.dataset.plan));
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
  $('#view-membership').onclick=showMember;
})();
