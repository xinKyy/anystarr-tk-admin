(this["webpackJsonpreact-admin"]=this["webpackJsonpreact-admin"]||[]).push([[13],{106:function(e,t,a){},113:function(e,t,a){"use strict";a.d(t,"c",(function(){return n})),a.d(t,"d",(function(){return c})),a.d(t,"b",(function(){return r})),a.d(t,"e",(function(){return l})),a.d(t,"a",(function(){return o}));var n=function(e){new Date(e);var t=new Date(e).getFullYear(),a=new Date(e).getMonth()<9?"0"+(new Date(e).getMonth()+1):new Date(e).getMonth()+1,n=new Date(e).getDate()<10?"0"+new Date(e).getDate():new Date(e).getDate(),c=new Date(e).getHours()<10?"0"+new Date(e).getHours():new Date(e).getHours(),r=new Date(e).getMinutes()<10?"0"+new Date(e).getMinutes():new Date(e).getMinutes(),l=new Date(e).getSeconds()<10?"0"+new Date(e).getSeconds():new Date(e).getSeconds();return"".concat(t,"-").concat(a,"-").concat(n," ").concat(c,":").concat(r,":").concat(l)},c=function(e){e=e.replace(" ","T");var t=new Date(e),a=(new Date(t),new Date(t).getFullYear()),n=new Date(t).getMonth()<9?"0"+(new Date(t).getMonth()+1):new Date(t).getMonth()+1,c=new Date(t).getDate()<10?"0"+new Date(t).getDate():new Date(t).getDate(),r=new Date(t).getHours()<10?"0"+new Date(t).getHours():new Date(t).getHours(),l=new Date(t).getMinutes()<10?"0"+new Date(t).getMinutes():new Date(t).getMinutes(),o=new Date(t).getSeconds()<10?"0"+new Date(t).getSeconds():new Date(t).getSeconds();return"".concat(c,".").concat(n,".").concat(a," ").concat(r,":").concat(l,":").concat(o)},r=function(e,t){if(!e&&!t)return"";var a,n=new Date(e);a=t?new Date(t):new Date;var c=Math.floor((a-n)/3600/1e3);return 1==c?c+" hour":c+" hours"},l=function(e){if("string"==typeof e)try{var t=JSON.parse(e);return!("object"!=typeof t||!t)}catch(a){return console.log("error\uff1a"+e+"!!!"+a),!1}},o=function(e){for(var t in e)""===e[t]&&(e[t]=null);return e}},1184:function(e,t,a){e.exports=a.p+"static/media/user.6bc3b122.png"},1185:function(e,t,a){},1186:function(e,t,a){e.exports=a.p+"static/media/logo.290e0073.png"},123:function(e,t){var a="http://admin.clubchopp.com";-1!==window.location.href.indexOf("local")?a="http://local.clubchopp.com:3001":-1!=window.location.href.indexOf("padmin.anystarr")?a="http://padmin.anystarr.com":-1!=window.location.href.indexOf("anystarr")&&(a="https://admin.anystarr.com"),e.exports=a},1740:function(e,t,a){"use strict";a.r(t);a(54);var n=a(55),c=a.n(n),r=(a(77),a(78)),l=a.n(r),o=(a(72),a(66)),i=a.n(o),s=a(63),u=(a(86),a(87)),m=a.n(u),p=(a(52),a(51)),d=a.n(p),g=(a(57),a(59)),b=a.n(g),h=(a(58),a(60)),f=a.n(h),E=(a(69),a(70)),y=a.n(E),O=(a(65),a(67)),k=a.n(O),j=a(53),_=(a(64),a(62)),v=a.n(_),x=(a(74),a(75)),w=a.n(x),S=a(0),C=a.n(S),D=a(71),I=(a(106),a(56)),P=a(94),T=(a(113),a(15),a(225),a(73)),N=a.n(T),M=(w.a.MonthPicker,w.a.RangePicker,v.a.Option),F=([{label:"\u5f85\u5904\u7406",value:"to_handle"},{label:"\u5df2\u5904\u7406",value:"handled"}].map((function(e,t){return C.a.createElement(M,{key:t,value:e.value},e.label)})),{labelCol:{span:8},wrapperCol:{span:16}}),R=function(e){var t=k.a.useForm(),a=Object(j.a)(t,1)[0];return C.a.createElement(k.a,Object.assign({},F,{form:a,name:"advanced_search",className:"ant-advanced-search-form",onFinish:function(t){console.log("values",t),e.changeSearch(t)}}),C.a.createElement(b.a,{gutter:24},C.a.createElement(f.a,{span:8},C.a.createElement(k.a.Item,{name:"id",label:"ID"},C.a.createElement(y.a,null))),C.a.createElement(f.a,{span:8},C.a.createElement(k.a.Item,{name:"description",label:"Description"},C.a.createElement(y.a,null)))),C.a.createElement(b.a,null,C.a.createElement(f.a,{span:24,style:{textAlign:"right"}},C.a.createElement(d.a,{type:"primary",htmlType:"submit",loading:e.loading},"Search"),C.a.createElement(d.a,{style:{margin:"0 8px"},onClick:function(){a.resetFields()}},"Reset"))))},z=function(e){var t=e.visible,a=e.onCreate,n=e.onCancel,c=e.formData,r=(e.disabled,k.a.useForm()),l=Object(j.a)(r,1)[0],o=Object(S.useState)({}),i=Object(j.a)(o,2),s=(i[0],i[1],Object(S.useState)(!1)),u=Object(j.a)(s,2);u[0],u[1];Object(S.useEffect)((function(){console.log("formdata",c),Object.keys(c).length?l.setFieldsValue(c):l.resetFields()}),[c]);return C.a.createElement(m.a,{visible:t,title:"sku",okText:"Submit",cancelText:"Cancel",onCancel:n,onOk:function(){l.validateFields().then((function(e){l.resetFields(),a(e)})).catch((function(e){console.log("Validate Failed:",e)}))}},C.a.createElement(k.a,Object.assign({},{labelCol:{span:6},wrapperCol:{span:14}},{form:l,name:"form_in_modal"}),C.a.createElement(k.a.Item,{name:"id",label:"ID"},C.a.createElement(y.a,{disabled:!0})),C.a.createElement(k.a.Item,{name:"tier_1_cat",label:"Tier1 Cat",rules:[{required:!0}]},C.a.createElement(y.a,null)),C.a.createElement(k.a.Item,{name:"tier_2_cat",label:"Tier2 Cat"},C.a.createElement(y.a,null)),C.a.createElement(k.a.Item,{name:"tier_3_cat",label:"Tier3 Cat"},C.a.createElement(y.a,null)),C.a.createElement(k.a.Item,{name:"shown_name",label:"Sku name",rules:[{required:!0}]},C.a.createElement(y.a,null))))},L=function(e){var t=Object(S.useState)({list:[],pagination:{current:1,pageSize:10},search:{},loading:!0,visible:!1,disabled:!1,formData:{}}),a=Object(j.a)(t,2),n=a[0],r=a[1],o=Object(S.useState)({visible:!1,data:{}}),u=Object(j.a)(o,2);u[0],u[1];Object(S.useEffect)((function(){n.pagination;var e={start_row:0,page_size:n.pagination.pageSize};m(e)}),[]);var m=function(e){n.pagination,n.search;r(Object(s.a)(Object(s.a)({},n),{},{loading:!0})),Object(I.rb)({permissionJson:JSON.stringify(e)}).then((function(t){r(Object(s.a)(Object(s.a)({},n),{},{visible:!1,list:t.data.list&&Object(P.getKeyList)(t.data.list),loading:!1,search:e.search,pagination:{total:t.data.pager.total,current:e.start_row/e.page_size+1,pageSize:e.page_size}}))})).catch((function(e){console.log("err",e)}))};return C.a.createElement(c.a,{className:"animated fadeIn"},C.a.createElement(z,{visible:n.visible,onCreate:function(e){console.log("data",e),e.is_show_app=1,Object(I.s)({categoryJson:JSON.stringify(e)}).then((function(e){i.a.success("success");var t=Object(s.a)(Object(s.a)({},n.search),{},{start_row:0,page_size:10});m(t)})).catch((function(e){console.log("err",e)}))},onCancel:function(){r(Object(s.a)(Object(s.a)({},n),{},{visible:!1}))},formData:n.formData,disabled:n.disabled}),C.a.createElement("div",{className:"web-bread-c"},C.a.createElement(D.a,{arr:["Permission List"]}),C.a.createElement("h3",null,"Permission List"),C.a.createElement("img",{src:N.a,className:"aset",alt:"aset"})),C.a.createElement("div",{className:"base-wr"},C.a.createElement("div",{className:"base-style"},C.a.createElement(R,{changeSearch:function(e){var t=Object(s.a)(Object(s.a)({},e),{},{page_size:10,start_row:0,search:e});r(Object(s.a)(Object(s.a)({},n),{},{search:e})),m(t)},loading:n.loading})),C.a.createElement(b.a,null,C.a.createElement(f.a,{span:24},C.a.createElement("div",{className:"base-style"},C.a.createElement(b.a,null,C.a.createElement(f.a,{span:24,style:{textAlign:"right",marginBottom:"15px"}},C.a.createElement(d.a,{type:"primary",onClick:function(){Object(I.nc)().then((function(e){var t={start_row:0,page_size:n.pagination.pageSize};m(t)}))}},"Reload"))),C.a.createElement(l.a,{columns:[{title:"Modular",dataIndex:"modular",key:"modular",width:"100",align:"center"},{title:"Descrption",dataIndex:"descrption",key:"descrption",align:"center"},{title:"Update date",dataIndex:"update_time",key:"update_time",width:"100",align:"center",render:function(e,t){return C.a.createElement("div",null,new Date(e).toLocaleString())}}],rowKey:function(e){return e.key},dataSource:n.list,onChange:function(e){console.log("state",n);var t=Object(s.a)(Object(s.a)({},n.search),{},{page_size:e.pageSize,start_row:e.pageSize*(e.current-1),search:n.search});console.log("ttt",t),m(t)},loading:n.loading,pagination:n.pagination,bordered:!0,rowSelection:Object(s.a)({type:"checkbox"},(function(){})),scroll:{scrollToFirstRowOnChange:!0,x:1e3}}))))))};t.default=L},1749:function(e,t,a){"use strict";a.r(t);a(885);var n=a(1187),c=a.n(n),r=(a(72),a(66)),l=a.n(r),o=a(53),i=a(63),s=(a(54),a(55)),u=a.n(s),m=a(0),p=a.n(m),d=a(2),g=(a(85),a(8)),b=(a(340),a(869),a(1740),Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(4),a.e(9),a.e(14)]).then(a.bind(null,1750))}))),h=Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(4),a.e(9),a.e(14)]).then(a.bind(null,1756))})),f=Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(4),a.e(9),a.e(14)]).then(a.bind(null,1757))})),E=Object(g.a)((function(){return a.e(49).then(a.bind(null,1758))})),y=Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(46)]).then(a.bind(null,1759))})),O=Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(51)]).then(a.bind(null,1760))})),k=Object(g.a)((function(){return Promise.all([a.e(0),a.e(2),a.e(4),a.e(45)]).then(a.bind(null,1761))})),j=Object(g.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(3),a.e(21)]).then(a.bind(null,1762))})),_=Object(g.a)((function(){return Promise.all([a.e(4),a.e(35)]).then(a.bind(null,1763))})),v=Object(g.a)((function(){return Promise.all([a.e(0),a.e(2),a.e(4),a.e(5),a.e(28)]).then(a.bind(null,1764))})),x=Object(g.a)((function(){return Promise.resolve().then(a.bind(null,869))})),w=Object(g.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(3),a.e(22)]).then(a.bind(null,1765))})),S=Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(7),a.e(47)]).then(a.bind(null,1766))})),C=Object(g.a)((function(){return a.e(38).then(a.bind(null,1767))})),D=Object(g.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(3),a.e(25)]).then(a.bind(null,1768))})),I=Object(g.a)((function(){return a.e(57).then(a.bind(null,1769))})),P=Object(g.a)((function(){return Promise.all([a.e(0),a.e(2),a.e(5),a.e(6),a.e(42)]).then(a.bind(null,1770))})),T=Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(37)]).then(a.bind(null,1771))})),N=Object(g.a)((function(){return Promise.all([a.e(1),a.e(7),a.e(48)]).then(a.bind(null,1751))})),M=Object(g.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(3),a.e(24)]).then(a.bind(null,1772))})),F=Object(g.a)((function(){return Promise.all([a.e(0),a.e(4),a.e(7),a.e(29),a.e(44)]).then(a.bind(null,1773))})),R=Object(g.a)((function(){return Promise.all([a.e(32),a.e(62)]).then(a.bind(null,1774))})),z=Object(g.a)((function(){return Promise.resolve().then(a.bind(null,1740))})),L=Object(g.a)((function(){return a.e(34).then(a.bind(null,1775))})),A=Object(g.a)((function(){return Promise.all([a.e(0),a.e(2),a.e(5),a.e(6),a.e(40)]).then(a.bind(null,1776))})),K=Object(g.a)((function(){return Promise.all([a.e(33),a.e(63)]).then(a.bind(null,1777))})),J=Object(g.a)((function(){return Promise.all([a.e(0),a.e(2),a.e(5),a.e(6),a.e(41)]).then(a.bind(null,1778))})),H=Object(g.a)((function(){return Promise.all([a.e(1),a.e(3),a.e(59)]).then(a.bind(null,1779))})),U=Object(g.a)((function(){return Promise.all([a.e(0),a.e(2),a.e(4),a.e(5),a.e(27)]).then(a.bind(null,1780))})),B=Object(g.a)((function(){return Promise.all([a.e(9),a.e(18),a.e(50)]).then(a.bind(null,1781))})),W=Object(g.a)((function(){return a.e(43).then(a.bind(null,1782))})),V=(Object(g.a)((function(){return a.e(60).then(a.bind(null,1783))})),Object(g.a)((function(){return a.e(58).then(a.bind(null,1784))}))),q=Object(g.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(3),a.e(26)]).then(a.bind(null,1785))})),Y=Object(g.a)((function(){return a.e(54).then(a.bind(null,1786))})),G=Object(g.a)((function(){return Promise.all([a.e(4),a.e(61)]).then(a.bind(null,1787))})),Q=Object(g.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(3),a.e(23)]).then(a.bind(null,1788))})),X=Object(g.a)((function(){return a.e(52).then(a.bind(null,1789))})),Z=[{path:"/index",exact:!0,name:"Index",component:b,auth:[1]},{path:"/tiktok/userList",exact:!1,name:"Tiktok",component:h,auth:[0]},{path:"/tiktok/event",exact:!1,name:"Tiktok",component:f,auth:[0]},{path:"/statistic",exact:!0,component:B,auth:[1]},{path:"/account/account",exact:!1,component:y,auth:[1]},{path:"/account/invitecode",exact:!1,component:O,auth:[1]},{path:"/account/referral_code",exact:!1,component:Object(g.a)((function(){return a.e(55).then(a.bind(null,1790))})),auth:[1]},{path:"/campaigns_ma/campaigns",exact:!1,component:k,auth:[1]},{path:"/createCampaign/:id",exact:!1,component:j,auth:[1]},{path:"/tasks_ma/tasks",exact:!1,component:_,auth:[1]},{path:"/taskDetail/:id",exact:!1,component:v,auth:[1]},{path:"/messages",exact:!1,component:x,auth:[1]},{path:"/messageDetail/:id",exact:!1,component:w,auth:[1]},{path:"/payManagement/payments",exact:!1,component:S,auth:[1]},{path:"/campaigns_ma/merchant",exact:!1,component:C,auth:[1]},{path:"/merchantDetail",exact:!1,component:D,auth:[1]},{path:"/campaigns_ma/email_tem",exact:!1,component:I,auth:[1]},{path:"/email_tem_detail/:id",exact:!1,component:P,auth:[1]},{path:"/payManagement/codeCommission",exact:!1,component:T,auth:[1]},{path:"/postManagement/postList",exact:!1,component:N,auth:[1]},{path:"/postManagement/create_post/:id",exact:!1,component:M,auth:[1]},{path:"/userDetail/:id",exact:!1,component:F,auth:[1]},{path:"/sku",exact:!1,component:R,auth:[1]},{path:"/permissions/permissions",exact:!1,component:z,auth:[1]},{path:"/permissions/role",exact:!1,component:L,auth:[1]},{path:"/permissions/user",exact:!1,component:L,auth:[1]},{path:"/permissions/addRole/:id",exact:!1,component:A,auth:[1]},{path:"/permissions/system_user",exact:!1,component:K,auth:[1]},{path:"/permissions/add_system_user/:id",exact:!1,component:J,auth:[1]},{path:"/tasks_ma/sample_application",exact:!1,component:H,auth:[1]},{path:"/sample_detail/:id",exact:!1,component:U,auth:[1]},{path:"/modify_pwd",exact:!1,component:E,auth:[1]},{path:"/add_user",exact:!1,component:W,auth:[1]},{path:"/mobile_app_management/promotions",exact:!1,component:V,auth:[1]},{path:"/mobile_app_management/promotion_detail/:id",exact:!1,component:q,auth:[1]},{path:"/order_management/order_list",exact:!1,component:Y,auth:[1]},{path:"/order_management/sample_list",exact:!1,component:G,auth:[1]},{path:"/order_management/create_product/:id",exact:!1,component:Q,auth:[1]},{path:"/payManagement/branding_commission",exact:!1,component:X,auth:[1]},{path:"/account/referral_user",exact:!1,component:Object(g.a)((function(){return a.e(56).then(a.bind(null,1791))})),auth:[1]},{path:"/kol_persona",exact:!1,component:Object(g.a)((function(){return Promise.all([a.e(5),a.e(53)]).then(a.bind(null,1792))})),auth:[1]},{path:"/createCampaignNew/:id",exact:!1,component:Object(g.a)((function(){return Promise.all([a.e(0),a.e(1),a.e(2),a.e(3),a.e(20)]).then(a.bind(null,1752))})),auth:[1]},{path:"/tasks_ma/task_module",exact:!1,component:Object(g.a)((function(){return a.e(39).then(a.bind(null,1793))})),auth:[1]},{path:"/tasks_ma/tasks_new",exact:!1,component:Object(g.a)((function(){return Promise.all([a.e(4),a.e(36)]).then(a.bind(null,1794))})),auth:[1]},{path:"/task_detail_new/:id",exact:!1,component:Object(g.a)((function(){return Promise.all([a.e(0),a.e(4),a.e(31)]).then(a.bind(null,1795))})),auth:[1]}],$=a(1798),ee=a(1799),te=a(1800),ae=a(1801),ne=a(1802),ce=[{key:"/index",title:"Home",icon:p.a.createElement($.a,null),au:"super"},{key:"/tiktok",title:"Tiktok",icon:p.a.createElement($.a,null),subs:[{title:"User management",key:"/tiktok/userList",icon:p.a.createElement(ee.a,null)},{title:"Event management",key:"/tiktok/event",icon:p.a.createElement(te.a,null)}]},{key:"/statistic",title:"Statistic",icon:p.a.createElement(ae.a,null),au:"super"},{key:"/account",title:"User management",icon:p.a.createElement(ee.a,null),subs:[{key:"/account/invitecode",title:"Invitation Code"},{key:"/account/account",title:"User list"},{key:"/account/referral_code",title:"Referral Code "}]},{key:"/campaigns_ma",title:"Campaign management",icon:p.a.createElement(ne.a,null),au:"super",subs:[{key:"/campaigns_ma/campaigns",title:"Campaign management",icon:p.a.createElement(ae.a,null),au:"super"},{key:"/campaigns_ma/merchant",title:"Merchant management",icon:p.a.createElement(ae.a,null),au:"super"},{key:"/campaigns_ma/email_tem",title:"Email Template management",icon:p.a.createElement(ae.a,null),au:"super"}]},{key:"/tasks_ma",title:"Task management",icon:p.a.createElement(te.a,null),subs:[{title:"Task management",key:"/tasks_ma/tasks",icon:p.a.createElement(ne.a,null)},{title:"Sample application management",key:"/tasks_ma/sample_application",icon:p.a.createElement(ne.a,null)},{title:"Task module",key:"/tasks_ma/task_module",icon:p.a.createElement(ne.a,null),au:"super"}]},{key:"/messages",title:"Ticket management",icon:p.a.createElement(ee.a,null)},{title:"Payout management",key:"/payManagement",icon:p.a.createElement(ee.a,null),au:"super",subs:[{title:"Payments",key:"/payManagement/payments",au:"super"},{title:"Code commission",key:"/payManagement/codeCommission",au:"super"},{title:"Branding commission",key:"/payManagement/branding_commission",au:"super"}]},{title:"Post management",key:"/postManagement",icon:p.a.createElement(ne.a,null),au:"super",subs:[{title:"Post List",key:"/postManagement/postList",au:"super"}]},{title:"SKU management",key:"/sku",icon:p.a.createElement(ne.a,null),au:"super"},{title:"Permissions management",key:"/permissions",icon:p.a.createElement(ae.a,null),au:"super",subs:[{title:"Users List",key:"/permissions/system_user",au:"super"},{title:"Roles List",key:"/permissions/role",au:"super"},{title:"Permissions List",key:"/permissions/permissions",au:"super"}]},{title:"Mobile App managemet",key:"/mobile_app_management",icon:p.a.createElement(ne.a,null),au:"super",subs:[{title:"Promotion activity",key:"/mobile_app_management/promotions",au:"super"}]},{title:"Order management",key:"/order_management",icon:p.a.createElement(ae.a,null),au:"super",subs:[{title:"abComo Order List",key:"/order_management/order_list",au:"super"},{title:"abComo Sample List",key:"/order_management/sample_list",au:"super"}]},{title:"Kol Persona",key:"/kol_persona",icon:p.a.createElement(ne.a,null),au:"super"}],re=a(1184),le=a.n(re),oe=(a(1185),function(e,t){switch(t.type){case"SET_AREA":return Object.assign({},e,{area:t.area});case"SET_AREA_LIST":return console.log("action22",t),Object.assign({},e,{areaList:t.areaList});default:return e}}),ie=(a(341),a(350)),se=a.n(ie),ue=(a(343),a(298)),me=a.n(ue),pe=(a(64),a(62)),de=a.n(pe),ge=a(1803),be=a(1804),he=a(1805),fe=a(1806),Ee=a(56),ye=a(184),Oe=a(321),ke=a.n(Oe),je=u.a.Header,_e=(de.a.Option,function(e){var t=e.menuClick,a=(e.avatar,e.menuToggle),n=e.loginOut,c=e.gotoModifyPwd,r=(e.gotoRuleConfig,Object(m.useContext)(Te),ke.a.get("crm_user_info")?JSON.parse(ke.a.get("crm_user_info")):{});console.log("userInfo....",r),console.log("yyy",decodeURI(r.c_nk));JSON.parse(localStorage.getItem("u"))&&JSON.parse(localStorage.getItem("u")).permission;var l=p.a.createElement(me.a,{onClick:function(e){var t=e.key;switch(console.log("key",t),t){case"1":c();break;case"2":n();break;default:console.log("1")}}},p.a.createElement(me.a.Item,{key:"1"},p.a.createElement(ge.a,null)," Change password"),p.a.createElement(me.a.Item,{key:"2"},p.a.createElement(be.a,null)," Log out"));return Object(m.useEffect)((function(){}),[]),p.a.createElement(je,{className:"header"},p.a.createElement("div",{className:"left"},a?p.a.createElement(he.a,{onClick:t}):p.a.createElement(fe.a,{onClick:t})),p.a.createElement("div",{className:"right"},p.a.createElement("div",null,p.a.createElement(se.a,{overlay:l,overlayStyle:{width:"20rem"},trigger:["click"]},p.a.createElement("div",{className:"ant-dropdown-link"},p.a.createElement(ye.a,null))))))}),ve=a(17),xe=function(e,t){for(var a="",n=[],c=e.split("/").map((function(e){return"/"+e})),r=1;r<c.length-1;r++)a+=c[r],n.push(a);return t?[]:n},we=Object(d.g)((function(e){var t=Object(m.useState)({openKeys:[],selectedKeys:[]}),a=Object(o.a)(t,2),n=a[0],c=a[1],r=n.openKeys,l=n.selectedKeys,s=e.collapsed?{}:{openKeys:r};Object(m.useEffect)((function(){var t=e.location.pathname;c((function(e){return Object(i.a)(Object(i.a)({},e),{},{selectedKeys:[t],openKeys:xe(t)})}))}),[e]);var u=function(e){var t=e.key,a=e.icon,n=e.title;return p.a.createElement(me.a.Item,{key:t},p.a.createElement(ve.b,{to:t,replace:!0},a,p.a.createElement("span",null,n)))};return p.a.createElement(me.a,Object.assign({mode:"inline",theme:"dark"},s,{selectedKeys:l,onClick:function(e){var t=e.key;return c((function(e){return Object(i.a)(Object(i.a)({},e),{},{selectedKeys:[t]})}))},onOpenChange:function(e){c((function(t){if(0===e.length||1===e.length)return Object(i.a)(Object(i.a)({},t),{},{openKeys:e});var a=e[e.length-1];return a.includes(e[0])?Object(i.a)(Object(i.a)({},t),{},{openKeys:e}):Object(i.a)(Object(i.a)({},t),{},{openKeys:[a]})}))}}),e.menu&&e.menu.map((function(e){return e.subs&&e.subs.length>0?function e(t){var a=t.key,n=t.icon,c=t.title,r=t.subs;return p.a.createElement(me.a.SubMenu,{key:a,title:p.a.createElement("span",null,n,p.a.createElement("span",null,c))},r&&r.map((function(t){return t.subs&&t.subs.length>0?e(t):u(t)})))}(e):u(e)})))})),Se=u.a.Sider,Ce=ke.a.get("crm_user_info")?JSON.parse(ke.a.get("crm_user_info")):{},De=function(e){var t=e.menuToggle,n=e.menu;return p.a.createElement(Se,{className:"aside",trigger:null,collapsible:!0,collapsed:t,width:225},p.a.createElement("div",{className:"logo",style:{marginBottom:"20px",marginTop:"32px"}},p.a.createElement("a",{rel:"noopener noreferrer",href:"/"},p.a.createElement("img",{src:a(1186),style:{maxWidth:"60px"}}),p.a.createElement("div",{className:"user",style:{color:"#fff",marginTop:"4px"}},Ce.c_nk?decodeURI(Ce.c_nk):""))),p.a.createElement(we,{menu:n,collapsed:t}))},Ie=u.a.Footer,Pe=function(){return p.a.createElement(Ie,{className:"footer",style:{textAlign:"center"}},"admin any starr \xa92021")},Te=p.a.createContext(null),Ne=u.a.Content,Me=function(e,t){switch(t.type){case"menuToggle":return Object(i.a)(Object(i.a)({},e),{},{menuToggle:!e.menuToggle});default:return e}},Fe=[{label:"\u9ec4\u70e8\u6e2f",value:"1",key:"1"},{label:"\u53ef\u4e8f\u635f",value:"2",key:"2"}],Re=Object(d.g)((function(e){var t=JSON.parse(localStorage.getItem("userInfo")),a=Object(m.useState)((function(e){return function e(a){return console.log("menus",a),a.filter((function(e){return!e.au||e.au&&!("10008"==t.id||"10009"==t.id)})).map((function(t){return(t=Object.assign({},t)).subs&&(t.subs=e(t.subs)),t}))}(ce)})),n=Object(o.a)(a,1)[0],r=Object(m.useReducer)(Me,{menuToggle:!1}),i=Object(o.a)(r,2),s=i[0],g=i[1],b=(JSON.parse(localStorage.getItem("user"))?JSON.parse(localStorage.getItem("user")):"").auth,h=Object(m.useReducer)(oe,{area:"",areaList:[]}),f=Object(o.a)(h,2),E=f[0],y=f[1];return Object(m.useEffect)((function(){e.location.pathname}),[]),p.a.createElement(Te.Provider,{value:{areaState:E,dispatch:y}},p.a.createElement(u.a,{className:"app"},p.a.createElement(c.a,null),p.a.createElement(De,{menuToggle:s.menuToggle,menu:n}),p.a.createElement(u.a,{style:{minHeight:"100vh"}},p.a.createElement(_e,{menuToggle:s.menuToggle,menuClick:function(){g({type:"menuToggle"})},avatar:le.a,loginOut:function(){Object(Ee.Wb)().then((function(t){e.history.push("/login"),localStorage.clear(),l.a.success("\u767b\u51fa\u6210\u529f!")}))},ascription:Fe,gotoAmountDetail:function(){e.history.push("/amountDetail")},gotoIntegralDetail:function(){e.history.push("/integralDetail")},gotoModifyPwd:function(){e.history.push("/modify_pwd")},gotoAddAccount:function(){e.history.push("/addAccount")},gotoNotify:function(){e.history.push("/myNotify")},gotoSystemConfig:function(){e.history.push("/systemConfig")},gotoIndex:function(){e.history.push("/index")},gotoRuleConfig:function(){e.history.push("/ruleConfig")},gotoHomeConfig:function(){e.history.push("/homeConfig")},gotoLevelScoreConfig:function(){e.history.push("/levelScoreConfig")}}),p.a.createElement(Ne,{className:"content"},p.a.createElement(d.d,null,Z.map((function(e){return p.a.createElement(d.b,{key:e.path,path:e.path,exact:e.exact,render:function(t){return b?e.auth&&-1!==e.auth.indexOf(b)?p.a.createElement(e.component,t):p.a.createElement(d.a,Object.assign({to:"/404"},t)):p.a.createElement(e.component,t)}})})),p.a.createElement(d.a,{to:"/404"}))),p.a.createElement(Pe,null))))}));t.default=Re},184:function(e,t,a){"use strict";var n=a(0),c=a.n(n),r=a(321),l=a.n(r),o=(a(225),function(e){var t,a=l.a.get("crm_user_info")?JSON.parse(l.a.get("crm_user_info")):{},n=decodeURIComponent(a.c_nk)?decodeURIComponent(a.c_nk):"",r=((e.name?e.name:"")||n).toUpperCase(),o=(t=r,new RegExp("[\\u4E00-\\u9FFF]","g").test(t)?r.slice(0,1):r.slice(0,2));return c.a.createElement("span",{className:function(e){var t=e.length;switch(Math.ceil(t%5)){case 0:return"avatar-color-0";case 1:return"avatar-color-1";case 2:return"avatar-color-2";case 3:return"avatar-color-3";case 4:return"avatar-color-4";default:return"avatar-color-0"}}(r),style:{borderRadius:"50%",color:"#fff",overflow:"hidden",width:"25px",height:"25px",display:"inline-block",lineHeight:"25px",textAlign:"center",fontSize:"12px",fontWeight:"lighter",cursor:"pointer",marginRight:"4px",verticalAlign:"middle"}},o)});t.a=o},71:function(e,t,a){"use strict";a(965);var n=a(968),c=a.n(n),r=a(0),l=a.n(r),o=a(17);var i=l.a.memo((function(e){return l.a.createElement(c.a,{style:{marginBottom:16}},l.a.createElement(c.a.Item,null,l.a.createElement(o.b,{to:"/index",replace:!0},"Home")),e.arr&&e.arr.map((function(e){return"object"===typeof e?l.a.createElement(c.a.Item,{key:e.path},l.a.createElement(o.b,{to:e.path},e.title)):l.a.createElement(c.a.Item,{key:e},e)})))}),(function(e,t){return e.arr.join()===t.arr.join()}));t.a=i},73:function(e,t,a){e.exports=a.p+"static/media/aset1.95abb23f.png"},869:function(e,t,a){"use strict";a.r(t);a(54);var n=a(55),c=a.n(n),r=(a(77),a(78)),l=a.n(r),o=(a(72),a(66)),i=a.n(o),s=a(63),u=(a(86),a(87)),m=a.n(u),p=(a(52),a(51)),d=a.n(p),g=(a(57),a(59)),b=a.n(g),h=(a(69),a(70)),f=a.n(h),E=(a(58),a(60)),y=a.n(E),O=(a(65),a(67)),k=a.n(O),j=a(53),_=(a(369),a(379)),v=a.n(_),x=(a(223),a(226)),w=a.n(x),S=(a(64),a(62)),C=a.n(S),D=(a(74),a(75)),I=a.n(D),P=a(0),T=a.n(P),N=a(71),M=(a(106),a(56)),F=a(94),R=(a(15),a(123)),z=a.n(R),L=a(73),A=a.n(L),K=a(1796),J=a(1797),H=a(113),U=(I.a.MonthPicker,I.a.RangePicker,C.a.Option),B=([{label:"\u5f85\u5904\u7406",value:"to_handle"},{label:"\u5df2\u5904\u7406",value:"handled"}].map((function(e,t){return T.a.createElement(U,{key:t,value:e.value},e.label)})),{labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}}),W=function(e){return[{title:"operation",dataIndex:"edit",key:"edit",width:"100",align:"center",render:function(t,a){return T.a.createElement("a",{className:"action-btn",onClick:function(){e(a)}},T.a.createElement(K.a,null),T.a.createElement("span",{style:{marginLeft:"4px"}},"Edit"))}},{title:"Ticket Type",dataIndex:"type",key:"type",width:"100",align:"center",render:function(e,t){return"1"==e?T.a.createElement("span",{className:"table-row-p"},T.a.createElement(J.a,{style:{color:"#868AF6",fontSize:"13px",marginRight:"3px"}}),"Contact anyStarr"):T.a.createElement("span",{className:"table-row-green"},T.a.createElement(J.a,{style:{color:"#18BFA4",fontSize:"13px",marginRight:"3px"}})," Contact abcomo")}},{title:"Status",dataIndex:"status",key:"status",align:"center",width:"100",render:function(e,t){return T.a.createElement("div",null,T.a.createElement(w.a,{status:9==e?"success":10==e?"processing":"default"}),T.a.createElement("span",null,10==t.status?"Waiting for reply":9==t.status?"Replied":0==t.status?"Close":""))}},{title:"Ticket created time",dataIndex:"create_time",key:"create_time",width:"100",align:"center"},{title:"Ticket from(email)",dataIndex:"from_user",key:"from_user",align:"center"},{title:"Name",dataIndex:"user_name",key:"user_name",align:"center"},{title:"Topic",dataIndex:"topic",key:"topic",width:"100",align:"center",render:function(e,t){return T.a.createElement("span",{className:"table-row-green"},T.a.createElement(J.a,{style:{color:"#18BFA4",fontSize:"13px",marginRight:"3px"}})," ",e)}},{title:"Country",dataIndex:"country",key:"country",width:"100",align:"center",render:function(e,t){return T.a.createElement(v.a,{color:"geekblue"},e)}}]},V=function(e){var t=k.a.useForm(),a=Object(j.a)(t,1)[0];return T.a.createElement(k.a,Object.assign({},B,{form:a,name:"advanced_search",className:"ant-advanced-search-form",onFinish:function(t){e.changeSearch(t)}}),T.a.createElement(b.a,{gutter:24},T.a.createElement(y.a,{span:8},T.a.createElement(k.a.Item,{name:"status",label:"Ticket status"},T.a.createElement(C.a,null,T.a.createElement(U,{value:"0"},"closed"),T.a.createElement(U,{value:"10"},"Waiting for reply"),T.a.createElement(U,{value:"9"},"Replied")))),T.a.createElement(y.a,{span:8},T.a.createElement(k.a.Item,{name:"from_user",label:"From"},T.a.createElement(f.a,null))),T.a.createElement(y.a,{span:8},T.a.createElement(k.a.Item,{name:"topic",label:"Topic"},T.a.createElement(f.a,null)))),T.a.createElement(b.a,{gutter:24},T.a.createElement(y.a,{span:8},T.a.createElement(k.a.Item,{name:"country",label:"Country"},T.a.createElement(f.a,null))),T.a.createElement(y.a,{span:8},T.a.createElement(k.a.Item,{name:"type",label:"Ticket Type"},T.a.createElement(C.a,null,T.a.createElement(U,{value:"1"},"anyStarr"),T.a.createElement(U,{value:"2"},"abcomo")))),T.a.createElement(y.a,{span:8},T.a.createElement(k.a.Item,{name:"operator_name",label:"Operator name"},T.a.createElement(f.a,null)))),T.a.createElement(b.a,null,T.a.createElement(y.a,{span:24,style:{textAlign:"right"}},T.a.createElement(d.a,{type:"primary",htmlType:"submit",loading:e.loading},"Search"),T.a.createElement(d.a,{style:{margin:"0 8px"},onClick:function(){a.resetFields()}},"Reset"))))},q=function(e){var t=e.visible,a=e.onCreate,n=e.onCancel,c=e.formData,r=(e.disabled,k.a.useForm()),l=Object(j.a)(r,1)[0],o=Object(P.useState)({}),i=Object(j.a)(o,2),s=(i[0],i[1],Object(P.useState)(!1)),u=Object(j.a)(s,2);u[0],u[1];Object(P.useEffect)((function(){Object.keys(c).length?l.setFieldsValue(c):l.resetFields()}),[]);return T.a.createElement(m.a,{visible:t,title:"\u521b\u5efa\u9080\u8bf7\u7801",okText:"Submit",cancelText:"Cancel",onCancel:n,onOk:function(){l.validateFields().then((function(e){l.resetFields(),a(e)})).catch((function(e){console.log("Validate Failed:",e)}))}},T.a.createElement(k.a,Object.assign({},{labelCol:{span:6},wrapperCol:{span:14}},{form:l,name:"form_in_modal"}),T.a.createElement(k.a.Item,{name:"email",label:"email",rules:[{required:!0}]},T.a.createElement(f.a,null))))},Y=function(e){var t=Object(P.useState)({list:[],pagination:{current:1,pageSize:10},search:{},loading:!0,visible:!1,disabled:!1,formData:{}}),a=Object(j.a)(t,2),n=a[0],r=a[1],o=Object(P.useState)({visible:!1,data:{}}),u=Object(j.a)(o,2);u[0],u[1];Object(P.useEffect)((function(){n.pagination;var e={start_row:0,page_size:n.pagination.pageSize};m(e)}),[]);var m=function(e){n.pagination,n.search;r(Object(s.a)(Object(s.a)({},n),{},{loading:!0})),Object(M.ob)({messageJson:JSON.stringify(Object(H.a)(e))}).then((function(e){r(Object(s.a)(Object(s.a)({},n),{},{visible:!1,list:e.data.list&&Object(F.getKeyList)(e.data.list),loading:!1,pagination:{total:e.data.pager.total}}))})).catch((function(e){console.log("err",e)}))};return T.a.createElement(c.a,{className:"animated fadeIn"},T.a.createElement(q,{visible:n.visible,onCreate:function(e){console.log("data",e),Object(M.j)(e).then((function(e){i.a.success("success");var t=Object(s.a)({},n.search);m(t)})).catch((function(e){console.log("err",e)}))},onCancel:function(){r(Object(s.a)(Object(s.a)({},n),{},{visible:!1}))},formData:n.formData,disabled:n.disabled}),T.a.createElement("div",{className:"web-bread-c"},T.a.createElement(N.a,{arr:["Ticket List"]}),T.a.createElement("h3",null,"Ticket List"),T.a.createElement("img",{src:A.a,className:"aset",alt:"aset"})),T.a.createElement("div",{className:"base-wr"},T.a.createElement("div",{className:"base-style"},T.a.createElement(V,{changeSearch:function(e){var t=Object(s.a)(Object(s.a)({},e),{},{page_size:10,start_row:0});r(Object(s.a)(Object(s.a)({},n),e)),m(t)},loading:n.loading})),T.a.createElement(b.a,null,T.a.createElement(y.a,{span:24},T.a.createElement("div",{className:"base-style"},T.a.createElement(l.a,{columns:W((function(e){var t=z.a+"/messageDetail/"+e.id;window.open(t,"_blank").focus()})),rowKey:function(e){return e.key},dataSource:n.list,onChange:function(e){var t=Object(s.a)(Object(s.a)({},n.search),{},{page_size:e.pageSize,start_row:e.pageSize*(e.current-1)});m(t)},loading:n.loading,bordered:!0,rowSelection:Object(s.a)({type:"checkbox"},(function(){})),pagination:n.pagination,scroll:{scrollToFirstRowOnChange:!0,x:1e3}}))))))};t.default=Y},94:function(e,t){e.exports={getKeyList:function(e){return e.map((function(e,t){!function(e){e=e||32;for(var t="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",a=t.length,n="",c=0;c<e;c++)n=t.charAt(Math.floor(Math.random()*a))}();return e.key=t,e}))}}}}]);
//# sourceMappingURL=default.aaf92b1e.chunk.js.map