(this["webpackJsonpreact-admin"]=this["webpackJsonpreact-admin"]||[]).push([[61],{1820:function(e,a,t){"use strict";t.r(a);t(54);var n=t(55),l=t.n(n),r=(t(83),t(85)),c=t.n(r),i=(t(74),t(66)),s=t.n(i),o=t(62),m=(t(92),t(93)),u=t.n(m),d=(t(51),t(50)),b=t.n(d),p=(t(57),t(59)),g=t.n(p),E=(t(58),t(60)),f=t.n(E),h=(t(69),t(72)),_=t.n(h),O=(t(65),t(67)),v=t.n(O),j=t(53),k=(t(63),t(61)),w=t.n(k),y=(t(77),t(79)),I=t.n(y),S=t(0),C=t.n(S),x=t(73),z=(t(110),t(56)),D=t(97),F=(t(117),t(15),t(226),t(130)),T=t.n(F),N=(I.a.MonthPicker,I.a.RangePicker,w.a.Option),J=([{label:"\u5f85\u5904\u7406",value:"to_handle"},{label:"\u5df2\u5904\u7406",value:"handled"}].map((function(e,a){return C.a.createElement(N,{key:a,value:e.value},e.label)})),{labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}}),U=function(e,a,t){return[{title:"Sample application ID",dataIndex:"id",key:"id",width:"100",align:"center",render:function(a,t){return C.a.createElement("div",null,C.a.createElement("a",{onClick:function(){e(t)}},t.id))}},{title:"Task ID",dataIndex:"task_id",key:"task_id",align:"center"},{title:"Campaign title",dataIndex:"title",key:"title",width:"100",align:"center"},{title:"Update date",dataIndex:"update_time",key:"update_time",width:"100",align:"center",render:function(e,a){return C.a.createElement("div",null,new Date(e).toLocaleString())}},{title:"Username",dataIndex:"from_user",key:"from_user",width:"100",align:"center"},{title:"Courier",dataIndex:"courier",key:"courier",width:"100",align:"center"},{title:"Tracking number",dataIndex:"tracking_number",key:"tracking_number",width:"100",align:"center"},{title:"Application status",dataIndex:"status",key:"status",width:"100",align:"center",render:function(e,a){return C.a.createElement("div",null,1==e?"New application":"Shipped")}}]},R=function(e){var a=v.a.useForm(),t=Object(j.a)(a,1)[0];return C.a.createElement(v.a,Object.assign({},J,{form:t,name:"advanced_search",className:"ant-advanced-search-form",onFinish:function(a){console.log("values",a),e.changeSearch(a)}}),C.a.createElement(g.a,{gutter:24},C.a.createElement(f.a,{span:8},C.a.createElement(v.a.Item,{name:"id",label:"ID"},C.a.createElement(_.a,null))),C.a.createElement(f.a,{span:8},C.a.createElement(v.a.Item,{name:"user_id",label:"User ID"},C.a.createElement(_.a,null))),C.a.createElement(f.a,{span:8},C.a.createElement(v.a.Item,{name:"from_user",label:"User Email"},C.a.createElement(_.a,null)))),C.a.createElement(g.a,{gutter:24},C.a.createElement(f.a,{span:8},C.a.createElement(v.a.Item,{name:"tracking_number",label:"Tracking Number"},C.a.createElement(_.a,null)))),C.a.createElement(g.a,null,C.a.createElement(f.a,{span:24,style:{textAlign:"right"}},C.a.createElement(b.a,{type:"primary",htmlType:"submit"},"Search"),C.a.createElement(b.a,{style:{margin:"0 8px"},onClick:function(){t.resetFields()}},"Reset"))))},q=function(e){var a=e.visible,t=e.onCreate,n=e.onCancel,l=e.formData,r=(e.disabled,v.a.useForm()),c=Object(j.a)(r,1)[0],i=Object(S.useState)({}),s=Object(j.a)(i,2),o=(s[0],s[1],Object(S.useState)(!1)),m=Object(j.a)(o,2);m[0],m[1];Object(S.useEffect)((function(){console.log("formdata",l),Object.keys(l).length?c.setFieldsValue(l):c.resetFields()}),[l]);return C.a.createElement(u.a,{visible:a,title:"sku",okText:"Submit",cancelText:"Cancel",onCancel:n,onOk:function(){c.validateFields().then((function(e){c.resetFields(),t(e)})).catch((function(e){console.log("Validate Failed:",e)}))}},C.a.createElement(v.a,Object.assign({},{labelCol:{span:6},wrapperCol:{span:14}},{form:c,name:"form_in_modal"}),C.a.createElement(v.a.Item,{name:"id",label:"ID"},C.a.createElement(_.a,{disabled:!0})),C.a.createElement(v.a.Item,{name:"tier_1_cat",label:"Tier1 Cat",rules:[{required:!0}]},C.a.createElement(_.a,null)),C.a.createElement(v.a.Item,{name:"tier_2_cat",label:"Tier2 Cat"},C.a.createElement(_.a,null)),C.a.createElement(v.a.Item,{name:"tier_3_cat",label:"Tier3 Cat"},C.a.createElement(_.a,null)),C.a.createElement(v.a.Item,{name:"shown_name",label:"Sku name",rules:[{required:!0}]},C.a.createElement(_.a,null))))},A=function(e){var a=Object(S.useState)({list:[],pagination:{current:1,pageSize:10},search:{},loading:!0,visible:!1,disabled:!1,formData:{}}),t=Object(j.a)(a,2),n=t[0],r=t[1],i=Object(S.useState)({visible:!1,data:{}}),m=Object(j.a)(i,2);m[0],m[1];Object(S.useEffect)((function(){n.pagination;var e={start_row:0,page_size:n.pagination.pageSize};u(e)}),[]);var u=function(e){n.pagination,n.search;console.log("paramslist",e),Object(z.Eb)({sampleOrderJson:JSON.stringify(e)}).then((function(a){r(Object(o.a)(Object(o.a)({},n),{},{visible:!1,list:a.data.list&&Object(D.getKeyList)(a.data.list),loading:!1,search:e.search,pagination:{total:a.data.pager.total,current:e.start_row/e.page_size+1,pageSize:e.page_size}}))})).catch((function(e){console.log("err",e)}))};return C.a.createElement(l.a,{className:"animated fadeIn"},C.a.createElement(q,{visible:n.visible,onCreate:function(e){console.log("data",e),e.is_show_app=1,Object(z.s)({categoryJson:JSON.stringify(e)}).then((function(e){s.a.success("success");var a=Object(o.a)(Object(o.a)({},n.search),{},{start_row:0,page_size:10});u(a)})).catch((function(e){console.log("err",e)}))},onCancel:function(){r(Object(o.a)(Object(o.a)({},n),{},{visible:!1}))},formData:n.formData,disabled:n.disabled}),C.a.createElement("div",null,C.a.createElement(x.a,{arr:["Sample application management"]})),C.a.createElement("div",{className:"base-style"},C.a.createElement(R,{changeSearch:function(e){console.log("search11",e),console.log("statte",n);var a=Object(o.a)(Object(o.a)({},e),{},{page_size:10,start_row:0,search:e});console.log("searchparams",a),u(a),r(Object(o.a)(Object(o.a)({},n),{},{search:e}))}})),C.a.createElement(g.a,null,C.a.createElement(f.a,{span:24},C.a.createElement("div",{className:"base-style"},C.a.createElement(c.a,{columns:U((function(e){var a=T.a+"/sample_detail/"+e.id;window.open(a,"_blank").focus()})),rowKey:function(e){return e.key},dataSource:n.list,onChange:function(e){console.log("state",n);var a=Object(o.a)(Object(o.a)({},n.search),{},{page_size:e.pageSize,start_row:e.pageSize*(e.current-1),search:n.search});console.log("ttt",a),u(a)},loading:n.loading,pagination:n.pagination,scroll:{scrollToFirstRowOnChange:!0,x:1e3}})))))};a.default=A}}]);
//# sourceMappingURL=61.cc63e3d9.chunk.js.map