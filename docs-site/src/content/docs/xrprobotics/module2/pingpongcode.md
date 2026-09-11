---
title: "1.5.10 - Arduino Motor Bridge (The Shooter)"
---

# 1.5.10 - Arduino Motor Bridge (The Shooter)

The XRP board has 4 built-in motor ports. But what happens when you build a complex robot and run out of ports? Or what if you want to run a heavy-duty motor that requires an external motor controller? 

We can solve this by using an **Arduino** as a secondary "brain." We will plug the Arduino into one of the XRP's **Servo Ports**. Instead of turning a servo, the XRP will send a signal to the Arduino, and the Arduino will translate that signal into raw power for our shooter motors!

*(add image or diagram showing XRP Servo Port connected to Arduino Pin 2, and Arduino connected to a motor driver)*

Here is how to wire and code a custom Arduino motor bridge.

---

### Step 1: The Hardware Wiring

A standard servo port has three pins: **Signal, Power (5V), and Ground**. The XRP natively outputs 5V on these pins, which is perfect for an Arduino. 

Locate the **Servo 2** port on your XRP board and connect three standard jumper wires to your Arduino:
* **Signal (Inside Pin):** Connect to **Arduino Digital Pin 2**.
* **Power / 5V (Middle Pin):** Connect to **Arduino 5V**.
* **Ground / GND (Outside Pin):** Connect to **Arduino GND**.

:::tip
**Hardware Safety First!**
Because the XRP is now providing power to the Arduino through that 5V wire, **NEVER** have the Arduino plugged into your computer via USB while the XRP battery is turned on. Having two power sources fighting each other is a quick way to fry your electronics! 
:::

---

### Step 2: The Arduino Code (C++)

Normally, a servo signal is just a series of electrical pulses. A short pulse (1000 microseconds) means "0 degrees," and a long pulse (2000 microseconds) means "180 degrees." 

We need to upload a C++ sketch to the Arduino that acts like a stopwatch. It will measure the exact length of the pulse coming from the XRP and convert that time into a motor speed (0 to 255). 

Open the Arduino IDE, paste this code, and upload it to your Arduino:

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
  // If the pulse jumps up to 2200 when you press the button on the controller
  if (currentPulse > 1550 && currentPulse < 2500) { 
    // Map the XRP signal to Arduino Motor Power
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

// The background listener that measures the pulse length
void measurePulse() {
  if (digitalRead(pwmInputPin) == HIGH) {
    pulseStartTime = micros();
  } else {
    pulseWidth = micros() - pulseStartTime;
    lastPulseTime = millis();
  }
}
```

---

### Step 3: The Java Subsystem (`shooter.java`)

Now we switch over to VS Code. We need to create a new Subsystem to represent our shooter mechanism. Even though we are spinning flywheels, we are going to use the `XRPServo` class because we need to generate that specific pulsing signal out of the physical Servo 2 port.

Create a new file in your `subsystems` folder called `shooter.java` and paste this in:

```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj.xrp.XRPServo;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class shooter extends SubsystemBase {
    
    // Physical Servo 2 port is recognized as Channel 5 in the software
    private final XRPServo shooterBridge = new XRPServo(5); 

    public shooter() {
    }

    /**
     * @param speed Value from -1.0 to 1.0 (from joystick or hardcoded)
     */
    public void setTargetSpeed(double speed) {
        // XRPServo uses "Degrees" (0 to 180) to stretch the pulse.
        // -1.0 -> 0 degrees (1000us)
        //  0.0 -> 90 degrees (1500us - Neutral)
        //  1.0 -> 180 degrees (2000+ us)
        double angle = (speed + 1.0) * 90.0;
        shooterBridge.setAngle(angle); 
    }

    public void stop() {
        // 90.0 degrees is exactly the middle point (1500us / Neutral / Stop)
        shooterBridge.setAngle(90.0); 
    }

    @Override
    public void periodic() {
        // Leave empty for now
    }
}
```

:::note
**The Software Illusion**
Notice how we created a method called `setTargetSpeed()` that takes a standard motor speed between `-1.0` and `1.0`. By hiding the `setAngle()` math inside the subsystem, the rest of our robot code just thinks it's talking to a normal motor! This keeps our Commands clean and easy to read.
:::

---

### Step 4: Binding the Button (`RobotContainer.java`)

The final step is to hook our new shooter subsystem up to a button on our PS4 controller. 

Open your `RobotContainer.java` file. First, add the import at the very top, and create the subsystem object near the top of the class:

```java
import frc.robot.subsystems.shooter;

public class RobotContainer {

  // Create the software object representing our physical shooter
  private final shooter m_shooter = new shooter();
```

Next, scroll down to your `configureButtonBindings()` method and add the logic for the Triangle button:

```java
  private void configureButtonBindings() {
    
    // --- SHOOTER ---
    // While Triangle is held, send a speed of 0.8 (80% power).
    // When released, immediately call stop().
    new Trigger(driverController::getTriangleButton)
        .whileTrue(new RunCommand(() -> m_shooter.setTargetSpeed(0.8), m_shooter))
        .onFalse(new InstantCommand(() -> m_shooter.stop(), m_shooter));

  }
```

:::tip
**`.whileTrue` vs `.onTrue`**
In command-based programming, `.whileTrue()` is perfect for flywheels or intakes. It actively runs the command continuously for as long as your finger is holding the button down, and safely stops the moment you let go!
:::