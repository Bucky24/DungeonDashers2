# Equipment

Equipment are part of modules and are contained within the module folder. An Equipment is something that can be placed in Slots on Entities to modify their stats.

## Structure

The Equipment consists primarily of a manifest file, images, and scripts. Because all these files are defined explicitly in either the primary module manifest, or the Equipment manifest, they can be any name you want.

## Manifest file

The Manifest is a JSON file with the following format:

| Key | Description |
| -- | -- |
| id | the ID of the equipment (must match the ID in the module manifest.json) |
| slot | The slot of the equipment (equipment can only be put into a Slot of matching type) |
| name | The name of the equipment |
| mainImage | The portrait image for the equipment |
| stats | A list of StatModifiers |

## StatModifier

An StatModifier is block of data that describes a way that the Equipment modifies the stats of the Entity that is wearing it.

| Key | Description |
| -- | -- |
| stat | A valid Stat that can be modified |
| operator | A valid Operator |
| value | A StatValue |

## Stat

There are a few valid Stats that can be modified by Equipment

| Stat | Description |
| -- | -- |
| maxHp | The max hp of the Entity |
| actionPoints | The action points the Entity has |

## Operator

There are a number of ways a stat can be modified

| Operator | Description |
| -- | -- |
| INCREASE | Increases the given stat |
| DECREASE | Decreases the given stat |

## StatValue

There are several ways the value of the adjustment can be determined

| Key | Description |
| -- | -- |
| type | The StatAdjustmentType |
| data | This depends on the StatAdjustmentType |

## StatAdjustmentType

| Type | Description | Data |
| -- | -- | -- |
| CONST | A static value that does not change | Usually a number |