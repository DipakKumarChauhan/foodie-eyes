# Rendered Diagrams

This directory contains rendered versions of all Mermaid diagrams from `DIAGRAMS.md`.

## Files

### Diagram 1: Process Flow Diagram - Search & Discovery Flow
- **MMD**: `diagram-1-flowchart.mmd`
- **PNG**: `diagram-1-flowchart.png`
- **SVG**: `diagram-1-flowchart.svg`
- **Description**: Complete process flow from user query to displaying results

### Diagram 2: Use Case Diagram - System Actors & Use Cases
- **MMD**: `diagram-2-graph.mmd`
- **PNG**: `diagram-2-graph.png`
- **SVG**: `diagram-2-graph.svg`
- **Description**: All actors and their interactions with the system

### Diagram 3: Detailed Search Process Flow
- **MMD**: `diagram-3-flowchart.mmd`
- **PNG**: `diagram-3-flowchart.png`
- **SVG**: `diagram-3-flowchart.svg`
- **Description**: Detailed search algorithm with scoring and ranking

### Diagram 4: Component Interaction Flow (Sequence Diagram)
- **MMD**: `diagram-4-sequenceDiagram.mmd`
- **PNG**: `diagram-4-sequenceDiagram.png`
- **SVG**: `diagram-4-sequenceDiagram.svg`
- **Description**: React component interactions and communication

### Diagram 5: Data Flow Diagram
- **MMD**: `diagram-5-flowchart.mmd`
- **PNG**: `diagram-5-flowchart.png`
- **SVG**: `diagram-5-flowchart.svg`
- **Description**: How data moves through the system

### Diagram 6: System Architecture Diagram
- **MMD**: `diagram-6-graph.mmd`
- **PNG**: `diagram-6-graph.png`
- **SVG**: `diagram-6-graph.svg`
- **Description**: Overall system architecture and technology stack

## Regenerating Diagrams

To regenerate these diagrams:

1. Install mermaid-cli:
   ```bash
   npm install -g @mermaid-js/mermaid-cli
   ```

2. Run the render script:
   ```bash
   node scripts/render-diagrams.js
   ```

3. Or manually render individual diagrams:
   ```bash
   cd docs/diagrams-rendered
   mmdc -i diagram-1-flowchart.mmd -o diagram-1-flowchart.png -w 2400 -H 1800 -b white
   ```

## File Formats

- **MMD**: Mermaid source code (editable)
- **PNG**: Raster image format (2400x1800px, white background)
- **SVG**: Vector image format (scalable, white background)

## Usage

- **PNG**: Best for presentations, documentation, and sharing
- **SVG**: Best for web pages and scalable graphics
- **MMD**: Source code for editing and version control
