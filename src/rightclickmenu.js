const menuItems = [
    { name: "Create Asset Here", action: function(menu) { 

        // Parse and use the menu's style properties directly
        const x = parseInt(menu.style.left);
        const y = parseInt(menu.style.top);

        const boardX = Math.floor((x - board.offsetX) / (board.square.width + board.square.margin));
        const boardY = Math.floor((y - board.offsetY) / (board.square.height + board.square.margin));

        board.assets.push(new asset(boardX, boardY));
        console.log('Created asset at ' + boardX + ',' + boardY);
    }}
];

// Function to create the custom menu
function createCustomMenu(items) {
    const customMenu = document.createElement("ul");
    customMenu.classList.add("custom-menu");

    items.forEach(item => {
        const menuItem = document.createElement("li");
        menuItem.textContent = item.name;
        menuItem.addEventListener("click", function(event) {
            item.action(customMenu);
        });
        customMenu.appendChild(menuItem);
    });

    document.body.appendChild(customMenu);
}

// Trigger action when the context menu is about to be shown
document.addEventListener("contextmenu", function (event, items) {
    items = items || menuItems;
    event.preventDefault();
    createCustomMenu(items);

    const customMenu = document.querySelector(".custom-menu");
    if (customMenu) {
        customMenu.style.top = event.pageY + "px";
        customMenu.style.left = event.pageX + "px";
        customMenu.style.display = "block";

        // Hide the menu when the user clicks outside of it
        document.addEventListener("click", function() {
            customMenu.style.display = "none";
            customMenu.remove();
        }, { once: true }); // Use { once: true } to ensure the event listener is removed after one use
    }
});
