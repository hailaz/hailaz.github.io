---
title: windows
---

## windows 读取苹果格式硬盘

### 使用 HFSExplorer 访问 Mac 格式驱动器

[HFSExplorer](https://www.catacombae.org/hfsexplorer/) 是一个免费软件，可以帮助您访问 Mac 格式的驱动器，解决 exFAT 格式 U 盘电脑不识别问题。但是，您需要先安装 [Java](https://www.java.com/zh-CN/) 环境，然后在 Windows10/11 上安装 HFSEexplorer。它允许您读取 Mac 格式的驱动器，并将文件自由复制到 Windows PC，另外，如果您需要使用它的写入数据支持，则需要额外付费。

要使用 HFSExplorer 访问 Mac 格式的驱动器，您可以按照以下步骤操作：

步骤 1. 将驱动器连接到 Windows 计算机并确保系统能够检测到它，然后启动 HFSExplorer。

步骤 2. 单击“文件”菜单，选择“从设备加载文件系统”它将自动定位连接的驱动器，您可以加载它。

步骤 3. 当您在窗口中看到 HFS+驱动器的内容时，仅需选择所需的文件或文件夹，单击“提取”，然后选择一个文件夹，它们将被复制到您在 Windows 计算机上选择的文件夹中。

然而，HFSExplorer 并不是一个好的选择，因为它缺少很多功能，而且是只读的。如果您想在 Windows 和 Mac 上读写 Mac 格式的驱动器的话，重新 格式化硬盘 为 exFAT 文件系统或许才是一个不错的选择方案！

https://www.disktool.cn/content-center/exfat-drive-not-recognized-windows-10-666.html

## VSCode cpu 占用过高问题排查 - 转载请注明出处 https://cyyjs.top/blog/636c74c6d67bdd000f281387

最近一打开 VSCode, 电脑风扇就呼呼的响个不停，网上查了很多资料，都没有解决。

这里吐槽下垃圾百度, 垃圾 CSDN, 搜到的都是复制粘贴的内容，解决不了问题还浪费时间。

比如： 修改 search.followSymlinks 值，修改 Files:exclude 等等，都没有卵用。

### 问题排查

多数情况下 CPU 占用过高都是某个插件引起的，我们手动逐个排除会比较麻烦，但是 VSCode 给我们提供了自动排查的功能，你只需要按住 Cmd+Shift+P 打开快捷命令窗口，输入 Start extension bisect，按回车后，根据提示确认，即可定位到有问题的插件。

第一次会自动禁用全部插件，我们可以通过观察 Code Helper 进程，发现 CPU 占用已经正常，说明就是某个插件除了问题；接着我们点击 Good Now, VSCode 会再次自动禁用一部分插件，继续观察 CPU 进程，如果有异常，就选 This is bad，没问题就选择 Good Now,不出意外的话，最终会定位到一个插件，这就是有问题的那个插件；它的查找方法如命令的名称一样，使用二分查找法，快速定位有问题的插件。


## Linux 的 Windows 子系统 (WSL)

https://learn.microsoft.com/zh-cn/windows/wsl/

### wsl2老是提示“参考的对象类型不支持尝试的操作”
https://cloud.tencent.com/developer/article/1986728
```shell
.\NoLsp.exe C:\windows\system32\wsl.exe
```

```shell
# 查看系统版本
lsb_release -a
uname -a

```