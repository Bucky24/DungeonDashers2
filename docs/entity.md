# Entity

An Entity is a Character, Enemy, or Object. This document details data and methods common to all three of these. See the individal documents for specific info.

## Flags

Entities can have a number of flags applied to them. These can be custom, and can be used for various scripting behavior. Below are the flags that have special meaning in the game.

| Flag | Description |
| -- | -- |
| nonblocking | This Entity will not block the passage of other entities. Defaults to off |