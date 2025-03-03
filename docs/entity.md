# Entity

An Entity is a Character, Enemy, or Object. This document details data and methods common to all three of these. See the individal documents for specific info.

## Flags

Entities can have a number of flags applied to them. These can be custom, and can be used for various scripting behavior. Below are the flags that have special meaning in the game.

| Flag | Description |
| -- | -- |
| nonblocking | This Entity will not block the passage of other entities. Defaults to off |
| inactive | This Entity will not be visible, cannot be collided with, and will not take a turn during combat |
| disabled | This entity will not take a turn during combat, but can be collided with, damaged, and will be visible |

## Data

Data is a field that can exist on the Entity in the Map file. It contains pass-through data that can be accessed by scripts. Data can be any valid object, it is not read by the main game code.

## Sound

The following sound names are used by the game system:

| Name | Use |
| -- | -- |
| moving | Sound used when character moves through the map |

## EntityContext

The following data and methods are available on every Entity's script context

### getData

This method returns the `data` parameter present for this Entity, or null if one does not exist.

### getFlags

This method returns the flags for the Entity as an array.

### getPos

This method returns the x and y coordinates as a Coord object

### moveTo

This method moves the Entity to a specific x and y. The Entity will teleport there, bypassing any obstacles.

| Param | Description |
| -- | -- |
| x | The x coord to move to |
| y | The y coord to move to |

### damage

This method does the specified amount of damage to the Entity's health. This will rigger an "attacked" event, and if any event handler returns a false, then the attack will be cancelled.

| Param | Description |
| -- | -- |
| amount | The amount of damage to do |

### getId

This method returns the ID of the Entity.

### removeFlag

This method unsets the specified flag from the Entity

| Param | Description |
| -- | -- |
| flag | The flag to remove |

### entityType

The entityType is a field on the context that can determine what type of Entity this is.

### canTakeAction

The canTakeAction method returns a boolean indicating if the Entity has enough action points to take the given action.

| Param | Description |
| -- | -- |
| action | A COMBAT_ACTION from the GameContext |
| times | The number of times to take the action. Defaults 1 |

### canTakeActions

The canTakeAction method returns a boolean indicating if the Entity has enough action points to take the given actions, one after another. It takes in an array of arrays, where each inner array has hte action to take, and the times to take it.

### moveTowards

The moveTowards method allows the Entity to move a certain number of steps along a path towards given coordinates. Returns true if the movement was successful.

| Param | Description |
| -- | -- |
| x | The x coord to move towards |
| y | The y coord to move towards |
| steps | How many steps to take towards the coordinate |
| collide | If true, don't take steps that would cause a collision. Default false |

### takeAction

The takeAction method removes the expected number of action points from the Entity. Should be used always after an action is taken in combat.

| Param | Description |
| -- | -- |
| action | A COMBAT_ACTION from the GameContext |

### setFlag

A function that takes in a flag as a string and sets it to `on`