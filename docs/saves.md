# Saves

Saves store data for a specific saved game

## Structure

Saves are single JSON files. Though they may depend on other pieces of data, they do not contain those objects.

## File

The file structure is as follows:

| Key | Description |
| -- | -- |
| saveType | A string, "game", indicating this is a saved game |
| map | The map that this game was played on |
