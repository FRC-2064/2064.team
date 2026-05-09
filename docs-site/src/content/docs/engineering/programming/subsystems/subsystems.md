---
title: "2.3.9 - Subsystems"
---

# 2.3.9 - Subsystems

Subsystems are how we break up a robot into logical chunks. The best way to decide if something should be its own subsystem is to ask yourself:

> Can this run independently?

Each subsystem class typically encapsulates the hardware (motors, sensors) and logic needed to control a specific mechanism. This lets us control each part of the robot independently. Examples include:

- Arms
- Wrists
- End Effectors
- Elevators
- Drivebase
- Swerve Module

---

### Arm Subsystem Example:

In this example, we'll look at the 2025 `ArmSubsystem` class.

First, we define the class, extending `SubsystemBase`, and declare the hardware components and essential variables. This includes the `TalonFX` motor controllers, configuration objects, control requests (like `MotionMagicVoltage`), and variables to hold the arm's target and current angle/state.

```java
public class ArmSubsystem extends SubsystemBase {
    // Hardware Objects
    private TalonFX leader = new TalonFX(ArmConstants.ARM_LEADER_ID);
    private TalonFX follower = new TalonFX(ArmConstants.ARM_FOLLOWER_ID);

    // Control Objects
    private final MotionMagicVoltage armControl = new MotionMagicVoltage(0.0);
    private final VoltageOut m_voltReq = new VoltageOut(0.0); // For SysId

    // Configuration Objects
    private TalonFXConfiguration leaderConfig = new TalonFXConfiguration();
    private TalonFXConfiguration followerConfig = new TalonFXConfiguration();

    // State Variables
    private double armTarget;
    private double armAngle;
    private ArmState state = ArmState.STATIONARY;
    private NeutralModeValue neutralMode = NeutralModeValue.Brake;

```

Once we have declared all of our subsystem variables, we need to initialize them. We do this by creating a constructor for the class.

```java
public ArmSubsystem(CANdi candi) {
        // Configure follower motor
        followerConfig.MotorOutput.NeutralMode = NeutralModeValue.Brake;
        follower.getConfigurator().apply(followerConfig);
        follower.setControl(new Follower(ArmConstants.ARM_LEADER_ID, true));

        // Configure leader motor PID and Feedforward (Slot 0)
        var slot0 = leaderConfig.Slot0;
        slot0.kP = 80;
        slot0.kI = 0;
        slot0.kD = 0.1;
        slot0.kS = 0.25; // Feedforward gains
        slot0.kV = 0.12;
        slot0.kA = 0.01;
        slot0.GravityType = GravityTypeValue.Arm_Cosine; // Gravity compensation
        slot0.StaticFeedforwardSign = StaticFeedforwardSignValue.UseVelocitySign;

        // Configure Motion Magic parameters
        var mmc = leaderConfig.MotionMagic;
        mmc.MotionMagicCruiseVelocity = 80;
        mmc.MotionMagicAcceleration = 160;
        mmc.MotionMagicJerk = 500;

        // Configure leader motor output settings
        leaderConfig.MotorOutput.Inverted = InvertedValue.Clockwise_Positive;
        leaderConfig.MotorOutput.NeutralMode = NeutralModeValue.Brake;

        // Configure feedback sensor (via CANdi)
    leaderConfig.Feedback.withRotorToSensorRatio(ArmConstants.ARM_GEAR_RATIO)
                             .withFusedCANdiPwm2(candi);

        // Apply leader configuration
        leader.getConfigurator().apply(leaderConfig);

        // Configure the CANdi device
        PWM2Configs candiConfig = new PWM2Configs();
        candiConfig.AbsoluteSensorOffset = ArmConstants.ABS_ENCODER_OFFSET;
        candiConfig.SensorDirection = false;
        candi.getConfigurator().apply(candiConfig);
    }
```
*Generally this is where we set PID for the subsystem and CAN ids for the motors within them.*

The main reason to extend the `SubsystemBase` class is to override the `periodic()`. This is where we have code that we want to run every cycle. This should be where we update values to dashboard and update the current state of the subsystem.

```java
@Override
    public void periodic() {
        // Read sensor and convert to degrees
        armAngle = (leader.getPosition().getValueAsDouble() + 0.5) * 360;

        // Update internal state based on target
        if (Math.abs(armAngle - armTarget) < ArmConstants.ALLOWED_ERROR_DEGREES) {
            state = ArmState.STATIONARY;
        } else {
            state = ArmState.MOVING;
        }

        // Log state and angle to SmartDashboard
        SmartDashboard.putString("Logging/Arm/State", state.toString());
        SmartDashboard.putNumber("Logging/Arm/Angle", armAngle);
    }
```

We also include public methods that interact with the hardware contains in the subsystem. This will be methods such as:
```java
public void setTargetAngle(double angle) {
        // Apply physical limits
        if (angle < 14) {
            angle = 14;
        }
        // Convert degrees to motor controller units (-0.5 to 0.5 rotations)
        double positionTarget = (angle / 360) - 0.5;
        armTarget = angle; // Store the target in degrees

        // Prepare and send the Motion Magic control request
        armControl.withPosition(positionTarget);
        ControlRequest acr = armControl;
        leader.setControl(acr);
    }
```
*This method converts the desired angle into a value that we can use to set a target position for the motor. We need to convert it to a control request in this case.*
