paper.install(window);

// Pour les animations des algorithmes.
var showRay = false;
var ray;
var ray2;

var showCircle = true;
var showGraph = true;

var showCurPoint = true;
var oldPoint;
var oldPoint2;
var oldPoint3;
var oldRegion;
var isCentre = false;

var showCentre = true;

var timeCentre = 0;
var timeRay = 0;

var liste_regions = [];
var liste_edges = [];

// Voir : https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
const sleep = ms => new Promise(res => setTimeout(res, ms));
function myLoop(i) {
	setTimeout(function() {
		if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
	}, 3000)
};

function euclidian_distance(x, y) {
	var d = 0.;
	for (let i = 0; i < x.length; i++) {
		d += Math.pow(x[i] - y[i], 2);
	};
	return Math.sqrt(d);
};

async function task_1(P, p1, k) {
	var S = [p1];
	var n = P.length;
	var distances = P.map((x) => P.map((y) => euclidian_distance([x.position.x, x.position.y], [y.position.x, y.position.y])));
	var couleurs = new Array(n).fill(true);
	couleurs[P.indexOf(p1)] = false;

	for (let i = 1; i < k; i++) {
		var d = 0;
		var l = 0;
	
		for (let j = 0; j < n; j++) {
			if (couleurs[j]) {
				if (showCurPoint) {
					if ((oldPoint != undefined) && (oldPoint != S[S.length - 1])) {
						oldPoint.fillColor = 'black';
						oldPoint.strokeColor = 'black';
					};
					P[j].fillColor = 'yellow';
					P[j].strokeColor = 'yellow';
					oldPoint = P[j];
				};

				var d_min = Infinity;
				for (let t = 0; t < n; t++) {
					if (!couleurs[t]) {
						if (showRay) {
							if (ray != undefined) {ray.remove();};
							ray = new Path.Line(P[t].position, P[j].position);
							ray.strokeColor = 'black';
							ray.opacity = 0.5;
							ray.sendToBack();
						};
						if (d_min > distances[j][t]) {
							d_min = distances[j][t];
						};
						await sleep(1000 * timeRay);
					};
				};

				if (d_min > d) {
					d = d_min;
					l = j;
				};
				if (showRay) {
					ray.remove();
				};
			};
		};

		couleurs[l] = false;
		if (showCentre) {
			P[l].fillColor = 'red';
			P[l].strokeColor = 'red';
		};
		S.push(P[l]);

		if (showCurPoint) {
			if ((oldPoint != undefined) && (oldPoint != S[S.length - 1])) {
				oldPoint.fillColor = 'black';
				oldPoint.strokeColor = 'black';
			};
		};

		await sleep(1000 * timeCentre);
	};

	return S;
};

async function task_1_queue(P, p1, k) {
	var n = P.length;
	var j = P.indexOf(p1);

	var centres = [j];
	var distances = P.map((x) => P.map((y) => euclidian_distance([x.position.x, x.position.y], [y.position.x, y.position.y])));

	var points = [];
	for (let i = 0; i < n; i++) {
		if (i != j) {points.push(i);};
	};
	var taille = n - 1;

	for (let u = 1; u < k; u++) {
		var d = 0;
		var i = j;

		for (let r = 0; r < taille; r++) {
			var point = points.shift();
			if (showCurPoint) {
				if ((oldPoint != undefined) && (oldPoint != P[centres[u - 1]])) {
					oldPoint.fillColor = 'black';
					oldPoint.strokeColor = 'black';
				};
				P[point].fillColor = 'yellow';
				P[point].strokeColor = 'yellow';
				oldPoint = P[point];
			};

			var d_min = Infinity;
			for (const c of centres) {
				var dt = distances[point][c];
				if (showRay) {
					if (ray != undefined) {ray.remove();};
					ray = new Path.Line(P[c].position, P[point].position);
					ray.strokeColor = 'black';
					ray.opacity = 0.5;
					ray.sendToBack();
				};
				if (d_min > dt) {
					d_min = dt;
				};
				await sleep(1000 * timeRay);
			};

			if (d_min > d) {
				if (i != j) {
					points.push(i);
				};
				d = d_min;
				i = point;
			} else {
				points.push(point);
			};
			if (showRay) {
				ray.remove();
			};
		};

		if (showCentre) {
			P[i].fillColor = 'red';
			P[i].strokeColor = 'red';
		};
		centres.push(i);
		taille -= 1;

		if (showCurPoint) {
			if ((oldPoint != undefined) && (oldPoint != P[i])) {
				oldPoint.fillColor = 'black';
				oldPoint.strokeColor = 'black';
			};
		};

		await sleep(1000 * timeCentre);
	};

	S = centres.map((i) => P[i]);
	return S;
};

