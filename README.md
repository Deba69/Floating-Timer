# Floating Timer

A lightweight, floating timer application built with Electron that stays on top of other windows. Perfect for keeping track of time while working on other tasks.

## Features

- 🕒 Floating timer that stays on top of other windows
- 🎯 Multiple timer modes (countdown and stopwatch)
- ⚡ Quick preset buttons (30 min, 1 hour, 2 hours)
- 🎨 Custom time input (hours, minutes, seconds)
- 🖱️ Draggable window with minimize/close controls
- 🌙 Dark, modern UI design

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

### Installing Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version for your operating system
3. Run the installer and follow the setup instructions
4. Verify installation by opening a terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

## Installation

1. **Clone or download the project**
   ```bash
   git clone https://github.com/Deba69/Floating-Timer
   cd Floating-Timer
   ```
   
   Or simply navigate to the project folder if you already have the files.

2. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

To start the floating timer application:

```bash
npm start
```

Or alternatively:

```bash
electron .
```

### Building for Distribution

To create a distributable version of the application:

1. Install electron-builder globally:
   ```bash
   npm install -g electron-builder
   ```

2. Build the application:
   ```bash
   electron-builder
   ```

## Usage

### Basic Controls

- **Start/Stop**: Click the "Start" button to begin the timer
- **Reset**: Click "Reset" to clear the timer back to 00:00:00
- **Switch Mode**: Toggle between countdown timer and stopwatch modes

### Timer Options

- **Preset Buttons**: Quick access to common durations (30 min, 1 hour, 2 hours)
- **Custom Time**: Enter specific hours, minutes, and seconds using the input fields

### Window Controls

- **Minimize**: Click the yellow button (-) to minimize the window
- **Close**: Click the red button (×) to close the application
- **Move**: Click and drag anywhere on the timer to reposition it

## Project Structure

```
timer/
├── index.html          # Main HTML file with UI
├── main.js            # Electron main process
├── renderer.js        # Frontend JavaScript logic
├── package.json       # Project configuration and dependencies
└── README.md          # This file
```

## Dependencies

- **Electron** (^28.1.0) - Cross-platform desktop application framework

## Development

### Adding New Features

1. Modify the UI in `index.html`
2. Update the logic in `renderer.js`
3. Handle any new IPC events in `main.js`

### Styling

The application uses CSS for styling. The main styles are embedded in the `index.html` file for simplicity.

## Troubleshooting

### Common Issues

1. **"electron command not found"**
   - Make sure you've run `npm install` to install dependencies

2. **Application won't start**
   - Check that Node.js is properly installed
   - Verify all dependencies are installed with `npm install`

3. **Timer not working**
   - Check the browser console for JavaScript errors
   - Ensure `renderer.js` is properly loaded

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Verify your Node.js and npm versions
3. Try deleting `node_modules` and running `npm install` again

## License

This project is licensed under the ISC License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this floating timer application. 