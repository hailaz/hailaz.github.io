"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[8931],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),f=s(n),g=o,m=f["".concat(c,".").concat(g)]||f[g]||p[g]||a;return n?r.createElement(m,i(i({ref:t},u),{},{components:n})):r.createElement(m,i({ref:t},u))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=f;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var s=2;s<a;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},853:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>l,toc:()=>s});var r=n(7462),o=(n(7294),n(3905));const a={title:"\u6280\u5de7"},i=void 0,l={unversionedId:"learn/go/1",id:"learn/go/1",title:"\u6280\u5de7",description:"gofmt\u683c\u5f0f\u5316\u4ee3\u7801",source:"@site/docs/learn/go/1.md",sourceDirName:"learn/go",slug:"/learn/go/1",permalink:"/docs/learn/go/1",draft:!1,editUrl:"https://github.com/hailaz/hailaz.github.io/blob/master/docs/learn/go/1.md",tags:[],version:"current",frontMatter:{title:"\u6280\u5de7"},sidebar:"learn",previous:{title:"\u5b66\u4e60\u8d44\u6599",permalink:"/docs/learn/go/index"},next:{title:"\u603b\u7ed3",permalink:"/docs/learn/go/2"}},c={},s=[{value:"gofmt\u683c\u5f0f\u5316\u4ee3\u7801",id:"gofmt\u683c\u5f0f\u5316\u4ee3\u7801",level:2},{value:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5json\u8f93\u51fa",id:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5json\u8f93\u51fa",level:2}],u={toc:s};function p(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"gofmt\u683c\u5f0f\u5316\u4ee3\u7801"},"gofmt\u683c\u5f0f\u5316\u4ee3\u7801"),(0,o.kt)("p",null,"gofmt -s -w xxx.go"),(0,o.kt)("h2",{id:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5json\u8f93\u51fa"},"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5json\u8f93\u51fa"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},'type User struct {\n Pwd string `json:"pwd"`\n Age int    `json:"age"`\n}\n\ntype UserOut struct {\n User\n Pwd *struct{} `json:"pwd,omitempty"`// \u8fd9\u91cc\u7684\u5b57\u6bb5json\u540d\u9700\u8981\u548c\u5d4c\u5957\u7684\u5b57\u6bb5json\u540d\u4e00\u81f4\uff0c\u5426\u5219\u65e0\u6548\n}\n\nfunc TestJson(t *testing.T) {\n u := User{Pwd: "123", Age: 1}\n bb := UserOut{User: u}\n b, _ := json.MarshalIndent(bb, "", "    ")\n t.Log(string(b))\n}\n')))}p.isMDXComponent=!0}}]);