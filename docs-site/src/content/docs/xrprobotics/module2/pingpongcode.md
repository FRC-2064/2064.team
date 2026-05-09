---
title: "1.5.9 - Launcher Code"
---

# 1.5.9 - Launcher Code

If you are building a symmetrical mechanism like a grabbing claw or a dual-sided lifting arm, you will need two servos to work together.

However, because the servos are usually mounted facing *opposite* directions on the robot, sending them the exact same angle will make your claw twist instead of open and close! We need to write code that makes the second servo act as a **mirror** to the first one.

(add gif of cad model simulation visualizing the movement described here)

Here is how to update our `Servo.java` subsystem to handle two mirrored servos.

---

Step 1: Updating the Port Map (`Constants.java`)

Before we can write any code for the new servo, we need to tell the robot where it is plugged in. Open your `Constants.java` file and find the `ServoConstants` section.

```java
    public final class ServoConstants {
        // The ports that the servos are plugged into on the XRP
        public static final int SERVO_MOTOR = 4;
        public static final int SERVO_MOTOR_TWO = 5; // Add this line!

        public static final Angle POSITION_DEFAULT = Angle.ofBaseUnits(90.0, Degrees);
        public static final Angle POSITION_ONE = Angle.ofBaseUnits(0.0, Degrees);
        public static final Angle POSITION_TWO = Angle.ofBaseUnits(180.0, Degrees);
    }
```

:::tip
**The FRC Way: Why use Constants?**
We never type raw numbers (like the port `5`) directly into our subsystem code. This is called using "Magic Numbers," and it is a bad programming habit. By keeping all our port numbers in `Constants.java`, if a physical wire breaks at a competition and we have to plug the servo into a different port, we only have to change the number in *one single place* in our code.

:::
---

Step 2: Creating the Second Servo Object (`Servo.java`)

Now, open your `Servo.java` subsystem file. At the very top, where we declare our hardware, we need to add the second servo.

```java
public class Servo extends SubsystemBase {

  // Initialize the first servo using the port in constants
  private final XRPServo servoOne = new XRPServo(ServoConstants.SERVO_MOTOR);

  // Initialize the second servo
  private final XRPServo servoTwo = new XRPServo(ServoConstants.SERVO_MOTOR_TWO);
```

:::note
**Hardware to Software**
In Java, creating a `new XRPServo()` is how we tell the software that a physical piece of hardware exists in the real world. We are creating a "software object" (`servoTwo`) that we can control, which is permanently linked to the physical pin on the XRP board.

:::
---

Step 3: Writing the Mirrored Math (`Servo.java`)

This is where the magic happens. We want our Commands to be simple. When a command says "Go to 45 degrees", the subsystem should be smart enough to handle the complex math of moving *both* servos correctly at the same time.

Find your `setAngle()` method and update it to look like this:

```java
  // Set the angle of BOTH servo motors simultaneously
  public void setAngle(Angle angle) {
    // Extract the raw double value from the Angle object
    double setValue = angle.in(Degrees);

    // Set the first servo to the requested angle
    servoOne.setAngle(setValue);

    // Set the second servo to the exact opposite angle
    servoTwo.setAngle(180.0 - setValue);
  }
```

:::note
**The Physics of the Mirror Math**
Standard hobby servos have a physical range of 0 to 180 degrees. If you mount two servos back-to-back, moving them both to `0` means they will point in the same absolute direction (like a pair of windshield wipers).

To make them squeeze together like a claw, we subtract the target angle from the maximum angle (`180.0 - setValue`). Now, if Servo 1 is told to move to 45°, Servo 2 automatically calculates its position and moves to 135°!

:::
---

Step 4: Adding Telemetry for Debugging (`Servo.java`)

Finally, we want to prove that our math is working without having to guess by looking at the physical robot. We will update the `periodic()` method to post the live angles of both servos to our Driver Station screen.

```java
  @Override
  public void periodic() {
    // Output both servo angles to the dashboard for easy debugging
    SmartDashboard.putNumber("Servo 1 Angle", servoOne.getAngle());
    SmartDashboard.putNumber("Servo 2 Mirrored Angle", servoTwo.getAngle());
  }
} // End of the Subsystem class
```

:::note
**Why use Telemetry?**
`SmartDashboard` is your best friend when debugging FRC code. If your physical claw isn't closing properly, look at the dashboard first. If the numbers say `45` and `135`, your code is perfect, and you know you have a mechanical hardware issue! If the numbers say `45` and `45`, you know you have a software bug.


:::
