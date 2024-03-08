# Events

## Format

Events can be triggered by any object, character, or enemy in the game. Often an action will trigger multiple events, such as when a character collides with an Object.

Events are objects with the following structure:

| Key | Description |
| -- | -- |
| on | The actual event that can trigger this action
| filters | An array of filters for the event |
| action | An action to take |

The event may also contain additional fields based on the filters or actions.

## Events

### collide

This event is triggered when an enemy, player, or Object hit another player, enemy, Object, or some tiles (such as a wall or a hole).

#### Filters

The collide event has the following filters:

| Name | Description |
| -- | -- |
| character | Collisions with a character |
| enemy | Collisions with an enemy |
| object | Collisions with an object |
| tile | Collisions with a tile |

Note that this refers to the _other_ entity in the collision, not the entity handling the event.

## Actions

### script

This action will run code from a script. The `this` property of the script will be the entity that is processing the event. See specific entity files for info on what data and methods are available.

#### Additional Keys

The script action requires the additional keys to be present on the Event:

| Key | Description |
| -- | -- |
| file | The relative path to the script file within the module |