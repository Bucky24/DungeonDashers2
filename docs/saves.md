# Saves

Saves store the state for a saved game

## Structure

Saves are single JSON files. Though they may depend on other pieces of data, they do not contain those objects.

## File

The file structure is as follows:

| Key | Description |
| -- | -- |
| modules | A list of modules that the save relies on to provide content |
| map | A list of Tile objects that make up the main map |

## Tile

| Key | Description |
| -- | -- |
| x | X coord of map tile |
| y | Y coord of map tile |
| tile | Tile ID of what tile to place here. This should be prepended with the module the tile came from, for example "main_ground1" is the ground1 tile from the main module |