"use strict";(self.webpackChunkhailaz_github_io=self.webpackChunkhailaz_github_io||[]).push([[5],{5568:(t,n,e)=>{e.r(n),e.d(n,{assets:()=>f,contentTitle:()=>l,default:()=>c,frontMatter:()=>i,metadata:()=>u,toc:()=>a});var s=e(7462),r=(e(7294),e(3905)),o=e(4915);const i={layout:"post",title:"goset"},l=void 0,u={unversionedId:"learn/go/\u793a\u4f8b/goset",id:"learn/go/\u793a\u4f8b/goset",title:"goset",description:"\u96c6\u5408",source:"@site/docs/learn/go/\u793a\u4f8b/goset.mdx",sourceDirName:"learn/go/\u793a\u4f8b",slug:"/learn/go/\u793a\u4f8b/goset",permalink:"/docs/learn/go/\u793a\u4f8b/goset",draft:!1,editUrl:"https://github.com/hailaz/hailaz.github.io/blob/master/docs/learn/go/\u793a\u4f8b/goset.mdx",tags:[],version:"current",frontMatter:{layout:"post",title:"goset"},sidebar:"learn",previous:{title:"gorun",permalink:"/docs/learn/go/\u793a\u4f8b/gorun"},next:{title:"MGR",permalink:"/docs/learn/mysql/mgr"}},f={},a=[{value:"\u96c6\u5408",id:"\u96c6\u5408",level:2},{value:"\u5e76\u53d1\u5b89\u5168",id:"\u5e76\u53d1\u5b89\u5168",level:3},{value:"\u975e\u5e76\u53d1\u5b89\u5168",id:"\u975e\u5e76\u53d1\u5b89\u5168",level:3}],m={toc:a};function c(t){let{components:n,...e}=t;return(0,r.kt)("wrapper",(0,s.Z)({},m,e,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"\u96c6\u5408"},"\u96c6\u5408"),(0,r.kt)("h3",{id:"\u5e76\u53d1\u5b89\u5168"},"\u5e76\u53d1\u5b89\u5168"),(0,r.kt)(o.Z,{language:"go",mdxType:"CodeBlock"},'package main\n\nimport (\n\t"fmt"\n\t"sort"\n\t"sync"\n)\n\ntype Set struct {\n\tsync.RWMutex\n\tm map[int]bool\n}\n\n// \u65b0\u5efa\u96c6\u5408\u5bf9\u8c61\n// \u53ef\u4ee5\u4f20\u5165\u521d\u59cb\u5143\u7d20\nfunc New(items ...int) *Set {\n\ts := &Set{\n\t\tm: make(map[int]bool, len(items)),\n\t}\n\ts.Add(items...)\n\treturn s\n}\n\n// \u521b\u5efa\u526f\u672c\nfunc (s *Set) Duplicate() *Set {\n\ts.Lock()\n\tdefer s.Unlock()\n\tr := &Set{\n\t\tm: make(map[int]bool, len(s.m)),\n\t}\n\tfor e := range s.m {\n\t\tr.m[e] = true\n\t}\n\treturn r\n}\n\n// \u6dfb\u52a0\u5143\u7d20\nfunc (s *Set) Add(items ...int) {\n\ts.Lock()\n\tdefer s.Unlock()\n\tfor _, v := range items {\n\t\ts.m[v] = true\n\t}\n}\n\n// \u5220\u9664\u5143\u7d20\nfunc (s *Set) Remove(items ...int) {\n\ts.Lock()\n\tdefer s.Unlock()\n\tfor _, v := range items {\n\t\tdelete(s.m, v)\n\t}\n}\n\n// \u5224\u65ad\u5143\u7d20\u662f\u5426\u5b58\u5728\nfunc (s *Set) Has(items ...int) bool {\n\ts.RLock()\n\tdefer s.RUnlock()\n\tfor _, v := range items {\n\t\tif _, ok := s.m[v]; !ok {\n\t\t\treturn false\n\t\t}\n\t}\n\treturn true\n}\n\n// \u7edf\u8ba1\u5143\u7d20\u4e2a\u6570\nfunc (s *Set) Count() int {\n\ts.Lock()\n\tdefer s.Unlock()\n\treturn len(s.m)\n}\n\n// \u6e05\u7a7a\u96c6\u5408\nfunc (s *Set) Clear() {\n\ts.Lock()\n\tdefer s.Unlock()\n\ts.m = map[int]bool{}\n}\n\n// \u7a7a\u96c6\u5408\u5224\u65ad\nfunc (s *Set) Empty() bool {\n\ts.Lock()\n\tdefer s.Unlock()\n\treturn len(s.m) == 0\n}\n\n// \u83b7\u53d6\u5143\u7d20\u5217\u8868\uff08\u65e0\u5e8f\uff09\nfunc (s *Set) List() []int {\n\ts.RLock()\n\tdefer s.RUnlock()\n\tlist := make([]int, 0, len(s.m))\n\tfor item := range s.m {\n\t\tlist = append(list, item)\n\t}\n\treturn list\n}\n\n// \u83b7\u53d6\u5143\u7d20\u5217\u8868\uff08\u6709\u5e8f\uff09\nfunc (s *Set) SortedList() []int {\n\ts.RLock()\n\tdefer s.RUnlock()\n\tlist := make([]int, 0, len(s.m))\n\tfor item := range s.m {\n\t\tlist = append(list, item)\n\t}\n\tsort.Ints(list)\n\treturn list\n}\n\n// \u5e76\u96c6\n// \u83b7\u53d6 s \u4e0e\u53c2\u6570\u7684\u5e76\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s *Set) Union(sets ...*Set) {\n\t// \u4e3a\u4e86\u9632\u6b62\u591a\u4f8b\u7a0b\u6b7b\u9501\uff0c\u4e0d\u80fd\u540c\u65f6\u9501\u5b9a\u4e24\u4e2a\u96c6\u5408\n\t// \u6240\u4ee5\u8fd9\u91cc\u6ca1\u6709\u9501\u5b9a s\uff0c\u800c\u662f\u521b\u5efa\u4e86\u4e00\u4e2a\u4e34\u65f6\u96c6\u5408\n\tr := s.Duplicate()\n\t// \u83b7\u53d6\u5e76\u96c6\n\tfor _, set := range sets {\n\t\tset.Lock()\n\t\tfor e := range set.m {\n\t\t\tr.m[e] = true\n\t\t}\n\t\tset.Unlock()\n\t}\n\t// \u5c06\u7ed3\u679c\u8f6c\u5165 s\n\ts.Lock()\n\tdefer s.Unlock()\n\ts.m = map[int]bool{}\n\tfor e := range r.m {\n\t\ts.m[e] = true\n\t}\n}\n\n// \u5e76\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6\u6240\u6709\u53c2\u6570\u7684\u5e76\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Union(sets ...*Set) *Set {\n\t// \u5904\u7406\u53c2\u6570\u6570\u91cf\n\tif len(sets) == 0 {\n\t\treturn New()\n\t} else if len(sets) == 1 {\n\t\treturn sets[0]\n\t}\n\t// \u83b7\u53d6\u5e76\u96c6\n\tr := sets[0].Duplicate()\n\tfor _, set := range sets[1:] {\n\t\tset.Lock()\n\t\tfor e := range set.m {\n\t\t\tr.m[e] = true\n\t\t}\n\t\tset.Unlock()\n\t}\n\treturn r\n}\n\n// \u5dee\u96c6\n// \u83b7\u53d6 s \u4e0e\u6240\u6709\u53c2\u6570\u7684\u5dee\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s *Set) Minus(sets ...*Set) {\n\t// \u4e3a\u4e86\u9632\u6b62\u591a\u4f8b\u7a0b\u6b7b\u9501\uff0c\u4e0d\u80fd\u540c\u65f6\u9501\u5b9a\u4e24\u4e2a\u96c6\u5408\n\t// \u6240\u4ee5\u8fd9\u91cc\u6ca1\u6709\u9501\u5b9a s\uff0c\u800c\u662f\u521b\u5efa\u4e86\u4e00\u4e2a\u4e34\u65f6\u96c6\u5408\n\tr := s.Duplicate()\n\t// \u83b7\u53d6\u5dee\u96c6\n\tfor _, set := range sets {\n\t\tset.Lock()\n\t\tfor e := range set.m {\n\t\t\tdelete(r.m, e)\n\t\t}\n\t\tset.Unlock()\n\t}\n\t// \u5c06\u7ed3\u679c\u8f6c\u5165 s\n\ts.Lock()\n\tdefer s.Unlock()\n\ts.m = map[int]bool{}\n\tfor e := range r.m {\n\t\ts.m[e] = true\n\t}\n}\n\n// \u5dee\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6\u7b2c 1 \u4e2a\u53c2\u6570\u4e0e\u5176\u5b83\u53c2\u6570\u7684\u5dee\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Minus(sets ...*Set) *Set {\n\t// \u5904\u7406\u53c2\u6570\u6570\u91cf\n\tif len(sets) == 0 {\n\t\treturn New()\n\t} else if len(sets) == 1 {\n\t\treturn sets[0]\n\t}\n\t// \u83b7\u53d6\u5dee\u96c6\n\tr := sets[0].Duplicate()\n\tfor _, set := range sets[1:] {\n\t\tfor e := range set.m {\n\t\t\tdelete(r.m, e)\n\t\t}\n\t}\n\treturn r\n}\n\n// \u4ea4\u96c6\n// \u83b7\u53d6 s \u4e0e\u5176\u5b83\u53c2\u6570\u7684\u4ea4\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s *Set) Intersect(sets ...*Set) {\n\t// \u4e3a\u4e86\u9632\u6b62\u591a\u4f8b\u7a0b\u6b7b\u9501\uff0c\u4e0d\u80fd\u540c\u65f6\u9501\u5b9a\u4e24\u4e2a\u96c6\u5408\n\t// \u6240\u4ee5\u8fd9\u91cc\u6ca1\u6709\u9501\u5b9a s\uff0c\u800c\u662f\u521b\u5efa\u4e86\u4e00\u4e2a\u4e34\u65f6\u96c6\u5408\n\tr := s.Duplicate()\n\t// \u83b7\u53d6\u4ea4\u96c6\n\tfor _, set := range sets {\n\t\tset.Lock()\n\t\tfor e := range r.m {\n\t\t\tif _, ok := set.m[e]; !ok {\n\t\t\t\tdelete(r.m, e)\n\t\t\t}\n\t\t}\n\t\tset.Unlock()\n\t}\n\t// \u5c06\u7ed3\u679c\u8f6c\u5165 s\n\ts.Lock()\n\tdefer s.Unlock()\n\ts.m = map[int]bool{}\n\tfor e := range r.m {\n\t\ts.m[e] = true\n\t}\n}\n\n// \u4ea4\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6\u6240\u6709\u53c2\u6570\u7684\u4ea4\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Intersect(sets ...*Set) *Set {\n\t// \u5904\u7406\u53c2\u6570\u6570\u91cf\n\tif len(sets) == 0 {\n\t\treturn New()\n\t} else if len(sets) == 1 {\n\t\treturn sets[0]\n\t}\n\t// \u83b7\u53d6\u4ea4\u96c6\n\tr := sets[0].Duplicate()\n\tfor _, set := range sets[1:] {\n\t\tfor e := range r.m {\n\t\t\tif _, ok := set.m[e]; !ok {\n\t\t\t\tdelete(r.m, e)\n\t\t\t}\n\t\t}\n\t}\n\treturn r\n}\n\n// \u8865\u96c6\n// \u83b7\u53d6 s \u76f8\u5bf9\u4e8e full \u7684\u8865\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s *Set) Complement(full *Set) {\n\tr := full.Duplicate()\n\ts.Lock()\n\tdefer s.Unlock()\n\t// \u83b7\u53d6\u8865\u96c6\n\tfor e := range s.m {\n\t\tdelete(r.m, e)\n\t}\n\t// \u5c06\u7ed3\u679c\u8f6c\u5165 s\n\ts.m = map[int]bool{}\n\tfor e := range r.m {\n\t\ts.m[e] = true\n\t}\n}\n\n// \u8865\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6 sub \u76f8\u5bf9\u4e8e full \u7684\u8865\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Complement(sub, full *Set) *Set {\n\tr := full.Duplicate()\n\tsub.Lock()\n\tdefer sub.Unlock()\n\tfor e := range sub.m {\n\t\tdelete(r.m, e)\n\t}\n\treturn r\n}\n\nfunc main() {\n\ts1 := New(1, 2, 3, 4, 5, 6, 7, 8)\n\ts2 := New(3, 4, 5, 6)\n\ts3 := New(1, 2, 5, 6, 8, 9)\n\n\t// \u521b\u5efa 10 \u4e2a goroutine \u540c\u6b65\u64cd\u4f5c s2\uff0c\u770b\u4f1a\u4e0d\u4f1a\u6b7b\u9501\n\twg := sync.WaitGroup{}\n\tfor i := 0; i < 10; i++ {\n\t\twg.Add(1)\n\t\tgo func(n int) {\n\t\t\tfor i := 0; i < 100; i++ {\n\t\t\t\ts2.Union(s1) // \u83b7\u53d6\u5e76\u96c6\n\t\t\t\tfmt.Printf("%2v\uff1as2 + %v = %v\\n", n, s1.SortedList(), s2.SortedList())\n\n\t\t\t\ts2.Minus(s3) // \u83b7\u53d6\u5dee\u96c6\n\t\t\t\tfmt.Printf("%2v\uff1as2 - %v = %v\\n", n, s3.SortedList(), s2.SortedList())\n\n\t\t\t\ts2.Intersect(s1) // \u83b7\u53d6\u4ea4\u96c6\n\t\t\t\tfmt.Printf("%2v\uff1as2 * %v = %v\\n", n, s1.SortedList(), s2.SortedList())\n\n\t\t\t\ts2.Complement(s1) // \u83b7\u53d6 s2 \u76f8\u5bf9\u4e8e s1 \u7684\u8865\u96c6\n\t\t\t\tfmt.Printf("%2v\uff1a%v / s2 = %v\\n", n, s1.SortedList(), s2.SortedList())\n\t\t\t}\n\t\t\twg.Done()\n\t\t}(i)\n\t}\n\twg.Wait()\n}\n'),(0,r.kt)("h3",{id:"\u975e\u5e76\u53d1\u5b89\u5168"},"\u975e\u5e76\u53d1\u5b89\u5168"),(0,r.kt)(o.Z,{language:"go",mdxType:"CodeBlock"},'package main\n\nimport (\n\t"fmt"\n\t"sort"\n)\n\ntype Set map[int]bool\n\n// \u65b0\u5efa\u96c6\u5408\u5bf9\u8c61\n// \u53ef\u4ee5\u4f20\u5165\u521d\u59cb\u5143\u7d20\nfunc New(items ...int) Set {\n\ts := make(Set, len(items))\n\ts.Add(items...)\n\treturn s\n}\n\n// \u521b\u5efa\u526f\u672c\nfunc (s Set) Duplicate() Set {\n\tr := make(map[int]bool, len(s))\n\tfor e := range s {\n\t\tr[e] = true\n\t}\n\treturn r\n}\n\n// \u6dfb\u52a0\u5143\u7d20\nfunc (s Set) Add(items ...int) {\n\tfor _, v := range items {\n\t\ts[v] = true\n\t}\n}\n\n// \u5220\u9664\u5143\u7d20\nfunc (s Set) Remove(items ...int) {\n\tfor _, v := range items {\n\t\tdelete(s, v)\n\t}\n}\n\n// \u5224\u65ad\u5143\u7d20\u662f\u5426\u5b58\u5728\nfunc (s Set) Has(items ...int) bool {\n\tfor _, v := range items {\n\t\tif _, ok := s[v]; !ok {\n\t\t\treturn false\n\t\t}\n\t}\n\treturn true\n}\n\n// \u7edf\u8ba1\u5143\u7d20\u4e2a\u6570\nfunc (s Set) Count() int {\n\treturn len(s)\n}\n\n// \u6e05\u7a7a\u96c6\u5408\nfunc (s Set) Clear() {\n\ts = map[int]bool{}\n}\n\n// \u7a7a\u96c6\u5408\u5224\u65ad\nfunc (s Set) Empty() bool {\n\treturn len(s) == 0\n}\n\n// \u83b7\u53d6\u5143\u7d20\u5217\u8868\uff08\u65e0\u5e8f\uff09\nfunc (s Set) List() []int {\n\tlist := make([]int, 0, len(s))\n\tfor item := range s {\n\t\tlist = append(list, item)\n\t}\n\treturn list\n}\n\n// \u83b7\u53d6\u5143\u7d20\u5217\u8868\uff08\u6709\u5e8f\uff09\nfunc (s Set) SortedList() []int {\n\tlist := s.List()\n\tsort.Ints(list)\n\treturn list\n}\n\n// \u5e76\u96c6\n// \u83b7\u53d6 s \u4e0e\u53c2\u6570\u7684\u5e76\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s Set) Union(sets ...Set) {\n\tfor _, set := range sets {\n\t\tfor e := range set {\n\t\t\ts[e] = true\n\t\t}\n\t}\n}\n\n// \u5e76\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6\u6240\u6709\u53c2\u6570\u7684\u5e76\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Union(sets ...Set) Set {\n\t// \u5904\u7406\u53c2\u6570\u6570\u91cf\n\tif len(sets) == 0 {\n\t\treturn New()\n\t} else if len(sets) == 1 {\n\t\treturn sets[0]\n\t}\n\t// \u83b7\u53d6\u5e76\u96c6\n\tr := sets[0].Duplicate()\n\tfor _, set := range sets[1:] {\n\t\tfor e := range set {\n\t\t\tr[e] = true\n\t\t}\n\t}\n\treturn r\n}\n\n// \u5dee\u96c6\n// \u83b7\u53d6 s \u4e0e\u6240\u6709\u53c2\u6570\u7684\u5dee\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s Set) Minus(sets ...Set) {\n\tfor _, set := range sets {\n\t\tfor e := range set {\n\t\t\tdelete(s, e)\n\t\t}\n\t}\n}\n\n// \u5dee\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6\u7b2c 1 \u4e2a\u53c2\u6570\u4e0e\u5176\u5b83\u53c2\u6570\u7684\u5dee\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Minus(sets ...Set) Set {\n\t// \u5904\u7406\u53c2\u6570\u6570\u91cf\n\tif len(sets) == 0 {\n\t\treturn New()\n\t} else if len(sets) == 1 {\n\t\treturn sets[0]\n\t}\n\t// \u83b7\u53d6\u5dee\u96c6\n\tr := sets[0].Duplicate()\n\tfor _, set := range sets[1:] {\n\t\tfor e := range set {\n\t\t\tdelete(r, e)\n\t\t}\n\t}\n\treturn r\n}\n\n// \u4ea4\u96c6\n// \u83b7\u53d6 s \u4e0e\u5176\u5b83\u53c2\u6570\u7684\u4ea4\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s Set) Intersect(sets ...Set) {\n\tfor _, set := range sets {\n\t\tfor e := range s {\n\t\t\tif _, ok := set[e]; !ok {\n\t\t\t\tdelete(s, e)\n\t\t\t}\n\t\t}\n\t}\n}\n\n// \u4ea4\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6\u6240\u6709\u53c2\u6570\u7684\u4ea4\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Intersect(sets ...Set) Set {\n\t// \u5904\u7406\u53c2\u6570\u6570\u91cf\n\tif len(sets) == 0 {\n\t\treturn New()\n\t} else if len(sets) == 1 {\n\t\treturn sets[0]\n\t}\n\t// \u83b7\u53d6\u4ea4\u96c6\n\tr := sets[0].Duplicate()\n\tfor _, set := range sets[1:] {\n\t\tfor e := range r {\n\t\t\tif _, ok := set[e]; !ok {\n\t\t\t\tdelete(r, e)\n\t\t\t}\n\t\t}\n\t}\n\treturn r\n}\n\n// \u8865\u96c6\n// \u83b7\u53d6 s \u76f8\u5bf9\u4e8e full \u7684\u8865\u96c6\uff0c\u7ed3\u679c\u5b58\u5165 s\nfunc (s Set) Complement(full Set) {\n\tr := s.Duplicate()\n\ts.Clear()\n\tfor e := range full {\n\t\tif _, ok := r[e]; !ok {\n\t\t\ts[e] = true\n\t\t}\n\t}\n}\n\n// \u8865\u96c6\uff08\u51fd\u6570\uff09\n// \u83b7\u53d6 sub \u76f8\u5bf9\u4e8e full \u7684\u8865\u96c6\uff0c\u5e76\u8fd4\u56de\nfunc Complement(sub, full Set) Set {\n\tr := full.Duplicate()\n\tfor e := range sub {\n\t\tdelete(r, e)\n\t}\n\treturn r\n}\n\nfunc main() {\n\ts1 := New(1, 2, 3, 4, 5, 6, 7, 8)\n\ts2 := New(3, 4, 5, 6)\n\ts3 := New(5, 6, 8, 9)\n\tr1 := Union(s1, s2, s3)     // \u83b7\u53d6\u5e76\u96c6\n\tr2 := Minus(s1, s2, s3)     // \u83b7\u53d6\u5dee\u96c6\n\tr3 := Intersect(s1, s2, s3) // \u83b7\u53d6\u4ea4\u96c6\n\tr4 := Complement(s2, s1)    // \u83b7\u53d6 s2 \u76f8\u5bf9\u4e8e s1 \u7684\u8865\u96c6\n\tfmt.Println(r1.SortedList())\n\tfmt.Println(r2.SortedList())\n\tfmt.Println(r3.SortedList())\n\tfmt.Println(r4.SortedList())\n}\n'))}c.isMDXComponent=!0}}]);