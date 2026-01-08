let filters = {
    Brightness: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    Contrast: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    Saturation: {
        value: 100,
        min: 0,
        max: 200,
        unit: "%"
    },
    HueRotation: {
        value: 0,
        min: 0,
        max: 360,
        unit: "deg"
    },
    Blur: {
        value: 0,
        min: 0,
        max: 20,
        unit: "px"
    },
    Grayscale:{
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    }, 
    Sepia: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    }, 
    Opacity: {
        value: 100,
        min: 0,
        max: 100,
        unit: "%"
    }, 
    Invert: {
        value: 0,
        min: 0,
        max: 100,
        unit: "%"
    }, 
}

const imageCanvas = document.querySelector("#image-canvas")
const imgInput = document.querySelector("#image-input")
const canvasCTX = imageCanvas.getContext("2d")
const resetBtn = document.querySelector("#reset-btn")
const downloadBtn = document.querySelector("#download-btn")

let file = null
let image = null

const filtersContainer = document.querySelector(".filters")

function createFilterElement(name, unit = "%", value, min, max){ 

    const div = document.createElement("div")
    div.classList.add("filter")

    const input = document.createElement("input")
    input.type = "range"
    input.min = min
    input.max = max
    input.value = value
    input.id = name

    const p = document.createElement("p")
    p.innerText = name

    div.appendChild(p)
    div.appendChild(input)

    input.addEventListener("input", (event) => {
        filters[name].value = input.value
        applyFilters()
    }) 

    return div
}

function createFilters() {
    filtersContainer.innerHTML = "" // Clear existing filters first
    Object.keys(filters).forEach(key => {
        const filterElements = createFilterElement(key, filters[key].unit, filters[key].value, filters[key].min, filters[key].max)
        filtersContainer.appendChild(filterElements)
    })
}

createFilters()

imgInput.addEventListener("change", (event) => { 
    file = event.target.files[0]  
    const imagePlaceholder = document.querySelector(".placeholder")              
    imageCanvas.style.display = "block"
    imagePlaceholder.style.display = "none"

    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
        image = img
        imageCanvas.width = img.width
        imageCanvas.height = img.height
        const ctx = imageCanvas.getContext("2d")
        ctx.drawImage(img, 0, 0)                                                             
    }
})

function applyFilters() {
    if (!image) return; // Don't apply if no image loaded
    
    canvasCTX.clearRect(0, 0, imageCanvas.width, imageCanvas.height)
    canvasCTX.filter = `brightness(${filters.Brightness.value}${filters.Brightness.unit})
    contrast(${filters.Contrast.value}${filters.Contrast.unit})
    saturate(${filters.Saturation.value}${filters.Saturation.unit})
    hue-rotate(${filters.HueRotation.value}${filters.HueRotation.unit})
    blur(${filters.Blur.value}${filters.Blur.unit})
    grayscale(${filters.Grayscale.value}${filters.Grayscale.unit})
    sepia(${filters.Sepia.value}${filters.Sepia.unit})
    opacity(${filters.Opacity.value}${filters.Opacity.unit})
    invert(${filters.Invert.value}${filters.Invert.unit})`.trim()
    canvasCTX.drawImage(image, 0, 0)
}

resetBtn.addEventListener("click", () => { 
    // Reset filters object to default values
    filters.Brightness.value = 100;
    filters.Contrast.value = 100;
    filters.Saturation.value = 100;
    filters.HueRotation.value = 0;
    filters.Blur.value = 0;
    filters.Grayscale.value = 0;
    filters.Sepia.value = 0;
    filters.Opacity.value = 100;
    filters.Invert.value = 0;
    
    // Recreate all filter sliders with reset values
    createFilters()
    
    // Apply filters to image if loaded
    if (image) {
        applyFilters()
    }
})

downloadBtn.addEventListener("click", () => {
    if (!image) {
        alert("Please load an image first!")
        return
    }
    
    const link = document.createElement("a")
    link.download = "filtered-image.png"
    link.href = imageCanvas.toDataURL()
    link.click()
})