# Object

Objects are part of modules and are contained within the module folder. An Object is something on the map that is not an active participant, IE not a character or enemy. But it can be interacted with, unlike a tile.

Objects are Entities. See the Entity documentation for common data.

## Structure

The Object consists primarily of a manifest file, images, and scripts. Because all these files are defined explicitly in either the primary module manifest, or the object manifest, they can be any name you want.

## Manifest file

The Manifest is a JSON file with the following format:

| Key | Description |
| -- | -- |
| id | the ID of the object (must match the ID in the module manifest.json) |
| events | A list of Events |
| states | A list of strings that correspond to possible states for the Object |
| defaultState | The starting state for the object (this can be overwritten in the Map Editor) |
| images | A map of state to image path |
| scripts | An array of file paths to scripts used for the Object. If you have a script as part of an Event and it is not listed here, it will not be loaded |

## Events

See the events.md file for a full description of events. The main events supported by an Object are:

| Event |
| -- |
| collide |

When an Event is triggered, the context will be an ObjectContext

## ObjectContext

### getState

A function that returns the current state of the object

### setState

A function that takes in a string and updates the state of the object

### setFlag

A function that takes in a flag as a string and sets it to `on`