# Maps

Maps store data for a specific scenario or map in the game

## Structure

Maps are single JSON files. Though they may depend on other pieces of data, they do not contain those objects.

## File

The file structure is as follows:

| Key | Description |
| -- | -- |
| verison | The version of the map. The current version is 2 |
| modules | A list of modules that the save relies on to provide content |
| map | A list of Tile objects that make up the main map |
| characters | A list of MapCharacter objects |
| objects | A list of MapObject objects |
| enemies | A list of MapEnemy objects |
| triggers | A map of trigger id to MapTrigger objects |

# Data Types

## Tile

| Key | Description |
| -- | -- |
| x | X coord of map tile |
| y | Y coord of map tile |
| tile | Tile ID of what tile to place here. This should be prepended with the module the tile came from, for example "main_ground1" is the ground1 tile from the main module |

## MapCharacter

| Key | Description |
| -- | -- |
| type | The type of character, must map to a character defined in a module. Prepended with the module it came from |
| x | X coord of character |
| y | Y coord of character |
| slots | List of MapEquipmentSlots |

## MapObject

| Key | Description |
| -- | -- |
| type | The type of object. Prepended with the module it came from |
| x | X coord of character |
| y | Y coord of character |
| id | The pre-defined ID of the object. Optional |
| data | A JSON blob of data used by the object's scripts. Optional |
| flags | A list of flags to be applied to the object. Optional |

## MapEnemy

| Key | Description |
| -- | -- |
| type | The type of enemy. Prepended with the module it came from |
| x | X coord of character |
| y | Y coord of character |
| id | The pre-defined ID of the enemy. Optional |
| flags | A list of flags to be applied to the enemy. Optional |

## MapTrigger

| Key | Description |
| -- | -- |
| type | The type of trigger. Right now only "script" is supported |
| code | Used for type "script", this contains the code to run when the trigger is executed |

## MapEquipmentSlots

| Key | Description |
| -- | -- |
| type | The type of equipment |
| slot | The slot the equipment is added to |