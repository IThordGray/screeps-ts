## Strategies
To be defined a bit better. The idea is that these strats will govern the decisions the Queen makes in terms of the hive. When a strat comes into play it signals a phase in the game where certain objectives become more important. These depend on smaller milestones that are reached, which includes the global and room levels.

### Starter
This strat focusses on getting started. It will spawn drones and start building the base as well as upgrading.

### Rebuilding
This strat focusses on rebuilding. It follows similar steps as the Starter strat, but the doesn't upgrade. If there are threats around still, it will incorporate some of the Basic military strat.

### Explorer
This strat foccusses on exploring, and expanding into other rooms. The explorer strat doesn't build into other rooms however. That will be covered in the Colonising strat.

### Specialised (name to be adjusted)
This strat focusses on providing more specialised creeps to the base. It might involve roles such as Architect, Advanced haversting.

### Military Basic
This strat focusses on getting defences up. This includes setting up of towers, walls and spawning defenders.

### Military Advanced
This strat focusses on getting military up and running for invasion purposes.


## CreepTypes
### Logistics
#### Drone
This creep does basic tasks such as harvesting, building, repairing, upgrading.

#### Miner
This creep is dedicated to harvesting. It moves very slowly and just drops resources on the ground.

#### Hauler
This creep moves resources between destinations.

### Military
These will get better defined as time goes on.

### Defender
This creep is in charge of staying in the base and neutralising incoming threats.

### Attacker
This creep is in charge of moving into other rooms and attacking others


## Classes
### Queen
This is in charge of dealing with Room and Territory logic.
Room involves the running and expanding of the room.
Territory is the surrounding rooms that are still connected to a room.
The Queen determines the strategy and provides override if neccesary.

### Hatchery
This is in charge of creating creeps and bootstrapping each into the hive. It will also keep stats about the creeps.

### Delegator
This is in charge of handing out tasks to the hive.
I don't know if this is actually something the queen does.

