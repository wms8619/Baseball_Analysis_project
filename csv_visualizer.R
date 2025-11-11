# Install required packages if not already installed
packages <- c("shiny", "ggplot2", "DT", "dplyr")
installed <- packages %in% rownames(installed.packages())
if (any(!installed)) {
  install.packages(packages[!installed])
}

library(shiny)
library(ggplot2)
library(DT)
library(dplyr)

# Define UI
ui <- fluidPage(
  titlePanel("CSV Data Visualization & Analysis Dashboard"),
  
  sidebarLayout(
    sidebarPanel(
      fileInput("file", "Upload CSV File", 
                accept = c(".csv")),
      uiOutput("var_select"),
      selectInput("plot_type", "Plot Type", 
                  choices = c("Histogram", "Scatter Plot", "Box Plot")),
      hr(),
      checkboxInput("show_data", "Show Data Table", TRUE)
    ),
    
    mainPanel(
      plotOutput("plot"),
      DTOutput("table")
    )
  )
)

# Define Server
server <- function(input, output, session) {
  
  # Reactive expression to read CSV
  data <- reactive({
    req(input$file) # Wait until file is uploaded
    tryCatch({
      read.csv(input$file$datapath, stringsAsFactors = FALSE)
    }, error = function(e) {
      showNotification("Error reading file. Please check CSV format.", type = "error")
      return(NULL)
    })
  })
  
  # Dynamically generate variable selectors based on uploaded data
  output$var_select <- renderUI({
    req(data())
    tagList(
      selectInput("xvar", "X-axis Variable", choices = names(data())),
      selectInput("yvar", "Y-axis Variable (for Scatter/Box)", 
                  choices = names(data()), selected = names(data())[2])
    )
  })
  
  # Render plot
  output$plot <- renderPlot({
    req(data(), input$xvar)
    df <- data()
    
    if (input$plot_type == "Histogram") {
      ggplot(df, aes_string(x = input$xvar)) +
        geom_histogram(fill = "steelblue", color = "white", bins = 30) +
        theme_minimal()
      
    } else if (input$plot_type == "Scatter Plot") {
      req(input$yvar)
      ggplot(df, aes_string(x = input$xvar, y = input$yvar)) +
        geom_point(color = "darkred") +
        theme_minimal()
      
    } else if (input$plot_type == "Box Plot") {
      req(input$yvar)
      ggplot(df, aes_string(x = input$xvar, y = input$yvar)) +
        geom_boxplot(fill = "orange") +
        theme_minimal()
    }
  })
  
  # Render data table
  output$table <- renderDT({
    req(data())
    if (input$show_data) {
      datatable(data(), options = list(pageLength = 10))
    }
  })
}

# Run the app
shinyApp(ui, server)

