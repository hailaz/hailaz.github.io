## 影驰 SSD 修复记录（其他 PS3110 主控的 SSD 也适用）

之前刷错固件了，导致无法识别。
最后用这个方法解决，SATA 接入硬盘，先插入数据线，然后短接硬盘 PCB 上的 fbc0 和 3v3 触点，然后插入硬盘电源线。

1. 先执行
   ```
   phison_eraseall_rommode_s10 [drive_num] 目标固件.bin
   ```
   例如
   ```
   phison_eraseall_rommode_s10 2 SAFM11.3_22082016.bin
   ```
2. 再执行，生成固件升级程序
   ```
   build-s10-flasher fw.exe SAFM11.3_22082016.bin
   ```
3. 运行 fw.exe 刷固件


工具已经重新整理了[影驰 SSD 修复（PS3110）.zip](影驰SSD修复（PS3110）.zip)

其他相同主控的 SSD 也适用，具体根据存储芯片型号选择对应固件即可。

### 不同版本的用途说明：
- safm00.*/safm01.*/safm02.* - 适用于不同厂商（micron/sandisk/toshiba）的 MLC 闪存硬盘
- safm22.* - 适用于“ufs”MLC 闪存（toshiba）
- safm32.* - 适用于 1-2TB 容量的 MLC 闪存硬盘
- safm11.* - 适用于 19nm toshiba TLC 闪存
- safm12.* - 适用于 15nm toshiba TLC 闪存
- safm13.* - 适用于 BiCS3 (3D) toshiba TLC 闪存
- safm16.* - 适用于无 SLC 缓存的 BiCS3 (3D) toshiba TLC 闪存