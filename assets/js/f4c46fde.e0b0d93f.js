"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[6785],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>k});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},s=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,c=e.originalType,i=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=p(r),k=o,m=u["".concat(i,".").concat(k)]||u[k]||b[k]||c;return r?n.createElement(m,a(a({ref:t},s),{},{components:r})):n.createElement(m,a({ref:t},s))}));function k(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var c=r.length,a=new Array(c);a[0]=u;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var p=2;p<c;p++)a[p]=r[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},2668:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>a,default:()=>b,frontMatter:()=>c,metadata:()=>l,toc:()=>p});var n=r(7462),o=(r(7294),r(3905));const c={layout:"post",title:"WebSocket",tags:["WebSocket","HTML5"],categories:"\u534f\u8bae"},a=void 0,l={unversionedId:"learn/web/2019-07-15-websocket",id:"learn/web/2019-07-15-websocket",title:"WebSocket",description:"\u6458\u81ea\u83dc\u9e1f\u6559\u7a0b",source:"@site/docs/learn/web/2019-07-15-websocket.md",sourceDirName:"learn/web",slug:"/learn/web/2019-07-15-websocket",permalink:"/docs/learn/web/2019-07-15-websocket",draft:!1,editUrl:"https://github.com/hailaz/hailaz.github.io/blob/master/docs/learn/web/2019-07-15-websocket.md",tags:[{label:"WebSocket",permalink:"/docs/tags/web-socket"},{label:"HTML5",permalink:"/docs/tags/html-5"}],version:"current",frontMatter:{layout:"post",title:"WebSocket",tags:["WebSocket","HTML5"],categories:"\u534f\u8bae"},sidebar:"learn",previous:{title:"MGR",permalink:"/docs/learn/mysql/mgr"},next:{title:"JavaScript",permalink:"/docs/learn/web/2023-05-29"}},i={},p=[],s={toc:p};function b(e){let{components:t,...c}=e;return(0,o.kt)("wrapper",(0,n.Z)({},s,c,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("blockquote",null,(0,o.kt)("p",{parentName:"blockquote"},(0,o.kt)("a",{parentName:"p",href:"https://www.runoob.com/html/html5-websocket.html"},"\u6458\u81ea\u83dc\u9e1f\u6559\u7a0b"))),(0,o.kt)("p",null,"WebSocket \u662f HTML5 \u5f00\u59cb\u63d0\u4f9b\u7684\u4e00\u79cd\u5728\u5355\u4e2a TCP \u8fde\u63a5\u4e0a\u8fdb\u884c\u5168\u53cc\u5de5\u901a\u8baf\u7684\u534f\u8bae\u3002"),(0,o.kt)("p",null,"WebSocket \u4f7f\u5f97\u5ba2\u6237\u7aef\u548c\u670d\u52a1\u5668\u4e4b\u95f4\u7684\u6570\u636e\u4ea4\u6362\u53d8\u5f97\u66f4\u52a0\u7b80\u5355\uff0c\u5141\u8bb8\u670d\u52a1\u7aef\u4e3b\u52a8\u5411\u5ba2\u6237\u7aef\u63a8\u9001\u6570\u636e\u3002\u5728 WebSocket API \u4e2d\uff0c\u6d4f\u89c8\u5668\u548c\u670d\u52a1\u5668\u53ea\u9700\u8981\u5b8c\u6210\u4e00\u6b21\u63e1\u624b\uff0c\u4e24\u8005\u4e4b\u95f4\u5c31\u76f4\u63a5\u53ef\u4ee5\u521b\u5efa\u6301\u4e45\u6027\u7684\u8fde\u63a5\uff0c\u5e76\u8fdb\u884c\u53cc\u5411\u6570\u636e\u4f20\u8f93\u3002"),(0,o.kt)("p",null,"\u5728 WebSocket API \u4e2d\uff0c\u6d4f\u89c8\u5668\u548c\u670d\u52a1\u5668\u53ea\u9700\u8981\u505a\u4e00\u4e2a\u63e1\u624b\u7684\u52a8\u4f5c\uff0c\u7136\u540e\uff0c\u6d4f\u89c8\u5668\u548c\u670d\u52a1\u5668\u4e4b\u95f4\u5c31\u5f62\u6210\u4e86\u4e00\u6761\u5feb\u901f\u901a\u9053\u3002\u4e24\u8005\u4e4b\u95f4\u5c31\u76f4\u63a5\u53ef\u4ee5\u6570\u636e\u4e92\u76f8\u4f20\u9001\u3002"),(0,o.kt)("p",null,"\u73b0\u5728\uff0c\u5f88\u591a\u7f51\u7ad9\u4e3a\u4e86\u5b9e\u73b0\u63a8\u9001\u6280\u672f\uff0c\u6240\u7528\u7684\u6280\u672f\u90fd\u662f Ajax \u8f6e\u8be2\u3002\u8f6e\u8be2\u662f\u5728\u7279\u5b9a\u7684\u7684\u65f6\u95f4\u95f4\u9694\uff08\u5982\u6bcf 1 \u79d2\uff09\uff0c\u7531\u6d4f\u89c8\u5668\u5bf9\u670d\u52a1\u5668\u53d1\u51fa HTTP \u8bf7\u6c42\uff0c\u7136\u540e\u7531\u670d\u52a1\u5668\u8fd4\u56de\u6700\u65b0\u7684\u6570\u636e\u7ed9\u5ba2\u6237\u7aef\u7684\u6d4f\u89c8\u5668\u3002\u8fd9\u79cd\u4f20\u7edf\u7684\u6a21\u5f0f\u5e26\u6765\u5f88\u660e\u663e\u7684\u7f3a\u70b9\uff0c\u5373\u6d4f\u89c8\u5668\u9700\u8981\u4e0d\u65ad\u7684\u5411\u670d\u52a1\u5668\u53d1\u51fa\u8bf7\u6c42\uff0c\u7136\u800c HTTP \u8bf7\u6c42\u53ef\u80fd\u5305\u542b\u8f83\u957f\u7684\u5934\u90e8\uff0c\u5176\u4e2d\u771f\u6b63\u6709\u6548\u7684\u6570\u636e\u53ef\u80fd\u53ea\u662f\u5f88\u5c0f\u7684\u4e00\u90e8\u5206\uff0c\u663e\u7136\u8fd9\u6837\u4f1a\u6d6a\u8d39\u5f88\u591a\u7684\u5e26\u5bbd\u7b49\u8d44\u6e90\u3002"),(0,o.kt)("p",null,"HTML5 \u5b9a\u4e49\u7684 WebSocket \u534f\u8bae\uff0c\u80fd\u66f4\u597d\u7684\u8282\u7701\u670d\u52a1\u5668\u8d44\u6e90\u548c\u5e26\u5bbd\uff0c\u5e76\u4e14\u80fd\u591f\u66f4\u5b9e\u65f6\u5730\u8fdb\u884c\u901a\u8baf\u3002\n",(0,o.kt)("img",{alt:"ws",src:r(3203).Z,width:"834",height:"444"})),(0,o.kt)("p",null,"Websocket \u4f7f\u7528 ws \u6216 wss \u7684\u7edf\u4e00\u8d44\u6e90\u6807\u5fd7\u7b26\uff0c\u7c7b\u4f3c\u4e8e HTTPS\uff0c\u5176\u4e2d wss \u8868\u793a\u5728 TLS \u4e4b\u4e0a\u7684 Websocket\u3002\u5982\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"ws://example.com/wsapi\nwss://secure.example.com/\n")),(0,o.kt)("p",null,"Websocket \u4f7f\u7528\u548c HTTP \u76f8\u540c\u7684 TCP \u7aef\u53e3\uff0c\u53ef\u4ee5\u7ed5\u8fc7\u5927\u591a\u6570\u9632\u706b\u5899\u7684\u9650\u5236\u3002\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0cWebsocket \u534f\u8bae\u4f7f\u7528 80 \u7aef\u53e3\uff1b\u8fd0\u884c\u5728 TLS \u4e4b\u4e0a\u65f6\uff0c\u9ed8\u8ba4\u4f7f\u7528 443 \u7aef\u53e3\u3002"),(0,o.kt)("p",null,"\u4e00\u4e2a\u5178\u578b\u7684 Websocket \u63e1\u624b\u8bf7\u6c42\u5982\u4e0b\uff1a"),(0,o.kt)("p",null,"\u5ba2\u6237\u7aef\u8bf7\u6c42"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"GET / HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade\nHost: example.com\nOrigin: http://example.com\nSec-WebSocket-Key: sN9cRrP/n9NdMgdcy2VJFQ==\nSec-WebSocket-Version: 13\n")),(0,o.kt)("p",null,"\u670d\u52a1\u5668\u56de\u5e94"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: fFBooB7FAkLlXgRSz0BT3v4hq5s=\nSec-WebSocket-Location: ws://example.com/\n")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Connection \u5fc5\u987b\u8bbe\u7f6e Upgrade\uff0c\u8868\u793a\u5ba2\u6237\u7aef\u5e0c\u671b\u8fde\u63a5\u5347\u7ea7\u3002"),(0,o.kt)("li",{parentName:"ul"},"Upgrade \u5b57\u6bb5\u5fc5\u987b\u8bbe\u7f6e Websocket\uff0c\u8868\u793a\u5e0c\u671b\u5347\u7ea7\u5230 Websocket \u534f\u8bae\u3002"),(0,o.kt)("li",{parentName:"ul"},"Sec-WebSocket-Key \u662f\u968f\u673a\u7684\u5b57\u7b26\u4e32\uff0c\u670d\u52a1\u5668\u7aef\u4f1a\u7528\u8fd9\u4e9b\u6570\u636e\u6765\u6784\u9020\u51fa\u4e00\u4e2a SHA-1 \u7684\u4fe1\u606f\u6458\u8981\u3002\u628a \u201cSec-WebSocket-Key\u201d \u52a0\u4e0a\u4e00\u4e2a\u7279\u6b8a\u5b57\u7b26\u4e32 \u201c258EAFA5-E914-47DA-95CA-C5AB0DC85B11\u201d\uff0c\u7136\u540e\u8ba1\u7b97 SHA-1 \u6458\u8981\uff0c\u4e4b\u540e\u8fdb\u884c BASE-64 \u7f16\u7801\uff0c\u5c06\u7ed3\u679c\u505a\u4e3a \u201cSec-WebSocket-Accept\u201d \u5934\u7684\u503c\uff0c\u8fd4\u56de\u7ed9\u5ba2\u6237\u7aef\u3002\u5982\u6b64\u64cd\u4f5c\uff0c\u53ef\u4ee5\u5c3d\u91cf\u907f\u514d\u666e\u901a HTTP \u8bf7\u6c42\u88ab\u8bef\u8ba4\u4e3a Websocket \u534f\u8bae\u3002"),(0,o.kt)("li",{parentName:"ul"},"Sec-WebSocket-Version \u8868\u793a\u652f\u6301\u7684 Websocket \u7248\u672c\u3002RFC6455 \u8981\u6c42\u4f7f\u7528\u7684\u7248\u672c\u662f 13\uff0c\u4e4b\u524d\u8349\u6848\u7684\u7248\u672c\u5747\u5e94\u5f53\u5f03\u7528\u3002"),(0,o.kt)("li",{parentName:"ul"},"Origin \u5b57\u6bb5\u662f\u53ef\u9009\u7684\uff0c\u901a\u5e38\u7528\u6765\u8868\u793a\u5728\u6d4f\u89c8\u5668\u4e2d\u53d1\u8d77\u6b64 Websocket \u8fde\u63a5\u6240\u5728\u7684\u9875\u9762\uff0c\u7c7b\u4f3c\u4e8e Referer\u3002\u4f46\u662f\uff0c\u4e0e Referer \u4e0d\u540c\u7684\u662f\uff0cOrigin \u53ea\u5305\u542b\u4e86\u534f\u8bae\u548c\u4e3b\u673a\u540d\u79f0\u3002"),(0,o.kt)("li",{parentName:"ul"},"\u5176\u4ed6\u4e00\u4e9b\u5b9a\u4e49\u5728 HTTP \u534f\u8bae\u4e2d\u7684\u5b57\u6bb5\uff0c\u5982 Cookie \u7b49\uff0c\u4e5f\u53ef\u4ee5\u5728 Websocket \u4e2d\u4f7f\u7528\u3002")))}b.isMDXComponent=!0},3203:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/ws-1e1c5b0a6234f98dca2a38542e0d2f1a.png"}}]);