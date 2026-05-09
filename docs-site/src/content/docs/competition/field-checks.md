---
title: "3.2.4 - Field Connectivity"
---

# 3.2.4 - Field Connectivity
> **Objective:** Learn the critical procedures for updating firmware, verifying Driver Station versions, and configuring our VH-109 radios for both the shop and the official competition Field Management System (FMS).

A robot that works perfectly in the shop but cannot connect to the competition field is completely useless. Network configuration and firmware management are the most common reasons teams miss their first qualification matches.

This module teaches the Software and Pit Crew leads how to transition the robot's brain from "Shop Mode" to "Event Mode" and back again using the modern VH-109 radio system.

---

🚦 Step 1: Pre-Event Firmware & Software Updates

Before we ever pack the trailer, the programming and electrical leads must ensure every piece of silicon on the robot is running the exact same, legal version of the software.

:::caution
**Version Mismatches**
If your Driver Station is running v24.1 but the roboRIO is running v24.2, the field FMS will refuse to let you connect. Everything must match.

:::
**The Update Checklist:**

1. **NI Game Tools (Driver Station):** Verify the driver laptop has the latest FRC Game Tools installed. Check the Driver Station version number at the top of the window.
2. **roboRIO Image:** Use the roboRIO Imaging Tool to format and flash the latest legal firmware to the RIO.
3. **Kraken Motors:** Open **Phoenix Tuner X**. Connect to the robot and ensure every single Kraken X60 is flashed to the exact same, latest firmware version.
4. **VH-109 Radio Firmware:** Connect an Ethernet cable from your laptop to the radio's `DS` port. Go to `http://radio.local/`. If the firmware is older than v1.3.0, you must update it.
    * *External Guide:* Open the [Vivid-Hosting Firmware Page :material-open-in-new:](https://frc-radio.vivid-hosting.net/miscellaneous/firmware-releases) in a new tab. Download the correct file, copy the SHA-256 key, and upload it via the radio interface. Once the SYS light blinks slowly, return to this page!

---

📻 Step 2: Radio Configuration (Shop Mode)

To drive the robot safely at Pomperaug High School, we must act as our own field. For the best 6GHz, low-latency performance, Team 2064 utilizes a **Dual-Radio Setup** for practice.

**When to do this:** Any time we are testing at the school or doing off-season driving.

**How to configure the Dual-Radio Setup:**
1. Connect directly to the **First Radio (The Robot Radio)** via Ethernet and go to `http://radio.local/`.
2. Select **Robot Radio Mode**.
3. Enter Team Number: `2064` (Add a suffix like "Practice" if desired).
4. Set the 6 GHz and 2.4 GHz WPA/SAE keys (Ask the Software Lead for our shop passwords).
5. Disconnect, and connect to the **Second Radio (The Access Point)**.
6. Go to `http://radio.local/` and select **Access Point Mode**.
7. Enter the *exact same* team number, suffix, and WPA keys.
8. Mount the Access Point radio high up in the shop, powered by a VH-117 PoE Wall Adapter.

*(Note: If we are lacking a second VH-109 for the Access Point, we must either use an older OM5P radio powered via a VRM as the AP, or manually flip DIP Switch 3 on the robot radio to "ON" for standalone 2.4GHz mode—though this is not recommended due to high interference in the school).*

---

🏟️ Step 3: At the Event (FMS Mode)

When we arrive at a regional, the very first task for the Software Lead is getting the robot radio flashed for the official Field Management System (FMS).

**When to do this:** Thursday morning of a competition, immediately after uncrating.
**Why:** Our custom "Shop Mode" settings are strictly prohibited at events and will not connect to the field.

**The Event Workflow:**
1. **The Radio Kiosk:** Pull the VH-109 radio off the robot. Take it to the official Radio Kiosk near the inspection station. The volunteers will flash it with the event's encrypted FMS key. *(We do not use our Access Point radio at events).*
2. **Pit Tethering:** *Wi-Fi is strictly banned in the pits.* To test the robot in our pit, you must physically tether the Driver Station to the robot using a long Ethernet cable.
3. **The Practice Match / Field Connectivity Test:** During our first practice match, plug the driver station laptop into the official Ethernet cable at our driver station.
4. **Verify DS Logs:** Once connected, open the Driver Station Log File Viewer. Check the latency and packet loss. If latency spikes above 20ms, notify the FTA (FIRST Technical Advisor) immediately.

---

🔄 Step 4: Post-Event (Returning to the Shop)

**When to do this:** The Monday after a competition.
**Why:** The robot radio is still locked with the encrypted competition FMS key! It will be completely dead wirelessly until we reset it.

**The Reset Protocol:**
1. Hook the radio up to a laptop via Ethernet.
2. Navigate to `http://radio.local/`.
3. Re-enter the configurations listed above in **Step 2 (Shop Mode)** to pair it back with our shop Access Point.

---

✅ Step 5: Pathway Deliverable

You must physically demonstrate your ability to manage the robot's network state to the Software Lead or Lead Mentor.

**Before submitting for review, ensure you have:**

- [ ] Demonstrated how to check the firmware version on a Kraken motor using Phoenix Tuner X.
- [ ] Successfully updated the firmware on a VH-109 radio using `http://radio.local/`.
- [ ] Configured a radio for "Robot Mode" and another for "Access Point Mode" with matching keys.
- [ ] Tethered the Driver Station to the robot via Ethernet and successfully enabled it.

**Notify a Mentor:** Let the Software Lead or Pit Boss know you are ready to be tested on field connectivity!

---

🎉 Module Complete!
You now know how to get the robot legally approved, connected to the field, and ready to play.
