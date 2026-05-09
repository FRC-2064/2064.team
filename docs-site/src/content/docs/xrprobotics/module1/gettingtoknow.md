---
title: "1.5.2 - XRP Firmware Installation"
---

# 1.5.2 - XRP Firmware Installation

Installing the Firmware and Booting up the XRP

:::note
You should already have an assembled XRP bot with the correct firmware installed - but this video is a good reference in case troubleshooting or repairs are needed - Watch if this is your first time using XRP.

:::
With the build process complete, we need to work on loading the firmware to the XRP.  To accompliosh this: The XRP will be using custom FRC firmware that enables it to communicate wirelessly and utilize the WPIlib commands.  Luckily they provide the details to accomplish this, so follow this video and guide, and you should have the XRP robot boradcasting its' own WIFI channel to connect to so we can connect and deploy code to it after this step.

:::caution
If you already have VScode with WPIlib on your workstation: **Stop the video at 9:04 marker**. The video continues to explain how to accomplish installation and create a **Time Based Code** We will **NOT** be coding in Time Based format!

:::
<iframe width="560" height="315" src="https://www.youtube.com/embed/Nlk52QdoasE?si=OOVQTXUfxC7waexL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

:::note
**WPILib Official Documentation**
For firmware updates, advanced programming guides, and the full Java library reference, the official WPILib site is your best resource.

:::
[View the WPILib XRP Guide ↗️](https://docs.wpilib.org/en/stable/docs/xrp-robot/index.html)

:::note
Your XRP bot will be fully wireless at this point, and no longer will need to be plugged into a computer.  All code is sent wirelessly and simulating the robot is completed over WIFI.

:::
---

If you followed these steps correctly: Upon start up (when power is applied to the XRP), the following will happen:

1. The IMU will calibrate itself. This lasts approximately 3-5 seconds, and will be indicated by the green LED blinking rapidly. Ideally, the XRP should be placed on a flat surface prior to power up, and if necessary, users can hit the reset button to restart the firmware and IMU calibration process.

2. The network will be configured, depending on the configuration settings and if you successfully followed the steps in the video. See the section on [XRP Web UI Interface](https://docs.wpilib.org/en/stable/docs/xrp-robot/web-ui.html) for more information on how to configure the network settings if having issues. By default, the XRP will broadcast its own WiFi Access Point and you can connect to its' WIFI when ready to **SIMULATE** and test code.

3. After this, the XRP is ready for use.
