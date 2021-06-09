# What is DIARDE? 

If you haven't heard of DIARDE before and do not really know what it is, the best point to start is here: <a href="http://github.com/Diarde/DIARDE" >DIARDE</a>


# What is the DIARDE Plugin for SketchUp? 

3-D models that have been created from photos with DIARDE are stored in DIARDE's MongoDB database. The format 
for storing the 3-D repreentation is custom build, rather simple and tailored to the application. The SketchUp Plugin 
is one way of unleashing the model and allow the data to be used and processed further by design and architecture professionals.

The DIARDE for SketchUp Plugin allows to open a HTML window inside SketchUp giving access to the DIARDE API. The user is able 
to browse through the projects and load the corresponding 3D-models. The Plugin translates the models into SketchUp representations, thus imorting the Models into SKetchup.    

# Getting started

SketchUp Plugins are based on Ruby. The Plugin, however, only uses ruby to the bare minimum. The user-interface to select and load DIARDE models is realised via an HTML WebDialog utilizing a lean Angular 2+ web app.

To get started your first step is to clone the git repository and install node and the package manager NPM if you haven't done so before. Navigate to the DIARDESketchUp room directory and install the necessary third party modules for Angular 2+ by:

&nbsp;&nbsp;&nbsp;&nbsp; **npm install**

Now you are ready to build the web-app:

&nbsp;&nbsp;&nbsp;&nbsp; **ng build --prod**

Now you can move the files to the SketchUp extensions folder:

&nbsp;&nbsp;&nbsp;&nbsp; **coming soon**

The skript works for and has been tested. If case the folder structure for other version should be different or the 
code is not compatible please advise us of the issue studiocinqo@gmail.com

# Contributing

The reason we have open sourced this project is because we want to offer it to a wider audience and allow talented
developers to collaborate. If you want to contribute you are very welcome to do so. 
Please refer to the contribution guidelines


