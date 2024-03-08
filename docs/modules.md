# Modules

Modules provide the core data sets that the game uses to figure out data on tiles, characters, etc.

## Structure

A module is a folder containing a `manifest.json` file inside. The organization after that is completely up to you.

## Manifest

The Manifest is a JSON file with the following format:

| Key | Description |
| -- | -- |
| tiles | A list of tile ids mapped to a Tile |
| objects | A list of object ids mapped to a ManifestContainer |

## Tile

The Tile is an object that contains data on a specific tile
| Key | Description |
| -- | -- |
| type | One of TileType |
| image | a relative link to the image file for this tile |

## TileType

One of:

| Key | Description |
| -- | -- |
| ground | A ground tile. Can be traversed by all creatures |
| wall | A wall tile. Cannot be traversed |
| hole | A hole tile. Can be traversed by flying creatures |

## ManifestContainer

The MainfestContainer is an object that contains data on where to find info for a specific type of data
| Key | Description |
| -- | -- |
| manifest | The path to where the manifest JSON file can be found |