---
title: "2.2.6 - Laser Engraver Workflow"
---

# 2.2.6 - Laser Engraver Workflow
*A step-by-step tutorial from Zero to Laser.*

:::note
**Target Audience**
This tutorial is designed for students using the FSE Laser. Follow each step in order. If you are unsure about a setting, **ASK** before pressing Start.

:::
---

## 0. File Creation to Be Lasered
Before we even use the machine, we need a 2D PDF file of our contours of the shapes we will want to cut:

1. On a computer, create a file on Onshape you plan to make.
2. Create a drawing of the file (Ensure scaling is 1:1).
3. Export the file as PDF (Turn off/delete unnecessary lines/centerlines, labels/text you do not want—only should see the lines you actually want to cut).
4. Verify file opens and save to a USB drive to transfer to the machine later on step 3 below.

![PDF FILE Creation](/img/placeholder-startup.png)
<p align="center">*Place a photo or GIF of a screen capture of this process to make a PDF.*</p>

---

## 1. Safety First 🛡️
Before you even turn the machine on, perform these checks:

* [x] **Safety Glasses:** Never look at laser while cutting, Lid must be closed to operate.
* [x] **Exhaust System:** Ensure the machine is in the **Paint Room** with vent fan **ON** and clear of obstructions.
* [x] **Fire Extinguisher:** Locate the nearest extinguisher.
* [x] **Workspace:** Ensure no flammable scraps are sitting on the honeycomb bed.

---

## 2. Machine Startup
Follow this specific power-on sequence:

1. Ensure power strip is on and all components plugged in, **Should hear pumps running**.
2. Verify water is in 5-Gallon Bucket and water is running through the pump.
3. Turn on the main power switch **Keyed Lock to ON Position**.
4. Unlock the Emergency Stop **E-Stop** if depressed.
5. Open **Retina Engrave** Software and ensure **Connected** in lower left corner.
6. Home the Machine pressing **Home** Icon.
7. Wait for the laser head to **Home** (move to the corner).
8. After machine is homed, you can use **Arrow Keys** on the laptop to move the laser head to a new position.

![Machine Startup Placement](/img/placeholder-startup.png)
<p align="center">*Place a photo or GIF of the power switch and E-Stop here.*</p>

---

## 3. Preparing Your File
Projects start in **Retina Engrave**, but need to be **Printed** to send file to Software.

* **Insert USB:** Plug `USB` Drive into laptop **Open folder files are stored in to be lasered**.
* **Opening:** Open `.pdf` file (Double-Click/Right-Click - Open) to **Preview It in Google Chrome**.
* **Importing:** Print `.pdf` file to **Full Spectrum Engraver** which is a printer selected in the menu.
* **Scaling:** Ensure your dimensions match your physical material 1:1.
* **Layers:** Assign different colors for **Cutting** (Line) vs. **Engraving** (Fill).

:::tip
**Layer Logic**
Always set your **Engraving** layers to happen *before* your **Cutting** layers so the part doesn't shift.

:::
---

## 4. Material Setup & Focusing
This is the most important step for a clean result.

1. Place your material flat on the bed (12"x20" MAX BUILD SIZE).
2. Use the **Focus Tool** to set the correct distance between the lens and the material. (You may have to move machine head **Laptop Arrow Keys** to a different location to be on your workpiece and can fit the focus tool under the laser head).
3. There is a **Turn Handle** Underneath the machine, turn it to move the machine **Floor** to the proper height so the Focus Tool is just below the laser head when resting on your workpiece.
4. Manually move the laser head to the "Origin" (where you want the job to start **Typically Top Left Corner of Job**).

![Focusing Method](/img/placeholder-focus.png)
<p align="center">*Insert a photo of the focus tool in use here.*</p>

---

## 5. Speed & Power Settings
Refer to the **Material Library** at the tool station. Common starting points:

| Material | Mode | Speed (%) | Power (%) | Passes (#) |
| :--- | :--- | :--- | :--- | :--- |
| 1/8" Plywood | Cut | 10% | 100% | 3 |
| Plywood | Engrave | 80% | 50% | 1 |
| 1/8" Acrylic | Cut | 15% | 100% | 3 |
| Acrylic | Engrave | 80% | 50% | 1 |

---

## 6. The "Perimeter" Check
Before firing the laser, press the **[PERIMETER STEPS]** button in the software.

> **Why?** This moves the laser head in a rectangle around your design area. Check to make sure the laser won't hit machine limits or go off the edge of the material.

---

## 7. Run the Job 🚀
1. Close the laser lid/shroud.
2. Double-check that the air assist is blowing.
3. Click **Start**.

:::danger
**Never Leave the Machine Unattended**
You must stay within **line of sight** of the laser at all times during operation. Do not leave the woodshop area, or the laser unsupervised. If you see a flame, hit the E-Stop immediately.

:::
---

## 8. Cleanup
* [x] Wait 30 seconds for smoke to clear before opening the lid.
* [x] Remove your project and any small "drop" scraps from the bed.
* [x] Turn off the machine and exhaust fan.
* [x] Clean the work area for the next student.

---

## Operation Workflow
Since the laser process starts with a 2D PDF drawing rather than G-Code, the workflow is slightly different than a CNC mill. This chart provides an overview of the process:

<div class="mermaid">
graph TD
    A[Onshape Design 3D Model] --> B[Create Onshape Drawing]
    B --> C[Export as PDF<br>Scaling 1:1<br>No Centerlines/Labels]
    C --> D[Save PDF to USB Drive]
    D --> E[Start Machine:<br>Turn on Power/Unlock E-Stop<br>Wait for Home]
    E --> F[Secure Workholding<br>Use Focus Tool]
    F --> G[Import File<br>Open PDF/Print to FSE<br>Check Scaling/Layers]
    G --> H[Execute Cut<br>Fire the Laser]

    H --> I{Job<br>Completed?}

    I -- No --> H
    I -- Yes --> J[Cleanup<br>Let Smoke Clear]
</div>

---

## Video Walkthrough
<p align="center">
  <video width="600" controls>
    <source src="../vid/laser-tutorial.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</p>
<p align="center">*Update the source path above to your actual video file.*</p>
