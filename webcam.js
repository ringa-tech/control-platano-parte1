var video;
var canvas;

var altoCamara = 720;
var anchoCamara = 720;

var amarillo = {r: 255, g: 255, b: 0};

var distanciaAceptableColor = 190;

function mostrarCamara() {
	video = document.getElementById("video");
	canvas = document.getElementById("canvas");

	var opciones = {
		audio: false,
		video: {
			width: anchoCamara, height: altoCamara
		}
	};

	if(navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia(opciones)
		    .then(function(stream) {
		    	video.srcObject = stream;
		    	procesarCamara();
		    })
		    .catch(function(err) {
		    	console.log("Oops, hubo un error", err);
		    })
	} else {
		console.log("No existe la funcion getUserMedia... oops :( ");
	}
}

function procesarCamara() {
	var ctx = canvas.getContext("2d");

	ctx.drawImage(video, 0, 0, anchoCamara, altoCamara, 0, 0, canvas.width, canvas.height);

	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var pixeles = imgData.data;
	//console.log(pixeles);

	//var pixelMasAmarillo = null;
	//var menorDistancia = null;

	var sumaX = 0;
	var sumaY = 0;
	var cuenta = 0;

	for (var p=0; p < pixeles.length; p += 4) {
		var rojo = pixeles[p];
		var verde = pixeles[p+1];
		var azul = pixeles[p+2];
		var alpha = pixeles[p+3];

		var distancia = Math.sqrt(
			Math.pow(amarillo.r-rojo, 2) +
			Math.pow(amarillo.g-verde,2) +
			Math.pow(amarillo.b-azul, 2)
		);

		if (distancia < distanciaAceptableColor) {
			//pintar el pixel de rojo
			pixeles[p] = 255; //r
			pixeles[p+1] = 0; //g
			pixeles[p+2] = 0; //b

			var y = Math.floor(p / 4 / canvas.width);
			var x = (p/4) % canvas.width;

			sumaX += x;
			sumaY += y;
			cuenta++;
		} else {

		}

		/*if (menorDistancia == null || distancia < menorDistancia) {
			menorDistancia = distancia;

			var y = Math.floor(p / 4 / canvas.width);
			var x = (p/4) % canvas.width;

			pixelMasAmarillo = {x: x, y: y};
		}*/
	}

	ctx.putImageData(imgData, 0, 0);

	if (cuenta > 0) {
		ctx.fillStyle="#00f";
		ctx.beginPath();
		ctx.arc(sumaX/cuenta, sumaY/cuenta, 10, 0, 2*Math.PI);
		ctx.fill();

	}

	setTimeout(procesarCamara, 20);
}