async function task_2_queue(P, p1, k) {
	var n = P.length;
	var j = P.indexOf(p1);

	var centres = [j];
	var distances = Array(n).fill(Infinity);

	var points = [];
	for (let i = 0; i < n; i++) {
		if (i != j) {points.push(i);};
	};
	var taille = n - 1;

	var i = j;
	for (let u = 1; u < k; u++) {
		var d = 0;

		for (let r = 0; r < taille; r++) {
			var point = points.shift();
			if (showCurPoint) {
				if ((oldPoint != undefined) && (oldPoint != P[centres[u - 1]])) {
					oldPoint.fillColor = 'black';
					oldPoint.strokeColor = 'black';
				};
				P[point].fillColor = 'yellow';
				P[point].strokeColor = 'yellow';
				oldPoint = P[point];
			};

			distances[point] = Math.min(distances[point], euclidian_distance([P[point].position.x, P[point].position.y], [P[centres[u - 1]].position.x, P[centres[u - 1]].position.y]));

			if (showRay) {
				if (ray != undefined) {ray.remove();};
				ray = new Path.Line(P[centres[u - 1]].position, P[point].position);
				ray.strokeColor = 'black';
				ray.opacity = 0.5;
				ray.sendToBack();
			};
			await sleep(1000 * timeRay);

			if (distances[point] > d) {
				if (i != centres[u - 1]) {
					points.push(i);
				};
				d = distances[point];
				i = point;
			} else {
				points.push(point);
			};
			if (showRay) {
				ray.remove();
			};
		};

		if (showCentre) {
			P[i].fillColor = 'red';
			P[i].strokeColor = 'red';
		};
		centres.push(i);
		taille -= 1;

		if (showCurPoint) {
			if ((oldPoint != undefined) && (oldPoint != P[i])) {
				oldPoint.fillColor = 'black';
				oldPoint.strokeColor = 'black';
			};
		};

		await sleep(1000 * timeCentre);
	};

	S = centres.map((i) => P[i]);
	return S;
};

