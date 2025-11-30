# Linux Desktop Enviroment Inspired Portfolio Website

This is an portfolio website that shows anyone who visits my portfolio about the love of linux by me.

## Project Details

This Project is trying to simulate or replicate a Linux Based Desktop Environment Linux Kde Plasma. 
It has basic things that an linux installation has like a browser, terminal, start menu, taskbar, etc.
A non technical person could easily mistake this site for an acutal desktop if the tab is in fullscreen.

### Tech Stack Used

This Project is made using react+vite, with JS.
There is not any extra library used for things like the terminal or any other features of the OS.

### Rough Idea of how things work

So every "Apps" are in a different jsx and when you click on them then a function will be triggred which will set a variable corrosponding to the app to "true" or on. Then that will make that app show up on the desktop due to the conditional rendering which checks for these "true" values. Then that "App" will pop up on the screen, it does not take extra space due to position:fixed in the css. Then there is a onClose prop passed to the jsx which in case of clicking the cross button on activate which will turn the initial "true" value to "false" and due to conditional rendering the app will stop rendering. 

### Features

#### Desktop Environment
- Full Desktop Environment Simulation
- A working Taskbar 
- Semi Working Start Menu (the apps cannot be searched and apps cannot be opened from it yet)
- theme system (this is in the settings icon, it is half working)

#### Applications
- Terminal
  A working terminal with different commands like
    - help (displays all command and its use )
    - clear (clears the terminal)
    - date (shows the date and the time)
    - echo (repeats the text after that command)
    - ls (displays all things on that directory)
    - pwd (shows your location)
    - fastfetch (shows system information)

- Browser
    A working Browser is features with
        - A home page
        - URL search bar
        - ability to navigate to previous and forward pages
        - Home Page 
        - close browser button

- Notepad
    A notepad app that i am using to show my info

- Settings
    It is kinda WIP

#### Notifications

You can show Notifications like in the login page if you do not click on the picture.


## Live Demo

Check out the live demo at : https://portfolio-kde-plasma.vercel.app/


## Installation and Setup

### Prerequisites
- Node.js (version 14+)
- npm or yarn

### Local Development

#### Clone the repository
git clone https://github.com/Abhinav2065/portfolio-kde-plasma


#### Install dependencies
npm install

#### Start development server
npm run dev

#### Build for production
npm run build



## Author

Abhinav Siluwal
abhinavsl511@gmail.com



## ⭐ Star this repo if you found it interesting!




(This Project is a WIP. Features and Documentation are regularly updated)