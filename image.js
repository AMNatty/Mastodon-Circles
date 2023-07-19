const toRad = (x) => x * (Math.PI / 180);

const dist = [200, 330, 450];
const numb = [8, 15, 26];
const radius = [64,58,50];
let userNum = 0;
let remainingImg = 0;

function render(users, selfUser) {
	userNum = 0;
	remainingImg = 0;

	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
    
    const width = canvas.width;
	const height = canvas.height;

	// fill the background
	const bg_image = document.getElementById("mieke_bg");
	ctx.drawImage(bg_image, 0, 0, 1000, 1000);

	loadImage(ctx, selfUser.avatar, (width/2)-110, (height/2)-110, 110, "@" + selfUser.handle.name + "@" + selfUser.handle.instance);

	// loop over the layers
	for (var layerIndex=0; layerIndex<3; layerIndex++) {
        //let layerIndex = get_layer(num);

		const angleSize = 360 / numb[layerIndex];

		// loop over each circle of the layer
		for (let i = 0; i < numb[layerIndex]; i++) {
			remainingImg += 1;
			// if we are trying to render a circle but we ran out of users, just exit the loop. We are done.
			if (userNum>=users.length) break;
			// We need an offset or the first circle will always on the same line and it looks weird
			// Try removing this to see what happens
			const offset = layerIndex * 30;

			// i * angleSize is the angle at which our circle goes
			// We need to converting to radiant to work with the cos/sin
			const r = toRad(i * angleSize + offset);

			const centerX = Math.cos(r) * dist[layerIndex] + width / 2;
			const centerY = Math.sin(r) * dist[layerIndex] + height / 2;

            loadImage(
                ctx,
                users[userNum].avatar,
				centerX - radius[layerIndex],
				centerY - radius[layerIndex],
				radius[layerIndex],
				"@" + users[userNum].handle.name + "@" + users[userNum].handle.instance
			);

            userNum++;
		}
	}

	ctx.fillStyle = "#0505AA";
	ctx.fillText("Be gay do crime uwu", 10, 15);
	ctx.fillStyle = "#666666";
	ctx.fillText("https://data.natty.sh/fedi-circles", width-120, height-15, 110)
    //ctx.fillText("@sonnenbrandi@mieke.club mit lieben Grüßen an Duiker101", width-300, height-15, 290)
};

function get_layer(i) {
    if (i<numb[0]) return 0;
    if (i<numb[0]+numb[1]) return 1;
    return 2;   
}

// Load the image from the URL and draw it in a circle
function loadImage(ctx, url, x, y, r, name) {
	const addText = () => {
		ctx.font = "bold 11px sans-serif";
		const textWidth = ctx.measureText(name).width;
		ctx.fillStyle = "black";

		const tx = textWidth > r * 2 ? x : x + r - textWidth / 2;
		const ty = y + r * 2 + 3;

		if (textWidth > r * 2) {
			ctx.fillText(name, tx, ty + 1, r * 2);
			ctx.fillStyle = "white";
			ctx.fillText(name, tx, ty, r * 2);
		} else {
			ctx.fillText(name, tx, ty + 1);
			ctx.fillStyle = "white";
			ctx.fillText(name, tx, ty);
		}
	};

    const img = new Image;
    img.onload = function(){
        ctx.save();
        ctx.beginPath();
        ctx.arc(x+r, y+r, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img,x,y,r*2,r*2);

        ctx.beginPath();
        ctx.arc(x+r, y+r, r, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();

		addText();

		remainingImg -= 1;
		if (remainingImg <= 0) {
			document.getElementById("btn_download").href = document.getElementById("canvas").toDataURL("image/png");
    		document.getElementById("btn_download").style.display = "inline";
		}
    };
	img.onerror = function() {
		addText();
	};

    img.src = url;
}