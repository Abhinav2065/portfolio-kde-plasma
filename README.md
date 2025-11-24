# Linux Simulation Portfolio


This is a Website that Simulates Linux GUI and a Portfolio website, it is a WIP so there are not a lot of things here.

This is made using React+Vite.


# What Works?
1. The Login page thing works where if you click on the picture then you will get redirected to the desktop.
2. Desktop: So the basic version of the desktop works, the wallpaper looks decent imo. 
3. Desktop Icons: I have added 2 desktop icons both are kinda like notepad things so if you click on them you can see information as well or you can change it as well but it is not saved tho cuz i don't think it is a good idea to let ppl change stuff at a portfolio website.
4. Taskbar: So in the Taskbar, while it is not complete i have made the Start Button(first button th Arch logo) kinda work, it does not have a lot but it works, i will add stuff to that later.


# What Does not Work:
1. Terminal: While it does show up when you click on it, you cannot type or do anything. I tried to implement terminal first but it took too long to debug and i just kinda got bored, i will work on the terminal in the future. 
2. Browser: I do have some code for browser but do not have time to implement it yet.
3. File Manager: Yeah i have not even started this one...




# How does the Login Thing Work?

So i have a localstorage that is turned on when you click on the picture at first then you can just use desktop else it will redirect you to the login screen thing.

# How does the Desktop Work?

So the wallpaper is just a background image edited to look like that.

there are multiple components no the Desktop like the taskbar and icons which uses simple css to appear like they are in a desktop.

# How does the notepad work?

It checks for double click and if you double clicked then a use state will set its value to the value of the icon that you clicked, so its title, contents, etc and we check if there are any of these loaded things and if it is then it will appear and once you click on the close button then the use state variable will clear the icon datas so that other icon may load and your screen may be clear.


# What is Left to add?

1. A complete Browser 
2. A working Terminal with a lot of features like fastfetch or neofetch, basic commands for making files, maybe vim even? uh add like mkdir and stuff like that.
3. File Manager (i know this one is gonna be really hard)
4. And some more icons on the desktop.