async function task_3(P, p1, k) {
	var n = P.length;
	var j = P.indexOf(p1);

	//var distances2 = P.map((x) => P.map((y) => euclidian_distance([x.position.x, x.position.y], [y.position.x, y.position.y])));
	var centres = [j];
	var distances = Array(n).fill(Infinity);

	var regions = [];

	class Region {
		constructor(centre, points, rayon, border_point) {
			this.centre = centre
			this.points = points
			this.rayon = rayon
			this.border_point = border_point

			this.cercle = new Shape.Circle({
				center: P[this.centre].position,
				radius: this.rayon,
				strokeColor: 'black',
				fillColor: 'black',
				opacity: 0,
			});
			this.cercle.sendToBack();
			if (showCircle) {
				this.cercle.opacity = 0.1;
			};

			liste_regions.push(this);
		};

		update() {
			this.cercle.remove();
			this.cercle = new Shape.Circle({
				center: P[this.centre].position,
				radius: this.rayon,
				strokeColor: 'black',
				fillColor: 'black',
				opacity: 0,
			});
			this.cercle.sendToBack();
			if (showCircle) {
				this.cercle.opacity = 0.1;
			};
		};
	};

	function split_region(new_region, old_region) {
		var old_points = [];
		var old_radius = 0;
		var old_outer_point = old_region.centre;
		for (const point of old_region.points) {
			if (point != new_region.centre) {
				var nouvelle_distance = Math.min(distances[point], euclidian_distance([P[point].position.x, P[point].position.y], [P[new_region.centre].position.x, P[new_region.centre].position.y]));
				if (nouvelle_distance < distances[point]) {
					if (nouvelle_distance > new_region.rayon) {
						new_region.rayon = nouvelle_distance;
						new_region.border_point = point;
					};
					new_region.points.push(point);
				} else {
					if (nouvelle_distance > old_radius) {
						old_radius = nouvelle_distance;
						old_outer_point = point;
					};
					old_points.push(point);
				};
				distances[point] = nouvelle_distance;
			};
		};
		old_region.points = old_points;
		old_region.rayon = old_radius;
		old_region.border_point = old_outer_point;

		old_region.update();
		new_region.update();
	};

	function creer_region(c, anciennes_regions) {
		var r = new Region(c, [], 0, c);
		for (const region of anciennes_regions) {
			if (euclidian_distance([P[c].position.x, P[c].position.y], [P[region.centre].position.x, P[region.centre].position.y]) < 2 * region.rayon) {
				split_region(r, region);
			};
		};
		regions.push(r);
	};

	var points = [];
	var rayon = 0;
	var outer_point;
	for (let i = 0; i < n; i++) {
		if (i != j) {
			var nouvelle_distance = euclidian_distance([P[i].position.x, P[i].position.y], [P[j].position.x, P[j].position.y]);
			if (nouvelle_distance < distances[i]) {
				distances[i] = nouvelle_distance;
			};
			if (nouvelle_distance > rayon) {
				rayon = nouvelle_distance;
				outer_point = i;
			};
			points.push(i);
		};
	};
	var r = new Region(j, points, rayon, outer_point);
	regions.push(r);
	await sleep(1000 * timeCentre);

	for (let u = 1; u < k; u++) {
		var d = 0;
		var i = 0;
		for (const region of regions) {
			if (showCurPoint) {
				if (oldPoint != undefined) {
					if (isCentre) {
						oldPoint.fillColor = 'red';
						oldPoint.strokeColor = 'red';
					} else {
						oldPoint.fillColor = 'black';
						oldPoint.strokeColor = 'black';
					};
				};
				if (region.border_point == region.centre) {
					isCentre = true;
				} else {
					isCentre = false;
				};
				P[region.border_point].fillColor = 'yellow';
				P[region.border_point].strokeColor = 'yellow';
				oldPoint = P[region.border_point];

			};
			if (showCircle) {
				if (oldRegion != undefined) {
					oldRegion.cercle.fillColor = 'black';
					oldRegion.cercle.strokeColor = 'black';
				};
				region.cercle.fillColor = 'yellow';
				region.cercle.strokeColor = 'yellow';
				oldRegion = region;
			};

			if (showRay) {
				if (ray != undefined) {ray.remove();};
				ray = new Path.Line(P[region.centre].position, P[region.border_point].position);
				ray.strokeColor = 'black';
				ray.opacity = 0.5;
				ray.sendToBack();
			};

			if (region.rayon > d) {
				d = region.rayon;
				i = region.border_point;
			};

			await sleep(1000 * timeRay);

			if (showRay) {
				ray.remove();
			};
		};

		if (showCentre) {
			P[i].fillColor = 'red';
			P[i].strokeColor = 'red';
		};
		if (oldPoint == P[i]) {
			isCentre = true;
		};
		centres.push(i);
		creer_region(i, regions);

		if (showCurPoint) {
			if ((oldPoint != undefined) && (oldPoint != P[i])) {
				if (isCentre) {
					oldPoint.fillColor = 'red';
					oldPoint.strokeColor = 'red';
				} else {
					oldPoint.fillColor = 'black';
					oldPoint.strokeColor = 'black';
				};
			};
		};
		if (showCircle) {
			if (oldRegion != undefined) {
				oldRegion.cercle.fillColor = 'black';
				oldRegion.cercle.strokeColor = 'black';
			};
		};

		/*liste_edges.forEach((edge) => {
			edge.remove();
		});
		for (const [index1, aze] of centres.entries()) {
			for (const [index2, bze] of centres.entries()) {
				var bool = true;
				if (aze != bze && regions[index1]) {
					for (const kze of centres) {
						if (kze != aze && kze != bze) {

							var dt1 = euclidian_distance([P[kze].position.x, P[kze].position.y], [P[bze].position.x + regions[index2].rayon * (P[aze].position.x - P[bze].position.x) / distances2[aze][bze], P[bze].position.y + regions[index2].rayon * (P[aze].position.y - P[bze].position.y) / distances2[aze][bze]]);
							var dt2 = euclidian_distance([P[kze].position.x, P[kze].position.y], [P[aze].position.x + regions[index2].rayon * (P[bze].position.x - P[aze].position.x) / distances2[aze][bze], P[aze].position.y + regions[index2].rayon * (P[bze].position.y - P[aze].position.y) / distances2[aze][bze]]);
							//console.log(dt, distances2[aze][bze] - (regions[index1].rayon + regions[index2].rayon));
							var dt3 = Math.min(distances2[kze][aze], distances2[kze][bze]);
							var dt4 = distances2[kze][aze] + distances2[kze][bze];
							// Math.min(dt3, Math.max(dt1, dt2))  

							if (distances2[aze][bze] - (regions[index1].rayon + regions[index2].rayon) >= dt4 / 2) {
								bool = false;
								break;
							};
						};
					};
					if (bool) {
						var edge = new Path.Line(P[aze].position, P[bze].position);
						edge.strokeColor = 'black';
						edge.opacity = 1;
						edge.strokeWidth = 2;
						edge.sendToBack();
						liste_edges.push(edge);
					};
				};
			};
		};*/

		await sleep(1000 * timeCentre);
	};

	S = centres.map((i) => P[i]);
	return S;
};

