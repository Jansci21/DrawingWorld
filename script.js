//ELEMENTS & IDS

//Page 1 (2 Buttons)
const buttons = document.querySelectorAll(".button")

//Page 2 (Choose shape of world)
const shapes_page = document.getElementById("shapes_page")
const shapes = document.querySelectorAll(".shape")
const shape_text = document.getElementById("shape_text")

//Page 3 (Choose colour of world)
const colours_page = document.getElementById("colours_page")
const colours = document.querySelectorAll(".colour")
const colour_picker = document.getElementById("colour_picker")
const confirm_button = document.getElementById("confirm_button")
const colour_text = document.getElementById("colour_text")
const colour_container = document.getElementById("colour_container")
const colour_row = document.getElementById("colour_row")


//Page 4 (Home) 
const home = document.getElementById("home")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d") //returns an object with tools(methods) for drawing.
const canvas_container = document.getElementById("canvas_container")

const canvas_eraser = document.getElementById("canvas_eraser")
const canvas_brush = document.getElementById("canvas_brush")
const canvas_undo = document.getElementById("canvas_undo")
const canvas_redo = document.getElementById("canvas_redo")
const canvas_brush_size = document.getElementById("canvas_brush_size")


let canvas_history = []

const blank_canvas = ctx.getImageData(0,0, canvas.width, canvas.height)
canvas_history.push(blank_canvas)

let state = {
    button: null,
    page: null,
    exit: null,
    colour_pallete: null,
    custom_colour: "#000000",
    add_colour: null,
    shape: null,
    shape_colour: "yellowgreen",
    shape_coloured: false,
    drawing: false,
    tool: "brush",
    brush_colour: "black",
    stroke: 0,
    undo: false
}




let zoom = 1


function render() {

    //Exiting Page 1 (Buttons)
    if (state.button === "new world") {
        for (let button of buttons) {
            button.style.display = "none"

        }
    }

    //Page 2 (Select shape)

    if (state.page === "shapes") {
        shapes_page.style.display = "block"
        
    }

    //Exiting Page 2
    if (state.exit === "shapes") {
        shapes.forEach(function(othershape) {
            if (othershape !== state.shape) {
                shape_text.style.display = "none"
                othershape.style.display = "none"       
            }
        })
    }

    //Page 3 (choosing colour) 

    if (state.page === "colours") {
        if (state.shape_coloured === false) {
            colours_page.style.display = "flex"
            colour_container.style.display = "flex"
            

        }
        if (state.shape_coloured === true) {
            state.shape.style.backgroundColor = state.shape_colour

        }
        
        
    }

    //Exiting Page 3
    if (state.exit === "colours") { 
        state.shape.style.display = "none"
        colours_page.style.display = "none"
        canvas.style.backgroundColor = state.shape_colour

    }

    //Page 4 (texture) 
    if (state.page === "texture") {
        canvas_container.style.display = "flex"
        ctx.strokeStyle = state.brush_colour
        console.log("Texture page")
        
        // add the add colour boxes

        if (state.add_colour === false) {
            create()
        }
    }
    //Exiting page 4
    if (state.exit === "texture") {
        canvas_container.style.display = "none"
        colour_container.style.display = "none"
    }

    //Page 5

    if (state.page === "home") {
        home.style.display = "block"
        state.shape.style.display = "block"
        zooming()
        
    }

}
    
//When button is clicked
buttons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        const type = event.target.dataset.type

        if (type === "New world") {
            console.log("New world has been selected.")
            state.page = "shapes"
            state.button = "new world"
            render()
        }

        if (type === "Upload") {
            console.log("Upload file has been selected.")
            //add open file explorer and etc to upload
        }
    })
})

//When a shape is clicked
shapes.forEach(function(shape) {
    shape.addEventListener("click", function() {
        console.log("A shape has been selected.")
        state.shape = shape
        state.exit = "shapes"
        state.page = "colours"
        state.colour_pallete = "shapes"
        shape.classList.add("selected")
        render()
    })
})

//Colour pallete (shape colour & brush colour)


colours.forEach(function(colour) {
    colour.addEventListener("click", function() {
        if (state.colour_pallete === "shapes") {
            console.log("Shape has been coloured.")
            state.shape_colour = getComputedStyle(colour).backgroundColor
            state.shape_coloured = true
            console.log(state.shape_colour)
            render()
        }

        if (state.colour_pallete === "texture") {
            state.brush_colour = getComputedStyle(colour).backgroundColor
            render()
        }
        
        
    })
})

