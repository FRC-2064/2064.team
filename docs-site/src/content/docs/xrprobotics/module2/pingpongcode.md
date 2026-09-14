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

### Part A: The Arduino Code (C++)
We need to upload a C++ sketch to the Arduino that measures the exact length of the pulse coming from the XRP and converts it into a raw motor speed. Open the Arduino IDE, paste this code, and upload it to your Arduino:

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

### Part B: The Java Subsystem (`shooter.java`)
Now we switch to VS Code. Even though we are spinning a motor, our Java code uses the `XRPServo` class to generate the signal. We hide this inside the `shooter.java` subsystem. We are also adding an **Idle Mode**. Mechanical flywheels sometimes get stuck if starting from a dead stop, so we want the ability to keep them coasting at a low speed in the background.

Create this file inside your `subsystems` folder. 

```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj.xrp.XRPServo;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class shooter extends SubsystemBase {
    
    // Physical Servo 2 port is recognized as Channel 5 in the software
    private final XRPServo shooterBridge = new XRPServo(5); 
    private boolean idleModeEnabled = false;

    public shooter() {}

    public void setTargetSpeed(double speed) {
        // We convert a standard motor speed (-1.0 to 1.0) into a Servo Angle (0 to 180)
        // This stretches the signal pulse so the Arduino knows how fast to spin!
        double angle = (speed + 1.0) * 90.0;
        shooterBridge.setAngle(angle); 
    }

    public void stop() {
        // 90.0 degrees is exactly the middle point (Neutral / Stop)
        shooterBridge.setAngle(90.0); 
    }

    public void toggleIdleMode() {
        idleModeEnabled = !idleModeEnabled;
    }

    public void runDefaultBehavior() {
        if (idleModeEnabled) {
            setTargetSpeed(0.6); // Coast at 60% software power to beat static friction
        } else {
            stop(); 
        }
    }

    @Override
    public void periodic() {
        // Posts our idle status to the Driver Station so we can see if it is ON or OFF
        SmartDashboard.putBoolean("Shooter Idle ON", idleModeEnabled);
    }
}
```

---

## 2. The Feeder: Why use an Encoder?

The feeder's job is to push a ball into the spinning flywheels. If we just turn a standard motor on, it might push two balls, or jam halfway through. 

We plug the feeder into **Motor Port 3**. This port has a built-in sensor called an **Encoder**. An encoder measures the physical rotation of the motor shaft. By using the encoder, we can tell the motor to rotate exactly 45 degrees (one "tick" of our feeder) and stop perfectly every single time.

:::warning
**Zero-Indexing Reminder**
In programming, we start counting at `0`. So, physical **Motor Port 3** is actually Channel `2` in your Java code!
:::

### `feeder.java`
Create this file inside your `subsystems` folder.

```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj.Encoder;
import edu.wpi.first.wpilibj.xrp.XRPMotor;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class feeder extends SubsystemBase {
    
    // Physical Motor Port 3 is Channel 2
    private final XRPMotor feederMotor = new XRPMotor(2); 
    
    // Motor 3's built-in encoder uses DIO pins 8 and 9
    private final Encoder feederEncoder = new Encoder(8, 9);

    public feeder() {
        // Standard XRP motor ticks per revolution
        feederEncoder.setDistancePerPulse(1.0 / 585.6);
        resetEncoder();
    }

    public void runFeeder(double speed) {
        feederMotor.set(speed);
    }

    public void stop() {
        feederMotor.set(0.0);
    }

    public double getRevolutions() {
        // Math.abs ensures it counts positively no matter which way it spins
        return Math.abs(feederEncoder.getDistance());
    }

    public void resetEncoder() {
        feederEncoder.reset();
    }

    @Override
    public void periodic() {}
}
```

---

## 3. The Winch: Why use Manual Control?

Our winch uses a string to pull the shooter up and down to change its angle. We plug this into **Motor Port 4**. 

Unlike the feeder, we want the driver to have direct manual control over the winch using the L1 and R1 buttons. Because a string can spool backward if wound too far, it is safest for a beginner to control this motor manually with their eyes, rather than relying on software limits that might get confused if the string gets tangled.

### `winch.java`
Create this file inside your `subsystems` folder.

```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj.xrp.XRPMotor;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class winch extends SubsystemBase {
    
    // Physical Motor Port 4 is recognized as Channel 3 in software
    private final XRPMotor winchMotor = new XRPMotor(3); 

    public winch() {}

    public void setPower(double speed) {
        // The driver has direct, raw control over the motor power
        winchMotor.set(speed);
    }

    public void stop() {
        winchMotor.set(0.0);
    }

    @Override
    public void periodic() {}
}
```

---

## 4. Tying it Together: The AutoShoot Sequence

We need the Feeder and the Shooter to work together perfectly. We want the flywheels to spin up to max speed, wait half a second, push a ball in exactly 45 degrees, wait, and repeat. 

We do this using a **Command** with a "State Machine." A state machine checks what step we are currently on, finishes that step, and moves to the next one.

### `AutoShoot.java`
Create a new folder inside `frc/robot` called `commands`. Create this file inside the `commands` folder.

