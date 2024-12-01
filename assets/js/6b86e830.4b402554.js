"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[3976],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>g});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var i=r.createContext({}),p=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=p(e.components);return r.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),m=p(n),g=o,f=m["".concat(i,".").concat(g)]||m[g]||u[g]||a;return n?r.createElement(f,l(l({ref:t},s),{},{components:n})):r.createElement(f,l({ref:t},s))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:o,l[1]=c;for(var p=2;p<a;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1844:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var r=n(7462),o=(n(7294),n(3905));const a={title:"JavaScript"},l=void 0,c={unversionedId:"learn/web/2023-05-29",id:"learn/web/2023-05-29",title:"JavaScript",description:"\u53d6\u6d88\u8bf7\u6c42\uff0c\u89e6\u53d1golang\u7684context cancel",source:"@site/docs/learn/web/2023-05-29.md",sourceDirName:"learn/web",slug:"/learn/web/2023-05-29",permalink:"/docs/learn/web/2023-05-29",draft:!1,editUrl:"https://github.com/hailaz/hailaz.github.io/blob/master/docs/learn/web/2023-05-29.md",tags:[],version:"current",frontMatter:{title:"JavaScript"},sidebar:"learn",previous:{title:"WebSocket",permalink:"/docs/learn/web/2019-07-15-websocket"},next:{title:"\u6d4f\u89c8\u5668\u63d2\u4ef6\u5546\u5e97",permalink:"/docs/learn/web/2023-08-08"}},i={},p=[{value:"\u53d6\u6d88\u8bf7\u6c42\uff0c\u89e6\u53d1golang\u7684context cancel",id:"\u53d6\u6d88\u8bf7\u6c42\u89e6\u53d1golang\u7684context-cancel",level:2},{value:"\u4e0d\u540c\u5305\u6307\u5b9a\u4e0d\u540c\u6e90",id:"\u4e0d\u540c\u5305\u6307\u5b9a\u4e0d\u540c\u6e90",level:2}],s={toc:p};function u(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"\u53d6\u6d88\u8bf7\u6c42\u89e6\u53d1golang\u7684context-cancel"},"\u53d6\u6d88\u8bf7\u6c42\uff0c\u89e6\u53d1golang\u7684context cancel"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-html"},'<meta http-equiv="Content-Security-Policy" content="connect-src \'self\'">\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"// \u73b0\u5728\u4e0d\u7ba1\u7528\u7684\uff0c\u6d4f\u89c8\u5668\u4f1a\u62e6\u622a\nconst controller = new AbortController();\nconst signal = controller.signal;\n\nfetch('https://xxx', { signal })\n .then(response => {\n    // \u5904\u7406\u54cd\u5e94\u6570\u636e\n  })\n .catch(error => {\n    if (error.name === 'AbortError') {\n      console.log('\u8bf7\u6c42\u88ab\u53d6\u6d88');\n    } else {\n      console.error('\u8bf7\u6c42\u5931\u8d25', error);\n    }\n  });\n\nsetTimeout(() => {\n  // \u53d6\u6d88\u8bf7\u6c42\ncontroller.abort();\n}, 50);\n")),(0,o.kt)("h2",{id:"\u4e0d\u540c\u5305\u6307\u5b9a\u4e0d\u540c\u6e90"},"\u4e0d\u540c\u5305\u6307\u5b9a\u4e0d\u540c\u6e90"),(0,o.kt)("p",null,"\u5168\u5c40"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"npm config set @xxx:registry=https://mirrors.xxx.com/npm/\nnpm config set registry https://registry.npmjs.org/\n")),(0,o.kt)("p",null,"\u4e5f\u53ef\u4ee5\u4f7f\u7528",(0,o.kt)("inlineCode",{parentName:"p"},".npmrc"),"\u65b9\u5f0f\u9488\u5bf9\u7279\u5b9a\u9879\u76ee\uff0c\u9879\u76ee\u6839\u76ee\u5f55\u65b0\u5efa",(0,o.kt)("inlineCode",{parentName:"p"},".npmrc"),"\u6587\u4ef6\uff0c\u5185\u5bb9\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"# \u4e3a\u4e86\u5b89\u88c5\u65e7\u7248\u672c\u4f9d\u8d56\nregistry=https://registry.npmjs.org/\n@xxx:registry=https://mirrors.xxx.com/npm/\n")))}u.isMDXComponent=!0}}]);