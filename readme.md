# Handle Figma MCP

This project implements a Model Context Protocol (MCP) integration between AI IDEs (such as Cursor, Antigravity, Windsurf, etc.) and Figma. It allows your AI assistant to communicate with Figma for reading designs and modifying them programmatically.

https://github.com/user-attachments/assets/129a14d2-ed73-470f-9a4c-2240b2a4885c

## Project Structure

- `src/talk_to_figma_mcp/` - TypeScript MCP server for Figma integration
- `src/cursor_mcp_plugin/` - Figma plugin for communicating with your AI IDE
- `src/socket.ts` - (Legacy) Standalone WebSocket server (Now embedded in the MCP server)

## Get Started (Recommended)

The easiest way to use this MCP server is directly via `npx`. This ensures you always have the latest version without needing to download or manage files locally.

1. **Add to your AI IDE's MCP Configuration**
   Go to your IDE's MCP settings (e.g., Cursor Settings > MCP), and add a new server with the following configuration:
   ```json
   {
     "mcpServers": {
       "TalkToFigma": {
         "command": "npx",
         "args": ["-y", "handle-figma-mcp@latest"]
       }
     }
   }
   ```
   *(Note: The embedded WebSocket server will start automatically when your IDE runs this command!)*

   **Troubleshooting: Mac Homebrew PATH Issue**
   If your AI IDE (e.g. Cursor) cannot find `npx`, you may need to provide the absolute path and inject the PATH environment variable. *(Note: The paths below are examples for Apple Silicon Macs. Intel Macs typically use `/usr/local/bin/npx`. Replace with your actual paths if different.)*
   ```json
   {
     "mcpServers": {
       "TalkToFigma": {
         "command": "/opt/homebrew/bin/npx",
         "args": ["-y", "handle-figma-mcp@latest"],
         "env": {
           "PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
         }
       }
     }
   }
   ```

