(this["webpackJsonpreact-admin"]=this["webpackJsonpreact-admin"]||[]).push([[43],{126:function(e,a,t){"use strict";var n=t(130),l=t.n(n),c=t(86),r=localStorage.getItem("token"),s=l.a.create({baseURL:c.a,timeout:5e3});s.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",s.interceptors.request.use((function(e){return r&&(e.headers.Authorization=r),e}),(function(e){return Promise.reject(e)})),s.interceptors.response.use((function(e){return 200===e.status?Promise.resolve(e):Promise.reject(e)}),(function(e){if(e.response&&e.response.status)switch(e.response.status){case 401:case 403:case 404:case 500:break;default:console.log("\u5176\u4ed6\u9519\u8bef\u4fe1\u606f")}return Promise.reject(e)}))},1769:function(e,a,t){"use strict";t.r(a);t(54);var n=t(55),l=t.n(n),c=(t(51),t(50)),r=t.n(c),s=(t(57),t(59)),m=t.n(s),i=(t(58),t(60)),u=t.n(i),o=(t(74),t(66),t(62)),p=(t(65),t(67)),b=t.n(p),E=t(53),d=(t(63),t(61)),h=t.n(d),f=(t(69),t(72)),g=t.n(f),j=(t(77),t(79)),v=t.n(j),O=t(0),y=t.n(O),T=(t(122),t(93)),S=(t(85),t(56)),w=(t(126),t(86),t(215),t(194),t(195),v.a.RangePicker,{labelCol:{span:8},wrapperCol:{span:16}}),I={wrapperCol:{offset:10,span:16}},N=g.a.TextArea,C=h.a.Option,F=function(e){var a=Object(O.useState)({id:"12",fullName:"hhh",displayName:"display",logo:"",category:1,typeTemplate:[]}),t=Object(E.a)(a,2),n=t[0],c=t[1],s=b.a.useForm(),i=Object(E.a)(s,1)[0],p=Object(O.useState)([{name:"china",value:"1"}]),d=Object(E.a)(p,2),f=(d[0],d[1],Object(O.useState)([{name:"Chinese",value:"1"},{name:"English",value:"2"}])),j=Object(E.a)(f,2),v=(j[0],j[1],Object(O.useState)([{name:"merchant1",value:"1"}])),F=Object(E.a)(v,2),P=(F[0],F[1],Object(O.useState)(" ")),k=Object(E.a)(P,2),J=(k[0],k[1],Object(O.useState)([])),L=Object(E.a)(J,2),_=(L[0],L[1],n.editorState,n.outputHTML,function(e){Object(S.ac)(e).then((function(e){var a=[];for(var t in e.data.messageTypes)a.push({label:e.data.messageTypes[t],value:Number(t)});console.log("typeTemplate",a),c(Object(o.a)(Object(o.a)({},n),{},{typeTemplate:a}))}))});return Object(O.useEffect)((function(){_(),e.match.params.id&&Object(S.ib)({id:e.match.params.id}).then((function(e){i.setFieldsValue(Object(o.a)({},e.data.messageTemplate))}))}),[]),y.a.createElement(l.a,{className:"animated fadeIn"},y.a.createElement(T.a,{title:"Email Template detail"}),y.a.createElement("div",{className:"base-style base-detail",id:"demoline"},y.a.createElement(m.a,null,y.a.createElement(u.a,{span:24},y.a.createElement(b.a,Object.assign({},w,{name:"basic",initialValues:{remember:!0},form:i,onFinish:function(a){a=Object(o.a)({},a),console.log("props.match.params.id",e.match.params.id),"0"!==e.match.params.id?(console.log("edit"),Object(S.ec)(JSON.stringify(a)).then((function(a){e.history.push("/campaigns_ma/email_tem")}))):Object(S.i)(JSON.stringify(a)).then((function(a){e.history.push("/campaigns_ma/email_tem")}))},onFinishFailed:function(e){console.log("Failed:",e)}}),y.a.createElement(m.a,null,y.a.createElement(u.a,{span:18},y.a.createElement(b.a.Item,{label:"Merchant ID",name:"id"},y.a.createElement(g.a,{disabled:!0})))),y.a.createElement(m.a,null,y.a.createElement(u.a,{span:18},y.a.createElement(b.a.Item,{label:"Category",name:"category"},y.a.createElement(h.a,{onChange:function(e){c(Object(o.a)(Object(o.a)({},n),{},{category:e})),_({type:e})},disabled:"0"!==e.match.params.id},y.a.createElement(C,{value:1},"Email Template"),y.a.createElement(C,{value:2},"Notification Template"))))),y.a.createElement(m.a,null,y.a.createElement(u.a,{span:18},y.a.createElement(b.a.Item,{label:"Type",name:"type"},y.a.createElement(h.a,null,n.typeTemplate.length&&n.typeTemplate.map((function(e,a){return y.a.createElement(C,{key:e.label,value:e.value},e.label)})))))),y.a.createElement(m.a,null,y.a.createElement(u.a,{span:18},y.a.createElement(b.a.Item,{label:"Language",name:"language"},y.a.createElement(h.a,null,y.a.createElement(C,{value:1},"English"),y.a.createElement(C,{value:2},"French"),y.a.createElement(C,{value:3},"Spanish"),y.a.createElement(C,{value:4},"Polish"),y.a.createElement(C,{value:5},"Portuguese"))))),y.a.createElement(m.a,null,y.a.createElement(u.a,{span:18},y.a.createElement(b.a.Item,{label:"Title",name:"title"},y.a.createElement(g.a,null)))),y.a.createElement(m.a,null,y.a.createElement(u.a,{span:18},y.a.createElement(b.a.Item,{label:"Content",name:"content"},y.a.createElement(N,{rows:10})))),y.a.createElement(b.a.Item,I,y.a.createElement("div",null,y.a.createElement(r.a,{type:"primary",htmlType:"submit",style:{marginLeft:"30px"}},"Save"))))))))};a.default=F},85:function(e,a,t){},86:function(e,a,t){"use strict";t.d(a,"a",(function(){return n}));var n="http://149.28.152.251:9001/v1"},93:function(e,a,t){"use strict";var n=t(0),l=t.n(n),c=t(73),r=t(76),s=t.n(r),m=function(e){var a=e.title;return l.a.createElement("div",{className:"web-bread-c"},l.a.createElement(c.a,{arr:[a]}),l.a.createElement("h3",null,a),l.a.createElement("img",{src:s.a,className:"aset",alt:"aset"}))};a.a=m}}]);
//# sourceMappingURL=43.7b7e4a5d.chunk.js.map