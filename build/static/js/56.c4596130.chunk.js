(this["webpackJsonpreact-admin"]=this["webpackJsonpreact-admin"]||[]).push([[56],{1827:function(e,a,t){"use strict";t.r(a);t(54);var n=t(55),l=t.n(n),c=(t(83),t(85)),r=t.n(c),i=(t(348),t(74),t(66)),s=t.n(i),o=t(62),m=(t(92),t(93)),d=t.n(m),u=(t(51),t(50)),b=t.n(u),f=(t(57),t(59)),g=t.n(f),E=(t(58),t(60)),p=t.n(E),O=(t(69),t(72)),j=t.n(O),v=(t(65),t(67)),h=t.n(v),C=t(53),_=(t(63),t(61)),y=t.n(_),w=(t(77),t(79)),k=t.n(w),D=t(0),S=t.n(D),F=t(73),I=(t(110),t(56)),x=t(97),Y=(t(123),t(76)),N=t.n(Y),R=t(511),T=(t(204),t(130)),z=t.n(T),M=(k.a.MonthPicker,k.a.RangePicker,y.a.Option),V={rules:[{type:"object",required:!0,message:"Please select time!"}]},H=([{label:"\u5f85\u5904\u7406",value:"to_handle"},{label:"\u5df2\u5904\u7406",value:"handled"}].map((function(e,a){return S.a.createElement(M,{key:a,value:e.value},e.label)})),function(e){return[{title:"Referral Code ID",dataIndex:"id",key:"id",align:"center",render:function(a,t){return S.a.createElement("span",{className:"table-id pointer",onClick:function(){e(t.user_id)}},a)}},{title:"Referral Code",dataIndex:"code",key:"code",align:"center"},{title:"Email",dataIndex:"email",key:"email",align:"center"},{title:"Created time",dataIndex:"create_time",key:"create_time",align:"center"}]}),J={labelCol:{span:8},wrapperCol:{span:16}},L=function(e){var a=h.a.useForm(),t=Object(C.a)(a,1)[0];return S.a.createElement(h.a,Object.assign({},J,{form:t,name:"advanced_search",className:"ant-advanced-search-form",onFinish:function(a){e.changeSearch(a)}}),S.a.createElement(g.a,{gutter:24},S.a.createElement(p.a,{span:8},S.a.createElement(h.a.Item,{name:"user_id",label:"User ID"},S.a.createElement(j.a,null))),S.a.createElement(p.a,{span:8},S.a.createElement(h.a.Item,{name:"Code",label:"Code"},S.a.createElement(j.a,null))),S.a.createElement(p.a,{span:8},S.a.createElement(h.a.Item,{name:"email",label:"Email"},S.a.createElement(j.a,null)))),S.a.createElement(g.a,null,S.a.createElement(p.a,{span:24,style:{textAlign:"right"}},S.a.createElement(b.a,{icon:S.a.createElement(R.a,null),type:"primary",htmlType:"submit",loading:e.loading},"Search"),S.a.createElement(b.a,{style:{margin:"0 8px"},onClick:function(){t.resetFields()}},"Reset"))))},P=function(e){var a=e.visible,t=e.onCreate,n=e.onCancel,l=(e.formData,e.disabled,h.a.useForm()),c=Object(C.a)(l,1)[0];return S.a.createElement(d.a,{visible:a,title:"download ",okText:"Submit",cancelText:"Cancel",onCancel:n,onOk:function(){c.validateFields().then((function(e){c.resetFields(),t(e)})).catch((function(e){console.log("Validate Failed:",e)}))}},S.a.createElement(h.a,Object.assign({},{labelCol:{span:6},wrapperCol:{span:14}},{form:c,name:"form_in_modal"}),S.a.createElement(h.a.Item,{label:"User Name",name:"user_name"},S.a.createElement(j.a,null)),S.a.createElement(h.a.Item,{label:"Type",name:"type"},S.a.createElement(y.a,null,S.a.createElement(M,{value:1},"Email"),S.a.createElement(M,{value:2},"Ins"),S.a.createElement(M,{value:3},"facebook"))),S.a.createElement(h.a.Item,Object.assign({name:"begin_date",label:"Begin Time"},V),S.a.createElement(k.a,{showTime:!0,format:"YYYY-MM-DD HH:mm:ss"})),S.a.createElement(h.a.Item,Object.assign({name:"end_date",label:"End Time"},V),S.a.createElement(k.a,{showTime:!0,format:"YYYY-MM-DD HH:mm:ss"}))))},U=function(e){var a=e.visible,t=e.onCreate,n=e.onCancel,l=e.formData,c=(e.disabled,h.a.useForm()),r=Object(C.a)(c,1)[0],i=Object(D.useState)({}),s=Object(C.a)(i,2),o=(s[0],s[1],Object(D.useState)(!1)),m=Object(C.a)(o,2);m[0],m[1];Object(D.useEffect)((function(){Object.keys(l).length?r.setFieldsValue(l):r.resetFields()}),[]);return S.a.createElement(d.a,{visible:a,title:"Generate Referral code",okText:"Submit",cancelText:"Cancel",onCancel:n,onOk:function(){r.validateFields().then((function(e){r.resetFields(),t(e)})).catch((function(e){console.log("Validate Failed:",e)}))}},S.a.createElement(h.a,Object.assign({},{labelCol:{span:6},wrapperCol:{span:14}},{form:r,name:"form_in_modal"}),S.a.createElement(h.a.Item,{name:"type",label:"Type"},S.a.createElement(y.a,null,S.a.createElement(M,{value:"email"},"email"),S.a.createElement(M,{value:"ins"},"ins"),S.a.createElement(M,{value:"fb"},"fb"))),S.a.createElement(h.a.Item,{name:"user_name",label:"User Name",rules:[{required:!0}]},S.a.createElement(j.a,null))))},B=function(){var e=Object(D.useState)({list:[],pagination:{current:1,pageSize:10},search:{},loading:!0,visible:!1,disabled:!1,formData:{},aVisible:!1,aFormData:{},bVisible:!1,bFormData:{},dVisible:!1,dFormData:{}}),a=Object(C.a)(e,2),t=a[0],n=a[1],c=Object(D.useState)({visible:!1,data:{}}),i=Object(C.a)(c,2);i[0],i[1];Object(D.useEffect)((function(){t.pagination;var e={start_row:0,page_size:t.pagination.pageSize};m(e)}),[]);var m=function(e){console.log("params",e);t.pagination,t.search;n(Object(o.a)(Object(o.a)({},t),{},{loading:!0})),Object(I.zb)(e).then((function(e){n(Object(o.a)(Object(o.a)({},t),{},{visible:!1,list:e.data.list&&Object(x.getKeyList)(e.data.list),loading:!1,pagination:{total:e.data.pager.total}}))})).catch((function(e){console.log("err",e)}))},d={onChange:function(e,a){console.log("selectedRowKeys: ".concat(e),"selectedRows: ",a)},getCheckboxProps:function(e){return{disabled:"Disabled User"===e.name,name:e.name}}};return S.a.createElement(l.a,{className:"animated fadeIn"},S.a.createElement(P,{visible:t.dVisible,onCreate:function(e){console.log("values",e);var a=Object(o.a)(Object(o.a)({},e),{},{begin_date:e.begin_date.format("YYYY-MM-DD HH:mm:ss"),end_date:e.end_date.format("YYYY-MM-DD HH:mm:ss")});Object(I.J)({Referral_code_json:JSON.stringify(a)}).then((function(e){s.a.success("success"),n(Object(o.a)(Object(o.a)({},t),{},{dVisible:!1}))}))},onCancel:function(){n(Object(o.a)(Object(o.a)({},t),{},{dVisible:!1}))},formData:t.formData}),S.a.createElement(U,{visible:t.visible,onCreate:function(e){console.log("data",e),Object(I.j)({ReferralCodeJson:JSON.stringify(e)}).then((function(e){s.a.success("success");var a=Object(o.a)({},t.search);m(a)})).catch((function(e){console.log("err",e)}))},onCancel:function(){n(Object(o.a)(Object(o.a)({},t),{},{visible:!1}))},formData:t.formData,disabled:t.disabled}),S.a.createElement("div",{className:"web-bread-c"},S.a.createElement(F.a,{arr:["Referral Code List"]}),S.a.createElement("h3",null,"Referral Code List"),S.a.createElement("img",{src:N.a,className:"aset"})),S.a.createElement("div",{className:"base-wr"},S.a.createElement("div",{className:"base-style"},S.a.createElement(L,{changeSearch:function(e){var a=Object(o.a)(Object(o.a)({},e),{},{page_size:t.pagination.pageSize,start_row:0});n(Object(o.a)(Object(o.a)({},t),e)),m(a)},loading:t.loading})),S.a.createElement(g.a,null,S.a.createElement(p.a,{span:24},S.a.createElement("div",{className:"base-style"},S.a.createElement(g.a,null,S.a.createElement(p.a,{span:24,style:{textAlign:"right",marginBottom:"15px"}})),S.a.createElement(r.a,{columns:H((function(e){console.log("edit",e);var a=z.a+"/account/referral_user?user_id="+e;window.open(a,"_blank").focus()})),bordered:!0,rowKey:function(e){return e.key},rowSelection:Object(o.a)({type:"checkbox"},d),scroll:{scrollToFirstRowOnChange:!0,x:1e3},dataSource:t.list,onChange:function(e){var a=Object(o.a)(Object(o.a)({},t.search),{},{page_size:e.pageSize,start_row:e.pageSize*(e.current-1)});m(a)},loading:t.loading,pagination:t.pagination}))))))};a.default=B},511:function(e,a,t){"use strict";var n=t(0),l={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"}}]},name:"search",theme:"outlined"},c=t(52),r=function(e,a){return n.createElement(c.a,Object.assign({},e,{ref:a,icon:l}))};r.displayName="SearchOutlined";a.a=n.forwardRef(r)}}]);
//# sourceMappingURL=56.c4596130.chunk.js.map