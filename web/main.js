paper.install(window);
window.onload = function() {
	// Ensemble des points de la scène.
	var points = [];
	// Mémoriser qui est le premier centre.
	var firstCenter;

	// Pour le zoom.
	var isZooming = false;
	var zoomVec = 1;
	const zoomFactor = 1.1;
	const zoomTransationFactor = 1.2;

	const R = 10;

	// Pour déplacer la vue avec la souris.
	var isSpacePressed = false;

	// Translation de la vue.
	var isTranslating = false;
	var translationVec = new Point(0, 0);
	const translationFactor = 1.2;

	var isRunning = false;

	// Désactiver l'affichage du menu par un clique droit dans le canvas.
	var canvas = document.getElementsByTagName("canvas")[0];
	canvas.addEventListener("contextmenu", e => e.preventDefault());

	// Pour réinitialiser le canvas.
	var boutonReset = document.getElementById('reset');
	boutonReset.addEventListener("click", (event) => {paper.project.activeLayer.removeChildren(); points = []; firstCenter = undefined; boutonRun.disabled = true; update_k();});

	// Pour charger un jeu de donnée.
	var input = document.createElement('input');
	input.type = 'file';
	input.onchange = (e) => {
		// getting a hold of the file reference
		var file = e.target.files[0];
		n = parseInt(file.name.split('_')[1], 10);
		// setting up the reader
		var reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		// here we tell the reader what to do when it's done reading...
		reader.onload = (readerEvent) => {
			var content = readerEvent.target.result.split('\n'); // this is the content!
			for (let i = 0; i < n; i++) {
				var coordonnees = content[i].split(' ').map(function(item) {
					return parseInt(item, 10);
				});
				const cercle = new Cercle(coordonnees[0], coordonnees[1]);
				points.push(cercle.path);
				if ((content[i] == content[n]) && (firstCenter == undefined)) { // Le premier centre.
					firstCenter = cercle.path;
					if (currentTask <= 4 ) {
						firstCenter.fillColor = 'red';
						firstCenter.strokeColor = 'red';
					};
				};
			};
		};
		reader.onloadend = () => {
			update_k();
			if (points.length > 0) {
				boutonRun.disabled = false;
			};
		};
	};

	var boutonLoad = document.getElementById('load');
	boutonLoad.addEventListener("click", (event) => {input.click();});

	// Pour enregistrer un jeu de donnée.
	var boutonSave = document.getElementById('save');
	boutonSave.addEventListener("click", (event) => {
		// Source : https://stackoverflow.com/questions/11071473/how-can-javascript-save-to-a-local-file
		if (points.length > 0) {
			var liste_points = [];
			points.forEach((cercle) => {liste_points.push(cercle.position.x + ' ' + cercle.position.y)});
			liste_points.push(firstCenter.position.x + ' ' + firstCenter.position.y);

			var bb = new Blob([liste_points.join('\n')], {type: 'text/plain'});
			var a = document.createElement('a');
			a.download = '2_' + points.length + '_dataset.txt';
			a.href = window.URL.createObjectURL(bb);
			a.click();
		};
	});

	var currentTask = 1;
	$('#tasks :input').change(function() {
		currentTask = parseInt($(this).val());
		switch ($(this).val()) {
			case '1':
			case '2':
				$("#task12_cercles").prop('disabled', true);
				$("#task12_k").prop('disabled', false);
				$("#task_graphe").prop('disabled', true);
				$("#task12_centre_time").prev().prev().text("Temps d'attente entre 2 centres :");
				if (firstCenter != undefined) {
					firstCenter.fillColor = 'red';
					firstCenter.strokeColor = 'red';
				};
				break;
			case '3':
				$("#task12_cercles").prop('disabled', false);
				$("#task12_k").prop('disabled', false);
				$("#task_graphe").prop('disabled', true);
				$("#task12_centre_time").prev().prev().text("Temps d'attente entre 2 centres :");
				if (firstCenter != undefined) {
					firstCenter.fillColor = 'red';
					firstCenter.strokeColor = 'red';
				};
				break;
			case '5':
			case '6':
				$("#task12_cercles").prop('disabled', true);
				$("#task12_k").prop('disabled', true);
				$("#task_graphe").prop('disabled', false);
				$("#task12_centre_time").prev().prev().text("Temps d'attente entre 2 sommets :");
				if (firstCenter != undefined) {
					if (liste_edges.length == 0) {
						firstCenter.fillColor = 'black';
						firstCenter.strokeColor = 'black';
					};
				};
				break;
				
			default:
				break;
		};
	
	});

	function reinitialize() {
		boutonLoad.disabled = false;
		boutonReset.disabled = false;
		boutonSave.disabled = false;
		boutonRun.disabled = false;

		$("#tasks :input").prop('disabled', false);
		isRunning = false;
	};

	var boutonRun = document.getElementById('run');
	boutonRun.disabled = true;
	boutonRun.addEventListener("click", async (event) => {
		points.forEach((point) => {
			if (point != firstCenter) {
				point.fillColor = 'black';
				point.strokeColor = 'black';
			};
		});
		if (currentTask >= 5) {
			firstCenter.fillColor = 'black';
			firstCenter.strokeColor = 'black';
		};
		liste_regions.forEach((region) => {
			region.cercle.remove();
		});
		liste_edges.forEach((edge) => {
			edge.remove();
		});
		liste_regions = [];
		liste_edges = [];
		oldPoint = undefined;
		oldPoint2 = undefined;
		oldPoint3 = undefined;
		ray = undefined;
		ray2 = undefined;
		isCentre = false;

		boutonLoad.disabled = true;
		boutonReset.disabled = true;
		boutonSave.disabled = true;
		boutonRun.disabled = true;

		$("#tasks :input").prop('disabled', true);
		isRunning = true;

		showCurPoint = document.getElementById('task12_cur').checked;
		showCentre = document.getElementById('task12_centre').checked;
		showCircle = document.getElementById('task12_cercles').checked;

		showGraph = document.getElementById('task_graphe').checked;

		showRay = document.getElementById('task12_rays').checked;
		timeRay = document.getElementById('task12_rays_time').value;
		timeCentre = document.getElementById('task12_centre_time').value;

		const k = parseInt($("#task12_k").val(), 10);

		switch (currentTask) {
			case 1:
				await task_1_queue(points, firstCenter, k);
				break;
			case 2:
				await task_2_queue(points, firstCenter, k);
				break;
			case 3:
				console.log((await task_3(points, firstCenter, k)).map((i) => [i.position.x, i.position.y]));
				break;
			case 5:
				await task_5(points);
				break;
			case 6:
				await task_6(points);
				break;
		};

		reinitialize();
	});

	function update_k() {
		$("#task12_k").attr('max', points.length);
		if ((points.length < $("#task12_k").next().val()) || (points.length <= 1)) {
			$("#task12_k").next().val(points.length);
		};
		if ($("#task12_k").next().val() == 0) {
			$("#task12_k").next().val(Math.min(1, points.length));
		};
	};

	// Créer un projet vide et une vue pour le canvas.
	paper.setup(canvas);
	const toolPan = new Tool();
	toolPan.activate();

	class Cercle {
		constructor(x, y) {
			this.path = new Shape.Circle({
				center: new Point(x, y),
				radius: R,
				strokeColor: 'black',
				fillColor: 'black'
			});

			// Quand on clique (gauche) sur l'objet.
			this.path.onMouseDown = function(event) {
				if (!isSpacePressed && !isRunning) {
					if (event.event.buttons == 2) { // Clique droit.
						event.target.remove();
						points.splice(points.indexOf(event.target), 1);
						update_k();
						// Pour garder le point qui sert de premier centre.
						if (event.target == firstCenter) {
							if (points.length > 0) {
								points[0].fillColor = 'red';
								points[0].strokeColor = 'red';
								firstCenter = points[0];
							} else {
								firstCenter = undefined;
								boutonRun.disabled = true;
							}; 
						};
					};
				};
			};
			this.path.onDoubleClick = function(event) {
				if (isSpacePressed && !isRunning && currentTask <= 4) {
					if (event.target != firstCenter) {
						firstCenter.fillColor = 'black';
						firstCenter.strokeColor = 'black';
						firstCenter = event.target;

						event.target.fillColor = 'red';
						event.target.strokeColor = 'red';
					};
				};
			};
		};
	};

	// Pour pouvoir se déplacer avec la souris 
	toolPan.onMouseDrag = function(event) {
		if (isSpacePressed) {
			const delta = event.point.subtract(event.downPoint);
			//view.translate(delta);
			translationVec = delta;
			isTranslating = true;
		};
	};

	// Source : https://stackoverflow.com/questions/56694938/zoom-and-pan-fix
	canvas.onwheel = function(event) {
		//Position de la souris.
		 var point = view.viewToProject(new Point(event.offsetX, event.offsetY));
		 var centre = view.center;
		 var oldZoom = view.zoom;

		// Mettre à jour le zoom.
		var newZoom = event.deltaY < 0
			? Math.min(oldZoom * zoomFactor, 3)
			: Math.max(oldZoom / zoomFactor, 0.2);
		zoomVec = newZoom - oldZoom;
		isZooming = true;
		//view.zoom = newZoom;

		// Mettre à jour la vue.
		const pc = point.subtract(view.center);
		//view.translate(pc.multiply((oldZoom / newZoom - 1)));
		translationVec = pc.multiply((oldZoom / newZoom - 1));
		isTranslating = true;
	};

	// Pour la détection des touches pressées / relâchées.
	toolPan.onKeyDown = function(event) {
		if (event.key == 'space') {
			event.preventDefault(); // Parfois on peut focus le bouton 'Reset'...
			isSpacePressed = true;
			canvas.style.cursor = 'grab';
		} else {
			isSpacePressed = false;
			canvas.style.cursor = 'crosshair';
		};
	};

	toolPan.onKeyUp = function(event) {
		if (event.key == 'space') {
			isSpacePressed = false;
			canvas.style.cursor = 'crosshair';
		};
	};

	view.onMouseDown = function(event) {
		if (!isSpacePressed && !isRunning) {
			if (event.event.buttons == 1) { // Clique gauche.
				const point = event.point;
				if (points.every((e) => (e.position.getDistance(point) > R))) { // Évite les points trop proches.
					const cercle = new Cercle(point.x, point.y);
					if (points.length == 0) {
						if (currentTask <= 4) {
							cercle.path.fillColor = 'red';
							cercle.path.strokeColor = 'red';
						};
						firstCenter = cercle.path;
					};
					points.push(cercle.path);
					update_k();
					boutonRun.disabled = false;
				};
			};
		};
	};

	view.onFrame = function(event) {
		// Lissage des translation de la vue.
		if (isTranslating) {
			view.translate(translationVec.multiply(translationFactor - 1));
			translationVec = translationVec.divide(translationFactor);
		};

		if (isZooming) {
			view.zoom += zoomVec * (zoomTransationFactor - 1);
			zoomVec /= zoomTransationFactor;
		};
	};

	// Dessine la vue.
	view.draw();
};

