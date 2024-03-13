# Character

Characters are part of modules and are contained within the module folder. A Cahracter is something on the map that the player can control. It can be interacted with.

## Structure

The Character consists primarily of a manifest file, images, and scripts. Because all these files are defined explicitly in either the primary module manifest, or the character manifest, they can be any name you want.

## Manifest file

The Manifest is a JSON file with the following format:

| Key | Description |
| -- | -- |
| id | the ID of the character (must match the ID in the module manifest.json) |
| images | A map of state to image path, see Base States for details |
| actions | A map of action name to Action |
| scripts | An array of file paths to scripts used for the Object. If you have a script as part of an Event and it is not listed here, it will not be loaded |

## Action

An Action is block of data that describes something the Character can do other than movement and basic attack. It has the following data:

| Key | Description |
| -- | -- |
| type | One of Type |

There may be additional parameters depending on the Type

## Type

### script

The script type runs a script when the action is taken.

#### Additional Parameters

| Key | Description |
| -- | -- |
| file | Path to the file containing code |

## CharacterContext

### moveTo

A function that moves the character to the specific point

| Param | Description |
| -- | -- |
| x | X coord to move to |
| y | Y coord to move to |