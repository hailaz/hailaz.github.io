.PHONY: run build install clean help

# 默认目标
.DEFAULT_GOAL := help

# 运行开发服务器
run:
	yarn start

# 构建项目
build:
	yarn build

# 安装依赖
install:
	yarn install

# 清理构建产物
clean:
	rm -rf build
	rm -rf node_modules/.cache

# 帮助信息
help:
	@echo "=== 使用说明 ==="
	@echo "make run      - 运行开发服务器"
	@echo "make build    - 构建项目"
	@echo "make install  - 安装依赖"
	@echo "make clean    - 清理构建文件"
	@echo "make help     - 显示本帮助信息"
