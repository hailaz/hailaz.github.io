"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[8931],{1656:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>s,metadata:()=>r,toc:()=>g});var l=t(7462),a=(t(7294),t(3905)),o=t(4915);const s={title:"\u8bed\u8a00\u6280\u5de7"},i=void 0,r={unversionedId:"learn/go/1",id:"learn/go/1",title:"\u8bed\u8a00\u6280\u5de7",description:"gofmt \u683c\u5f0f\u5316\u4ee3\u7801",source:"@site/docs/learn/go/1.md",sourceDirName:"learn/go",slug:"/learn/go/1",permalink:"/docs/learn/go/1",draft:!1,editUrl:"https://github.com/hailaz/hailaz.github.io/blob/master/docs/learn/go/1.md",tags:[],version:"current",frontMatter:{title:"\u8bed\u8a00\u6280\u5de7"},sidebar:"learn",previous:{title:"\u5b66\u4e60\u8d44\u6599",permalink:"/docs/learn/go/index"},next:{title:"\u603b\u7ed3",permalink:"/docs/learn/go/2"}},u={},g=[{value:"gofmt \u683c\u5f0f\u5316\u4ee3\u7801",id:"gofmt-\u683c\u5f0f\u5316\u4ee3\u7801",level:2},{value:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5 json \u8f93\u51fa",id:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5-json-\u8f93\u51fa",level:2},{value:"github action \u4f7f\u7528 ubuntu-latest \u6267\u884c make xxx \u64cd\u4f5c\u65f6\uff0c\u9700\u8981\u5728 Makefile \u6307\u5b9a shell",id:"github-action-\u4f7f\u7528-ubuntu-latest-\u6267\u884c-make-xxx-\u64cd\u4f5c\u65f6\u9700\u8981\u5728-makefile-\u6307\u5b9a-shell",level:2},{value:"go get \u6307\u5b9a\u7248\u672c",id:"go-get-\u6307\u5b9a\u7248\u672c",level:2},{value:"\u6784\u5efa",id:"\u6784\u5efa",level:2},{value:"windows",id:"windows",level:3},{value:"\u76ee\u6807\u5e73\u53f0",id:"\u76ee\u6807\u5e73\u53f0",level:3},{value:"pprof \u4f7f\u7528",id:"pprof-\u4f7f\u7528",level:2},{value:"\u5224\u65ad\u662f\u5426 Windows \u53cc\u51fb\u542f\u52a8",id:"\u5224\u65ad\u662f\u5426-windows-\u53cc\u51fb\u542f\u52a8",level:2}],p={toc:g};function d(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,l.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"gofmt-\u683c\u5f0f\u5316\u4ee3\u7801"},"gofmt \u683c\u5f0f\u5316\u4ee3\u7801"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"gofmt -s -w xxx.go\n")),(0,a.kt)("h2",{id:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5-json-\u8f93\u51fa"},"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5 json \u8f93\u51fa"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},'type User struct {\n Pwd string `json:"pwd"`\n Age int    `json:"age"`\n}\n\ntype UserOut struct {\n User\n Pwd *struct{} `json:"pwd,omitempty"`// \u8fd9\u91cc\u7684\u5b57\u6bb5json\u540d\u9700\u8981\u548c\u5d4c\u5957\u7684\u5b57\u6bb5json\u540d\u4e00\u81f4\uff0c\u5426\u5219\u65e0\u6548\n}\n\nfunc TestJson(t *testing.T) {\n u := User{Pwd: "123", Age: 1}\n bb := UserOut{User: u}\n b, _ := json.MarshalIndent(bb, "", "    ")\n t.Log(string(b))\n}\n')),(0,a.kt)("h2",{id:"github-action-\u4f7f\u7528-ubuntu-latest-\u6267\u884c-make-xxx-\u64cd\u4f5c\u65f6\u9700\u8981\u5728-makefile-\u6307\u5b9a-shell"},"github action \u4f7f\u7528 ubuntu-latest \u6267\u884c make xxx \u64cd\u4f5c\u65f6\uff0c\u9700\u8981\u5728 Makefile \u6307\u5b9a shell"),(0,a.kt)("p",null,"\u5728\u9996\u884c\u6dfb\u52a0"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-makefile"},"SHELL := /bin/bash\n")),(0,a.kt)("h2",{id:"go-get-\u6307\u5b9a\u7248\u672c"},"go get \u6307\u5b9a\u7248\u672c"),(0,a.kt)("p",null,"\u4ece Go 1.11 \u5f00\u59cb\uff0c\u4f7f\u7528 Go modules \u53ef\u4ee5\u505a\u5230\u8fd9\u4e00\u70b9\u3002\u5728\u4e3a Go \u6a21\u5757\u5b89\u88c5\u4f9d\u8d56\u9879\u65f6\uff0c\u4f60\u53ef\u4ee5\u6307\u5b9a\u4e00\u4e2a\u6a21\u5757\u67e5\u8be2\uff0c\u5176\u4e2d\u53ef\u80fd\u5305\u542b\u5206\u652f\u6216\u6807\u8bb0\u540d\u79f0\uff1a"),(0,a.kt)("p",null,"\u62c9\u53d6\u6700\u65b0\u7684\u7248\u672c(\u4f18\u5148\u62e9\u53d6 tag)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@latest\n")),(0,a.kt)("p",null,"\u62c9\u53d6 master \u5206\u652f\u7684\u6700\u65b0 commit"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@master\n")),(0,a.kt)("p",null,"\u62c9\u53d6 tag \u4e3a v0.3.2 \u7684 commit"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@v0.3.2\n")),(0,a.kt)("p",null,"\u62c9\u53d6 hash \u4e3a 342b231 \u7684 commit\uff0c\u6700\u7ec8\u4f1a\u88ab\u8f6c\u6362\u4e3a v0.3.2\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@342b2e\n")),(0,a.kt)("p",null,"\u6307\u5b9a\u7248\u672c\u62c9\u53d6\uff0c\u62c9\u53d6 v3 \u7248\u672c"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"go get github.com/smartwalle/alipay/v3\n")),(0,a.kt)("h2",{id:"\u6784\u5efa"},"\u6784\u5efa"),(0,a.kt)("h3",{id:"windows"},"windows"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"set GOOS=linux\nset GOARCH=amd64\n")),(0,a.kt)("h3",{id:"\u76ee\u6807\u5e73\u53f0"},"\u76ee\u6807\u5e73\u53f0"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://golang.google.cn/doc/install/source"},"https://golang.google.cn/doc/install/source")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"darwin    amd64\ndarwin    arm64\nios       amd64\nios       arm64\nfreebsd   386\nfreebsd   amd64\nfreebsd   arm\nlinux     386\nlinux     amd64\nlinux     arm\nlinux     arm64\nlinux     ppc64\nlinux     ppc64le\nlinux     mips\nlinux     mipsle\nlinux     mips64\nlinux     mips64le\nnetbsd    386\nnetbsd    amd64\nnetbsd    arm\nopenbsd   386\nopenbsd   amd64\nopenbsd   arm\nwindows   386\nwindows   amd64\nandroid   arm\ndragonfly amd64\nplan9     386\nplan9     amd64\nsolaris   amd64\n")),(0,a.kt)("h2",{id:"pprof-\u4f7f\u7528"},"pprof \u4f7f\u7528"),(0,a.kt)("p",null,"gf \u7684\u914d\u7f6e\u65b9\u5f0f\uff0c",(0,a.kt)("a",{parentName:"p",href:"https://goframe.org/pages/viewpage.action?pageId=1114350"},"https://goframe.org/pages/viewpage.action?pageId=1114350")),(0,a.kt)("p",null,"\u5f00\u542f\u540e\u4f7f\u7528\u89c6\u56fe\u5f62\u5f0f\u67e5\u770b"),(0,a.kt)("p",null,"\u9700\u8981\u4e0b\u8f7d\u5b89\u88c5",(0,a.kt)("a",{parentName:"p",href:"https://www.graphviz.org/download/"},"graphviz")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'go tool pprof -http="127.0.0.1:8080"  http://127.0.0.1:8000/debug/pprof/heap\n')),(0,a.kt)("h2",{id:"\u5224\u65ad\u662f\u5426-windows-\u53cc\u51fb\u542f\u52a8"},"\u5224\u65ad\u662f\u5426 Windows \u53cc\u51fb\u542f\u52a8"),(0,a.kt)(o.Z,{language:"go",mdxType:"CodeBlock"},'// +build windows\n\n//go:generate go build -ldflags "-s -w -extldflags \'-static\'" $GOFILE\npackage main\n\nimport (\n\t"fmt"\n\t"syscall"\n\t"unsafe"\n)\n\nfunc main() {\n\tclickRun := isDoubleClickRun()\n\tfmt.Println("Double click run:", clickRun)\n\tif clickRun {\n\t\tfmt.Print("press Enter to exit")\n\t\tvar b byte\n\t\t_, _ = fmt.Scanf("%v", &b)\n\t}\n}\n\n// Detect if windows golang executable file is running via double click or from cmd/shell terminator\n//  https://stackoverflow.com/questions/8610489/distinguish-if-program-runs-by-clicking-on-the-icon-typing-its-name-in-the-cons?rq=1\n//  https://github.com/shirou/w32/blob/master/kernel32.go\n//  https://github.com/kbinani/win/blob/master/kernel32.go#L3268\n//  win.GetConsoleProcessList(new(uint32), win.DWORD(2))\nfunc isDoubleClickRun() bool {\n\tkernel32 := syscall.NewLazyDLL("kernel32.dll")\n\tlp := kernel32.NewProc("GetConsoleProcessList")\n\tif lp != nil {\n\t\tvar pids [2]uint32\n\t\tvar maxCount uint32 = 2\n\t\tret, _, _ := lp.Call(uintptr(unsafe.Pointer(&pids)), uintptr(maxCount))\n\t\tif ret > 1 {\n\t\t\treturn false\n\t\t}\n\t}\n\treturn true\n}'))}d.isMDXComponent=!0}}]);