```java
package frc.robot.commands;

import edu.wpi.first.wpilibj.Timer;
import edu.wpi.first.wpilibj2.command.Command;
import frc.robot.subsystems.shooter;
import frc.robot.subsystems.feeder;

public class AutoShoot extends Command {
    private final shooter m_shooter;
    private final feeder m_feeder;
    private final Timer m_timer = new Timer();

    private final double FEED_ROTATIONS = 0.125;  
    
    // --- ADDED: Easily adjustable delay variables ---
    private final double INITIAL_SPIN_UP_TIME = 1.5; 
    private final double RECOVERY_TIME = 1.5;       
    
    private int m_state = 0; 

    public AutoShoot(shooter shooterSub, feeder feederSub) {
        m_shooter = shooterSub;
        m_feeder = feederSub;
        addRequirements(m_shooter, m_feeder);
    }

    @Override
    public void initialize() {
        m_timer.restart();
        m_state = 0; 
        m_feeder.stop();
        m_feeder.resetEncoder(); 
    }

    @Override
    public void execute() {
        m_shooter.setTargetSpeed(0.8);

        // STATE 0: INITIAL SPIN UP
        if (m_state == 0) {
            // Now checks against our new 1.0 second variable
            if (m_timer.hasElapsed(INITIAL_SPIN_UP_TIME)) {
                m_state = 1; 
                m_feeder.resetEncoder(); 
            }
        } 
        else if (m_state == 1) {
            m_feeder.runFeeder(0.6); 
            
            if (m_feeder.getRevolutions() >= FEED_ROTATIONS) {
                m_state = 2; 
                m_feeder.stop(); 
                m_timer.restart(); 
            }
        } 
        // STATE 2: RECOVERY PAUSE
        else if (m_state == 2) {
            // Now checks against our new 0.75 second variable
            if (m_timer.hasElapsed(RECOVERY_TIME)) {
                m_state = 1; 
                m_feeder.resetEncoder(); 
            }
        }
    }

    @Override
    public void end(boolean interrupted) {
        m_shooter.stop();
        m_feeder.stop();
    }

    @Override
    public boolean isFinished() {
        return false; 
    }
}
```

---

## 5. Hooking up the Controller

The very last step is to wire all of our new code to the buttons on the PS4 controller. 

We need to tell the robot a few final things:
1. When the driver presses **L1**, wind the winch UP.
2. When the driver presses **R1**, wind the winch DOWN.
3. When the driver presses **Circle**, toggle the shooter's Idle Mode on and off.
4. When the driver presses **Triangle**, run the entire `AutoShoot` sequence we just built.
5. In the background, constantly check to see if the shooter should be coasting.

### `RobotContainer.java`
Open your `RobotContainer.java` file and completely replace the code with this updated version. 

```java
package frc.robot;

import edu.wpi.first.wpilibj.PS4Controller;
import edu.wpi.first.wpilibj2.command.InstantCommand;
import edu.wpi.first.wpilibj2.command.RunCommand;
import edu.wpi.first.wpilibj2.command.button.Trigger;
import frc.robot.Constants.OperatorConstants;

// --- 1. IMPORT OUR NEW SUBSYSTEMS & COMMANDS ---
import frc.robot.subsystems.XRP;
import frc.robot.subsystems.shooter;
import frc.robot.subsystems.feeder;
import frc.robot.subsystems.winch;
import frc.robot.commands.AutoShoot;

public class RobotContainer {

  // --- 2. CREATE THE SOFTWARE OBJECTS ---
  private final shooter m_shooter = new shooter();
  private final feeder m_feeder = new feeder();     
  private final winch m_winch = new winch();        
  private final XRP xrp = new XRP();
  private final PS4Controller driverController = new PS4Controller(OperatorConstants.DRIVER_CONTROLLER_PORT);

  public RobotContainer() {
    // Note: Sticks are swapped (RightY / LeftY) to match how our robot is physically wired!
    xrp.setDefaultCommand(new RunCommand(
        () -> xrp.executeDrive(
            driverController.getRightY(),
            driverController.getLeftY(),
            false,
            false),
        xrp));

    // Constantly run the idle behavior when AutoShoot isn't taking over
    m_shooter.setDefaultCommand(new RunCommand(() -> m_shooter.runDefaultBehavior(), m_shooter));

    configureButtonBindings();
  }

  private void configureButtonBindings() {
    
    // --- 3. WINCH BUTTON BINDINGS ---
    // L1 = Wind Up (Positive power)
    new Trigger(driverController::getL1Button)
        .whileTrue(new RunCommand(() -> m_winch.setPower(0.7), m_winch))
        .onFalse(new InstantCommand(() -> m_winch.stop(), m_winch));

    // R1 = Unwind Down (Negative power)
    new Trigger(driverController::getR1Button)
        .whileTrue(new RunCommand(() -> m_winch.setPower(-0.7), m_winch))
        .onFalse(new InstantCommand(() -> m_winch.stop(), m_winch));

    // --- 4. SHOOTER BUTTON BINDINGS ---
    // Pressing the Circle button once flips the idle state on or off
    new Trigger(driverController::getCircleButton)
        .onTrue(new InstantCommand(() -> m_shooter.toggleIdleMode()));

    // Holding Triangle runs our smart AutoShoot file!
    new Trigger(driverController::getTriangleButton)
        .whileTrue(new AutoShoot(m_shooter, m_feeder));

    // --- 5. ARM BINDINGS ---
    new Trigger(driverController::getSquareButton)
        .onTrue(new InstantCommand(() -> xrp.setServoPositionOne()))
        .onFalse(new InstantCommand(() -> xrp.setServoDefault()));

    new Trigger(driverController::getCrossButton)
        .onTrue(new InstantCommand(() -> xrp.setServoPositionTwo()))
        .onFalse(new InstantCommand(() -> xrp.setServoDefault()));
  }
}
```

:::tip
**Test Your Code!**
Deploy this code to your robot. Enable the Driver Station and press **Circle**—your flywheels should start coasting. Then hold the **Triangle** button and watch the magic happen: your Arduino flywheels will spin up to full speed, and half a second later, your feeder will start perfectly pushing 45 degrees at a time to load the balls!
:::