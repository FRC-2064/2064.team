---
title: "2.3.2 - File Structure"
---

# 2.3.2 - File Structure

When talking about file structure in our robot code, we start by ignoring all files outside of the `src` folder. These are generally generated code, either from WPILib[^1] or our vendor dependencies[^2] .

## \Deploy

The `Deploy` folder holds files that we want to access on the robot. Some examples of this are:
- config files from the YAGSL[^3]
- paths and autos for Path Planner[^4]

we can access this folder using the command:
```java
Filesystem.getDeployDirectory()
```

---
## \Java\frc\robot

This is where the vast majority of our robot code lives.
### Main.java

This is a generated file that we do not touch. It simply starts the robot when we run the java program.
### Robot.java

This is where we put static actions that should happen on the init, periodic and exit of specific robot states, i.e. disabled, autonomous and teleop. Some examples of this from our 2025 code include throttling Limelights when the robot is disabled to reduce overheating issues:
```java
  @Override
  public void disabledInit() {
    LimelightHelpers.SetThrottle(Limelight1Constants.LIMELIGHT_NAME, 800);
    LimelightHelpers.SetThrottle(Limelight2Constants.LIMELIGHT_NAME, 800);
  }

   @Override
  public void disabledExit() {
    LimelightHelpers.SetThrottle(Limelight1Constants.LIMELIGHT_NAME, 0);
    LimelightHelpers.SetThrottle(Limelight2Constants.LIMELIGHT_NAME, 0);
  }
```

This is also where we are scheduling our autonomous routine:
```java
  @Override
  public void autonomousInit() {
    m_autonomousCommand = m_robotContainer.getAuto();

    if (m_autonomousCommand != null) {
      m_autonomousCommand.schedule();
    }
  }
```

### RobotContainer.java

This file is where we initialize all of our subsystems and commands, assign an autonomous routine and create our bindings to our controller. This will take the form of assigning a WPILib Command to an action on a controller, as shown in the following:

```java
driverXbox.b().onTrue(new InstantCommand(robot::goToFeeder));
driverXbox.a().onTrue(new InstantCommand(robot::goToScore));
driverXbox.y().onTrue(new InstantCommand(robot::armToScore));
```

## \Commands

This folder contains all of our custom commands. This takes two forms. An extension the Command class such as 2025s' `GroundIntakeCmd.java`:

```java
public class GroundIntakeCmd extends Command {
  private ArmSubsystem arm;
  private EndEffectorSubsystem endEffector;
  private WristSubsystem wrist;
  private RobotSubsystem robot;

  public GroundIntakeCmd(ArmSubsystem arm, WristSubsystem wrist, EndEffectorSubsystem endEffector, RobotSubsystem robot) {

    this.arm = arm;
    this.wrist = wrist;
    this.endEffector = endEffector;
    this.robot = robot;
  }

  @Override
  public void initialize() {
    arm.setTargetAngle(ArmConstants.ARM_GROUND_INTAKE);
    wrist.setTargetAngle(WristConstants.WRIST_GROUND_INTAKE);
    endEffector.setState(EndEffectorState.INTAKING_CORAL_GROUND);;

    if(robot.config != null){
      robot.config.setFinalEndEffectorState(EndEffectorState.OUTTAKING_TROUGH);       }
  }

  @Override
  public void execute() {}

  @Override
  public void end(boolean interrupted) {
    endEffector.setState(EndEffectorState.STOPPED);
    arm.setTargetAngle(ArmConstants.ARM_TROUGH_FRONT_ANGLE);
    wrist.setTargetAngle(WristConstants.WRIST_TROUGH_FRONT_ANGLE);
  }

  @Override
  public boolean isFinished() {
    return endEffector.hasCoral;
  }
}
```

Or a collection of commands built with factories such as 2025s' `BasicCmd.java`:
```java
public BasicCmd(WristSubsystem wrist, ArmSubsystem arm, EndEffectorSubsystem endEffector, ClimbSubsystem climb, LEDSubsystem leds, RobotSubsystem robot) {

        this.wrist = wrist;
        this.arm = arm;
        this.endEffector = endEffector;
        this.climb = climb;
        this.leds = leds;
        this.robot = robot;

        this.armCmd = new ArmCommands();
        this.eeCmd = new EndEffectorCommands();
        this.climbCmd = new ClimbCommands();
    }

    public class ArmCommands {
        public Command FrontFeeder = new InstantCommand(robot::armToFeeder);
        public Command FrontL1 = new InstantCommand(() -> {
            arm.setTargetAngle(ArmConstants.ARM_TROUGH_FRONT_ANGLE);
            wrist.setTargetAngle(WristConstants.WRIST_TROUGH_FRONT_ANGLE);
        });
        // Additional Arm Commands...
	}

	public class EndEffectorCommands {
	public Command PPOuttakeTrough = new SequentialCommandGroup(
		new WaitCommand(EndEffectorConstants.EE_TROUGH_WAIT_TIME),
		new InstantCommand(() ->
			endEffector.setState(EndEffectorState.OUTTAKING_TROUGH)),
		new WaitCommand(EndEffectorConstants.EE_TROUGH_OUTTAKE_TIME),
		new InstantCommand(() ->
			endEffector.setState(EndEffectorState.STOPPED))
	    );
	    // Additional End Effector Commands...
	}

    public class ClimbCommands {
        public Command winchIn = new StartEndCommand(
                () -> {
                    climb.winchIn();
                    leds.climbed();
                },
                climb::winchStop,
                climb);

        public Command toggleClamp = new InstantCommand(climb::toggleClamp);
    }
}
```

## \Subsystems

where we define all of our subsystem classes. Many times we will create subfolders based on where each of these subsystems are located on the robot. For example, in 2025 we created a subfolder named `Arm` that contained the `ArmSubsystem.java`, `ClimbSubsystem.java`, `WristSubsystem` and `EndEffectorSubsystem.java` because all of those items closely interacted with each other.

### RobotSubsystem.java

Unlike other subsystems, `RobotSubsystem` does not interact with motors or devices directly. Instead, we can think of it as an orchestrator for the actions of the other subsystems. See information on [[States and State Machines|State Machines]] for an idea of how we interact with this class.

## \Utils

This folder will contain files that we will use throughout our robot code.

### Constants.java

We use a `Constants.java` file to store all the static information for the robot. This includes motor CAN ids, arm and wrist angles, elevator heights, among many other values. We do this so that everyone, even non-programmers, know exactly where to go to make adjustments to these types of values. All variables in this file should be `public static final`.
```java
public class ArmConstants {
	//ARM
	public static final int ARM_LEADER_ID = 27;
	public static final int ARM_FOLLOWER_ID = 26;

	public static final double ARM_HOME_ANGLE = 45;
	public static final double ARM_FRONT_INTAKE_ANGLE = 60;
	public static final double ARM_BACK_INTAKE_ANGLE = 123;
	// More Arm Constants...
}
```

### Enums.java

`Enums.java` contains the public Enums that we use. This is generally going to be states for each subsystem. see [[States and State Machines#State Example|States]] for examples of previously used Enums.


---
[^1]: WPILib is the main library that FRC uses to program robots. Everything we do interacts with the classes of this library.

[^2]: A vendor dependency is how we reference libraries, similar to packages in other languages. Generally they are to access specific motor controllers or electronics.

[^3]: Yet Another Generic Swerve Library, a tool that we used in the 2024/25 seasons for our drive code when using rev motors.

[^4]: PathPlanner is a library that we use to create autonomous routines and on-the-fly path generation during teleop.