2. **Install the Figma Plugin**
   Download the entire `cursor_mcp_plugin` folder from [GitHub](https://github.com/GEON1999/cursor-talk-to-figma-mcp-local/tree/main/src/cursor_mcp_plugin). 
   Then, in Figma, go to **Plugins > Development > Import plugin from manifest...** and select the `manifest.json` file located inside your downloaded folder.

## Quick Video Tutorial

[Video Link](https://www.linkedin.com/posts/sonnylazuardi_just-wanted-to-share-my-latest-experiment-activity-7307821553654657024-yrh8)

## Design Automation Example

**Bulk text content replacement**

Thanks to [@dusskapark](https://github.com/dusskapark) for contributing the bulk text replacement feature. Here is the [demo video](https://www.youtube.com/watch?v=j05gGT3xfCs).

**Instance Override Propagation**
Another contribution from [@dusskapark](https://github.com/dusskapark)
Propagate component instance overrides from a source instance to multiple target instances with a single command. This feature dramatically reduces repetitive design work when working with component instances that need similar customizations. Check out our [demo video](https://youtu.be/uvuT8LByroI).

## Local Development (For Contributors)

If you want to modify the code or contribute to the project:

1. Install Bun if you haven't already:
```bash
curl -fsSL https://bun.sh/install | bash
```
2. Run setup:
```bash
bun setup
```
3. Update your AI IDE's MCP config to run the local entrypoint:
```json
{
  "mcpServers": {
    "TalkToFigma": {
      "command": "node",
      "args": ["/absolute/path/to/cursor-talk-to-figma-mcp/dist/server.js"]
    }
  }
}
```
4. Load the local plugin in Figma:
   Go to Plugins > Development > New Plugin > "Link existing plugin" and select `src/cursor_mcp_plugin/manifest.json`.



## MCP Tools

The MCP server provides the following tools for interacting with Figma:

### Document & Selection

- `get_document_info` - Get information about the current Figma document
- `get_selection` - Get information about the current selection
- `read_my_design` - Get detailed node information about the current selection without parameters
- `get_node_info` - Get detailed information about a specific node
- `get_nodes_info` - Get detailed information about multiple nodes by providing an array of node IDs
- `set_focus` - Set focus on a specific node by selecting it and scrolling viewport to it
- `set_selections` - Set selection to multiple nodes and scroll viewport to show them

### Annotations

- `get_annotations` - Get all annotations in the current document or specific node
- `set_annotation` - Create or update an annotation with markdown support
- `set_multiple_annotations` - Batch create/update multiple annotations efficiently
- `scan_nodes_by_types` - Scan for nodes with specific types (useful for finding annotation targets)

### Prototyping & Connections

- `get_reactions` - Get all prototype reactions from nodes with visual highlight animation
- `set_default_connector` - Set a copied FigJam connector as the default connector style for creating connections (must be set before creating connections)
- `create_connections` - Create FigJam connector lines between nodes, based on prototype flows or custom mapping

### Creating Elements

- `create_rectangle` - Create a new rectangle with position, size, and optional name
- `create_frame` - Create a new frame with position, size, and optional name
- `create_text` - Create a new text node with customizable font properties
- `create_polygon` - Create a new polygon (regular polygon) with position, size, point count, and styling

### Modifying text content

- `scan_text_nodes` - Scan text nodes with intelligent chunking for large designs
- `set_text_content` - Set the text content of a single text node
- `set_multiple_text_contents` - Batch update multiple text nodes efficiently

### Auto Layout & Spacing

- `set_layout_mode` - Set the layout mode and wrap behavior of a frame (NONE, HORIZONTAL, VERTICAL)
- `set_padding` - Set padding values for an auto-layout frame (top, right, bottom, left)
- `set_axis_align` - Set primary and counter axis alignment for auto-layout frames
- `set_layout_sizing` - Set horizontal and vertical sizing modes for auto-layout frames (FIXED, HUG, FILL)
- `set_item_spacing` - Set distance between children in an auto-layout frame

### Styling

- `set_fill_color` - Set the fill color of a node (RGBA)
- `set_stroke_color` - Set the stroke color and weight of a node
- `set_corner_radius` - Set the corner radius of a node with optional per-corner control
- `create_paint_style` - Create a new color style (paint style) in Figma. Use folder notation for grouping
- `create_multiple_paint_styles` - Create multiple color styles (paint styles) in Figma at once
- `apply_paint_style` - Apply an existing color style (paint style) to a node's fill
- `rename_paint_style` - Rename an existing paint style
- `swap_style` - Find all usages of a specific paint style and replace them with another style
- `create_color_variable` - Create or update a single Figma color variable
- `create_multiple_color_variables` - Create or update multiple Figma color variables at once

### Layout & Organization

- `move_node` - Move a node to a new position
- `resize_node` - Resize a node with new dimensions
- `rename_node` - Rename a node in Figma
- `delete_node` - Delete a node
- `delete_multiple_nodes` - Delete multiple nodes at once efficiently
- `clone_node` - Create a copy of an existing node with optional position offset

### Components & Styles

- `get_styles` - Get information about local styles
- `get_local_components` - Get information about local components
- `create_component_instance` - Create an instance of a component
- `get_instance_overrides` - Extract override properties from a selected component instance
- `set_instance_overrides` - Apply extracted overrides to target instances

### Export & Advanced

- `export_node_as_image` - Export a node as an image (PNG, JPG, SVG, or PDF) - limited support on image currently returning base64 as text

### Connection Management

- `join_channel` - Join a specific channel to communicate with Figma

### MCP Prompts

The MCP server includes several helper prompts to guide you through complex design tasks:

- `design_strategy` - Best practices for working with Figma designs
- `read_design_strategy` - Best practices for reading Figma designs
- `text_replacement_strategy` - Systematic approach for replacing text in Figma designs
- `annotation_conversion_strategy` - Strategy for converting manual annotations to Figma's native annotations
- `swap_overrides_instances` - Strategy for transferring overrides between component instances in Figma
- `reaction_to_connector_strategy` - Strategy for converting Figma prototype reactions to connector lines using the output of 'get_reactions', and guiding the use 'create_connections' in sequence

## Development

### Building the Figma Plugin

1. Navigate to the Figma plugin directory:

   ```
   cd src/cursor_mcp_plugin
   ```

2. Edit code.js and ui.html

## Best Practices

When working with the Figma MCP:

1. Always join a channel before sending commands
2. Get document overview using `get_document_info` first
3. Check current selection with `get_selection` before modifications
4. Use appropriate creation tools based on needs:
   - `create_frame` for containers
   - `create_rectangle` for basic shapes
   - `create_text` for text elements
   - `create_polygon` for polygon shapes
5. Verify changes using `get_node_info`
6. Use component instances when possible for consistency
7. Handle errors appropriately as all commands can throw exceptions
8. For large designs:
   - Use chunking parameters in `scan_text_nodes`
   - Monitor progress through WebSocket updates
   - Implement appropriate error handling
9. For text operations:
   - Use batch operations when possible
   - Consider structural relationships
   - Verify changes with targeted exports
10. For converting legacy annotations:
    - Scan text nodes to identify numbered markers and descriptions
    - Use `scan_nodes_by_types` to find UI elements that annotations refer to
    - Match markers with their target elements using path, name, or proximity
    - Categorize annotations appropriately with `get_annotations`
    - Create native annotations with `set_multiple_annotations` in batches
    - Verify all annotations are properly linked to their targets
    - Delete legacy annotation nodes after successful conversion
11. Visualize prototype noodles as FigJam connectors:
    - Use `get_reactions` to extract prototype flows,
    - set a default connector with `set_default_connector`,
    - and generate connector lines with `create_connections` for clear visual flow mapping.

## License

MIT
