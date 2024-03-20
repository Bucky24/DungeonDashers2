# Entity

An Entity is a Character, Enemy, or Object. This document details data and methods common to all three of these. See the individal documents for specific info.

## Flags

Entities can have a number of flags applied to them. These can be custom, and can be used for various scripting behavior. Below are the flags that have special meaning in the game.

| Flag | Description |
| -- | -- |
| nonblocking | This Entity will not block the passage of other entities. Defaults to off |

## Data

Data is a field that can exist on the Entity in the Map file. It contains pass-through data that can be accessed by scripts. Data can be any valid object, it is not read by the main game code.

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

This method does the specified amount of damage to the Entity's health

| Param | Description |
| -- | -- |
| amount | The amount of damage to do |