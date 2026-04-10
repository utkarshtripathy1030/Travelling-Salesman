# Travelling Salesman Problem Visualizer

An interactive web application for visualizing and solving the Travelling Salesman Problem with cost calculation and multiple algorithms.

## Features

- 🌍 **Interactive Canvas**: Click to add cities, right-click to remove
- 🧮 **Multiple Algorithms**: Nearest Neighbor, 2-Opt Optimization, Brute Force
- 💰 **Cost Calculation**: Distance-based costs with customizable parameters
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📊 **Real-time Statistics**: Distance, cost, and solve time metrics
- 🎨 **Modern UI**: Built with Tailwind CSS and smooth animations

## Getting Started

### Option 1: Using npm (Recommended)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Option 2: Direct File Access

Simply open `index.html` in your web browser. No setup required!

### Option 3: Python Server

If you have Python installed:
```bash
npm run serve
```
Then visit `http://localhost:8080`

## Usage

1. **Add Cities**: Click anywhere on the canvas to add cities
2. **Remove Cities**: Right-click near a city to remove it
3. **Generate Random**: Click "Random Cities" to generate random city positions
4. **Choose Algorithm**: Select from Nearest Neighbor, 2-Opt, or Brute Force
5. **Set Distance Metric**: Choose Euclidean, Manhattan, or Chebyshev distance
6. **Configure Costs**: Adjust cost parameters in the calculator section
7. **Solve**: Click "Solve TSP" to find the optimal path

## Algorithms

### Nearest Neighbor
- Fast heuristic approach
- Always finds a valid path quickly
- Good for large numbers of cities

### 2-Opt Optimization
- Starts with nearest neighbor solution
- Iteratively improves the path
- Better quality than nearest neighbor alone

### Brute Force
- Tests all possible permutations
- Guaranteed optimal solution
- Limited to 8 cities for performance reasons

## Distance Metrics

- **Euclidean**: Straight-line distance (default)
- **Manhattan**: Grid-based distance (|x₂-x₁| + |y₂-y₁|)
- **Chebyshev**: Maximum of x and y differences

## Cost Calculation

Total Cost = (Distance × Cost per Unit) + Fixed Cost + (Estimated Time × Time Cost per Hour)

- **Cost per Unit**: Cost per unit of distance traveled
- **Fixed Cost**: Base cost for the journey
- **Time Cost per Hour**: Cost based on estimated travel time

## Technologies Used

- **HTML5 Canvas** for visualization
- **Tailwind CSS** for styling
- **Vanilla JavaScript** for algorithms and interactivity
- **Live Server** for development (npm)

## License

MIT License - feel free to use this project for learning or development!