async function task_5(P) {
	var n = P.length;
	var G = Array(n).fill([]);
	var distances = P.map((x) => P.map((y) => euclidian_distance([x.position.x, x.position.y], [y.position.x, y.position.y])));
	var colored = Array(n).fill(false);

	for (let i = 0; i < n; i++) {
		for (let j = 0; j < i; j++) {
			var sont_voisin = true;
			var dij = distances[i][j]
			for (let k = 0; k < n; k++) {
				if (showCurPoint) {
					if (oldPoint != undefined) {
						if (colored[oldPoint]) {
							P[oldPoint].fillColor = 'red';
							P[oldPoint].strokeColor = 'red';
						} else {
							P[oldPoint].fillColor = 'black';
							P[oldPoint].strokeColor = 'black';
						};
					};
					if (oldPoint2 != undefined) {
						if (colored[oldPoint2]) {
							P[oldPoint2].fillColor = 'red';
							P[oldPoint2].strokeColor = 'red';
						} else {
							P[oldPoint2].fillColor = 'black';
							P[oldPoint2].strokeColor = 'black';
						};
					};
					if (oldPoint3 != undefined) {
						if (colored[oldPoint3]) {
							P[oldPoint3].fillColor = 'red';
							P[oldPoint3].strokeColor = 'red';
						} else {
							P[oldPoint3].fillColor = 'black';
							P[oldPoint3].strokeColor = 'black';
						};
					};
					P[i].fillColor = 'yellow';
					P[j].fillColor = 'yellow';
					P[k].fillColor = 'orange';
					P[i].strokeColor = 'yellow';
					P[j].strokeColor = 'yellow';
					P[k].strokeColor = 'orange';
					oldPoint = i;
					oldPoint2 = j;
					oldPoint3 = k;
				};
				if (showRay) {
					if (ray != undefined) {ray.remove();};
					if (ray2 != undefined) {ray2.remove();};
					ray = new Path.Line(P[k].position, P[i].position);
					ray.strokeColor = 'black';
					ray.opacity = 0.5;
					ray.sendToBack();

					ray2 = new Path.Line(P[k].position, P[j].position);
					ray2.strokeColor = 'black';
					ray2.opacity = 0.5;
					ray2.sendToBack();
				};
				if (Math.max(distances[k][i], distances[k][j]) < dij) {
					sont_voisin = false;
				};
				await sleep(1000 * timeRay);
				if (showRay) {
					ray.remove();
					ray2.remove();
				};
				if (!sont_voisin) {
					break;
				};
			};
			if (sont_voisin) {
				G[i].push(j);
				G[j].push(i);
				if (showGraph) {
					var edge = new Path.Line(P[i].position, P[j].position);
					edge.strokeColor = 'black';
					edge.opacity = 1;
					edge.strokeWidth = 2;
					edge.sendToBack();
					liste_edges.push(edge);
				};
			};
		};
		if (showCentre) {
			P[i].fillColor = 'red';
			P[i].strokeColor = 'red';
		};
		colored[i] = true;
		if (oldPoint != undefined) {
			if (colored[oldPoint]) {
				P[oldPoint].fillColor = 'red';
				P[oldPoint].strokeColor = 'red';
			} else {
				P[oldPoint].fillColor = 'black';
				P[oldPoint].strokeColor = 'black';
			};
		};
		if (oldPoint2 != undefined) {
			if (colored[oldPoint2]) {
				P[oldPoint2].fillColor = 'red';
				P[oldPoint2].strokeColor = 'red';
			} else {
				P[oldPoint2].fillColor = 'black';
				P[oldPoint2].strokeColor = 'black';
			};
		};
		if (oldPoint3 != undefined) {
			if (colored[oldPoint3]) {
				P[oldPoint3].fillColor = 'red';
				P[oldPoint3].strokeColor = 'red';
			} else {
				P[oldPoint3].fillColor = 'black';
				P[oldPoint3].strokeColor = 'black';
			};
		};
		await sleep(1000 * timeCentre);
	};
	return G;
};

