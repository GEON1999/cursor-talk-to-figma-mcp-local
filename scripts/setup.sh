#!/bin/bash

# Create .cursor directory if it doesn't exist
mkdir -p .cursor

bun install

# Create mcp.json with the current directory path
echo "{
  \"mcpServers\": {
    \"TalkToFigma\": {
      \"command\": \"npx\",
      \"args\": [
        \"-y\",
        \"handle-figma-mcp@latest\"
      ]
    }
  }
}" > .cursor/mcp.json