# Retro Password Strength Checker & Generator

I have built a web application that allows you to easily generate secure passwords and check the strength of existing ones, all wrapped in a sleek retro terminal visual style.

## Key Features

- **Retro Aesthetics**: Uses a green-on-black color scheme with CSS filters and animations to create a realistic CRT monitor effect (complete with scanlines, glowing text, and cursor blinks).
- **Password Generator**: Customize length (4-32 characters) and character sets (uppercase, lowercase, numbers, symbols) via an interactive retro control panel.
- **Copy to Clipboard**: A quick copy button makes retrieving your new password easy.
- **Strength Analyzer**: Automatically grades generated passwords and lets you input your own to analyze. It ranks passwords from `WEAK` to `SECURE` based on length and complexity, providing clear text feedback on how to improve.

## Project Structure

- `index.html`: The structural markup defining the dual-panel layout (one for generation, one for analysis).
- `style.css`: All the visual magic, heavy on text-shadows, custom form controls, and CSS keyframe animations to give it that authentic hacker-terminal feel.
- `script.js`: The brains of the operation. Handles the random character generation, the logic scoring system for password strength, and the DOM events binding the interface to the logic.

Open `index.html` in your browser to start using it!