async function find_neightbors(p, S, P, distances, colored) {
	var voisins = [];
	var points_restants = [];
	var taille = 0;

	var plus_proche_voisin;
	var d = Infinity;

	for (const q of S) {
		var dpq = distances[p][q];
		if (p != q) {
			if (dpq < d) {
				if (plus_proche_voisin != undefined) {
					points_restants.push(plus_proche_voisin);
					taille += 1;
				};
				plus_proche_voisin = q;
				d = dpq;
			} else {
				points_restants.push(q);
				taille += 1;
			};
		};
	};
	voisins.push(plus_proche_voisin);

	if (showGraph) {
		var edge = new Path.Line(P[p].position, P[plus_proche_voisin].position);
		edge.strokeColor = 'black';
		edge.opacity = 1;
		edge.strokeWidth = 2;
		edge.sendToBack();
		liste_edges.push(edge);
	};

	var points_retires = [];
	var q;
	while (taille > 0) {
		q = plus_proche_voisin;
		plus_proche_voisin = undefined;
		d = Infinity;
		var t = taille;

		for (let i = 0; i < t; i++) {
			var r = points_restants.shift();
			taille -= 1
			var dpr = distances[p][r];
			
			if (showCurPoint) {
				if (oldPoint != undefined) {
					if (colored[oldPoint]) {
						P[oldPoint].fillColor = 'red';
						P[oldPoint].strokeColor = 'red';
					} else {
						P[oldPoint].fillColor = 'black';
						P[oldPoint].strokeColor = 'black';
					};
				};
				P[r].fillColor = 'yellow';
				P[r].strokeColor = 'yellow';
				oldPoint = r;
			};
			if (showRay) {
				if (ray != undefined) {ray.remove();};
				ray = new Path.Line(P[p].position, P[r].position);
				ray.strokeColor = 'black';
				ray.opacity = 0.5;
				ray.sendToBack();
			};

			if (distances[q][r] >= dpr) {
				if (dpr < d) {
					if (plus_proche_voisin != undefined) {
						points_restants.push(plus_proche_voisin);
						taille += 1;
					};
					plus_proche_voisin = r;
					d = dpr;
				} else {
					points_restants.push(r);
					taille += 1;
				};
			} else {
				points_retires.push(r);
			};
			await sleep(1000 * timeRay);
		};
		if (plus_proche_voisin != undefined) {
			est_vrai_voisin = true;
			for (const q of points_retires) {
				if (Math.max(distances[p][q], distances[plus_proche_voisin][q]) < d) {
					est_vrai_voisin = false;
					break;
				};
			};
			if (est_vrai_voisin) {
				voisins.push(plus_proche_voisin);
				if (showGraph) {
					var edge = new Path.Line(P[p].position, P[plus_proche_voisin].position);
					edge.strokeColor = 'black';
					edge.opacity = 1;
					edge.strokeWidth = 2;
					edge.sendToBack();
					liste_edges.push(edge);
				};
			};
		};
	};
	if (showRay) {
		ray.remove();
		ray = undefined;
	};
	if (oldPoint != undefined) {
		if (colored[oldPoint]) {
			P[oldPoint].fillColor = 'red';
			P[oldPoint].strokeColor = 'red';
		} else {
			P[oldPoint].fillColor = 'black';
			P[oldPoint].strokeColor = 'black';
		};
	};

	return voisins;
};

async function task_6(P) {
	var n = P.length;
	var S = Array.from(Array(n).keys());
	var G = Array(n).fill([]);
	var distances = P.map((x) => P.map((y) => euclidian_distance([x.position.x, x.position.y], [y.position.x, y.position.y])));
	var colored = Array(n).fill(false);

	for (let i = 0; i < n; i++) {
		G[i] = await find_neightbors(i, S, P, distances, colored);

		colored[i] = true;
		if (showCentre) {
			P[i].fillColor = 'red';
			P[i].strokeColor = 'red';
		};
		await sleep(1000 * timeCentre);
	};
	return G;
};