colour_picker.addEventListener("input", function() {
    if (state.colour_pallete === "shapes") {
        //console.log("Shape has been coloured.")
        state.shape_colour = colour_picker.value
        state.shape_coloured = true
        
    
        render()
    }

    if (state.colour_pallete === "texture") {
        state.brush_colour = colour_picker.value
        state.custom_colour = colour_picker.value
        
        render()
    }
    
})

colour_picker.addEventListener("click", function() {
    colour_picker.value = state.custom_colour
    if (state.colour_pallete === "shapes") {
        state.shape_colour = colour_picker.value
    }
    if (state.colour_pallete === "texture") {
        state.brush_colour = colour_picker.value
    }
    render()
})


confirm_button.addEventListener("click", function() {
    if (state.colour_pallete === "shapes") {
        console.log("Colour has been confirmed.")
        state.exit = "colours"
        state.page = "texture"
        state.colour_pallete = "texture"
        console.log("Texture pallete")
        state.add_colour = false
        render()
    }

    else if (state.colour_pallete === "texture") {
        console.log("Texture has been confirmed.")
        const image = new Image()
        image.src = canvas.toDataURL("image/png")
        state.shape.style.backgroundImage = `url(${image.src})`
        state.shape.style.backgroundRepeat = "repeat"
        state.shape.style.backgroundSize = "20px 20px"
        state.exit = "texture"
        state.page = "home"
        render()
    }

})

//adding custom colours to new boxes

function create() {

    const add_colour = document.createElement("div")
    add_colour.classList.add("add_colour") 
    add_colour.classList.add("colour")
    add_colour.textContent = "+"
    colour_row.appendChild(add_colour)
    console.log("New box made.")

    state.add_colour = true


    add_colour.addEventListener("click", function() {
        add_colour.style.backgroundColor = state.custom_colour
        add_colour.textContent = ""
        add_colour.classList.add("coloured")
        console.log("Box coloured")
        create()
        
    }, {once: true} )

    const coloured_box = document.querySelectorAll(".coloured")
    coloured_box.forEach(function(box) {
        box.addEventListener("click", function() {
            state.brush_colour = getComputedStyle(box).backgroundColor
            render()
        })
    })
    

}

//Canvas tools
canvas_eraser.addEventListener("click", function() {
    console.log("Eraser has been selected.")
    state.tool = "eraser"
})

canvas_brush.addEventListener("click", function() {
    console.log("Brush has been selected.")
    state.tool = "brush"
})

canvas_undo.addEventListener("click", function() {
    state.undo = true
    console.log("Undo.")
    state.stroke = Math.max(0, state.stroke-1)
    ctx.putImageData(canvas_history[state.stroke], 0, 0)
})

canvas_redo.addEventListener("click", function() {
    console.log("Redo.")
    state.stroke = Math.min(state.stroke+1, canvas_history.length-1)
    ctx.putImageData(canvas_history[state.stroke], 0, 0)

})

canvas_brush_size.addEventListener("input", function() {
    console.log(canvas_brush_size.value)
    ctx.lineWidth = canvas_brush_size.value
})

//Canvas drawing 
canvas.addEventListener("pointerdown", function(event) {
    console.log("Drawing")
    state.drawing = true
    ctx.beginPath()
    ctx.moveTo(event.offsetX, event.offsetY)
})

canvas.addEventListener("pointerup", function() {
    state.drawing = false
    ctx.beginPath()
    state.stroke += 1
    if (state.undo === true) {
        canvas_history.splice(state.stroke)
        state.undo = false
    }

    const image_data = ctx.getImageData(0,0, canvas.width, canvas.height)
    canvas_history.push(image_data)
})

canvas.addEventListener("pointermove", function(event) {
    if (state.drawing === true) {

        if(state.tool === "brush") {
            console.log("Drawing")
            ctx.globalCompositeOperation = "source-over"
            ctx.lineTo(event.offsetX, event.offsetY) //stroke ending here
            ctx.stroke() //show stroke   
            }

        if (state.tool === "eraser") {
            console.log("Erasing")
            ctx.globalCompositeOperation = "destination-out"
            ctx.lineTo(event.offsetX, event.offsetY) //stroke ending here
            ctx.stroke() //show stroke 
        }
    } 
})




//Zooming stuff
function zooming() {
    window.addEventListener("wheel", function(event) {
        console.log(event.deltaY)
        if(event.deltaY < 0) {
            console.log("Screen has been zoomed in.")
            zoom += 0.1
        } else {
            console.log("Screen has been zoomed out.")
            zoom -= 0.1
        }

        zoom = Math.max(1, Math.min (5.5, zoom))
        state.shape.style.transform = `scale(${zoom})`
    })
}















