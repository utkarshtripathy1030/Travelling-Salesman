class TSPSolver {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cities = [];
        this.path = [];
        this.totalDistance = 0;
        this.totalCost = 0;
        this.solveTime = 0;
        this.animationProgress = 0;
        this.isAnimating = false;
        this.isDarkMode = true;
        
        this.setupEventListeners();
        this.updateDisplay();
        this.setupDarkMode();
    }
    
    setupEventListeners() {
        // Canvas click to add city
        this.canvas.addEventListener('click', (e) => {
            if (this.isAnimating) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.addCity(x, y);
        });
        
        // Right click to remove city
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (this.isAnimating) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.removeNearestCity(x, y);
        });
        
        // Button controls
        document.getElementById('solveBtn').addEventListener('click', () => {
            this.solveTSP();
        });
        
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearCities();
        });
        
        document.getElementById('randomBtn').addEventListener('click', () => {
            this.generateRandomCities();
        });
        
        // Cost calculator inputs
        document.getElementById('costPerUnit').addEventListener('input', () => {
            this.calculateCost();
        });
        
        document.getElementById('fixedCost').addEventListener('input', () => {
            this.calculateCost();
        });
        
        document.getElementById('timeCostPerHour').addEventListener('input', () => {
            this.calculateCost();
        });
    }
    
    setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const html = document.documentElement;
        
        darkModeToggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            
            if (this.isDarkMode) {
                html.classList.add('dark');
                darkModeToggle.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                `;
            } else {
                html.classList.remove('dark');
                darkModeToggle.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                `;
            }
            
            this.draw();
        });
    }
    
    addCity(x, y) {
        this.cities.push({ x, y, id: this.cities.length });
        this.path = [];
        this.totalDistance = 0;
        this.updateDisplay();
        this.draw();
    }
    
    removeNearestCity(x, y) {
        if (this.cities.length === 0) return;
        
        let nearestIndex = 0;
        let nearestDistance = this.getDistance(x, y, this.cities[0].x, this.cities[0].y);
        
        for (let i = 1; i < this.cities.length; i++) {
            const distance = this.getDistance(x, y, this.cities[i].x, this.cities[i].y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestIndex = i;
            }
        }
        
        if (nearestDistance < 30) { // Remove if within 30 pixels
            this.cities.splice(nearestIndex, 1);
            this.path = [];
            this.totalDistance = 0;
            this.updateDisplay();
            this.draw();
        }
    }
    
    clearCities() {
        this.cities = [];
        this.path = [];
        this.totalDistance = 0;
        this.isAnimating = false;
        this.updateDisplay();
        this.draw();
    }
    
    generateRandomCities() {
        this.clearCities();
        const numCities = Math.floor(Math.random() * 8) + 5; // 5-12 cities
        
        for (let i = 0; i < numCities; i++) {
            const x = Math.random() * (this.canvas.width - 40) + 20;
            const y = Math.random() * (this.canvas.height - 40) + 20;
            this.cities.push({ x, y, id: i });
        }
        
        this.updateDisplay();
        this.draw();
    }
    
    getDistance(x1, y1, x2, y2) {
        const metric = document.getElementById('costMetric').value;
        
        switch(metric) {
            case 'manhattan':
                return Math.abs(x2 - x1) + Math.abs(y2 - y1);
            case 'chebyshev':
                return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
            case 'euclidean':
            default:
                return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
    }
    
    calculateCost() {
        if (this.totalDistance === 0) {
            this.totalCost = 0;
            return;
        }
        
        const costPerUnit = parseFloat(document.getElementById('costPerUnit').value) || 10;
        const fixedCost = parseFloat(document.getElementById('fixedCost').value) || 100;
        const timeCostPerHour = parseFloat(document.getElementById('timeCostPerHour').value) || 50;
        
        // Assume average speed of 60 units per hour for time calculation
        const estimatedHours = this.totalDistance / 60;
        
        this.totalCost = (this.totalDistance * costPerUnit) + fixedCost + (estimatedHours * timeCostPerHour);
        this.updateDisplay();
    }
    
    solveTSP() {
        if (this.cities.length < 2) {
            alert('Please add at least 2 cities to solve TSP!');
            return;
        }
        
        const algorithm = document.getElementById('algorithmSelect').value;
        const startTime = performance.now();
        
        switch(algorithm) {
            case '2opt':
                this.solve2Opt();
                break;
            case 'brute':
                this.solveBruteForce();
                break;
            case 'nearest':
            default:
                this.solveNearestNeighbor();
                break;
        }
        
        this.solveTime = Math.round(performance.now() - startTime);
        this.calculateCost();
        this.animateSolution();
        this.updateDisplay();
    }
    
    solveNearestNeighbor() {
        this.path = [];
        const visited = new Set();
        let currentCity = this.cities[0];
        this.path.push(currentCity);
        visited.add(currentCity.id);
        
        while (visited.size < this.cities.length) {
            let nearestCity = null;
            let nearestDistance = Infinity;
            
            for (const city of this.cities) {
                if (!visited.has(city.id)) {
                    const distance = this.getDistance(currentCity.x, currentCity.y, city.x, city.y);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestCity = city;
                    }
                }
            }
            
            if (nearestCity) {
                this.path.push(nearestCity);
                visited.add(nearestCity.id);
                currentCity = nearestCity;
            }
        }
        
        // Complete the cycle
        this.path.push(this.cities[0]);
        this.calculateTotalDistance();
    }
    
    solve2Opt() {
        // Start with nearest neighbor solution
        this.solveNearestNeighbor();
        
        // Apply 2-opt improvements
        let improved = true;
        while (improved) {
            improved = false;
            
            for (let i = 1; i < this.path.length - 2; i++) {
                for (let j = i + 1; j < this.path.length - 1; j++) {
                    const currentDistance = this.getDistance(
                        this.path[i - 1].x, this.path[i - 1].y,
                        this.path[i].x, this.path[i].y
                    ) + this.getDistance(
                        this.path[j].x, this.path[j].y,
                        this.path[j + 1].x, this.path[j + 1].y
                    );
                    
                    const newDistance = this.getDistance(
                        this.path[i - 1].x, this.path[i - 1].y,
                        this.path[j].x, this.path[j].y
                    ) + this.getDistance(
                        this.path[i].x, this.path[i].y,
                        this.path[j + 1].x, this.path[j + 1].y
                    );
                    
                    if (newDistance < currentDistance) {
                        // Reverse the segment between i and j
                        const reversed = this.path.slice(i, j + 1).reverse();
                        this.path.splice(i, j - i + 1, ...reversed);
                        improved = true;
                    }
                }
            }
        }
        
        this.calculateTotalDistance();
    }
    
    solveBruteForce() {
        if (this.cities.length > 8) {
            alert('Brute force is limited to 8 cities for performance reasons!');
            this.solveNearestNeighbor();
            return;
        }
        
        const permutations = this.getPermutations(this.cities.slice(1));
        let bestPath = null;
        let bestDistance = Infinity;
        
        for (const perm of permutations) {
            const path = [this.cities[0], ...perm, this.cities[0]];
            let distance = 0;
            
            for (let i = 0; i < path.length - 1; i++) {
                distance += this.getDistance(
                    path[i].x, path[i].y,
                    path[i + 1].x, path[i + 1].y
                );
            }
            
            if (distance < bestDistance) {
                bestDistance = distance;
                bestPath = path;
            }
        }
        
        this.path = bestPath;
        this.totalDistance = bestDistance;
    }
    
    getPermutations(arr) {
        if (arr.length <= 1) return [arr];
        
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const current = arr[i];
            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
            const perms = this.getPermutations(remaining);
            
            for (const perm of perms) {
                result.push([current, ...perm]);
            }
        }
        
        return result;
    }
    
    calculateTotalDistance() {
        this.totalDistance = 0;
        for (let i = 0; i < this.path.length - 1; i++) {
            this.totalDistance += this.getDistance(
                this.path[i].x, this.path[i].y,
                this.path[i + 1].x, this.path[i + 1].y
            );
        }
    }
    
    animateSolution() {
        this.isAnimating = true;
        this.animationProgress = 0;
        
        const animate = () => {
            this.animationProgress += 0.02;
            
            if (this.animationProgress >= 1) {
                this.animationProgress = 1;
                this.isAnimating = false;
            }
            
            this.draw();
            
            if (this.isAnimating) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw path if exists
        if (this.path.length > 0) {
            this.drawPath();
        }
        
        // Draw cities
        this.drawCities();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.isDarkMode ? '#374151' : '#f0f0f0';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPath() {
        if (this.path.length < 2) return;
        
        this.ctx.strokeStyle = this.isDarkMode ? '#8b5cf6' : '#667eea';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Draw path with animation
        this.ctx.beginPath();
        
        const totalSegments = this.path.length - 1;
        const segmentsToDraw = Math.floor(totalSegments * this.animationProgress);
        
        for (let i = 0; i <= segmentsToDraw && i < this.path.length - 1; i++) {
            if (i === 0) {
                this.ctx.moveTo(this.path[i].x, this.path[i].y);
            }
            this.ctx.lineTo(this.path[i + 1].x, this.path[i + 1].y);
        }
        
        // Draw partial segment for animation
        if (segmentsToDraw < totalSegments && segmentsToDraw + 1 < this.path.length) {
            const progress = (this.animationProgress * totalSegments) - segmentsToDraw;
            const fromCity = this.path[segmentsToDraw];
            const toCity = this.path[segmentsToDraw + 1];
            
            const x = fromCity.x + (toCity.x - fromCity.x) * progress;
            const y = fromCity.y + (toCity.y - fromCity.y) * progress;
            
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.stroke();
        
        // Draw arrows to show direction
        if (this.animationProgress === 1) {
            for (let i = 0; i < this.path.length - 1; i++) {
                this.drawArrow(this.path[i], this.path[i + 1]);
            }
        }
    }
    
    drawArrow(from, to) {
        const angle = Math.atan2(to.y - from.y, to.x - from.x);
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        
        this.ctx.save();
        this.ctx.translate(midX, midY);
        this.ctx.rotate(angle);
        
        this.ctx.fillStyle = this.isDarkMode ? '#8b5cf6' : '#667eea';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-8, -4);
        this.ctx.lineTo(-8, 4);
        this.ctx.closePath();
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawCities() {
        this.cities.forEach((city, index) => {
            // Draw city circle
            this.ctx.fillStyle = this.isDarkMode ? '#ec4899' : '#764ba2';
            this.ctx.beginPath();
            this.ctx.arc(city.x, city.y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw city border
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Draw city number
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(index + 1, city.x, city.y);
        });
    }
    
    updateDisplay() {
        document.getElementById('cityCount').textContent = this.cities.length;
        document.getElementById('totalDistance').textContent = Math.round(this.totalDistance);
        document.getElementById('totalCost').textContent = '$' + Math.round(this.totalCost).toLocaleString();
        document.getElementById('solveTime').textContent = this.solveTime + 'ms';
    }
}

// Initialize the TSP solver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const solver = new TSPSolver('tspCanvas');
});
