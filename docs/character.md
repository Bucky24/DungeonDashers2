# Character

Characters are part of modules and are contained within the module folder. A Cahracter is something on the map that the player can control. It can be interacted with.

Characters are Entities. See the Entity documentation for common data.

## Structure

The Character consists primarily of a manifest file, images, and scripts. Because all these files are defined explicitly in either the primary module manifest, or the character manifest, they can be any name you want.

## Manifest file

The Manifest is a JSON file with the following format:

| Key | Description |
| -- | -- |
| id | the ID of the character (must match the ID in the module manifest.json) |
| name | The name of the character |
| actionPoints | The max action points for the character |
| maxHp | The max hp for the character |
| images | A map of state to image path, see Base States for details |
| skills | A map of skill name to Skill |
| scripts | An array of file paths to scripts used for the Object. If you have a script as part of an Event and it is not listed here, it will not be loaded |
| slots | An array of Slot objects. This provides info on where Equipment can be added. |
| sounds | A map with key being the sound name and value being a Sound (relative to the module folder). Some keys are used by the system (see the entry in entity.md for more)

## Skill

An Skill is block of data that describes something the Character can do other than movement and basic attack. It has the following data:

| Key | Description |
| -- | -- |
| type | One of ScriptType |

There may be additional parameters depending on the ScriptType

## ScriptType

### script

The script type runs a script when the action is taken.

#### Additional Parameters

| Key | Description |
| -- | -- |
| file | Path to the file containing code |

## Slot

A Slot provides information about a place that Equipment can be equipped to.

| Key | Description |
| -- | -- |
| type | This indicates the type of the slot. This determines which types of Equipment can be put into this Slot (the type of the Equipment must match the type of the Slot). |
| name | The name of the slot. Optional, type is used as a default. |

## Sound

A Sound provides info about the given sound

| Key | Description |
| -- | -- |
| file | The path to the sound file (relative to the module directory) |

## CharacterContext

### moveTo

A function that moves the character to the specific point

| Param | Description |
| -- | -- |
| x | X coord to move to |
| y | Y coord to move to |
| collide | A boolean indicating if collision events should be run for items on the space |

## Base States

These are states that are built into the game that any character may have at any moment

| Name | Description |
| -- | -- |
| base_right | Character is facing right |
| base_left | Character is facing left |
| base_up | Character is facing up |
| base_down | Character is facing down |
| base_dead | Character is dead |