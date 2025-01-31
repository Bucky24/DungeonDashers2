# Saved Games

Saves store data for a specific saved game

## Structure

Saves are single JSON files. Though they may depend on other pieces of data, they do not contain those objects.

## File

The file structure is as follows:

| Key | Description |
| -- | -- |
| type | A string, "game", indicating this is a saved game |
| map | The map that this game was played on |
| campaign | A string that indicates the campaign this save is part of, if any |
| characters | A list of SaveCharacter items |
| enemies | A list of SaveEnemy items |
| objects | A list of SaveObject items |
| equipment | A list of SaveEquipment items. Will be empty if the save is part of a campaign |
| gameData | An object of the format SaveGameData |

# Saved Campaigns

## File

The file structure of a campaign save is as follows:

| Key | Description |
| -- | -- |
| type | A string, "campaign", indicating this is a saved campaign |
| maps | A list of map names, that indicate which maps the player has already won |
| equipment | A list of SaveEquipment items |

# Data Types

## SaveCharacter

This object is the same as the MapCharacter from the game map. One thing of note here is that "slots" may be empty if this save is part of a campaign.

## SaveEnemy

This object is the same as the MapEnemy from the game map

## SaveObject

This object is the same as the MapObject from the game map

## SaveEquipment

This object contains data about equipment that is not attached to a character

| Key | Description |
| -- | -- |
| type | The equipment id |

## SaveGameData

This object contains various data about the state of the game

| Key | Description |
| -- | -- |
| activeCharacterIndex | The index of the currently active character |
| activeEnemyIndex | The index of the currently active enemy |
| gold | The current amount of gold for the party |
| combatTurn | An enum indicating who's turn it is in combat (player or enemies) |
| objectId | The current object ID that will be used for the next entity that is created in the game |