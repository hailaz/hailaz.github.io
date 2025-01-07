"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[8931],{1656:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>g,contentTitle:()=>i,default:()=>c,frontMatter:()=>r,metadata:()=>s,toc:()=>p});var l=t(7462),o=(t(7294),t(3905)),a=t(4915);const r={title:"\u8bed\u8a00\u6280\u5de7"},i=void 0,s={unversionedId:"learn/go/1",id:"learn/go/1",title:"\u8bed\u8a00\u6280\u5de7",description:"gofmt \u683c\u5f0f\u5316\u4ee3\u7801",source:"@site/docs/learn/go/1.md",sourceDirName:"learn/go",slug:"/learn/go/1",permalink:"/docs/learn/go/1",draft:!1,editUrl:"https://github.com/hailaz/hailaz.github.io/blob/master/docs/learn/go/1.md",tags:[],version:"current",frontMatter:{title:"\u8bed\u8a00\u6280\u5de7"},sidebar:"learn",previous:{title:"\u5b66\u4e60\u8d44\u6599",permalink:"/docs/learn/go/index"},next:{title:"\u603b\u7ed3",permalink:"/docs/learn/go/2"}},g={},p=[{value:"gofmt \u683c\u5f0f\u5316\u4ee3\u7801",id:"gofmt-\u683c\u5f0f\u5316\u4ee3\u7801",level:2},{value:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5 json \u8f93\u51fa",id:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5-json-\u8f93\u51fa",level:2},{value:"github action \u4f7f\u7528 ubuntu-latest \u6267\u884c make xxx \u64cd\u4f5c\u65f6\uff0c\u9700\u8981\u5728 Makefile \u6307\u5b9a shell",id:"github-action-\u4f7f\u7528-ubuntu-latest-\u6267\u884c-make-xxx-\u64cd\u4f5c\u65f6\u9700\u8981\u5728-makefile-\u6307\u5b9a-shell",level:2},{value:"go get \u6307\u5b9a\u7248\u672c",id:"go-get-\u6307\u5b9a\u7248\u672c",level:2},{value:"\u6e05\u7406 go mod \u7f13\u5b58",id:"\u6e05\u7406-go-mod-\u7f13\u5b58",level:2},{value:"\u67e5\u770b\u6a21\u5757\u6709\u54ea\u4e9b\u7248\u672c",id:"\u67e5\u770b\u6a21\u5757\u6709\u54ea\u4e9b\u7248\u672c",level:2},{value:"go mod \u67e5\u770b\u95f4\u63a5\u4f9d\u8d56\u6765\u6e90",id:"go-mod-\u67e5\u770b\u95f4\u63a5\u4f9d\u8d56\u6765\u6e90",level:2},{value:"\u6784\u5efa",id:"\u6784\u5efa",level:2},{value:"windows",id:"windows",level:3},{value:"GCC",id:"gcc",level:4},{value:"\u76ee\u6807\u5e73\u53f0",id:"\u76ee\u6807\u5e73\u53f0",level:3},{value:"pprof \u4f7f\u7528",id:"pprof-\u4f7f\u7528",level:2},{value:"\u5185\u5b58\u5206\u6790",id:"\u5185\u5b58\u5206\u6790",level:3},{value:"CPU \u5206\u6790",id:"cpu-\u5206\u6790",level:3},{value:"\u663e\u793a init \u987a\u5e8f",id:"\u663e\u793a-init-\u987a\u5e8f",level:2},{value:"\u5224\u65ad\u662f\u5426 Windows \u53cc\u51fb\u542f\u52a8",id:"\u5224\u65ad\u662f\u5426-windows-\u53cc\u51fb\u542f\u52a8",level:2},{value:"protobuf",id:"protobuf",level:2},{value:"\u5e26\u6267\u884c\u6743\u9650",id:"\u5e26\u6267\u884c\u6743\u9650",level:2},{value:"win10 \u4fee\u6539\u65f6\u533a\u62a5\u9519",id:"win10-\u4fee\u6539\u65f6\u533a\u62a5\u9519",level:2},{value:"\u89e6\u53d1 context canceled",id:"\u89e6\u53d1-context-canceled",level:2}],u={toc:p};function c(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,l.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"gofmt-\u683c\u5f0f\u5316\u4ee3\u7801"},"gofmt \u683c\u5f0f\u5316\u4ee3\u7801"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"gofmt -s -w xxx.go\n")),(0,o.kt)("h2",{id:"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5-json-\u8f93\u51fa"},"\u5d4c\u5957\u7ed3\u6784\u4f53\u5c4f\u853d\u6307\u5b9a\u5b57\u6bb5 json \u8f93\u51fa"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},'type User struct {\n Pwd string `json:"pwd"`\n Age int    `json:"age"`\n}\n\ntype UserOut struct {\n User\n Pwd *struct{} `json:"pwd,omitempty"`// \u8fd9\u91cc\u7684\u5b57\u6bb5json\u540d\u9700\u8981\u548c\u5d4c\u5957\u7684\u5b57\u6bb5json\u540d\u4e00\u81f4\uff0c\u5426\u5219\u65e0\u6548\n}\n\nfunc TestJson(t *testing.T) {\n u := User{Pwd: "123", Age: 1}\n bb := UserOut{User: u}\n b, _ := json.MarshalIndent(bb, "", "    ")\n t.Log(string(b))\n}\n')),(0,o.kt)("h2",{id:"github-action-\u4f7f\u7528-ubuntu-latest-\u6267\u884c-make-xxx-\u64cd\u4f5c\u65f6\u9700\u8981\u5728-makefile-\u6307\u5b9a-shell"},"github action \u4f7f\u7528 ubuntu-latest \u6267\u884c make xxx \u64cd\u4f5c\u65f6\uff0c\u9700\u8981\u5728 Makefile \u6307\u5b9a shell"),(0,o.kt)("p",null,"\u5728\u9996\u884c\u6dfb\u52a0"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-makefile"},"SHELL := /bin/bash\n")),(0,o.kt)("h2",{id:"go-get-\u6307\u5b9a\u7248\u672c"},"go get \u6307\u5b9a\u7248\u672c"),(0,o.kt)("p",null,"\u4ece Go 1.11 \u5f00\u59cb\uff0c\u4f7f\u7528 Go modules \u53ef\u4ee5\u505a\u5230\u8fd9\u4e00\u70b9\u3002\u5728\u4e3a Go \u6a21\u5757\u5b89\u88c5\u4f9d\u8d56\u9879\u65f6\uff0c\u4f60\u53ef\u4ee5\u6307\u5b9a\u4e00\u4e2a\u6a21\u5757\u67e5\u8be2\uff0c\u5176\u4e2d\u53ef\u80fd\u5305\u542b\u5206\u652f\u6216\u6807\u8bb0\u540d\u79f0\uff1a"),(0,o.kt)("p",null,"\u62c9\u53d6\u6700\u65b0\u7684\u7248\u672c(\u4f18\u5148\u62e9\u53d6 tag)"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@latest\n")),(0,o.kt)("p",null,"\u62c9\u53d6 master \u5206\u652f\u7684\u6700\u65b0 commit"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@master\n# \u5982\u679c\u5206\u652f\u5e26\u659c\u6760\u9700\u8981\u8bbe\u7f6e\u76f4\u8fde\nGOPROXY=direct GOSUMDB=off go install github.com/gogf/gf/cmd/gf/v2@feat/docrun\n")),(0,o.kt)("p",null,"\u62c9\u53d6 tag \u4e3a v0.3.2 \u7684 commit"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@v0.3.2\n")),(0,o.kt)("p",null,"\u62c9\u53d6 hash \u4e3a 342b231 \u7684 commit\uff0c\u6700\u7ec8\u4f1a\u88ab\u8f6c\u6362\u4e3a v0.3.2\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go get golang.org/x/text@342b2e\n")),(0,o.kt)("p",null,"\u6307\u5b9a\u7248\u672c\u62c9\u53d6\uff0c\u62c9\u53d6 v3 \u7248\u672c"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go get github.com/smartwalle/alipay/v3\n")),(0,o.kt)("h2",{id:"\u6e05\u7406-go-mod-\u7f13\u5b58"},"\u6e05\u7406 go mod \u7f13\u5b58"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go clean -modcache\n")),(0,o.kt)("h2",{id:"\u67e5\u770b\u6a21\u5757\u6709\u54ea\u4e9b\u7248\u672c"},"\u67e5\u770b\u6a21\u5757\u6709\u54ea\u4e9b\u7248\u672c"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go list -m -versions github.com/gogf/gf/v2\ngo list -m -versions github.com/gogf/gf/cmd/gf/v2\n")),(0,o.kt)("h2",{id:"go-mod-\u67e5\u770b\u95f4\u63a5\u4f9d\u8d56\u6765\u6e90"},"go mod \u67e5\u770b\u95f4\u63a5\u4f9d\u8d56\u6765\u6e90"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go mod why github.com/gogf/gf/v2\n# \u518d\u8be6\u7ec6\u7684\u4f9d\u8d56\u6811\ngo mod graph | grep github.com/gogf/gf/v2\n")),(0,o.kt)("h2",{id:"\u6784\u5efa"},"\u6784\u5efa"),(0,o.kt)("h3",{id:"windows"},"windows"),(0,o.kt)("p",null,"\u5728 Windows \u4e0b\u5982\u679c\u5f00\u542f\u4e86 cgo\uff0c\u90a3\u4e48\u6781\u5927\u6982\u7387\u662f\u65e0\u6cd5\u4ea4\u53c9\u7f16\u8bd1\u3002",(0,o.kt)("a",{parentName:"p",href:"https://kcsie.github.io/zh-cn/posts/18-go-cross-compile/"},"\u53c2\u8003")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"set GOOS=linux\nset GOARCH=amd64\n")),(0,o.kt)("h4",{id:"gcc"},"GCC"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://jmeubank.github.io/tdm-gcc/download/"},"https://jmeubank.github.io/tdm-gcc/download/")),(0,o.kt)("h3",{id:"\u76ee\u6807\u5e73\u53f0"},"\u76ee\u6807\u5e73\u53f0"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://golang.google.cn/doc/install/source"},"https://golang.google.cn/doc/install/source")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"darwin    amd64\ndarwin    arm64\nios       amd64\nios       arm64\nfreebsd   386\nfreebsd   amd64\nfreebsd   arm\nlinux     386\nlinux     amd64\nlinux     arm\nlinux     arm64\nlinux     ppc64\nlinux     ppc64le\nlinux     mips\nlinux     mipsle\nlinux     mips64\nlinux     mips64le\nnetbsd    386\nnetbsd    amd64\nnetbsd    arm\nopenbsd   386\nopenbsd   amd64\nopenbsd   arm\nwindows   386\nwindows   amd64\nandroid   arm\ndragonfly amd64\nplan9     386\nplan9     amd64\nsolaris   amd64\n")),(0,o.kt)("h2",{id:"pprof-\u4f7f\u7528"},"pprof \u4f7f\u7528"),(0,o.kt)("p",null,"gf \u7684\u914d\u7f6e\u65b9\u5f0f\uff0c",(0,o.kt)("a",{parentName:"p",href:"https://goframe.org/pages/viewpage.action?pageId=1114350"},"https://goframe.org/pages/viewpage.action?pageId=1114350")),(0,o.kt)("p",null,"\u5f00\u542f\u540e\u4f7f\u7528\u89c6\u56fe\u5f62\u5f0f\u67e5\u770b"),(0,o.kt)("p",null,"\u9700\u8981\u4e0b\u8f7d\u5b89\u88c5",(0,o.kt)("a",{parentName:"p",href:"https://www.graphviz.org/download/"},"graphviz")),(0,o.kt)("h3",{id:"\u5185\u5b58\u5206\u6790"},"\u5185\u5b58\u5206\u6790"),(0,o.kt)("p",null,"\u5207\u6362\u89c6\u56fe\uff0c\u901a\u8fc7\u4e0d\u540c\u7684\u89c6\u56fe\u67e5\u770b\u5185\u5b58\u4f7f\u7528\u60c5\u51b5\uff0c\u5b9a\u4f4d\u5185\u5b58\u5360\u7528\u8fc7\u9ad8\u7684\u5730\u65b9"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},'# \u76f4\u63a5\u6267\u884c\ngo tool pprof -http="127.0.0.1:8080"  http://127.0.0.1:8000/debug/pprof/heap\n\n# \u6216\u8005\u5148\u4e0b\u8f7d http://localhost/debug/pprof/heap\ngo tool pprof -http=":8080" heap\n\n# \u5b9e\u65f6\u5185\u5b58\n# http://127.0.0.1:8080/ui/peek?si=inuse_space\n# http://127.0.0.1:8080/ui/top?si=inuse_space\n# \u5386\u53f2\u5185\u5b58\n# http://127.0.0.1:8080/ui/?si=alloc_space\n')),(0,o.kt)("h3",{id:"cpu-\u5206\u6790"},"CPU \u5206\u6790"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},'# \u76f4\u63a5\u6267\u884c\ngo tool pprof -http="127.0.0.1:8081"  http://127.0.0.1:8000/debug/pprof/profile\n\n# \u6216\u8005\u5148\u4e0b\u8f7d http://localhost/debug/pprof/profile\ngo tool pprof -http=":8081" profile\n')),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://chanjarster.github.io/post/go/pprof-explained/"},"\u89e3\u8bfb pprof \u62a5\u544a")),(0,o.kt)("h2",{id:"\u663e\u793a-init-\u987a\u5e8f"},"\u663e\u793a init \u987a\u5e8f"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"GODEBUG=inittrace=1 go run main.go\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-powershell"},'$env:GODEBUG="inittrace=1"\ngo run main.go\n')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-cmd"},"set GODEBUG=inittrace=1\ngo run main.go\n")),(0,o.kt)("h2",{id:"\u5224\u65ad\u662f\u5426-windows-\u53cc\u51fb\u542f\u52a8"},"\u5224\u65ad\u662f\u5426 Windows \u53cc\u51fb\u542f\u52a8"),(0,o.kt)(a.Z,{language:"go",mdxType:"CodeBlock"},'// +build windows\n\n//go:generate go build -ldflags "-s -w -extldflags \'-static\'" $GOFILE\npackage main\n\nimport (\n\t"fmt"\n\t"syscall"\n\t"unsafe"\n)\n\nfunc main() {\n\tclickRun := isDoubleClickRun()\n\tfmt.Println("Double click run:", clickRun)\n\tif clickRun {\n\t\tfmt.Print("press Enter to exit")\n\t\tvar b byte\n\t\t_, _ = fmt.Scanf("%v", &b)\n\t}\n}\n\n// Detect if windows golang executable file is running via double click or from cmd/shell terminator\n//  https://stackoverflow.com/questions/8610489/distinguish-if-program-runs-by-clicking-on-the-icon-typing-its-name-in-the-cons?rq=1\n//  https://github.com/shirou/w32/blob/master/kernel32.go\n//  https://github.com/kbinani/win/blob/master/kernel32.go#L3268\n//  win.GetConsoleProcessList(new(uint32), win.DWORD(2))\nfunc isDoubleClickRun() bool {\n\tkernel32 := syscall.NewLazyDLL("kernel32.dll")\n\tlp := kernel32.NewProc("GetConsoleProcessList")\n\tif lp != nil {\n\t\tvar pids [2]uint32\n\t\tvar maxCount uint32 = 2\n\t\tret, _, _ := lp.Call(uintptr(unsafe.Pointer(&pids)), uintptr(maxCount))\n\t\tif ret > 1 {\n\t\t\treturn false\n\t\t}\n\t}\n\treturn true\n}'),(0,o.kt)("h2",{id:"protobuf"},"protobuf"),(0,o.kt)("p",null,"\u4e0b\u8f7d\u5bf9\u5e94\u7684 protoc\uff0c",(0,o.kt)("a",{parentName:"p",href:"https://github.com/protocolbuffers/protobuf/releases"},"https://github.com/protocolbuffers/protobuf/releases")),(0,o.kt)("p",null,"\u914d\u7f6e\u5230\u73af\u5883\u53d8\u91cf PATH \u4e2d"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"protoc --version\n")),(0,o.kt)("p",null,"\u5b89\u88c5 go \u63d2\u4ef6"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go install google.golang.org/protobuf/cmd/protoc-gen-go@latest\n")),(0,o.kt)("p",null,"\u751f\u6210 go \u4ee3\u7801"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"protoc --go_out=. *.proto\n")),(0,o.kt)("h2",{id:"\u5e26\u6267\u884c\u6743\u9650"},"\u5e26\u6267\u884c\u6743\u9650"),(0,o.kt)("p",null,"\u975e root\uff0c\u6267\u884c\u4e8c\u8fdb\u5236\u5e26 root\uff0c\u518d\u8fd0\u884c\u5bf9\u5e94\u7684 shell"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},'// chmod 4755 restart\nfunc main() {\n    syscall.Setuid(0)\n    syscall.Setgid(0)\n    RunShell("restart.sh")\n}\n\nfunc RunShell(name string, arg ...string) (string, error) {\n    cmd := exec.Command(name, arg...)\n    fmt.Println(name, arg)\n    out, err := cmd.Output()\n    if err != nil {\n\n        fmt.Printf("out: %s\\n", string(out))\n        fmt.Printf("err: %s\\n", err)\n        if exitErr, ok := err.(*exec.ExitError); ok {\n            // \u547d\u4ee4\u6267\u884c\u51fa\u9519\uff0c\u83b7\u53d6\u9519\u8bef\u8f93\u51fa\n            fmt.Println("\u547d\u4ee4\u6267\u884c\u51fa\u9519:\\n", string(exitErr.Stderr))\n        } else {\n            // \u5176\u4ed6\u9519\u8bef\n            fmt.Printf("\u6267\u884c\u547d\u4ee4\u65f6\u53d1\u751f\u9519\u8bef: %v", err)\n        }\n        return "", err\n    } else {\n        fmt.Printf("out: %s\\n", string(out))\n        return string(out), nil\n    }\n}\n')),(0,o.kt)("h2",{id:"win10-\u4fee\u6539\u65f6\u533a\u62a5\u9519"},"win10 \u4fee\u6539\u65f6\u533a\u62a5\u9519"),(0,o.kt)("p",null,"\u53ef\u4ee5\u901a\u8fc7\u5f15\u5165 ",(0,o.kt)("inlineCode",{parentName:"p"},'import \\_ "time/tzdata"'),"\n\u6216\u8005\u6784\u5efa\u65f6\u52a0\u5165 ",(0,o.kt)("inlineCode",{parentName:"p"},"-tags timetzdata")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"go build -tags timetzdata\n")),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/gogf/gf/issues/3676"},"https://github.com/gogf/gf/issues/3676")),(0,o.kt)("h2",{id:"\u89e6\u53d1-context-canceled"},"\u89e6\u53d1 context canceled"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-go"},'package main\n\nimport (\n    "time"\n\n    "github.com/gogf/gf/v2/frame/g"\n    "github.com/gogf/gf/v2/net/ghttp"\n)\n\nfunc main() {\n    s := g.Server()\n    s.BindHandler("/", func(r *ghttp.Request) {\n        r.Response.WriteTplContent(`\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta http-equiv="Content-Security-Policy" content="connect-src \'self\'">\n  <title>\u9875\u9762\u6807\u9898</title>\n</head>\n<body>\n<button onclick="req(500)">\u6b63\u5e38\u8bf7\u6c42</button>\n<button onclick="req(50)">\u5feb\u901f\u53d6\u6d88</button>\n</body>\n<script>\n    function req(delay) {\n        const controller = new AbortController();\n        const signal = controller.signal;\n\n        fetch(\'/test\', { signal })\n        .then(response => {\n            // \u5904\u7406\u54cd\u5e94\u6570\u636e\n            console.log(\'\u8bf7\u6c42\u6210\u529f\');\n        })\n        .catch(error => {\n            if (error.name === \'AbortError\') {\n            console.log(\'\u8bf7\u6c42\u88ab\u53d6\u6d88\');\n            } else {\n            console.error(\'\u8bf7\u6c42\u5931\u8d25\', error);\n            }\n        });\n\n        setTimeout(() => {\n        // \u53d6\u6d88\u8bf7\u6c42\n        controller.abort();\n        }, delay);\n    };\n<\/script>\n</html>\n`)\n    })\n    s.BindHandler("/test", func(r *ghttp.Request) {\n        ctx := r.GetCtx()\n        g.Log().Info(ctx, "\u8bf7\u6c42\u5f00\u59cb")\n        select {\n        case <-ctx.Done():\n            g.Log().Info(ctx, "\u8bf7\u6c42\u53d6\u6d88")\n            return\n        case <-time.After(300 * time.Millisecond):\n            g.Log().Info(ctx, "\u8bf7\u6c42\u7ed3\u675f")\n            return\n        }\n    })\n    s.SetPort(80)\n    s.Run()\n}\n// http://127.0.0.1\n\n')))}c.isMDXComponent=!0}}]);