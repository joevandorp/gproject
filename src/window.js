const windowState = [];
let windowCounter = 0;
let topZIndex = 1; // Global variable to track the topmost z-index
let derp=null;

document.addEventListener("keydown", function(event) {
    if ( event.key === "w" ) { // Check if the pressed key is "w"
        createNewWindow(event);
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const hardcodedWindows = document.querySelectorAll('.window'); 

    
    hardcodedWindows.forEach(windowElement => {
        const content = windowElement.querySelector('.content').innerHTML;
        const header = windowElement.querySelector('.header').textContent;
        const style = windowElement.getAttribute('style');

        // Remove the hardcoded window from the DOM
        windowElement.remove();

        // Create a new programmatically-generated window with the same content
        createNewWindow(null, content, header, style);
    });

    const programmaticWindows = [...document.querySelectorAll('.window')].reverse(); 

    let zindex=1;
    let top=60;
    let left=10;

    programmaticWindows.forEach(windowElement => {
        windowElement.style.zIndex = zindex;
        windowElement.style.top = `${top}px`;
        windowElement.style.left = `${left}px`;
        zindex++;
        top+=20;
        left+=10;
    });

});


function createNewWindow(event, contentText = "Content goes here.", headerText = null, style = null) {
    const windowElement = createWindowElement();
    const headerElement = createHeaderElement();
    const contentElement = createContentElement(contentText);
    const resizeHandle = createResizeHandle(); // Create the resize handle
    const closeHandle = createCloseHandle();
    

    
    windowElement.appendChild(resizeHandle); // Append the handle to the window
    windowElement.addEventListener("mousedown", bringToFront);
    windowElement.style = style; // Apply the style attribute to the window

    windowCounter++;

    const windowId = windowCounter;

    //the width and height of the window is in the style attribute then use it if not set to 400x350
    const windowWidth = windowElement.style.width || 400;
    const windowHeight = windowElement.style.height || 350;

    const { winTop, winLeft } = generateWindowPosition(event, 'mouse', windowWidth, windowHeight);

    console.log(winTop, winLeft);

    setWindowAttributes(windowElement, windowId, winTop, winLeft);
    setHeaderAttributes(headerElement, windowId, headerText);

    windowElement.appendChild(headerElement);
    headerElement.appendChild(closeHandle);
    windowElement.appendChild(contentElement);

    addWindowToDOM(windowElement);
    addWindowState(windowId, winTop, winLeft);
        windowElement.style.zIndex = ++topZIndex;
    // Make the window draggable
    makeWindowDraggable(windowElement, headerElement);
    makeWindowResizable(windowElement, resizeHandle); 
  
}




function bringWindowToFront(windowElement) {
    windowElement.style.zIndex = ++topZIndex;
}

function bringToFront() {
    bringWindowToFront(this);
    updateActiveWindowRef(this.id);
}

function updateActiveWindowRef(windowId) {
    // Remove 'active' class from all window references
    const allWindowRefs = document.querySelectorAll('.window-ref');
    allWindowRefs.forEach(ref => ref.classList.remove('active'));

    // Add 'active' class to the focused window's reference
    const startBar = document.getElementById("startbar");
    const activeWindowRef = startBar.querySelector(`.window-ref[data-id="${windowId}"]`);
    if (activeWindowRef) {
        activeWindowRef.classList.add('active');
    }
}

function createCloseHandle() {
    const closeHandle = document.createElement("div");
    closeHandle.className = "close-handle";
    closeHandle.textContent = "X"; // Set the text to "X"
    closeHandle.onclick = function() {
      closeThisWindow(this); // Attach the closeThisWindow function
    };
    return closeHandle;
  }

// Function to create a resize handle
function createResizeHandle() {
  const resizeHandle = document.createElement("div");
  resizeHandle.className = "resize-handle";
  return resizeHandle;
}

function makeWindowResizable(windowElement, handle) {
  let isResizing = false;
  document.body.classList.remove('no-select');
  let startX, startY, startWidth, startHeight;
  
  

  handle.addEventListener("mousedown", (e) => {
    isResizing = true;
    document.body.classList.add('no-select');
    startX = e.clientX;
    startY = e.clientY;
    startWidth = windowElement.offsetWidth;
    startHeight = windowElement.offsetHeight;
    
    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  });

  function doResize(e) {
    if (isResizing) {
      const width = startWidth + (e.clientX - startX);
      const height = startHeight + (e.clientY - startY);
      
      windowElement.style.width = `${width}px`;
      windowElement.style.height = `${height}px`;
    }
  }

  function stopResize() {
    isResizing = false;
    document.body.classList.remove('no-select');
    document.removeEventListener("mousemove", doResize);
    document.removeEventListener("mouseup", stopResize);
  }
} 

// Function to create a new window element
function createWindowElement() {
  const windowElement = document.createElement("div");
  windowElement.className = "window";
  return windowElement;
}

// Function to create a new header element
function createHeaderElement() {
  const headerElement = document.createElement("div");
  headerElement.className = "header";
  return headerElement;
}

// Function to create a new content element
function createContentElement(contentText) {
  const contentElement = document.createElement("div");
  contentElement.className = "content";
  contentElement.innerHTML = contentText;
  return contentElement;
}

function generateWindowPosition(event, position, windowWidth = 400, windowHeight = 350) {
    let winTop, winLeft;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    switch (position) {
        case 'top-right':
            winTop = 0;
            winLeft = screenWidth - windowWidth;
            break;

        case 'center':
            winTop = Math.max(0, (screenHeight - windowHeight) / 2);
            winLeft = Math.max(0, (screenWidth - windowWidth) / 2);
            break;
    
        case 'mouse': // default to wherever the mouse is
            const mouseX = mouse.lastMouseX;
            const mouseY = mouse.lastMouseY;

            // Calculate top position
            if (mouseY + windowHeight > screenHeight) {
                winTop = screenHeight - windowHeight;
            } else {
                winTop = mouseY;
            }

            // Calculate left position
            if (mouseX + windowWidth > screenWidth) {
                winLeft = screenWidth - windowWidth;
            } else {
                winLeft = mouseX;
            }

            // Ensure positions are not negative
            winTop = Math.max(0, winTop);
            winLeft = Math.max(0, winLeft);
            break;

        default:
            winTop = 0;
            winLeft = 0;
            break;
}

    return { winTop, winLeft };
}


function setWindowAttributes(windowElement, windowId, randomTop, randomLeft) {
    windowElement.id = `domwindow-${windowId}`;
    windowElement.style.top = `${randomTop}px`;
    windowElement.style.left = `${randomLeft}px`;
    windowElement.style.width = windowElement.style.width || "400px";  // Default width if not set
    windowElement.style.height = windowElement.style.height || "350px"; // Default height if not set
}

// Function to set header element attributes
function setHeaderAttributes(headerElement, windowId, headerText = null) {
    if (!headerText) {
        headerElement.textContent = `Window ${windowId}`;
    } else {
        headerElement.textContent = headerText;
    }
}

function toggleWindow(windowElement, arrowDirection) {
    const isMaximized = windowElement.getAttribute("data-maximized") === "true";

    if (arrowDirection === 'up' && !isMaximized) {
        // Maximize the window
        maximizeWindow(windowElement);
    } else if (arrowDirection === 'down' && isMaximized) {
        // Return window to normal state
        windowElement.removeAttribute("data-maximized");
        windowElement.style.width = originalSize.width;
        windowElement.style.height = originalSize.height;
        windowElement.style.top = originalPosition.top;
        windowElement.style.left = originalPosition.left;
    } else if (arrowDirection === 'down' && !isMaximized) {
        // Minimize the window
        windowElement.style.display = "none";
    }
}


// Function to add window to the DOM
function addWindowToDOM(windowElement) {
  document.body.appendChild(windowElement);
}

// Function to add window state to the array
function addWindowState(windowId, randomTop, randomLeft) {
  windowState.push({
    id: windowId,
    originalWidth: 150,
    originalHeight: 100,
    curwidth: 150,
    curheight: 100,
    curtop: randomTop,
    curleft: randomLeft,
  });
}

function maximizeWindow(windowElement) {
    // Capture the original position and size
    windowElement.setAttribute('data-original-top', windowElement.style.top || `${windowElement.offsetTop}px`);
    windowElement.setAttribute('data-original-left', windowElement.style.left || `${windowElement.offsetLeft}px`);
    windowElement.setAttribute('data-original-width', windowElement.style.width || `${windowElement.offsetWidth}px`);
    windowElement.setAttribute('data-original-height', windowElement.style.height || `${windowElement.offsetHeight}px`);
    originalPosition = {
        top: windowElement.style.top,
        left: windowElement.style.left
    };
    originalSize = {
        width: windowElement.style.width,
        height: windowElement.style.height
    };

    // Set the window to full screen
    windowElement.style.top = "0px";
    windowElement.style.left = "0px";
    windowElement.style.width = "100%";
    windowElement.style.height = "100%";
    windowElement.setAttribute("data-maximized", "true");
}


function makeWindowDraggable(windowElement, headerElement) {
    let isDragging = false;
    let offsetX, offsetY;
  
    headerElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      document.body.classList.add('no-select');
      offsetX = e.clientX - windowElement.getBoundingClientRect().left;
      offsetY = e.clientY - windowElement.getBoundingClientRect().top;
  
      // Save original position and size if window is maximized
      if(windowElement.getAttribute("data-maximized") === "true") {
          originalSize = {
              width: windowElement.style.width,
              height: windowElement.style.height
          };
          originalPosition = {
              top: windowElement.style.top,
              left: windowElement.style.left
          };
      }
    });


  
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
  
            // If window reaches the top of the screen
            if (newTop <= 0 && !windowElement.getAttribute("data-maximized")) {
                maximizeWindow(windowElement);
                isDragging = false; // Prevent further dragging when maximized
                document.body.classList.remove('no-select');
                return; // Exit the function
            }
            
            windowElement.style.left = newLeft + "px";
            windowElement.style.top = newTop + "px";
  
            // If window is pulled away from the top after being maximized
            if (newTop > 5 && windowElement.getAttribute("data-maximized")) { // newTop > 5 to give a slight buffer
                windowElement.removeAttribute("data-maximized");
            
                windowElement.style.top = windowElement.getAttribute('data-original-top');
                windowElement.style.left = windowElement.getAttribute('data-original-left');
                windowElement.style.width = windowElement.getAttribute('data-original-width');
                windowElement.style.height = windowElement.getAttribute('data-original-height');
            
                // Reset original position and size attributes
                windowElement.removeAttribute('data-original-top');
                windowElement.removeAttribute('data-original-left');
                windowElement.removeAttribute('data-original-width');
                windowElement.removeAttribute('data-original-height');
            } 
        }
    });
  
    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.classList.remove('no-select');
    });
  }

  function closeThisWindow(closeButtonElement) {
    console.log(closeButtonElement);
    // Find the closest window element to the clicked 'X' button
    const windowElement = closeButtonElement.closest('.window');

    if (windowElement) {
        // Extract the window ID from the window element's ID attribute
        const windowId = windowElement.id.split('-')[1];

        // Convert the window ID to a number and call the removeWindow function
        removeWindow(Number(windowId));
    } else {
        console.log('Window element not found.');
    }
}


  function removeWindow(windowId) {
    // Find the window element in the DOM
    const windowElement = document.getElementById(`domwindow-${windowId}`);
    
    if (windowElement) {
        // Remove the window element from the DOM
        windowElement.remove();

        // Remove the window state from the windowState array
        const windowIndex = windowState.findIndex(window => window.id === windowId);
        if (windowIndex > -1) {
            windowState.splice(windowIndex, 1);
        }

        // Optionally, remove the associated reference from the start bar if exists
        const startBar = document.getElementById("startbar");
        const windowRef = startBar.querySelector(`.window-ref[data-id="${windowId}"]`);
        if (windowRef) {
            windowRef.remove();
        }
        
        console.log(`Window with ID ${windowId} has been removed.`);
    } else {
        console.log(`No window found with ID ${windowId}.`);
    }
}
