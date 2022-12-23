---
layout: post
title: gorun
---

### 限制 go run 个数

#### V2

```go
type GoRun struct {
	ch chan struct{}
}

func NewGoRun(maxRun int) *GoRun {
	return &GoRun{ch: make(chan struct{}, maxRun)}
}
func (p *GoRun) Done() {
	<-p.ch
}

func (p *GoRun) Count() int {
	return len(p.ch)
}

func (p *GoRun) Max() int {
	return cap(p.ch)
}

func (p *GoRun) Run(f func()) {
	select {
	case p.ch <- struct{}{}:
		go func(f func()) {
			defer p.Done()
			f()
		}(f)
	default:
		return
	}
}

func T(){
	p := NewGoRun(100)
	for {
		p.Run(func() {
			rand.Seed(time.Now().UnixNano())
			x := rand.Intn(p.max * 100) //生成0-99随机整数
			time.Sleep(time.Millisecond * time.Duration(x))
		})
		fmt.Println(p.Count())
		time.Sleep(time.Millisecond * 100)
	}
}

func main() {
	go T()
	for{}
}
```

#### V1
```go
type GoRun struct {
	max   int
	count int
	sync.Mutex
}

func NewGoRun(max int) *GoRun {
	return &GoRun{max: max}
}

func (p *GoRun) CanRun() bool {
	p.Lock()
	defer p.Unlock()
	if p.count < p.max {
		p.count++
		return true
	}
	return false
}
func (p *GoRun) Done() {
	p.Lock()
	defer p.Unlock()
	p.count--
}

func (p *GoRun) Count() int {
	return p.count
}

func (p *GoRun) Run(f func()) {
	if !p.CanRun() {
		return
	}
	go func(f func()) {
		defer p.Done()
		f()
	}(f)
}

func T(){
	p := NewGoRun(100)
	for {
		p.Run(func() {
			rand.Seed(time.Now().UnixNano())
			x := rand.Intn(p.max * 100) //生成0-99随机整数
			time.Sleep(time.Millisecond * time.Duration(x))
		})
		fmt.Println(p.Count())
		time.Sleep(time.Millisecond * 100)
	}
}

func main() {
	go T()
	for{}
}
```
