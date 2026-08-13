//ELEMENTS & IDS

const buttons_list = document.querySelectorAll(".button")
const shapes_list = document.querySelectorAll(".shape")
const create = document.getElementById("create")
const colour_select = document.getElementById("colour_select")

const shape_text = document.getElementById("shape_text")

const colours = document.querySelectorAll(".colour")

const colourpicker = document.getElementById("colourpicker")

const confirm_colour = document.getElementById("confirm_button")

let state = {
    page: null
}

let zoom = 1








buttons_list.forEach(function(button) {
    button.addEventListener("click", function(event) {
        const type = event.target.dataset.type
        console.log(type, "is clicked.")
        //Erase all buttons
        for (let button of buttons_list) {
            button.style.display = "none"
        }
        //New World
        if (type === "New world") {
            console.log("New world is created.")
            create.style.display = "block"

            //shape selection
            shapes_list.forEach(function(shape) {
                shape.addEventListener("click", function() {
                    shapes_list.forEach(function(othershape) {
                        if (othershape !== shape) {
                        shape_text.style.display = "none"
                        othershape.style.display = "none"
                        shape.classList.add("selected")
                    }
                    })
                })

                colour_select.style.display = "flex"
                colours.forEach(function(colour) {
                    colour.addEventListener("click", function() {
                        const colourchosen = getComputedStyle(colour).backgroundColor
                        console.log(colourchosen)
                        shape.style.backgroundColor = colourchosen
                        })

                    colourpicker.addEventListener("input", function() {
                        console.log(colourpicker.value)
                        shape.style.backgroundColor = colourpicker.value
                    })
                    })

                    confirm_colour.addEventListener("click", function() {
                        colour_select.style.display = "none"
                        window.addEventListener("wheel", function(event) {
                            console.log(event.deltaY)
                            if (event.deltaY < 0) {
                                console.log("zoom in")
                                
                                zoom += 0.1
                            }
                            else {
                                console.log("zoom out")
                                zoom -= 0.1
                                
                            }

                            zoom = Math.max(1, Math.min(5.5, zoom));
                            shape.style.transform = `scale(${zoom})`
                        })

                    })
            })



        }
        //Upload
        if (type === "Upload") {
            console.log("File ready to upload.")
            //add open file explorer and etc to upload
        }
    })
})