# Enemy

Enemies are part of modules and are contained within the module folder. An Enemy is something on the map that the player cannot control. It can be interacted with.

Enemies are Entities. See the Entity documentation for common data.

## Structure

The Enemy consists primarily of a manifest file, images, and scripts. Because all these files are defined explicitly in either the primary module manifest, or the enemy manifest, they can be any name you want.

## Manifest file

The Manifest is a JSON file with the following format:

| Key | Description |
| -- | -- |
| id | the ID of the character (must match the ID in the module manifest.json) |
| images | A map of state to image path, see Base States for details |
| skills | A map of skill name to Skill |
| scripts | An array of file paths to scripts used for the Object. If you have a script as part of an Event and it is not listed here, it will not be loaded |
| events | A list of Events |
| states | A list of strings that correspond to possible states for the Enemy |

## Events

See the events.md file for a full description of events. The main events supported by an Enemy are:

| Event |
| -- |

When an Event is triggered, the context will be an EnemyContext

## Skill

An Skill is block of data that describes something the Enemy can do other than movement and basic attack. It has the following data:

| Key | Description |
| -- | -- |
| type | One of Type |

There may be additional parameters depending on the Type

### ai

The Enemy has a generic "ai" skill that the engine will attempt to run whenever it is the enemy's turn in combat.

## Type

### script

The script type runs a script when the action is taken.

#### Additional Parameters

| Key | Description |
| -- | -- |
| file | Path to the file containing code |

## EnemyContext

Empty

## Base States

These are states that are built into the game that any enemy may have at any moment

| Name | Description |
| -- | -- |
| base_right | Enemy is facing right |
| base_left | Enemy is facing left |
| base_up | Enemy is facing up |
| base_down | Enemy is facing down |
| base_dead | Enemy is dead |