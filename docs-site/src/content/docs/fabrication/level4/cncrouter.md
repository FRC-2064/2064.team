---
title: "2.2.7 - CNC Router Operations"
---

# 2.2.7 - CNC Router Operations
*A step-by-step tutorial for Full-Sheet Machining.*

:::note
**Target Audience**
This tutorial is for students using the PHS Stepcraft Q.408. CNC machining is "subtractive"—errors can break expensive bits or the machine itself. **Always verify your toolpaths with an instructor before hitting Cycle Start.**

:::
---

## 0. CAM & Post-Processing
Before heading to the machine, you must prepare your G-Code.

1. **CAD Software:** Create your 3D model in Onshape, Export as **STEP File**.
2. **CAM Software:** Import your model **STEP File** into Fusion 360.
3. **Setup:** Set your **Work Home (WCS)**. For most PHS projects, this is the **Top-Left-Front** corner of the stock but sometimes is the center, just be sure you know what you have set for the machine preperation.
4. **Toolpaths:** Select appropriate bits (Endmills/Drills) You will be using in the project.
5. **Post Process:** Use the [Stepcraft UCNC Post Processor](https://cam.autodesk.com/posts/download.php?name=stepcraft%20uccnc&type=post). This is to talk to the machine you are using.
6. **Verify:** Use Simulation to check toolpath in Fusion, and have a mentor review the CAM before Exporting/Post Processing G-Code.
7. **Editing** After Processing, a window will load previewing the **G-Code** - You will need to edit this file and remove the **X0 Y0 G53** Lines which are referencing a home positition that does not exist.
8. **Transfer:** Save the `.nc` file to a USB drive.

![Fusion 360 CAM Setup](/img/placeholder-cam.png)
<p align="center">*Screencap of the WCS orientation and Post-Process menu.*</p>

---

## 1. Safety & Machine Inspection 🛡️
* [x] **Safety Glasses:** Must be worn at all times when near the machine.
* [x] **Clear Path:** Ensure the 4'x8' gantry path is clear of bags, chairs, or people and any debris.
* [x] **E-Stop Check:** Locate the physical E-Stop on the machine and the software stop.

---

## 2. Machine Startup & Homing
1. Turn on the main Stepcraft power switch.
2. Launch the **UCNC** software on the control PC.
3. Reset the E-Stop in the software (click the flashing "Reset" button).
4. Press **Home All**. The machine will move to its mechanical limits to find "Machine Zero."

---

## 3. Workholding (The GOAT Board)
How we hold the material down is critical for accuracy.

* **GOAT Board:** Our custom fixturing system for smaller parts or aluminum.
* **Mechanical Clamps:** Use only if the toolpath stays at least 1" away from clamp locations.

![Workholding Setup](/img/placeholder-workholding.png)
<p align="center">*Photo of the Vacuum Table zones or GOAT board setup.*</p>

---

## 4. Tooling & Bit Changes
1. Select the collet that matches your bit diameter (typically 1/4" or 1/8").
2. Clean the collet and nut of any dust.
3. Insert the bit so the flutes are NOT inside the collet (grip the shank only).
4. Tighten using the dual-wrench method. **Do not over-tighten.**

---

## 5. Setting Work Home (Zeroing)
You must tell the machine where your material is located.

1. **Jogging:** Use the keyboard to move the bit to your stock's **Top-Left Corner**.
2. **Zero X/Y:** Set these values to zero in UCNC.
3. **Zero Z:** Use the **Touch Plate** to find the exact top of the material. Use the **TLS Button** in the software.

---

## 6. Feed & Speed Reference
Stepcraft Q.408 handles aluminum and wood differently. Reference this table before running:

| Material | Tool | Spindle RPM | Feedrate (mm/min) | Max Depth (DOC) |
| :--- | :--- | :--- | :--- | :--- |
| Plywood | 1/4" Upcut | 15,000 | 1200 | 18mm (3/4") |
| Aluminum | 1/8" Single Flute | 9,000 | 200 | Full Depth/Trochoidal (0.01") |
| Polycarbonate | 1/4" O-Flute | 12,000 | 700 | 6mm (1/4") |

---

## 7. Run the Operation 🚀
1. **Air Run:** (Optional but Recommended) Run the code 20mm above the material to check for errors.
2. **Dust Boot:** Lower the dust boot to the material surface.
3. **Start:** Click **Cycle Start**. Keep one hand near the E-Stop for the first 30 seconds.

:::danger
**Router Height Restrictions**
Because this is a router and not a mill, the Z-height is limited. Ensure your retract height in Fusion 360 doesn't cause the gantry to "top out" or hit a clamp.

:::
---

## 8. Cleanup & Teardown
* [x] Wait for the spindle to come to a complete stop.
* [x] Vacuum the entire 4'x8' bed—dust in the tracks causes mechanical wear.
* [x] Remove the bit and return it to the proper storage slot.
* [x] Power down the controller if leaving overnight. (You may leave machine on if running more parts)

---

## Operation Workflow

<div class="mermaid">
graph TD
    A[Onshape Design] --> B[CAM Fusion Toolpaths]
    B --> C[Post Process to G-Code]
    C --> D[Turn Machine On / Home Machine]
    D --> E[Secure Workholding<br>Determine Workpiece Zero]
    E --> F[Insert Tool / Set Work Zero<br>Z TLS]
    F --> G[Execute Cut]

    G --> H{Tool Change<br>Required?}

    H -- Yes --> F
    H -- No --> I[Complete Job / Cleanup]
</div>
