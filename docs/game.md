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
| type | Determines what cells are valid to select, one of LOCATION |

### TreasureType

| Name | Description |
| gold | Standard gold that the player can spend. Shared among all Characters |

### LOCATION

| Value | Description |
| -- | -- |
| STRAIGHT_LINES | Horizontal and Vertical lines only |