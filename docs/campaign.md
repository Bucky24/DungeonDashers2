# Campaign

Campaigns are collections of maps with some metadata attached.

## Structure

The Campaign consists of a manifest file and some images.

## Manifest file

The Manifest is a JSON file with the following format:

| Key | Description |
| -- | -- |
| width | The base width of the background |
| height | The base height of the background |
| background | A CampaignBackground |
| maps | A list of CampaignMap objects |

### CampaignBackground

This object provides data on the campaign's visual background

| Key | Description |
| -- | -- |
| image | Relative path to the background image |

### CampaignMap

This object provides data on a map that is part of the Campaign

| Key | Description |
| -- | -- |
| map | The name of the map to load |
| x | The x coord for the map icon on the campaign board |
| y | The y coord for the map icon on the campaign board |