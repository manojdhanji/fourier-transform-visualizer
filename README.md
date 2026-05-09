# Fourier Transform Visualizer

An interactive web application that visualizes the Discrete Fourier Transform (DFT) in real-time, showing the relationship between time-domain waveforms, frequency-domain spectra, and winding diagrams.

![Fourier Transform Visualizer](https://img.shields.io/badge/JavaScript-ES6+-blue) ![Docker](https://img.shields.io/badge/Docker-Ready-green) ![Nginx](https://img.shields.io/badge/Nginx-Alpine-lightgrey)

## 🎯 Features

- **Real-time Visualization**: Interactive time-domain waveform, frequency spectrum, and winding diagram
- **Multiple Waveforms**: Support for various signal types including sum of sines, sum of cosines, square waves, and more
- **Interactive Controls**: Adjustable frequency components with real-time DFT computation
- **Educational Tool**: Perfect for understanding Fourier analysis concepts
- **Responsive Design**: Works on desktop and mobile devices
- **Docker Support**: Easy deployment with containerization

## 🚀 Quick Start

### Option 1: Run with Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd fourier-transform-visualizer

# Build and run with Docker Compose
docker-compose up --build

# Access the application at http://localhost:8085
```

### Option 2: Run Locally

```bash
# Open index.html in your web browser
# No server required - it's a static site
```

## 📖 How to Use

1. **Select Waveform**: Choose from various predefined waveforms using the dropdown menu
2. **Adjust Frequency**: Use the frequency slider (k) to explore different frequency components
3. **View Visualizations**:
   - **Time Domain**: Shows the original waveform over time
   - **Frequency Domain**: Displays the magnitude spectrum
   - **Winding Diagram**: Illustrates the complex exponential winding
4. **Compute DFT**: Click the "Compute DFT" button for detailed analysis

## 🏗️ Architecture

```
fourier-transform-visualizer/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Styling and layout
├── js/
│   ├── main.js         # Application orchestrator
│   ├── dft.js          # DFT computation algorithms
│   ├── waveform.js     # Waveform generation functions
│   ├── drawing.js      # Canvas rendering utilities
│   └── utils.js        # Constants and helper functions
├── Dockerfile          # Docker container configuration
└── docker-compose.yaml # Docker Compose setup
```

## 🧮 Technical Details

### Supported Waveforms
- **Sum of Sines**: Multiple sinusoidal components
- **Sum of Cosines**: Cosine-based waveforms
- **Square Wave**: Periodic square function
- **Triangle Wave**: Triangular waveform
- **Sawtooth Wave**: Linear ramp function
- **Custom Functions**: Extensible waveform system

### DFT Implementation
- Uses the standard Discrete Fourier Transform formula
- Real-time computation for interactive exploration
- Magnitude spectrum visualization
- Complex plane winding diagram

## 🛠️ Development

### Prerequisites
- Modern web browser with ES6+ support
- Docker (optional, for containerized deployment)

### Local Development
```bash
# No build process required
# Simply open index.html in your browser
# Or use a local server for better development experience
```

### Docker Development
```bash
# Build the container
docker build -t fourier-visualizer .

# Run the container
docker run -p 8085:80 fourier-visualizer
```

## 📚 Learning Resources

This visualizer helps understand key concepts in:
- **Signal Processing**: Time-frequency domain relationships
- **Fourier Analysis**: Decomposition of signals into frequency components
- **Complex Analysis**: Visualization of complex exponentials
- **Digital Signal Processing**: DFT algorithms and applications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by various Fourier transform visualization tools
- Built with vanilla JavaScript for maximum compatibility
- Uses HTML5 Canvas for high-performance rendering

## 🔗 Links

- [Fourier Transform Theory](https://en.wikipedia.org/wiki/Fourier_transform)
- [Discrete Fourier Transform](https://en.wikipedia.org/wiki/Discrete_Fourier_transform)
- [Signal Processing Fundamentals](https://dspguide.com/)

---

**Made with ❤️ for educational purposes**