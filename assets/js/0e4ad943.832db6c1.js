"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[9581],{3765:(e,t,n)=>{n.r(t),n.d(t,{default:()=>U});var s=n(797),l=n(5318),a=n(6540);const o={toolsContainer:"toolsContainer_eWRe",tabsContainer:"tabsContainer_Jsur",tabList:"tabList_QPP7",tabActive:"tabActive_YwEC",tabContent:"tabContent_eYkP",toolDescription:"toolDescription_F8H2",toolContent:"toolContent_oT1D"};var r=n(4848);function c(){const[e,t]=(0,a.useState)("HelloWorld,hello_world"),[n,s]=(0,a.useState)(""),[l,c]=(0,a.useState)(""),[i,u]=(0,a.useState)("");(0,a.useEffect)((()=>{d(e)}),[e]);const d=e=>{if(!e)return;const t=e.split(",").map((e=>e.trim())).map((e=>{let t=[];if(e.includes("_"))t=e.split("_").filter(Boolean).map(((e,t)=>0===t?e.toLowerCase():e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()));else{let n="";for(let s=0;s<e.length;s++){const l=e[s];s>0&&l.toUpperCase()===l&&l.toLowerCase()!==l?(t.push(n),n=l.toLowerCase()):n+=l.toLowerCase()}n&&t.push(n)}return{camel:t.map(((e,t)=>0===t?e.toLowerCase():e.charAt(0).toUpperCase()+e.slice(1))).join(""),pascal:t.map((e=>e.charAt(0).toUpperCase()+e.slice(1))).join(""),snake:t.join("_").toLowerCase()}}));s(t.map((e=>e.camel)).join(", ")),c(t.map((e=>e.pascal)).join(", ")),u(t.map((e=>e.snake)).join(", "))};return(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u8f93\u5165 (\u7528\u9017\u53f7\u5206\u9694\u591a\u4e2a\u5355\u8bcd):"}),(0,r.jsx)("input",{className:o.inputField,type:"text",value:e,onChange:e=>t(e.target.value)}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u9a7c\u5cf0\u547d\u540d (\u9996\u5b57\u6bcd\u5c0f\u5199):"}),(0,r.jsx)("input",{className:o.inputField,type:"text",value:n,readOnly:!0})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u5e15\u65af\u5361\u547d\u540d (\u9996\u5b57\u6bcd\u5927\u5199):"}),(0,r.jsx)("input",{className:o.inputField,type:"text",value:l,readOnly:!0})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u4e0b\u5212\u7ebf\u547d\u540d:"}),(0,r.jsx)("input",{className:o.inputField,type:"text",value:i,readOnly:!0})]})]})}function i(){const[e,t]=(0,a.useState)(2),[n,s]=(0,a.useState)("\u5faa\u73af\u66ff\u6362 {#0} \u548c {#1}"),[l,c]=(0,a.useState)(Array(2).fill("").map(((e,t)=>`\u53c2\u6570${t+1}`))),[i,u]=(0,a.useState)("");return(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u53c2\u6570\u6570\u91cf:"}),(0,r.jsx)("input",{className:o.inputField,type:"number",min:"1",value:e,onChange:e=>(e=>{const n=parseInt(e);if(!(isNaN(n)||n<1))if(t(n),n>l.length){const e=[...l];for(let t=l.length;t<n;t++)e.push(`\u53c2\u6570${t+1}`);c(e)}else c(l.slice(0,n))})(e.target.value)})]}),(0,r.jsxs)("div",{children:[(0,r.jsxs)("label",{className:o.label,children:["\u6a21\u677f (\u4f7f\u7528 ","{#n}"," \u4f5c\u4e3a\u5360\u4f4d\u7b26):"]}),(0,r.jsx)("textarea",{className:o.textArea,value:n,onChange:e=>s(e.target.value)})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u53c2\u6570\u503c (\u7528\u9017\u53f7\u5206\u9694\u591a\u4e2a\u503c):"}),l.map(((e,t)=>(0,r.jsxs)("div",{style:{marginBottom:"10px"},children:[(0,r.jsxs)("label",{children:["\u53c2\u6570 ",t+1,":"]}),(0,r.jsx)("input",{className:o.inputField,type:"text",value:e,onChange:e=>((e,t)=>{const n=[...l];n[e]=t,c(n)})(t,e.target.value)})]},t)))]}),(0,r.jsx)("button",{className:o.button,onClick:()=>{const t=l.map((e=>e.split(",").map((e=>e.trim())))),s=t[0].length;let a="";for(let l=0;l<s;l++){let s=n;for(let n=0;n<e;n++){const e=Math.min(l,t[n].length-1);s=s.replace(new RegExp(`\\{#${n}\\}`,"g"),t[n][e])}a+=s+"\n"}u(a)},children:"\u751f\u6210\u4ee3\u7801"}),(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u8f93\u51fa:"}),(0,r.jsx)("textarea",{className:o.textArea,value:i,readOnly:!0})]})]})}const u="container_WKoJ",d="uploadSection_wgt6",p="fileInput_tGu2",h="button_o96W",m="previewSection_w0u4",x="imageBox_uz1y",j="preview_tMv4";function f(){const[e,t]=(0,a.useState)(null),[n,s]=(0,a.useState)(null),[l,o]=(0,a.useState)(!1),c=(0,a.useCallback)((e=>{const n=e.target.files[0];if(n){const e=new FileReader;e.onload=e=>{t(e.target.result),s(null)},e.readAsDataURL(n)}}),[]),i=(0,a.useCallback)((()=>{if(!e)return;o(!0);const t=new Image;t.onload=()=>{const e=document.createElement("canvas"),n=800;let l=t.width,a=t.height;l>a?l>n&&(a*=n/l,l=n):a>n&&(l*=n/a,a=n),e.width=l,e.height=a;e.getContext("2d").drawImage(t,0,0,l,a);const r=e.toDataURL("image/jpeg",.8);s(r),o(!1)},t.src=e}),[e]);return(0,r.jsxs)("div",{className:u,children:[(0,r.jsxs)("div",{className:d,children:[(0,r.jsx)("input",{type:"file",accept:"image/*",onChange:c,className:p}),e&&(0,r.jsx)("button",{onClick:i,className:h,disabled:l,children:l?"\u5904\u7406\u4e2d...":"\u538b\u7f29\u56fe\u7247"})]}),(0,r.jsxs)("div",{className:m,children:[e&&(0,r.jsxs)("div",{className:x,children:[(0,r.jsx)("h3",{children:"\u539f\u56fe"}),(0,r.jsx)("img",{src:e,alt:"Original",className:j})]}),n&&(0,r.jsxs)("div",{className:x,children:[(0,r.jsx)("h3",{children:"\u538b\u7f29\u540e"}),(0,r.jsx)("img",{src:n,alt:"Resized",className:j}),(0,r.jsx)("a",{href:n,download:"compressed.jpg",className:h,children:"\u4e0b\u8f7d"})]})]})]})}const v="container_S9Kn",b="label_mDkY",g="textArea_Ma_z",N="button_WTG9";function C(){const[e,t]=(0,a.useState)('{\n    "bankList" : [\n        {\n            "cardNoLast4" : "0129",\n            "bankName" : "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c",\n            "bankAccountNo" : "1323333333",\n            "arriveDateList" : [\n                {\n                    "singleAmount" : "50000.00",\n                    "availableAmount" : "50000.00",\n                    "title" : "\u9884\u8ba1\u4e24\u5c0f\u65f6\u5185\u5230\u8d26\uff0c\u786e\u8ba4\u63d0\u73b0",\n                    "desc" : "\u8be5\u7b14\u63d0\u73b0\u9884\u8ba1\u5c06\u5728",\n                    "arriveDateType" : "fast"\n                }\n            ],\n            "type" : "common",\n            "is_true" : true\n        }\n    ]\n}'),[n,s]=(0,a.useState)("");function l(){try{let t=o("Root",JSON.parse(e));s(t)}catch(t){s(`\u89e3\u6790\u9519\u8bef: ${t.message}`)}}function o(e,t){let n=`type ${e} struct {\n`;if(Array.isArray(t))if(t.length>0){const s=t[0];if(n+=`    Items ${"object"==typeof s?`[]${e}Item`:`[]${c(typeof s)}`} \`json:"items"\`\n`,"object"==typeof s&&null!==s)return n+="}\n\n"+o(`${e}Item`,s),n}else n+='    Items []interface{} `json:"items"`\n';else if("object"==typeof t&&null!==t){for(const[e,s]of Object.entries(t)){const t=e.charAt(0).toUpperCase()+e.slice(1);Array.isArray(s)?s.length>0&&"object"==typeof s[0]&&null!==s[0]?n+=`    ${t} []${t}Item \`json:"${e}"\`\n`:s.length>0?n+=`    ${t} []${c(typeof s[0])} \`json:"${e}"\`\n`:n+=`    ${t} []interface{} \`json:"${e}"\`\n`:n+="object"==typeof s&&null!==s?`    ${t} ${t}Object \`json:"${e}"\`\n`:`    ${t} ${c(typeof s)} \`json:"${e}"\`\n`}n+="}\n\n";for(const[e,s]of Object.entries(t)){const t=e.charAt(0).toUpperCase()+e.slice(1);Array.isArray(s)&&s.length>0&&"object"==typeof s[0]&&null!==s[0]?n+=o(`${t}Item`,s[0]):"object"==typeof s&&null!==s&&(n+=o(`${t}Object`,s))}return n}return n+="}\n",n}function c(e){switch(e){case"string":return"string";case"number":return"float64";case"boolean":return"bool";default:return"interface{}"}}return(0,a.useEffect)((()=>{l()}),[]),(0,r.jsxs)("div",{className:v,children:[(0,r.jsx)("label",{className:b,children:"JSON \u8f93\u5165:"}),(0,r.jsx)("textarea",{className:g,value:e,onChange:e=>t(e.target.value)}),(0,r.jsx)("button",{className:N,onClick:l,children:"\u8f6c\u6362\u4e3aGolang\u7ed3\u6784\u4f53"}),(0,r.jsx)("label",{className:b,children:"\u7ed3\u6784\u4f53\u8f93\u51fa:"}),(0,r.jsx)("textarea",{className:g,value:n,readOnly:!0})]})}function w(){const[e,t]=(0,a.useState)("www.hailaz.cn"),n=(0,a.useRef)(null);(0,a.useEffect)((()=>{const e=document.createElement("script");return e.src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js",e.async=!0,e.onload=()=>{s()},document.body.appendChild(e),()=>{document.body.removeChild(e)}}),[]),(0,a.useEffect)((()=>{window.QRCode&&s()}),[e]);const s=()=>{n.current&&window.QRCode&&(n.current.innerHTML="",new window.QRCode(n.current,{text:e||"null",width:300,height:300,colorDark:"#000000",colorLight:"#ffffff",correctLevel:window.QRCode.CorrectLevel.H}))};return(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("label",{className:o.label,children:"\u8f93\u5165\u7f51\u5740\u6216\u6587\u672c:"}),(0,r.jsx)("input",{className:o.inputField,type:"text",value:e,onChange:e=>t(e.target.value),placeholder:"\u8f93\u5165\u9700\u8981\u8f6c\u6362\u4e3a\u4e8c\u7ef4\u7801\u7684\u5185\u5bb9"})]}),(0,r.jsx)("div",{className:o.qrContainer,ref:n}),(0,r.jsx)("p",{className:o.hint,children:"\u4e8c\u7ef4\u7801\u4f1a\u6839\u636e\u8f93\u5165\u5185\u5bb9\u81ea\u52a8\u66f4\u65b0"})]})}const y="snakeGameContainer_eZlv",S="gameInfo_dgYU",_="score_SUBH",k="gameButton_AdL2",$="gameOverText_XUb7",A="snakeBox_RNxz",I="point_K7gE",L="pointSelect_WRfV",R="food_vB8u",O="instructions_lH8Q",D=()=>{const[e,t]=(0,a.useState)([]),[n]=(0,a.useState)(40),[s]=(0,a.useState)(10),[l]=(0,a.useState)(5),[o,c]=(0,a.useState)(-1),[i,u]=(0,a.useState)(0),[d,p]=(0,a.useState)(!1),[h,m]=(0,a.useState)(!1),x=(0,a.useRef)(null),j=(0,a.useRef)(39),f=(0,a.useRef)(null);class v{constructor(e){this.pointIndex=e,this.next=null}}const b=e=>{const t=new v(e),n=x.current,s=n,l=n;null!=l.next?(t.next=l.next,s.next=t):l.next=t},g=()=>{t((e=>{const t=[...e];let n=x.current;for(;null!=n.next;){n=n.next;const e=n.pointIndex;e>=0&&e<t.length&&(t[e]={...t[e],isSel:!0})}return t}))},N=()=>{if(d||!h)return void console.log("\u6e38\u620f\u672a\u5f00\u59cb\u6216\u5df2\u7ed3\u675f\uff0c\u505c\u6b62\u79fb\u52a8");const e=x.current;if(!e)return void console.log("\u627e\u4e0d\u5230\u86c7\u5934\u8282\u70b9");console.log("\u5f53\u524d\u79fb\u52a8\u65b9\u5411:",j.current);const s=e.pointIndex;let l;switch(console.log("\u5f53\u524d\u86c7\u5934\u4f4d\u7f6e:",s),j.current){case 37:l=s%n==0?s+n-1:s-1,console.log("\u5411\u5de6\u79fb\u52a8\uff0c\u65b0\u4f4d\u7f6e:",l);break;case 38:l=s-n<0?n*n+s-n:s-n,console.log("\u5411\u4e0a\u79fb\u52a8\uff0c\u65b0\u4f4d\u7f6e:",l);break;case 39:l=(s+1)%n==0?s-(n-1):s+1,console.log("\u5411\u53f3\u79fb\u52a8\uff0c\u65b0\u4f4d\u7f6e:",l);break;case 40:l=s+n>=n*n?s%n:s+n,console.log("\u5411\u4e0b\u79fb\u52a8\uff0c\u65b0\u4f4d\u7f6e:",l);break;default:l=s,console.log("\u672a\u77e5\u65b9\u5411\uff0c\u4fdd\u6301\u539f\u4f4d\u7f6e")}t((e=>{const t=[...e];return t[s]={...t[s],isSel:!1},t[l]={...t[l],isSel:!0},t}));let a=e.next;for(;a;){if(a.pointIndex===l)return console.log("\u86c7\u649e\u5230\u81ea\u5df1\u4e86\uff0c\u6e38\u620f\u7ed3\u675f"),p(!0),void(f.current&&(clearInterval(f.current),f.current=null));a=a.next}e.pointIndex=l,o===l?(console.log("\u5403\u5230\u98df\u7269\uff01\u751f\u6210\u65b0\u98df\u7269"),c(-1),C(),u((e=>e+10)),b(l)):((()=>{let e=x.current,n=e;for(;null!=e.next;)n=e,e=e.next;if(n!==x.current){const s=e.pointIndex;n.next=null,t((e=>{const t=[...e];return s>=0&&s<t.length&&(t[s]={...t[s],isSel:!1}),t}))}})(),b(l)),g()},C=()=>{let e,t;do{t=!1,e=Math.floor(Math.random()*n*n);let s=x.current;for(;s&&s.next;)if(s=s.next,s.pointIndex===e){t=!0;break}}while(t);c(e)};(0,a.useEffect)((()=>{const e=e=>{if(!h||d)return;const t=e.keyCode;switch(t){case 37:case 39:37!==j.current&&39!==j.current&&(j.current=t),e.preventDefault();break;case 38:case 40:38!==j.current&&40!==j.current&&(j.current=t),e.preventDefault()}};return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e),f.current&&clearInterval(f.current)}}),[h,d,n]);(0,a.useEffect)((()=>{const e=[];for(let t=0;t<n*n;t++)e.push({id:t,isSel:!1});t(e)}),[n]);const w=h?d?"\u91cd\u65b0\u5f00\u59cb":"\u6682\u505c\u6e38\u620f":"\u5f00\u59cb\u6e38\u620f";return(0,r.jsxs)("div",{className:y,children:[(0,r.jsxs)("div",{className:S,children:[(0,r.jsxs)("div",{className:_,children:["\u5206\u6570: ",i]}),(0,r.jsx)("button",{className:k,onClick:()=>{d||!h?(()=>{console.log("\u521d\u59cb\u5316\u6e38\u620f\u5f00\u59cb");const e=[];for(let t=0;t<n*n;t++)e.push({id:t,isSel:!1});t(e);const s=Math.floor(n*n/2),a=new v(s);x.current=a;for(let t=1;t<l;t++)b(s-t);g(),C(),u(0),p(!1),m(!0),console.log("\u6b63\u5728\u542f\u52a8\u6e38\u620f\u8ba1\u65f6\u5668..."),f.current&&(console.log("\u6e05\u9664\u65e7\u7684\u8ba1\u65f6\u5668"),clearInterval(f.current),f.current=null),console.log("\u8bbe\u7f6e\u65b0\u7684\u8ba1\u65f6\u5668"),f.current=setInterval((()=>{console.log("\u8ba1\u65f6\u5668\u89e6\u53d1\u79fb\u52a8"),N()}),200),console.log("\u6e38\u620f\u521d\u59cb\u5316\u5b8c\u6210\uff0c\u8ba1\u65f6\u5668ID:",f.current)})():(p(!0),m(!1),f.current&&(clearInterval(f.current),f.current=null))},children:w}),d&&(0,r.jsx)("div",{className:$,children:"\u6e38\u620f\u7ed3\u675f!"})]}),(0,r.jsx)("div",{className:A,style:{width:s*n+"px",height:s*n+"px"},children:e.map((e=>(0,r.jsx)("div",{className:`${I} ${e.isSel?L:""} ${e.id===o?R:""}`,style:{width:s-2+"px",height:s-2+"px"}},e.id)))}),(0,r.jsx)("div",{className:O,children:(0,r.jsx)("p",{children:"\u4f7f\u7528\u65b9\u5411\u952e \u2191 \u2193 \u2190 \u2192 \u63a7\u5236\u86c7\u7684\u79fb\u52a8"})})]})},E=[{label:"\u56fe\u7247\u538b\u7f29",value:"image",description:"\u5728\u7ebf\u56fe\u7247\u538b\u7f29\u5de5\u5177",component:(0,r.jsx)(f,{})},{label:"JSON\u8f6cGo\u7ed3\u6784\u4f53",value:"json2struct",description:"\u5c06JSON\u6570\u636e\u8f6c\u6362\u4e3aGolang\u7ed3\u6784\u4f53\u5b9a\u4e49",component:(0,r.jsx)(C,{})},{label:"\u4e8c\u7ef4\u7801\u751f\u6210\u5668",value:"qrcode",description:"\u751f\u6210\u4e8c\u7ef4\u7801\u7684\u5de5\u5177",component:(0,r.jsx)(w,{})},{label:"\u6a21\u677f\u4ee3\u7801\u751f\u6210\u5668",value:"codegen",description:"\u6839\u636e\u6a21\u677f\u751f\u6210\u4ee3\u7801\u7684\u5de5\u5177",component:(0,r.jsx)(i,{})},{label:"\u5927\u5c0f\u5199\u8f6c\u6362\u5668",value:"caseconverter",description:"\u8f6c\u6362\u6587\u672c\u7684\u5927\u5c0f\u5199",component:(0,r.jsx)(c,{})},{label:"\u8d2a\u5403\u86c7\u6e38\u620f",value:"snakegame",description:"\u7ecf\u5178\u7684\u8d2a\u5403\u86c7\u6e38\u620f",component:(0,r.jsx)(D,{})}];function U(){const{siteConfig:e}=(0,s.A)(),[t,n]=a.useState(E[0].value),c=E.find((e=>e.value===t));return(0,r.jsx)(l.A,{title:"\u5de5\u5177\u96c6",description:"\u5b9e\u7528\u7684\u5728\u7ebf\u5de5\u5177\u96c6\u5408",children:(0,r.jsx)("main",{children:(0,r.jsx)("div",{className:o.toolsContainer,children:(0,r.jsxs)("div",{className:o.tabsContainer,children:[(0,r.jsx)("div",{className:o.tabList,children:E.map((e=>(0,r.jsx)("button",{className:t===e.value?o.tabActive:"",onClick:()=>{return t=e.value,void n(t);var t},children:e.label},e.value)))}),(0,r.jsxs)("div",{className:o.tabContent,children:[(0,r.jsx)("div",{className:o.toolDescription,children:c.description}),(0,r.jsx)("div",{className:o.toolContent,children:c.component})]})]})})})})}}}]);