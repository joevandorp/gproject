const keys = {
    list: {
        48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
        8: 'backspace', 9: 'tab', 13: 'enter', 16: 'shift', 17: 'ctrl', 18: 'alt', 19: 'pause', 20: 'caps',
        27: 'esc', 33: 'pgup', 34: 'pgdn', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down',
        45: 'ins', 46: 'del', 65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i',
        74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't',
        85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z', 91: 'lcmd', 92: 'rwin', 93: 'rcmd', 96: 'n0',
        97: 'n1', 98: 'n2', 99: 'n3', 100: 'n4', 101: 'n5', 102: 'n6', 103: 'n7', 104: 'n8', 105: 'n9',
        106: 'multiply', 107: 'add', 109: 'subtract', 110: 'decimal', 111: 'divide', 112: 'f1', 113: 'f2',
        114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11',
        123: 'f12', 144: 'numlock', 145: 'scrolllock', 186: 'semicolon', 187: 'equal', 188: 'comma', 189: 'dash',
        190: 'period', 191: 'slash', 192: 'accent', 219: 'lbracket', 220: 'backslash', 221: 'rbracket',
        222: 'quote', 32: 'space'
    },
    state: {}
};

// Initialize key states
Object.keys(keys.list).forEach(keyCode => {
    keys.state[`${keys.list[keyCode]}_state`] = 'keyup';
});

// Keydown event listener
window.addEventListener('keydown', (e) => {
    const code = e.keyCode || e.which;
    const keyName = keys.list[code];

    if (keyName) {
        if (typeof keys[`${keyName}_keydown`] === 'function') {
            keys[`${keyName}_keydown`]();
        }

        if (keys.state[`${keyName}_state`] !== 'keydown') {
            keys.state[`${keyName}_state`] = 'keydown';
            //console.log(`Key down: ${keyName} (${code})`);
        }

        // Example additional logic
        //console.log(`ptoken = ${board.playertoken} ${board.assets.length}`);
        //board.refresh();
        //console.log(`xpos: ${board.assets[board.playertoken].x}, ypos: ${board.assets[board.playertoken].y}, facing: ${board.assets[board.playertoken].facing}`);
    }
});

// Keyup event listener
window.addEventListener('keyup', (e) => {
    const code = e.keyCode || e.which;
    const keyName = keys.list[code];

    if (keyName) {
        if (typeof keys[`${keyName}_keyup`] === 'function') {
            keys[`${keyName}_keyup`]();
        }

        if (keys.state[`${keyName}_state`] !== 'keyup') {
            keys.state[`${keyName}_state`] = 'keyup';
//             console.log(`Key up: ${keyName} (${code})`);
        }

        // Example additional logic
        board.refresh();
    }
});

// Define keydown handlers
keys.l_keydown = () => loadAssets();

keys.n_keydown = () => {
    board.redraw_quadrants = true;
};

keys.k_keydown = () => {
    board.assets = board.assets.slice(0, 30);
};

keys.f_keydown = () => {
    if (typeof zoomTestInterval === 'undefined') {
        board.cameraToAsset(board.playertoken, 'center');
        startZoomTest();
    } else {
        clearInterval(zoomTestInterval);
        zoomTestInterval = undefined;
    }
};

keys.shift_keydown = keys.e_keydown = () => {
//     console.log("shifty");
    board.cameraToAsset(board.playertoken, 'center');
};

keys.shift_keyup = keys.e_keyup = () => {};

// Define more keydown handlers
keys.t_keydown = () => board.onscreen_quadrants();

keys.t_keyup = () => {
    runtest = !runtest;
    if (runtest) {
        perf_test();
    }
};

keys.space_keydown = () => {
//     console.log("spacey!!!!");
    board.assets.push(new asset(board.assets[board.assets.length - 1].x, board.assets[board.assets.length - 1].y));
    board.playertoken = (board.playertoken < board.assets.length - 1) ? board.playertoken + 1 : 0;
};

keys.r_keydown = () => {
    board.mouse.action = (board.mouse.action === 'dragboard') ? 'addassets' : 'dragboard';
};


keys.up_keydown = keys.w_keydown = () => {
	if (board.keyState.up === false) {
//     	console.log("UP");
		board.keyState.up = true;
		board.assets[board.playertoken].methods.move();
	}
};

keys.up_keyup = keys.w_keyup = () => {
	if (board.keyState.up === true) {
		board.keyState.up = false;
	}
}

keys.down_keydown = keys.s_keydown = () => {
	if (board.keyState.down === false) {
// 		console.log("DOWN");
		board.keyState.down = true;
		board.assets[board.playertoken].methods.move();
	} 
}

keys.down_keyup = keys.s_keyup = () => {
	if (board.keyState.down === true) {
		board.keyState.down = false;
	}
}

keys.left_keydown = keys.a_keydown = () => {
	if (board.keyState.left === false) {
// 		console.log("LEFT");
		board.keyState.left = true;
		board.assets[board.playertoken].methods.move();
	}
}

keys.left_keyup = keys.a_keyup = () => {
	if (board.keyState.left === true) {
		board.keyState.left = false;
	}
}

keys.right_keydown = keys.d_keydown = () => {
	if (board.keyState.right === false) {
// 		console.log("RIGHT");
		board.keyState.right = true;
		board.assets[board.playertoken].methods.move();
	}
}

keys.right_keyup = keys.d_keyup = () => {
	if (board.keyState.right === true) {
		board.keyState.right = false;
	}
}


keys.slash_keydown = () => {
//     console.log("FIRE GUN");
    if (typeof board.assets[board.playertoken].methods.fireGun === 'function') {
        board.assets[board.playertoken].methods.fireGun();
    }
};
