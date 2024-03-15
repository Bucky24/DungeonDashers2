## GameContext

These methods are present on the `this.game` object in all scripts

### giveTreasure

The giveTreasure method can provide the player with gold, items, or anything else that goes into their inventory.

| Param | Description |
| -- | -- |
| type | One of TreasureType |
| amount | How much of the treasure to give (can be negative) |
| data | Any extra data around the treasure (not valid for gold) |

### TreasureType

| Name | Description |
| gold | Standard gold that the player can spend. Shared among all Characters |