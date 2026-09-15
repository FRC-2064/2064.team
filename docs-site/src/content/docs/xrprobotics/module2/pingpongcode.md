---
title: "1.5.10 - Advanced Mechanisms: Shooter, Feeder, and Winch"
---

# 1.5.10 - Advanced Mechanisms: Shooter, Feeder, and Winch

On The Panther Project, we know a competitive robot does more than just drive. To score, you need specialized mechanisms that all work together. In this section, we are adding three distinct mechanisms to our robot. Because they all do very different jobs, we have to program each one using a different strategy.

Here is a breakdown of the three systems we are building:
1. **The Shooter (Arduino Bridge):** Needs massive power, speed, and an "Idle Mode" to prevent the motors from getting stuck.
2. **The Feeder (Smart Motor):** Needs high precision to load exactly one ball at a time.
3. **The Winch (Manual Motor):** Needs direct driver control to aim the shooter.

---

## 1. The Shooter: The Arduino Bridge

The XRP has four built-in motor ports, but they are designed for small robotics. If you want to spin heavy flywheels to launch game pieces, you need larger motors and a separate, high-power motor controller. 

Because we cannot plug a giant FRC-style motor directly into the XRP, we use an **Arduino** as a translator. We plug the Arduino into the XRP's **Servo 2 Port**. The XRP sends a low-power "pulse" signal to the Arduino, and the Arduino commands the heavy-duty motor controller to spin the flywheels.

### Part A: The Arduino Sketch (C++)
Open your Arduino IDE, paste this code, and upload it to your Arduino. It listens to Pin 2 for the XRP pulse signal and translates it into high-power motor movement:

```cpp
// --- PIN DEFINITIONS ---
const int pwmInputPin = 2;  // DIRECT WIRE from XRP Servo 2 Signal

// Motor 1 Pins (Shooter Left)
const int motor1_PinA = 5;
const int motor1_PinB = 6;
// Motor 2 Pins (Shooter Right)
const int motor2_PinA = 9;
const int motor2_PinB = 10;

// --- VOLATILE VARIABLES FOR THE STOPWATCH ---
volatile unsigned long pulseStartTime = 0;
volatile unsigned long pulseWidth = 1500; 
volatile unsigned long lastPulseTime = 0; 

void setup() {
  pinMode(pwmInputPin, INPUT);
  pinMode(motor1_PinA, OUTPUT);
  pinMode(motor1_PinB, OUTPUT);
  pinMode(motor2_PinA, OUTPUT);
  pinMode(motor2_PinB, OUTPUT);

  // Attach the interrupt to Pin 2 to listen for the XRP signal
  attachInterrupt(digitalPinToInterrupt(pwmInputPin), measurePulse, CHANGE);
  stopMotors();
}

void loop() {
  noInterrupts(); 
  unsigned long currentPulse = pulseWidth;
  unsigned long signalAge = millis() - lastPulseTime;
  interrupts(); 

  // SAFETY: Stop if signal is lost or wire falls out (>100ms old)
  if (signalAge > 100) {
    stopMotors();
    return;
  }

  int motorSpeed = 0;

  // --- FORWARD (Shooting) ---
  if (currentPulse > 1550 && currentPulse < 2500) { 
    motorSpeed = map(currentPulse, 1550, 2200, 0, 255);
    motorSpeed = constrain(motorSpeed, 0, 255);
    
    analogWrite(motor1_PinA, motorSpeed);
    digitalWrite(motor1_PinB, LOW);
    analogWrite(motor2_PinA, motorSpeed);
    digitalWrite(motor2_PinB, LOW);
  } 
  // --- STOP (Neutral ~1500us) ---
  else {
    stopMotors();
  }

  delay(20); 
}

void stopMotors() {
  digitalWrite(motor1_PinA, LOW);
  digitalWrite(motor1_PinB, LOW);
  digitalWrite(motor2_PinA, LOW);
  digitalWrite(motor2_PinB, LOW);
}

void measurePulse() {
  if (digitalRead(pwmInputPin) == HIGH) {
    pulseStartTime = micros();
  } else {
    pulseWidth = micros() - pulseStartTime;
    lastPulseTime = millis();
  }
}
```

:::tip
**Alternative File Access**
If your network restricts direct transfers or code copying, a backup copy of this sketch is also available via the class Google Drive folder linked in your student portal.
:::

[View The Panther Project Repository](https://github.com/FRC-2064/XRP-Cammand-Based-Introduction.git){: .md-button .md-button--primary }

---

## 6. Newbie Customization Guide: Tuning Your Robot

When you test your robot code on the practice field, default parameters rarely fit every physical build perfectly. Here is how and why to customize them:

### 1. Speeding Up Initial Spin-Up
* **Where to look:** `AutoShoot.java`
* **What to change:** `INITIAL_SPIN_UP_TIME` (default: `1.5` seconds).
* **Why change it:** If your motors reach maximum RPM faster than 1.5 seconds, lower this to `1.0` to cycle shots faster. If your flywheels are heavy, increase it to give them more time.

### 2. Adjusting Recovery Delay Between Shots
* **Where to look:** `AutoShoot.java`
* **What to change:** `RECOVERY_TIME` (default: `1.5` seconds).
* **Why change it:** This controls the pause *between* fed balls. If the flywheels bog down too much when a ball enters, increase this delay so the motor recovers speed.

### 3. Modifying Feed Distance
* **Where to look:** `AutoShoot.java`
* **What to change:** `FEED_ROTATIONS` (default: `0.125`).
* **Why change it:** Controls how far the feeder wheel rotates per shot. If a piece does not completely enter the flywheels, increase it slightly (e.g., `0.15`).

### 4. Tuning Winch Speed
* **Where to look:** `RobotContainer.java` (Winch Bindings)
* **What to change:** The power values (`0.7` and `-0.7`).
* **Why change it:** Lowering this to `0.4` or `0.5` gives the driver finer, safer control over the shooter tilt angle.