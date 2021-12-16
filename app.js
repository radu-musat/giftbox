console.log('DOM fully loaded and parsed');
const present = document.querySelector('.present');
let items = {};
let playing = false;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let userName = document.querySelector('.username');
let cardTextContainer = document.querySelector('.card-text');
let codeContainer = document.querySelector('.code');
let button = document.querySelector('.stop');
let lightRope = document.querySelector('.lightrope');
let song;
getList();


let openPresent = (event) => {
	event.stopPropagation();
	let user;

	if(params.user) {
		console.log(window.items)
		button.classList.add('active');
		lightRope.classList.add('active');

		for(let item in window.items) {
			let itemKey = item;
			let itemValue = window.items[item];

			if(item.toLowerCase() === params.user.toLowerCase()) {
				cardTextContainer.textContent = itemValue.text;
				userName.textContent = itemKey;
				if(itemValue.mode === 'link') {
					codeContainer.innerHTML = `<a href="${itemValue.link}" target="_blank">Click to redeem your gift!</a>`;
					codeContainer.addEventListener('click',  (e) =>{
						console.log('click')
						e.stopPropagation();
					});
				}
			}
		}
	}


	if(!playing) {
		playing = true;
		song = new Audio('https://bizziroute.com/downloads/glee/jingle-bell-rock.mp3');
		song.play();
	}
	present.classList.add('open');
};

let stopMusic = (event)=> {
	event.preventDefault();
	if(song) {
		song.pause();
	}
}

present.onclick = openPresent;
button.onclick = stopMusic;

async function getList() {
	let response =  await fetch("https://giftbox-70986-default-rtdb.firebaseio.com/.json");
	let result = await response.json();
	window.items = result;
}

(function () {
	'use strict';

	const canvas = document.querySelector('canvas');
	const ctx = canvas.getContext('2d');

	let width, height, lastNow;
	let snowflakes;
	let maxSnowflakes = 100;

	function init() {
		snowflakes = [];
		resize();
		render(lastNow = performance.now());
	}

	function render(now) {
		requestAnimationFrame(render);

		const elapsed = now - lastNow;
		lastNow = now;

		ctx.clearRect(0, 0, width, height);
		if (snowflakes.length < maxSnowflakes)
			snowflakes.push(new Snowflake());

		ctx.fillStyle = ctx.strokeStyle = 'rgba(255, 255, 255, .5)';

		snowflakes.forEach(snowflake => snowflake.update(elapsed, now));
	}

	function pause() {
		cancelAnimationFrame(render);
	}
	function resume() {
		lastNow = performance.now();
		requestAnimationFrame(render);
	}


	class Snowflake {
		constructor() {
			this.spawn();
		}

		spawn(anyY = false) {
			this.x = rand(0, width);
			this.y = anyY === true ?
				rand(-50, height + 50) :
				rand(-50, -10);
			this.xVel = rand(-.05, .05);
			this.yVel = rand(.02, .1);
			this.angle = rand(0, Math.PI * 2);
			this.angleVel = rand(-.001, .001);
			this.size = rand(7, 12);
			this.sizeOsc = rand(.01, .5);
		}

		update(elapsed, now) {
			const xForce = rand(-.001, .001);

			if (Math.abs(this.xVel + xForce) < .075) {
				this.xVel += xForce;
			}

			this.x += this.xVel * elapsed;
			this.y += this.yVel * elapsed;
			this.angle += this.xVel * 0.05 * elapsed; //this.angleVel * elapsed

			if (
				this.y - this.size > height ||
				this.x + this.size < 0 ||
				this.x - this.size > width)
			{
				this.spawn();
			}

			this.render();
		}

		render() {
			ctx.save();
			const { x, y, angle, size } = this;
			ctx.beginPath();
			ctx.arc(x, y, size * 0.2, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.restore();
		}}


	// Utils
	const rand = (min, max) => min + Math.random() * (max - min);

	function resize() {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		maxSnowflakes = Math.max(width / 10, 100);
	}

	window.addEventListener('resize', resize);
	window.addEventListener('blur', pause);
	window.addEventListener('focus', resume);
	init();

})();
