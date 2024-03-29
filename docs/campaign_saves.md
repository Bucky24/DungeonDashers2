# Saves

Saves store data for a specific saved campaign

## Structure

Saves are single JSON files. Though they may depend on other pieces of data, they do not contain those objects.

## File

The file structure is as follows:

| Key | Description |
| -- | -- |
| saveType | A string, "campaign", indicating this is a saved campaign |
| mapsWon | A list of map names that have already been completed |
