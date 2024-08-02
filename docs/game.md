## GameContext

These methods are present on the `this.game` object in all scripts

### giveTreasure

The giveTreasure method can provide the player with gold, items, or anything else that goes into their inventory.

| Param | Description |
| -- | -- |
| type | One of TreasureType |
| amount | How much of the treasure to give (can be negative) |
| data | Any extra data around the treasure (not valid for gold) |

### userChooseLocation

The userChooseLocation method allows the player to select a location on the game map.

| Param | Description |
| -- | -- |
| x | The x to start the valid selection from |
| y | The y to start the valid selection from |
| min | The min distance away from the x,y that the selection must be |
| max | The max distance away from the x,y that the selection must be |
| typeOrPoints | Determines what cells are valid to select, one of LOCATION, or an array of Point objects |

### runTrigger

The runTrigger method looks up and executes a specific trigger as defined on the map.

| Param | Description |
| -- | -- |
| name | The name of the trigger to run |

### showDialog

The showDialog method shows a dialog of text to the player. It returns a Promise that resolves when the player closes the dialog.

| Param | Description |
| -- | -- |
| dialog | The text to show to the player |
| character | The character who's portrait shows up on the side of the dialog |

### showMultipleDialog

The showMutipleDialog method performs a similar action to showDialog, but takes in an array of Dialog objects. Each one is shown to the player in sequence before continuing.

| Param | Description |
| -- | -- |
| dialogs | list of Dialog |
| character | The character who's portrait shows up on the side of the dialog |

#### Dialog

| key | Description |
| -- | -- |
| dialog | The text to show to the player |
| character | The character who's portrait shows up on the side of the dialog |

### centerCamera

The centerCamera method moves the map to be cetered on the given coords

| Param | Description |
| -- | -- |
| x | The x coord to center on |
| y | The y coord to center on |

### createCharacter

The createCharacter method creates a character of the given type at the give position. It returns the new character's index.

| Param | Description |
| -- | -- |
| type | The character type ID to create |
| x | The x coord to center on |
| y | The y coord to center on |

### setActiveCharacter

The setActiveCharacter method changes the active (movable) character to that of the character at the index provided.

| Param | Description |
| -- | -- |
| index | The character index to make active |

### getEntitiesAt

The getEntitiesAt method returns a list of all Entities at the given coords

| Param | Description |
| -- | -- |
| x | The x coord to check |
| y | The y coord to check |

### sleep

The sleep method waits for a specified amount of milliseconds before continuing

| Param | Description |
| -- | -- |
| milliseconds | The amount of time to wait |

### isAccessible

The isAccessible method returns if the given coordinates are accessible to the given movement type. Note this does not take into account if any Entities are at the given position.

| Param | Description |
| -- | -- |
| movement | One of MOVEMENT |
| x | The x coord to check |
| y | The y coord to check |

### triggerEvent

The triggerEvent method causes an event to be dispatched to every Entity in the game. This can be an existing event or a custom one. Returns a Promise that is resolved when the Event is done processing.

| Param | Description |
| -- | -- |
| event | String containing the event to trigger |
| triggeringEntity | The entity to be used for the "other" in the Event data |

### getEntitiesWithinRange

The getEntitiesWithinRange method finds all Entities within a given radius from a specified point.

| Param | Description |
| -- | -- |
| x | X coord to use as center of search |
| y | Y coord to use as center of search |
| radius | Radius of search |

### distanceBetweenEntities

The distanceBetweenEntities method returns the cardinal distance between two entities, irrespective if the entities can actually get to each other.

| Param | Description |
| -- | -- |
| entity1 | Entity to start from |
| entity2 | Entity to get distance to |

### getCharacterIdByIndex

The getCharacterIdByIndex method returns the Entity ID for the given character, or null if the index is out of bounds.

| Param | Description |
| -- | -- |
| index | Index of the character to locate |

### getEntityById

The getEntityById method returns the Entity associated with the given ID, or null if not found.

| Param | Description |
| -- | -- |
| id | ID of the Entity to locate |

### getEntitiesOfType

The getEntitiesOfType method locates all Entities matching the give EntityType and type.

| Param | Description |
| -- | -- |
| entityType | One of EntityType |
| type | The specific type ID of the Entities you want |

### victory

The victory method immediately causes the player to win the current game. It takes no parameters.

### getTargets

The getTargets method takes in some data and returns appropriate targets based on criteria.

| Param | Description |
| -- | -- |
| targetType | One of TARGET_TYPE |
| x | The x to start from |
| y | The y to start from |
| radius | The radius to search for targets |

### TreasureType

| Name | Description |
| gold | Standard gold that the player can spend. Shared among all Characters |

### LOCATION

| Value | Description |
| -- | -- |
| STRAIGHT_LINES | Horizontal and Vertical lines only |

### MOVEMENT

| Value | Description |
| -- | -- |
| WALKING | Walking along the ground |

### COMBAT_ACTION

| Value | Description |
| -- | -- |
| MOVE | Movement action |
| ATTACK | Attack action |

### EntityType

| Value | Description |
| -- | -- |
| object | Object Entities |
| character | Character Entities |
| enemy | Enemy Entities |

### TARGET_TYPE

| Value | Description |
| -- | -- |
| ATTACKABLE | Any object that has the "attackable" flag |

### Point

An object containing x and y coordinates as keys.