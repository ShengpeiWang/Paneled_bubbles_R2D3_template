# notes before using this code ====

# If you want to modify anything in the d3 code, you can open and edit the .js file with any text editor.

# If you want to be able to develop d3 code in the Rstudio environment, you will need the newest version of Rstudio.
# Note that the newest Rstudio install only supports the 64 bit and not the 32 bit version of R.

# to install r2d3 ====
devtools::install_github("rstudio/r2d3")

# load necessary packages ====
library(r2d3)
library(dplyr)

# function to generate bubble charts using R2D3
r2d3(data = list(data = data,
                 data2 = data2,
                 data3 = data3,
                 data4 = data4,
                 legend = data_legend,
                 panel_number = 3, 
                 key = "id",
                 radius ="Percent",
                 color = "color",
                 alpha = "alpha",
                 lable_name = "Label",
                 font_size = "font_size",
                 font_size_title = 30,
                 font = "Times New Roman",
                 font_color = "#000000", 
                 title = "Title goes here",
                 legend_bubble_size = 20,
                 legend_spacing = 15), 
     script = "bubbles.js",
     viewer = c("internal", "external", "browser"))

# instructions==== 
# *please have a value for each option*

# data: dataframe for the first dataset
# data2 - data4: dataframes for the second to fourth datasets. 
#                If you don't need them, just use the "data" dataframe
# legend: dataframe for legend information, must have the following columns: id, X, Y, color, Lable
#         id: unique id for each row
#         X, Y are posistions of each circle in the legend
#         color and Lable are the color and text labels for each bubble in the legend

# panel_bumber: number of panels that will show. max 4
# key: column name for unique ids for each observation
# radius: column name for bubble size
# color: column name for bubble color. could be color names or hex code
# alpha: column name for bubble trnasparency
# lable_name: column name for bubble lables
# font_size: column name for font sizes for bubble lables
# font: (string) font family for both bubble lable and title. check font families supported by javascript
# font_color: (string) font color for both bubble lable and title. This could be a string of hex code or name
# title: (string) tiltle
# legend_bubble_size: size of the circles for the legend
# lengend_spacing: how tightly packed are the circles for the legend, the higher the tighter
# script: "bubbles.js" is where the d3 code lives. If the script is not in the working directory, please provide path to the script.
# viewer: an r2d3 option, a choice among "internal", "external", "browser"
## width and height can also be supplied as part of the r2d3 function. Otherwise they will scale dynamically with the viewing window.


# simple example ====

set.seed(82)
bubble_example_data = 
  data.frame(id = 1:20, 
             size = rnorm(20)+1.5, 
             color = sample(c("teal", "pink", "skyblue"), size = 20, replace = T),
             alpha = runif(20,50,100),
             Label = letters[1:20],
             font_size = 10)

bubble_example_data_legend = 
  data.frame(id = 1:7,
             X = c(1,2,3,4,1,2,3), 
             Y = c(1,1,1,1,2,2,2),
             color = bubble_example_data$color[1:7], 
             Lable = letters[1:7])

r2d3(data = list(data = bubble_example_data,
                 data2 = bubble_example_data ,
                 data3 = bubble_example_data ,
                 data4 = bubble_example_data ,
                 panel_number = 4, 
                 key = "id",
                 radius ="size",
                 color = "color",
                 alpha = "alpha",
                 lable_name = "Label",
                 font_size = "font_size",
                 font_size_title = 30,
                 font = "Times New Roman",
                 font_color = "#000000", 
                 title = "Example bubble chart",
                 legend = bubble_example_data_legend,
                 legend_bubble_size = 20,
                 legend_spacing = 15), 
     script = "bubbles.js",
     viewer = "browser")

# notes for future development ==== 
# wrapper functions can be developed to reduce the number of input parameters. 
# I sticked with the "r3d3" function to make future modifications more straight-forward.

# An additional directions to improve this function is to integrate it with ggplot.
# In order to do that, we need to develop code to calculate the position of each bubble.
# d3 has a "pack" function that generates the X, Y position values depending on the size of the canvas and the bubbles.
# This calculation is not trivial, and I would suggest let D3 handle it. 
# If we pass the inputs to D3 for these calculations, and get the X, Y positions back into R, We can easily graph the circles with ggplot's existing functionality. 
# And future developments can focus on communicating with D3.
