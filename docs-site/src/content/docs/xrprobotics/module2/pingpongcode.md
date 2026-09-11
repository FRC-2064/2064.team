---
title: "1.5.10 - Advanced Mechanisms: Shooter, Feeder, and Winch"
---

# 1.5.10 - Advanced Mechanisms: Shooter, Feeder, and Winch

A competitive robot does more than just drive. To score, you need specialized mechanisms that all work together. In this section, we are adding three distinct mechanisms to our robot. Because they all do very different jobs, we have to program each one using a different strategy.

Here is a breakdown of the three systems we are building:
1. **The Shooter (Arduino Bridge):** Needs massive power and speed.
2. **The Feeder (Smart Motor):** Needs high precision to load exactly one ball at a time.
3. **The Winch (Manual Motor):** Needs direct driver control to aim the shooter.

---

## 1. The Shooter: Why an Arduino Bridge?

The XRP has four built-in motor ports, but they are designed for small robotics. If you want to spin heavy flywheels to launch game pieces, you need larger motors and a separate, high-power motor controller. 

Because we cannot plug a giant FRC-style motor directly into the XRP, we use an **Arduino** as a translator. We plug the Arduino into the XRP's **Servo 2 Port**. The XRP sends a low-power "pulse" signal to the Arduino, and the Arduino commands the heavy-duty motor controller to spin the flywheels.

:::note
**The Software Illusion**
Even though we are spinning a motor, our code uses the `XRPServo` class to generate the signal. We hide this inside the `shooter.java` subsystem so the rest of our robot just thinks it is talking to a normal motor!
:::

### `shooter.java`
Create this file inside your `subsystems` folder. 

```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj.xrp.XRPServo;
import edu.wpi.first.wpilibj2.command.SubsystemBase;

public class shooter extends SubsystemBase {
    
    // Physical Servo 2 port is recognized as Channel 5 in the software
    private final XRPServo shooterBridge = new XRPServo(5); 

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

    @Override
    public void periodic() {}
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

    // 45 Degrees is exactly 1/8th (0.125) of a full rotation!
    private final double FEED_ROTATIONS = 0.125;  
    private int m_state = 0; 

    public AutoShoot(shooter shooterSub, feeder feederSub) {
        m_shooter = shooterSub;
        m_feeder = feederSub;
        // addRequirements locks these subsystems so no other command can use them right now
        addRequirements(m_shooter, m_feeder);
    }

    @Override
    public void initialize() {
        // This runs once when you first press the button
        m_timer.restart();
        m_state = 0; 
        m_feeder.stop();
        m_feeder.resetEncoder(); 
    }

    @Override
    public void execute() {
        // Force the flywheels to stay on at all times while the button is held
        m_shooter.setTargetSpeed(0.8);

        // STATE 0: INITIAL SPIN UP (Wait 0.5 seconds for flywheels to get fast)
        if (m_state == 0) {
            if (m_timer.hasElapsed(0.5)) {
                m_state = 1; 
                m_feeder.resetEncoder(); 
            }
        } 
        // STATE 1: PUSH 45 DEGREES
        else if (m_state == 1) {
            m_feeder.runFeeder(0.6); 
            
            // If the encoder reaches 45 degrees...
            if (m_feeder.getRevolutions() >= FEED_ROTATIONS) {
                m_state = 2; // Move to wait state
                m_feeder.stop(); 
                m_timer.restart(); 
            }
        } 
        // STATE 2: RECOVERY PAUSE
        else if (m_state == 2) {
            // Wait 0.5 seconds for the next ball to settle
            if (m_timer.hasElapsed(0.5)) {
                m_state = 1; // LOOP BACK to pushing!
                m_feeder.resetEncoder(); 
            }
        }
    }

    @Override
    public void end(boolean interrupted) {
        // When you let go of the button, stop both motors entirely
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

We need to tell the robot three things:
1. When the driver presses **L1**, wind the winch UP.
2. When the driver presses **R1**, wind the winch DOWN.
3. When the driver presses **Triangle**, run the entire `AutoShoot` sequence we just built.

### `RobotContainer.java`
Open your `RobotContainer.java` file and completely replace the code with this updated version. This imports our new mechanisms and binds them to the triggers.

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
    // We replaced L1 and R1 with 'false' here so they don't trigger drivetrain actions anymore!
    xrp.setDefaultCommand(new RunCommand(
        () -> xrp.executeDrive(
            driverController.getLeftY(),
            driverController.getRightY(),
            false,
            false),
        xrp));

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


    // --- 4. AUTOSHOOT SEQUENCE BINDING ---
    // Instead of just turning on a motor, holding Triangle now runs our smart AutoShoot file!
    new Trigger(driverController::getTriangleButton)
        .whileTrue(new AutoShoot(m_shooter, m_feeder));


    // --- ARM ---
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
Deploy this code to your robot. Hold the **Triangle** button and watch the magic happen: your Arduino flywheels will spin up, and half a second later, your feeder will start perfectly pushing 45 degrees at a time to load the balls!
:::