---
title: "2.3.8 - States & State Machines"
---

# 2.3.8 - States & State Machines

When creating subsystems, 2064 takes the approach of using State Derived Action. A state can be though of as a 'mode' that the subsystem is currently in. By mapping each state to a specific function, using Java's runnable interface, we are able to call a corresponding action when a new state is set.

In a state machine, we continuously check certain conditions to decide when to switch to a new state rather than simply calling a `setState` method. This lets the robot automatically transition to desired states without requiring input. This leads to more efficient robot movement and less cognitive load on our drivers.

---
### State Example:

In this example, I will go over how we used states in our 2025 End Effector.

First we start by defining our states in a Public Enum. This should include all possible / desired states for that subsystem.

```java
    public enum EndEffectorState {
        INTAKING_CORAL_GROUND,
        INTAKING_CORAL_FEEDER,
        OUTTAKING_TROUGH,
        OUTTAKING_LEVEL_2_FRONT,
        OUTTAKING_LEVEL_2_BACK,
        OUTTAKING_LEVEL_3,
        INTAKING_ALGAE,
        OUTTAKING_ALGAE,
        REMOVING_HIGH_ALGAE,
        REMOVING_LOW_ALGAE,
        STOPPED
    }
```

After we have our states, we want to create functions in our [[Subsystems|subsystem]] that correspond with the action we want that subsystem to do. In this case, we want to run the End Effector motors at certain speeds and directions for each State.

```java
    private void stop() {
        top.set(0.0);
        left.set(0.0);
        right.set(0.0);
    }
	private void intakeCoralFeeder() {
		top.set(0.25);
		left.set(0.25);
		right.set(0.25);
    }
	private void outtakeLevel3()  {
        top.set(-0.75);
        left.set(-0.75);
        right.set(-0.75);
    }
   // Functions for all states...
```
Its important to make these private, as we never want to call these externally.

Once we have our functions, we need to be able to link them to our states. We do this using a Map[^1] . We set the key as the state, and the value as a runnable[^2] .

```java
private final EnumMap<EndEffectorState, Runnable> stateActions;
```

``` java
stateActions = new EnumMap<>(EndEffectorState.class);
stateActions.put(EndEffectorState.INTAKING_CORAL_FEEDER, this::intakeCoralFeeder);
stateActions.put(EndEffectorState.OUTTAKING_LEVEL_3, this::outtakeLevel3);
stateActions.put(EndEffectorState.STOPPED, this::stop);
// Continue for all States...
```
_stateActions should be filled in the initialization of the subsystem._

We now need to be able to access the End Effectors state from outside of the subsystem. We do this with creating a getter and setter for `state`.

```java
    private EndEffectorState state = EndEffectorState.STOPPED;
```

```java
public void setState(EndEffectorState newState) {
	if (state == newState) {
		return;
	}

	state = newState;
	Runnable action = stateActions.get(newState);
	if (action != null) {
		action.run();
	}
}

public EndEffectorState getState() {
	return state;
}
```
_note that we only want to call the runnable if we are actually changing the state. We do this so that we do not make unnecessary calls to motor controllers, which increases our CAN utilization._

---
### State Machine Example:

In this example, we'll go over how we use a state machine in our 2024 shooter code. The idea is similar to the End Effector example, but here we continuously check conditions to decide when to switch states.

We start by creating an enum of ShooterState.
```java
  public enum ShooterState {
    STARTING,
    FEEDING,
    STOP,
  }
```

Instead of directly setting the state though a setter for state, a state machine uses variables to decide when the state is ready to be changed. We use a `manageState` method, called in the [[Subsystems|subsystems periodic]].

```java
  @Override
  public void periodic() {
    updateShooterState();
    // Other periodic logic...
  }
```

To decide when we update the state, we check certain conditions based on the current state and then trigger a change in state if those conditions are met.
```java
  public void updateShooterState() {
    switch (state) {
      case STARTING:
        if (leaderShooterEncoder.getVelocity()
        >= ShooterConstants.kShooterTargetSpeed)
        {
		  changeState(ShooterState.FEEDING);
        }
        break;

      case FEEDING:
        if (feedTimer.get() >= ShooterConstants.kFeedDuration) {
          changeState(ShooterState.STOP);
        }
        break;

      case STOP:
        if (shooting) {
          changeState(ShooterState.STARTING);
        }
        break;
    }
  }
```

The `changeState()` method handles the call to the runnable if the state is new.
```java
private void changeState(ShooterState newState) {
	if (state == newState) {
	    return;
    }
	state = newState;

	Runnable entryAction = stateEntryActions.get(newState);
	if (entryAction != null) {
		entryAction.run();
  }
}
```

We name these runnables with 'Entry' so that we understand that these are run only once on the change to a specific state.
```java
private void startEntry() {
    leaderShooterMotor.set(1);
    feedTimer.reset();
}

private void feedEntry() {
    feedTimer.start();
    feederMotor.set(-1.0);
}

private void stopEntry() {
    leaderShooterMotor.set(0);
    followerShooterMotor.set(0);
    feederMotor.set(0);
    shooting = false;
}
```

We need some function to start the state machine, which is handled here, in the shoot method.
```java
  public void shoot() {
    if (hasGamePeice){
      shooting = true;
    }
  }
```
---
[^1]: A 'Map' is a key-value pair, similar to a dictionary in python

[^2]: A runnable is a reference to a method
