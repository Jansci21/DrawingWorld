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
const confirm_colour = document.getElementById("confirm_button")
const colour_text = document.getElementById("colour_text")

//Page 4 (Home) 
const home = document.getElementById("home")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d") //returns an object with tools(methods) for drawing.
const canvas_container = document.getElementById("canvas_container")

const canvas_eraser = document.getElementById("canvas_eraser")
const canvas_brush = document.getElementById("canvas_brush")
const canvas_undo = document.getElementById("canvas_undo")
const canvas_redo = document.getElementById("canvas_redo")


let canvas_history = []

const blank_canvas = ctx.getImageData(0,0, canvas.width, canvas.height)
canvas_history.push(blank_canvas)

let state = {
    page: "home",
    shape: null,
    colour: null,
    colour_pallete: null,
    shape_colour: "yellowgreen",
    tool: "brush",
    stroke: 0,
    undo: false
}



let zoom = 1


function newworld() {
    console.log("New world creation has been selected.")

    for (let button of buttons) {
        button.style.display = "none"
    }

    //show shape screen

    state.page = "shapes"
    shapes_page.style.display = "block"

    //set up click for shapes
    shapes.forEach(function(shape) {
        shape.addEventListener("click", function() {
            shape_selected(shape)
        })
    })

}

function shape_selected(shape) {
    console.log("A", shape.id, "world has been selected.")

    shapes.forEach(function(othershape) {
        if (othershape !== shape) {
            shape_text.style.display = "none"
            othershape.style.display = "none"
            shape.classList.add("selected")
            state.page = "colours"
            state.colour_pallete = "shapes"

        }
    })

    if (state.page === "colours" && state.colour_pallete === "shapes") {
        //show colour page
        if (state.colour === null) {
            colours_page.style.display = "flex"
        } 
            
                
        //set up click for colours
        colours.forEach(function(colour) {
            colour.addEventListener("click", function() {
                colour_selected(colour, shape, "preset")
            })
        })

        //set up click for colour picker
        colour_picker.addEventListener("input", function() {
            colour_selected(colour_picker.value, shape, "custom")
        })

        //set up click for confirm colour button
        confirm_colour.addEventListener("click", function() {
            colours_page.style.display = "none"
            console.log("The colour painted has been confirmed.")
            canvas_board(shape, state.shape_colour)
            //zooming(shape)
            //home_page()
            texture_page()
            state.page = "texture"
            state.colour_pallete = "texture"


        })


    }

    
}

function texture_page() {
    drawing(canvas)


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

    colours_page.style.display = "block"
    colour_text.style.display = "none"

    if (state.page === "texture" && state.colour_pallete === "texture") {
        
    }

    
}

function colour_selected(colour, shape, type) {
    if (type === "preset") {
        const colourchosen = getComputedStyle(colour).backgroundColor
        console.log("The selected shape has been painted", colourchosen)
        shape.style.backgroundColor = colourchosen
        state.shape_colour = colourchosen

    }

    else {
        shape.style.backgroundColor = colour
        state.shape_colour = colour
    }


    
}

function zooming(shape) {
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
        shape.style.transform = `scale(${zoom})`
    })
}

function home_page() {
    home.style.display = "block"
}

function canvas_board(shape, colour) {
    canvas_container.style.display = "flex"
    //console.log(shape)
    console.log(colour)

    //radius = getComputedStyle(shape).borderRadius
    //console.log(radius)

    //canvas.style.borderRadius = radius
    shape.style.display = "none"
    canvas.style.backgroundColor = colour 
    console.log(colour)
}

function drawing(element) {
    let drawing = false

    element.addEventListener("mousedown", function(event) {
        drawing = true

        ctx.beginPath() //ready for a new drawing and thus ending the last one
        ctx.moveTo(event.offsetX, event.offsetY) //stroke starting here

    })

    element.addEventListener("mouseup", function() {
        drawing = false
        ctx.beginPath() //ready for a new drawing and thus ending the last one
        state.stroke += 1
        if (state.undo === true) {
            canvas_history.splice(state.stroke)
            state.undo = false
        }

        const image_data = ctx.getImageData(0,0, canvas.width, canvas.height)
        
        
        canvas_history.push(image_data)
    })

    element.addEventListener("mousemove", function(event) {
        if (drawing === true) {

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

    //when add items is clicked
}


buttons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        const type = event.target.dataset.type

        //New World
        if (type === "New world") {
            newworld()
        }
        //Upload
        if (type === "Upload") {
            console.log("File ready to upload.")
            //add open file explorer and etc to upload
        }
    })
})




