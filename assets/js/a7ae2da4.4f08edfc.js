"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[3507],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var l=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,l,a=function(e,t){if(null==e)return{};var n,l,a={},r=Object.keys(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)n=r[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=l.createContext({}),c=function(e){var t=l.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return l.createElement(p.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return l.createElement(l.Fragment,{},t)}},s=l.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,p=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),s=c(n),d=a,k=s["".concat(p,".").concat(d)]||s[d]||h[d]||r;return n?l.createElement(k,i(i({ref:t},u),{},{components:n})):l.createElement(k,i({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,i=new Array(r);i[0]=s;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var c=2;c<r;c++)i[c]=n[c];return l.createElement.apply(null,i)}return l.createElement.apply(null,n)}s.displayName="MDXCreateElement"},4195:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>o,toc:()=>c});var l=n(7462),a=(n(7294),n(3905));const r={layout:"post",title:"\u603b\u7ed3"},i=void 0,o={unversionedId:"learn/go/2",id:"learn/go/2",title:"\u603b\u7ed3",description:"\u57fa\u7840",source:"@site/docs/learn/go/2.md",sourceDirName:"learn/go",slug:"/learn/go/2",permalink:"/docs/learn/go/2",draft:!1,editUrl:"https://github.com/hailaz/hailaz.github.io/blob/master/docs/learn/go/2.md",tags:[],version:"current",frontMatter:{layout:"post",title:"\u603b\u7ed3"},sidebar:"learn",previous:{title:"\u8bed\u8a00\u6280\u5de7",permalink:"/docs/learn/go/1"},next:{title:"\u6587\u6863\u56e2\u961f Golang \u6700\u4f73\u5b9e\u8df5 & CR \u6848\u4f8b\u96c6",permalink:"/docs/learn/go/\u6587\u7ae0\u6458\u5f55/\u6587\u6863\u56e2\u961fGolangCR\u6848\u4f8b\u96c6&\u6700\u4f73\u5b9e\u8df5"}},p={},c=[{value:"\u57fa\u7840",id:"\u57fa\u7840",level:2},{value:"\u8bed\u8a00",id:"\u8bed\u8a00",level:3},{value:"\u6570\u636e\u7c7b\u578b",id:"\u6570\u636e\u7c7b\u578b",level:4},{value:"Goroutine",id:"goroutine",level:4},{value:"GPM \u6a21\u578b",id:"gpm-\u6a21\u578b",level:4},{value:"GC \u7684\u8fed\u4ee3",id:"gc-\u7684\u8fed\u4ee3",level:4},{value:"Slice",id:"slice",level:4},{value:"Chan",id:"chan",level:4},{value:"Map",id:"map",level:4},{value:"Interface",id:"interface",level:4},{value:"Mutex",id:"mutex",level:4},{value:"Defer Panic Recover",id:"defer-panic-recover",level:4},{value:"\u7f51\u7edc",id:"\u7f51\u7edc",level:3},{value:"TCP/IP",id:"tcpip",level:4},{value:"HTTP(S)",id:"https",level:4},{value:"Websocket",id:"websocket",level:4},{value:"\u6570\u636e\u5e93",id:"\u6570\u636e\u5e93",level:3},{value:"SQL",id:"sql",level:4},{value:"NoSQL - not only SQL",id:"nosql---not-only-sql",level:4},{value:"\u8fdb\u9636",id:"\u8fdb\u9636",level:2},{value:"\u8bed\u8a00",id:"\u8bed\u8a00-1",level:3},{value:"\u5185\u5b58\u6a21\u578b",id:"\u5185\u5b58\u6a21\u578b",level:4},{value:"\u7b97\u6cd5",id:"\u7b97\u6cd5",level:3},{value:"Nginx",id:"nginx",level:3},{value:"Docker",id:"docker",level:3},{value:"RPC",id:"rpc",level:3},{value:"gRPC \u57fa\u7840\u6982\u5ff5\u8be6\u89e3 https://mp.weixin.qq.com/s/I2QHEBO26nGqhGwIw281Pg",id:"grpc-\u57fa\u7840\u6982\u5ff5\u8be6\u89e3-httpsmpweixinqqcomsi2qhebo26ngqhgwiw281pg",level:4},{value:"\u9762\u8bd5\u9898",id:"\u9762\u8bd5\u9898",level:3}],u={toc:c};function h(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,l.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"\u57fa\u7840"},"\u57fa\u7840"),(0,a.kt)("h3",{id:"\u8bed\u8a00"},"\u8bed\u8a00"),(0,a.kt)("h4",{id:"\u6570\u636e\u7c7b\u578b"},"\u6570\u636e\u7c7b\u578b"),(0,a.kt)("p",null,"\u6570\u636e\u7c7b\u578b\u5206\u4e3a\u56db\u7c7b\uff1a\u57fa\u7840\u7c7b\u578b\u3001\u590d\u5408\u7c7b\u578b\u3001\u5f15\u7528\u7c7b\u578b\u548c\u63a5\u53e3\u7c7b\u578b\u3002"),(0,a.kt)("p",null,"\u57fa\u7840\u7c7b\u578b\uff0c\u5305\u62ec\uff1a\u6570\u5b57\u3001\u5b57\u7b26\u4e32\u548c\u5e03\u5c14\u578b"),(0,a.kt)("p",null,"\u590d\u5408\u6570\u636e\uff0c\u7c7b\u578b\u2014\u2014\u6570\u7ec4\u548c\u7ed3\u6784\u4f53\u2014\u2014\u662f\u901a\u8fc7\u7ec4\u5408\u7b80\u5355\u7c7b\u578b\uff0c\u6765\u8868\u8fbe\u66f4\u52a0\u590d\u6742\u7684\u6570\u636e\u7ed3\u6784\u3002"),(0,a.kt)("p",null,"\u5f15\u7528\u7c7b\u578b\uff0c\u5305\u62ec\u6307\u9488\u3001\u5207\u7247\u3001\u5b57\u5178\u3001\u51fd\u6570\u3001\u901a\u9053"),(0,a.kt)("p",null,"\u63a5\u53e3\u7c7b\u578b\uff0c\u662f\u5bf9\u5176\u5b83\u7c7b\u578b\u884c\u4e3a\u7684\u62bd\u8c61\u548c\u6982\u62ec"),(0,a.kt)("h4",{id:"goroutine"},"Goroutine"),(0,a.kt)("p",null,"\u8fdb\u7a0b\uff1a\u8fdb\u7a0b\u662f\u7cfb\u7edf\u8fdb\u884c\u8d44\u6e90\u5206\u914d\u7684\u57fa\u672c\u5355\u4f4d\uff0c\u6709\u72ec\u7acb\u7684\u5185\u5b58\u7a7a\u95f4\u3002"),(0,a.kt)("p",null,"\u7ebf\u7a0b\uff1a\u7ebf\u7a0b\u662f CPU \u8c03\u5ea6\u548c\u5206\u6d3e\u7684\u57fa\u672c\u5355\u4f4d\uff0c\u7ebf\u7a0b\u4f9d\u9644\u4e8e\u8fdb\u7a0b\u5b58\u5728\uff0c\u6bcf\u4e2a\u7ebf\u7a0b\u4f1a\u5171\u4eab\u7236\u8fdb\u7a0b\u7684\u8d44\u6e90\u3002"),(0,a.kt)("p",null,"\u534f\u7a0b\uff1a\u534f\u7a0b\u662f\u4e00\u79cd\u7528\u6237\u6001\u7684\u8f7b\u91cf\u7ea7\u7ebf\u7a0b\uff0c\u534f\u7a0b\u7684\u8c03\u5ea6\u5b8c\u5168\u7531\u7528\u6237\u63a7\u5236\uff0c\u534f\u7a0b\u95f4\u5207\u6362\u53ea\u9700\u8981\u4fdd\u5b58\u4efb\u52a1\u7684\u4e0a\u4e0b\u6587\uff0c\u6ca1\u6709\u5185\u6838\u7684\u5f00\u9500\u3002"),(0,a.kt)("p",null,"Golang \u7684 goroutine \u662f\u5982\u4f55\u5b9e\u73b0\u7684\uff1f - \u77e5\u4e4e ",(0,a.kt)("a",{parentName:"p",href:"https://www.zhihu.com/question/20862617"},"https://www.zhihu.com/question/20862617")),(0,a.kt)("h4",{id:"gpm-\u6a21\u578b"},"GPM \u6a21\u578b"),(0,a.kt)("p",null,"Go \u5b66\u4e60\u603b\u7ed3\u4e4b GPM \u6a21\u578b - \u77e5\u4e4e ",(0,a.kt)("a",{parentName:"p",href:"https://zhuanlan.zhihu.com/p/261807834"},"https://zhuanlan.zhihu.com/p/261807834")),(0,a.kt)("p",null,"G:Goroutine\uff0c\u6bcf\u4e2a Goroutine \u5bf9\u5e94\u4e00\u4e2a G \u7ed3\u6784\u4f53\uff0cG \u5b58\u50a8 Goroutine \u7684\u8fd0\u884c\u5806\u6808\u3001\u72b6\u6001\u4ee5\u53ca\u4efb\u52a1\u51fd\u6570\uff0c\u53ef\u91cd\u7528\u3002G \u5e76\u975e\u6267\u884c\u4f53\uff0c\u6bcf\u4e2a G \u9700\u8981\u7ed1\u5b9a\u5230 P \u624d\u80fd\u88ab\u8c03\u5ea6\u6267\u884c\u3002"),(0,a.kt)("p",null,"P: Processor\uff0c\u8868\u793a\u903b\u8f91\u5904\u7406\u5668\uff0c\u5bf9 G \u6765\u8bf4\uff0cP \u76f8\u5f53\u4e8e CPU \u6838\uff0cG \u53ea\u6709\u7ed1\u5b9a\u5230 P \u624d\u80fd\u88ab\u8c03\u5ea6\u3002\u5bf9 M \u6765\u8bf4\uff0cP \u63d0\u4f9b\u4e86\u76f8\u5173\u7684\u6267\u884c\u73af\u5883(Context)\uff0c\u5982\u5185\u5b58\u5206\u914d\u72b6\u6001(mcache)\uff0c\u4efb\u52a1\u961f\u5217(G)\u7b49\u3002P \u7684\u6570\u91cf\u51b3\u5b9a\u4e86\u7cfb\u7edf\u5185\u6700\u5927\u53ef\u5e76\u884c\u7684 G \u7684\u6570\u91cf\uff08\u524d\u63d0\uff1a\u7269\u7406 CPU \u6838\u6570 >= P \u7684\u6570\u91cf\uff09\u3002P \u7684\u6570\u91cf\u7531\u7528\u6237\u8bbe\u7f6e\u7684 GoMAXPROCS \u51b3\u5b9a\uff0c\u4f46\u662f\u4e0d\u8bba GoMAXPROCS \u8bbe\u7f6e\u4e3a\u591a\u5927\uff0cP \u7684\u6570\u91cf\u6700\u5927\u4e3a 256\u3002"),(0,a.kt)("p",null,"M: Machine\uff0cOS \u5185\u6838\u7ebf\u7a0b\u62bd\u8c61\uff0c\u4ee3\u8868\u7740\u771f\u6b63\u6267\u884c\u8ba1\u7b97\u7684\u8d44\u6e90\uff0c\u5728\u7ed1\u5b9a\u6709\u6548\u7684 P \u540e\uff0c\u8fdb\u5165 schedule \u5faa\u73af\uff1b\u800c schedule \u5faa\u73af\u7684\u673a\u5236\u5927\u81f4\u662f\u4ece Global \u961f\u5217\u3001P \u7684 Local \u961f\u5217\u4ee5\u53ca wait \u961f\u5217\u4e2d\u83b7\u53d6\u3002M \u7684\u6570\u91cf\u662f\u4e0d\u5b9a\u7684\uff0c\u7531 Go Runtime \u8c03\u6574\uff0c\u4e3a\u4e86\u9632\u6b62\u521b\u5efa\u8fc7\u591a OS \u7ebf\u7a0b\u5bfc\u81f4\u7cfb\u7edf\u8c03\u5ea6\u4e0d\u8fc7\u6765\uff0c\u76ee\u524d\u9ed8\u8ba4\u6700\u5927\u9650\u5236\u4e3a 10000 \u4e2a\u3002M \u5e76\u4e0d\u4fdd\u7559 G \u72b6\u6001\uff0c\u8fd9\u662f G \u53ef\u4ee5\u8de8 M \u8c03\u5ea6\u7684\u57fa\u7840\u3002"),(0,a.kt)("p",null,"Sched\uff1aGo \u8c03\u5ea6\u5668\uff0c\u5b83\u7ef4\u62a4\u6709\u5b58\u50a8 M \u548c G \u7684\u961f\u5217\u4ee5\u53ca\u8c03\u5ea6\u5668\u7684\u4e00\u4e9b\u72b6\u6001\u4fe1\u606f\u7b49\u3002"),(0,a.kt)("p",null,"\u8c03\u5ea6\u5668\u5faa\u73af\u7684\u673a\u5236\u5927\u81f4\u662f\u4ece\u5404\u79cd\u961f\u5217\u3001P \u7684\u672c\u5730\u961f\u5217\u4e2d\u83b7\u53d6 G\uff0c\u5207\u6362\u5230 G \u7684\u6267\u884c\u6808\u4e0a\u5e76\u6267\u884c G \u7684\u51fd\u6570\uff0c\u8c03\u7528 Goexit \u505a\u6e05\u7406\u5de5\u4f5c\u5e76\u56de\u5230 M\uff0c\u5982\u6b64\u53cd\u590d\u3002"),(0,a.kt)("h4",{id:"gc-\u7684\u8fed\u4ee3"},"GC \u7684\u8fed\u4ee3"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"go1.1\uff0c\u63d0\u9ad8\u6548\u7387\u548c\u5783\u573e\u56de\u6536\u7cbe\u786e\u5ea6\u3002\n\u6807\u8bb0-\u6e05\u9664(mark and sweep)\u7b97\u6cd5\n\ngo1.3\uff0c\u63d0\u9ad8\u4e86\u5783\u573e\u56de\u6536\u7684\u7cbe\u786e\u5ea6\u3002\ngo1.4\uff0c\u4e4b\u524d\u7248\u672c\u7684runtime\u5927\u90e8\u5206\u662f\u4f7f\u7528C\u5199\u7684\uff0c\u8fd9\u4e2a\u7248\u672c\u5927\u91cf\u4f7f\u7528Go\u8fdb\u884c\u4e86\u91cd\u5199\uff0c\u8ba9GC\u6709\u4e86\u626b\u63cfstack\u7684\u80fd\u529b\uff0c\u8fdb\u4e00\u6b65\u63d0\u9ad8\u4e86\u5783\u573e\u56de\u6536\u7684\u7cbe\u786e\u5ea6\u3002\ngo1.5\uff0c\u76ee\u6807\u662f\u964d\u4f4eGC\u5ef6\u8fdf\uff0c\u91c7\u7528\u4e86\u5e76\u53d1\u6807\u8bb0\u548c\u5e76\u53d1\u6e05\u9664\uff0c\u4e09\u8272\u6807\u8bb0\uff0cwrite barrier\uff0c\u4ee5\u53ca\u5b9e\u73b0\u4e86\u66f4\u597d\u7684\u56de\u6536\u5668\u8c03\u5ea6\uff0c\u8bbe\u8ba1\u6587\u68631\uff0c\u6587\u68632\uff0c\u4ee5\u53ca2015 \u7248\u7684Go talk\u3002\n\u4e09\u8272\u6807\u8bb0\u2014\u2014\u201c\u5f3a-\u5f31\u201d \u4e09\u8272\u4e0d\u53d8\u5f0f\u3001\u63d2\u5165\u5c4f\u969c\u3001\u5220\u9664\u5c4f\u969c\n\ngo1.6\uff0c\u5c0f\u4f18\u5316\uff0c\u5f53\u7a0b\u5e8f\u4f7f\u7528\u5927\u91cf\u5185\u5b58\u65f6\uff0cGC\u6682\u505c\u65f6\u95f4\u6709\u6240\u964d\u4f4e\u3002\ngo1.7\uff0c\u5c0f\u4f18\u5316\uff0c\u5f53\u7a0b\u5e8f\u6709\u5927\u91cf\u7a7a\u95f2goroutine\uff0cstack\u5927\u5c0f\u6ce2\u52a8\u6bd4\u8f83\u5927\u65f6\uff0cGC\u6682\u505c\u65f6\u95f4\u6709\u663e\u8457\u964d\u4f4e\u3002\ngo1.8\uff0cwrite barrier\u5207\u6362\u5230hybrid write barrier\uff0c\u4ee5\u6d88\u9664STW\u4e2d\u7684re-scan\uff0c\u628aSTW\u7684\u6700\u5dee\u60c5\u51b5\u964d\u4f4e\u523050us\uff0c\u8bbe\u8ba1\u6587\u6863\u3002\n\u4e09\u8272\u6807\u8bb0\u2014\u2014\u6df7\u5408\u5c4f\u969c\n\ngo1.9\uff0c\u63d0\u5347\u6307\u6807\u6bd4\u8f83\u591a\uff0c\uff081\uff09\u8fc7\u53bb runtime.GC, debug.SetGCPercent, \u548c debug.FreeOSMemory\u90fd\u4e0d\u80fd\u89e6\u53d1\u5e76\u53d1GC\uff0c\u4ed6\u4eec\u89e6\u53d1\u7684GC\u90fd\u662f\u963b\u585e\u7684\uff0cgo1.9\u53ef\u4ee5\u4e86\uff0c\u53d8\u6210\u4e86\u5728\u5783\u573e\u56de\u6536\u4e4b\u524d\u53ea\u963b\u585e\u8c03\u7528GC\u7684goroutine\u3002\uff082\uff09debug.SetGCPercent\u53ea\u5728\u6709\u5fc5\u8981\u7684\u60c5\u51b5\u4e0b\u624d\u4f1a\u89e6\u53d1GC\u3002\ngo.1.10\uff0c\u5c0f\u4f18\u5316\uff0c\u52a0\u901f\u4e86GC\uff0c\u7a0b\u5e8f\u5e94\u5f53\u8fd0\u884c\u66f4\u5feb\u4e00\u70b9\u70b9\u3002\ngo1.12\uff0c\u663e\u8457\u63d0\u9ad8\u4e86\u5806\u5185\u5b58\u5b58\u5728\u5927\u788e\u7247\u60c5\u51b5\u4e0b\u7684sweeping\u6027\u80fd\uff0c\u80fd\u591f\u964d\u4f4eGC\u540e\u7acb\u5373\u5206\u914d\u5185\u5b58\u7684\u5ef6\u8fdf\u3002\ngo1.13\uff0c\u7740\u624b\u89e3\u51b3\u5411\u64cd\u4f5c\u7cfb\u7edf\u5f52\u8fd8\u5185\u5b58\u7684\uff0c\u63d0\u51fa\u4e86\u65b0\u7684 Scavenger\ngo1.14\uff0c\u66ff\u4ee3\u4e86\u4ec5\u5b58\u6d3b\u4e86\u4e00\u4e2a\u7248\u672c\u7684 Scavenger\uff0c\u5168\u65b0\u7684\u9875\u5206\u914d\u5668\uff0c\u4f18\u5316\u5206\u914d\u5185\u5b58\u8fc7\u7a0b\u7684\u901f\u7387\u4e0e\u73b0\u6709\u7684\u6269\u5c55\u6027\u95ee\u9898\uff0c\u5e76\u5f15\u5165\u4e86\u5f02\u6b65\u62a2\u5360\uff0c\u89e3\u51b3\u4e86\u7531\u4e8e\u5bc6\u96c6\u5faa\u73af\u5bfc\u81f4\u7684 STW \u65f6\u95f4\u8fc7\u957f\u7684\u95ee\u9898\ngo gc\u5783\u573e\u56de\u6536\u2014\u2014\u4e09\u8272\u6807\u8bb0\u3001\u6df7\u5408\u5199\u5c4f\u969c - \u7b80\u4e66 https://www.jianshu.com/p/ff3d6da5d71a\n\ngolang gc| go\u8bed\u8a00gc\u8be6\u89e3 - \u77e5\u4e4e https://zhuanlan.zhihu.com/p/115143370\n")),(0,a.kt)("h4",{id:"slice"},"Slice"),(0,a.kt)("p",null,"\u6570\u7ec4\u548c\u5207\u7247\u7684\u533a\u522b"),(0,a.kt)("p",null,"\u5207\u7247\u5305\u542b\u4e86\u4e00\u4e2a\u6570\u7ec4\u548c\u5b83\u7684\u957f\u5ea6\u4ee5\u53ca\u5bb9\u91cf\u6570\u636e\u3002"),(0,a.kt)("p",null,"\u6269\u5bb9\u89c4\u5219\uff0ccap<1024 \u7ffb\u500d\u6269\u5bb9\uff0ccap>=1024 \u539f\u6765\u5bb9\u91cf\u7684\u56db\u5206\u4e4b\u4e00\u6269\u5bb9"),(0,a.kt)("p",null,"range \u7684\u65f6\u5019\uff0cvalue \u662f\u4e00\u4e2a\u5c40\u90e8\u53d8\u91cf"),(0,a.kt)("p",null,"\u6df1\u5165\u89e3\u6790 Go \u4e2d Slice \u5e95\u5c42\u5b9e\u73b0 - \u7b80\u4e66 ",(0,a.kt)("a",{parentName:"p",href:"https://www.jianshu.com/p/030aba2bff41"},"https://www.jianshu.com/p/030aba2bff41")),(0,a.kt)("h4",{id:"chan"},"Chan"),(0,a.kt)("p",null,"chan \u8c01\u53d1\u9001\u8c01\u5173\u95ed"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:"left"},"\u64cd\u4f5c"),(0,a.kt)("th",{parentName:"tr",align:"center"},"nil channel"),(0,a.kt)("th",{parentName:"tr",align:"right"},"closed channel"),(0,a.kt)("th",{parentName:"tr",align:"right"},"not-closed non-nil channel"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"close"),(0,a.kt)("td",{parentName:"tr",align:"center"},"panic"),(0,a.kt)("td",{parentName:"tr",align:"right"},"panic"),(0,a.kt)("td",{parentName:"tr",align:"right"},"\u6210\u529f close")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"\u5199 ",(0,a.kt)("inlineCode",{parentName:"td"},"ch <-")),(0,a.kt)("td",{parentName:"tr",align:"center"},"\u4e00\u76f4\u963b\u585e"),(0,a.kt)("td",{parentName:"tr",align:"right"},"panic"),(0,a.kt)("td",{parentName:"tr",align:"right"},"\u963b\u585e\u6216\u6210\u529f\u5199\u5165\u6570\u636e")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:"left"},"\u8bfb ",(0,a.kt)("inlineCode",{parentName:"td"},"<- ch")),(0,a.kt)("td",{parentName:"tr",align:"center"},"\u4e00\u76f4\u963b\u585e"),(0,a.kt)("td",{parentName:"tr",align:"right"},"\u8bfb\u53d6\u5bf9\u5e94\u7c7b\u578b\u96f6\u503c"),(0,a.kt)("td",{parentName:"tr",align:"right"},"\u963b\u585e\u6216\u6210\u529f\u8bfb\u53d6\u6570\u636e")))),(0,a.kt)("h4",{id:"map"},"Map"),(0,a.kt)("p",null,"hash"),(0,a.kt)("h4",{id:"interface"},"Interface"),(0,a.kt)("p",null,"TODO\uff1a"),(0,a.kt)("h4",{id:"mutex"},"Mutex"),(0,a.kt)("p",null,"\u9ad8\u5e76\u53d1 mutex"),(0,a.kt)("h4",{id:"defer-panic-recover"},"Defer Panic Recover"),(0,a.kt)("p",null,"defer - \u5148\u8fdb\u540e\u51fa"),(0,a.kt)("p",null,"recover - \u53ea\u80fd\u63a5\u5f53\u524d routine panic"),(0,a.kt)("h3",{id:"\u7f51\u7edc"},"\u7f51\u7edc"),(0,a.kt)("h4",{id:"tcpip"},"TCP/IP"),(0,a.kt)("p",null,"TCP \u4e09\u6b21\u63e1\u624b \u56db\u6b21\u6325\u624b"),(0,a.kt)("h4",{id:"https"},"HTTP(S)"),(0,a.kt)("p",null,"TODO\uff1a"),(0,a.kt)("h4",{id:"websocket"},"Websocket"),(0,a.kt)("p",null,"TODO\uff1a"),(0,a.kt)("h3",{id:"\u6570\u636e\u5e93"},"\u6570\u636e\u5e93"),(0,a.kt)("p",null,"Sql Or NoSql\uff0c\u770b\u5b8c\u8fd9\u4e00\u7bc7\u4f60\u5c31\u61c2\u4e86 - \u4e94\u6708\u7684\u4ed3\u9889 - \u535a\u5ba2\u56ed ",(0,a.kt)("a",{parentName:"p",href:"https://www.cnblogs.com/xrq730/p/11039384.html"},"https://www.cnblogs.com/xrq730/p/11039384.html")),(0,a.kt)("h4",{id:"sql"},"SQL"),(0,a.kt)("p",null,"MySQL\nTODO\uff1a\u5b9e\u9645\u8bed\u53e5\u7528\u5f97\u5c11\uff0c\u4f46\u662f\u5f88\u591a\u4eba\u95ee\u3002"),(0,a.kt)("h4",{id:"nosql---not-only-sql"},"NoSQL - not only SQL"),(0,a.kt)("p",null,"\u5185\u5b58\u7f13\u5b58-Redis\n\u8fd9\u7bc7 Redis \u6587\u7ae0\uff0c\u56fe\u7075\u770b\u4e86\u90fd\u8bf4\u597d ",(0,a.kt)("a",{parentName:"p",href:"https://mp.weixin.qq.com/s/k8agEub4qmhm3kX_TpETrA"},"https://mp.weixin.qq.com/s/k8agEub4qmhm3kX_TpETrA")),(0,a.kt)("p",null,"\u4e94\u79cd\u6570\u636e\u7c7b\u578b\nString \u6570\u636e\u7c7b\u578b\u3001List \u6570\u636e\u7c7b\u578b\u3001Hash \u6570\u636e\u7c7b\u578b\uff08\u6563\u5217\u7c7b\u578b\uff09\u3001set \u6570\u636e\u7c7b\u578b\uff08\u65e0\u5e8f\u96c6\u5408\uff09\u3001Sorted Set \u6570\u636e\u7c7b\u578b (zset\u3001\u6709\u5e8f\u96c6\u5408)\u3002"),(0,a.kt)("p",null,"\u641c\u7d22\u578b-ElasticSearch\nTODO\uff1a"),(0,a.kt)("p",null,"\u5217\u5f0f-HBase\nTODO\uff1a"),(0,a.kt)("p",null,"\u6587\u6863\u578b-MongoDB\nTODO\uff1a"),(0,a.kt)("h2",{id:"\u8fdb\u9636"},"\u8fdb\u9636"),(0,a.kt)("h3",{id:"\u8bed\u8a00-1"},"\u8bed\u8a00"),(0,a.kt)("h4",{id:"\u5185\u5b58\u6a21\u578b"},"\u5185\u5b58\u6a21\u578b"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://juejin.cn/post/6911126210340716558"},"Golang \u5e76\u53d1\u7f16\u7a0b\u6838\u5fc3\u2014\u5185\u5b58\u53ef\u89c1\u6027")),(0,a.kt)("h3",{id:"\u7b97\u6cd5"},"\u7b97\u6cd5"),(0,a.kt)("p",null,"TODO\uff1a"),(0,a.kt)("h3",{id:"nginx"},"Nginx"),(0,a.kt)("p",null,"Nginx \u6700\u5168\u64cd\u4f5c\u603b\u7ed3 ",(0,a.kt)("a",{parentName:"p",href:"https://mp.weixin.qq.com/s/LmtHTOVOvdcnMBuxv7a9_A"},"https://mp.weixin.qq.com/s/LmtHTOVOvdcnMBuxv7a9_A")),(0,a.kt)("h3",{id:"docker"},"Docker"),(0,a.kt)("p",null,"TODO\uff1a"),(0,a.kt)("h3",{id:"rpc"},"RPC"),(0,a.kt)("p",null,"\u82b1\u4e86\u4e00\u4e2a\u661f\u671f\uff0c\u6211\u7ec8\u4e8e\u628a RPC \u6846\u67b6\u6574\u660e\u767d\u4e86\uff01 - 51CTO.COM ",(0,a.kt)("a",{parentName:"p",href:"https://developer.51cto.com/art/201906/597963.htm#topx"},"https://developer.51cto.com/art/201906/597963.htm#topx")),(0,a.kt)("h4",{id:"grpc-\u57fa\u7840\u6982\u5ff5\u8be6\u89e3-httpsmpweixinqqcomsi2qhebo26ngqhgwiw281pg"},"gRPC \u57fa\u7840\u6982\u5ff5\u8be6\u89e3 ",(0,a.kt)("a",{parentName:"h4",href:"https://mp.weixin.qq.com/s/I2QHEBO26nGqhGwIw281Pg"},"https://mp.weixin.qq.com/s/I2QHEBO26nGqhGwIw281Pg")),(0,a.kt)("h3",{id:"\u9762\u8bd5\u9898"},"\u9762\u8bd5\u9898"),(0,a.kt)("p",null,"Go \u8bed\u8a00\u7b14\u8bd5\u9762\u8bd5\u9898\u6c47\u603b | \u6781\u5ba2\u9762\u8bd5 | \u6781\u5ba2\u5154\u5154 ",(0,a.kt)("a",{parentName:"p",href:"https://geektutu.com/post/qa-golang.html"},"https://geektutu.com/post/qa-golang.html")),(0,a.kt)("p",null,"Golang \u9762\u8bd5\u9898(\u4ece\u57fa\u7840\u5230\u9ad8\u7ea7) ",(0,a.kt)("a",{parentName:"p",href:"https://blog.csdn.net/weixin_34128839/article/details/94488565"},"https://blog.csdn.net/weixin_34128839/article/details/94488565")),(0,a.kt)("p",null,"Golang \u8fdb\u9636\u9762\u8bd5\u9898\u6574\u7406 ",(0,a.kt)("a",{parentName:"p",href:"https://blog.csdn.net/sinat_35406909/article/details/103818364"},"https://blog.csdn.net/sinat_35406909/article/details/103818364")),(0,a.kt)("p",null,"\u4f60\u9047\u5230\u8fc7\u54ea\u4e9b\u9ad8\u8d28\u91cf\u7684 Go \u8bed\u8a00\u9762\u8bd5\u9898\uff1f - \u77e5\u4e4e ",(0,a.kt)("a",{parentName:"p",href:"https://www.zhihu.com/question/60952598"},"https://www.zhihu.com/question/60952598")))}h.isMDXComponent=!0}}]);