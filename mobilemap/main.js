var pymChild = new pym.Child();

ready();
breaks = [0,0,8000,20000,30000,60000,900000];

function ready() {

hoveredId = null;

	map = new mapboxgl.Map({
		container: "map",
		style: "data/style.json",
		center: [-3.5, 52.355],
		zoom: 5,
		maxZoom: 18,
		attributionControl: false
	})

	//add fullscreen option
	map.addControl(new mapboxgl.FullscreenControl());

	// Add zoom and rotation controls to the map.
	map.addControl(new mapboxgl.NavigationControl());

	// Disable map rotation using right click + drag
	map.dragRotate.disable();

	// Disable map rotation using touch rotation gesture
	map.touchZoomRotate.disableRotation();

	//add compact attribution
	// map.addControl(new mapboxgl.AttributionControl({
	// 	compact: true
	// }));

	map.addControl(new mapboxgl.AttributionControl({
		compact:true,customAttribution:"© Crown copyright and database rights "+new Date(Date.now()).getFullYear()+" OS 100019153"
		})
	);

	d3.selectAll(".mapboxgl-ctrl-icon").attr("aria-hidden","false")


	map.on("load", function() {
		//map.addSource("area", { type: "geojson", data: areas });

		map.addSource('squares', {
			type: 'vector',
			//tiles: ['http://localhost:8000/broadband/{z}/{x}/{y}.pbf'],
			tiles: ['https://fryford.github.io/broadbandmap/mobilemap/broadband/{z}/{x}/{y}.pbf'],
			"promoteId": {
          "ukmobilebroadband2020q4": "quadkey"
        },
			minzoom:4,
			maxzoom: 10,
		});


		map.addLayer({
			id: 'squarestiles',
			type: 'fill',
			source: 'squares',
			'source-layer': 'ukmobilebroadband2020q4',
			minzoom:4,
			maxzoom:20,
			"background-color": "#ccc",
			'paint': {
					'fill-opacity':0.7,
					'fill-outline-color':'rgba(0,0,0,0)',
					'fill-color': {
							// Refers to the data of that specific property of the polygon
						'property': 'avg_d_kbps',
						'default': '#666666',
						// Prevents interpolation of colors between stops
						'base': 0,
						'stops': [
							[breaks[0], '#feedde'],
							[breaks[2], '#fdd0a2'],
							[breaks[3], '#fdae6b'],
							[breaks[4], '#fd8d3c'],
							[breaks[5], '#e6550d'],
							[breaks[6], '#a63603']

						]
					}

				}
		}, 'place_suburb');


		map.addLayer({
			id: 'squarestileslines',
			type: 'line',
			source: 'squares',
			'source-layer': 'ukmobilebroadband2020q4',
			minzoom:4,
			maxzoom:20,
			"background-color": "#ccc",
			paint: {
          'line-color': 'black',
          "line-width": 3,
          "line-opacity":
					//1
					[
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0
          ]
        },
		}, 'place_suburb');

		// // Add buildings tileset
		// map.addSource('building-tiles', {
		// 	type: 'vector',
		// 	tiles: ['https://cdn.ons.gov.uk/maptiles/administrative/lsoa/v1/buildings/{z}/{x}/{y}.pbf'],
		// 	promoteId: {
		// 		buildings: "AREACD"
		// 	},
		// 	minzoom: 8,
		// 	maxzoom: 12,
		// });
		//
		// // Add layer from the vector tile source with data-driven style
		// map.addLayer({
		// 	id: 'lsoa-building',
		// 	type: 'fill',
		// 	source: 'building-tiles',
		// 	'source-layer': 'buildings',
		// 	minzoom:8,
		// 	maxzoom:17,
		// 	paint: {
		// 		'fill-color': ['case',
		// 			['!=', ['feature-state', 'colour'], null],
		// 			['feature-state', 'colour'],
		// 			'rgba(255, 255, 255, 0)'
		// 		],
		// 		'fill-opacity': 0.8
		// 	}
		// }, 'place_suburb');








		var bounds = new mapboxgl.LngLatBounds();

		// areas.features.forEach(function(feature) {
		// 	bounds.extend(feature.geometry.coordinates);
		// });


		map.fitBounds([[-5.8,50.0],[1.9,55.9]]);


			// for (key in dataAll) {
			//
			// //	console.log(key);
			//
			// 	map.setFeatureState({
			// 		source: 'msoa-centroids',
			// 		sourceLayer: 'msoacentroids',
			// 		id: key
			// 	}, {
			// 		casesPI: Math.sqrt(dataAll[key]/Math.PI),
			// 		cases: dataAll[key]
			// 	});
			// }


	});

createKey()


	map.on("mousemove", "squarestiles", onMove);
	map.on("mouseleave", "coronabound", onLeave);
	map.on("click", "corona", onClick);


	function highlightArea(e) {
	  if (e.length > 0) {
	    if (hoveredId) {
	      map.setFeatureState({
	        source: 'squares',
	        sourceLayer: 'ukmobilebroadband2020q4',
	        id: hoveredId
	      }, {
	        hover: false
	      });
	    }

			console.log(e[0])
	    hoveredId = e[0].id;

	    map.setFeatureState({
	      source: 'squares',
	      sourceLayer: 'ukmobilebroadband2020q4',
	      id: hoveredId
	    }, {
	      hover: true
	    });

	    setAxisVal(e[0].properties.avg_d_kbps);
	   // setScreenreader(e[0].properties.AREANM, json[e[0].properties.AREACD]);
	  }
	}

	map.on('click', function(e) {
		var features = map.queryRenderedFeatures(e.point);
	})

	function onMove(e) {
		 highlightArea(e.features);
	 }

	function createKey() {
      keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

      var svgkey = d3.select("#keydiv")
        .attr("width", keywidth);

      d3.select("#keydiv")
        .style("font-family", "Open Sans")
        .style("font-size", "14px");

      d3.select("#keydiv")
        .append("p")
        .attr("id", "keyunit")
        .style("margin-top", "5px")
        .style("margin-bottom", "5px")
        .style("margin-left", "10px")
        .text("broadband speed Mbps");



			breaks = [0,8000,20000,30000,60000,900000];
			colour = ["#fdd0a2","#fdae6b","#fd8d3c","#e6550d","#a63603"]

      stops = d3.zip(breaks,colour);

      divs = svgkey.selectAll("div")
        .data(breaks)
        .enter()
        .append("div");

      divs.append("div")
        .style("height", "20px")
        .style("width", "10px")
        .attr("float", "left")
        .style("display", "inline-block")
        .style("background-color", function(d, i) {
          if (i != breaks.length - 1) {
            return stops[i][1];
          } else {
            //return dvc.nullColour;
          }
        });

      divs.append("p")
        .attr("float", "left")
        .style("padding-left", "5px")
        .style("margin", "0px")
        .style("display", "inline-block")
        .style("position", "relative")
        .style("top", "-5px")
        .text(function(d, i) {
          if (i != breaks.length - 1) {
            return d3.format(",.1f")(breaks[i]/1000) + " to " +(d3.format(",.1f")((breaks[i + 1])/1000)-0.1);
          } else {
            return "No Data";
          }
        });
    } // Ends create key


	function onClick(e) {
		var oldareacd = "ff";
		newareacd = e.features[0].properties.areacd;

		if (newareacd != oldareacd) {
			oldareacd = e.features[0].properties.areacd;
			map.setFilter("coronahover", [
				"==",
				"areacd",
				e.features[0].properties.areacd
			]);

			map.setFilter("coronaboundhover", [
				"==",
				"areacd",
				e.features[0].properties.areacd
			]);
			console.log(e.features[0].properties)

			setAxisVal(e.features[0].properties.areanm, e.features[0].properties.areanmhc, e.features[0].properties.areacd);

		}
	}

	function onLeave() {
		map.setFilter("coronahover", ["==", "areacd", ""]);
		map.setFilter("coronaboundhover", ["==", "areacd", ""]);

		oldlsoa11cd = "";
		hideaxisVal();
	}

	function setAxisVal(speed) {

		d3.select("#keyvalue")
			.style("font-weight", "bold")
			.html("<span>" + d3.format(",.1f")(speed/1000) + " Mbps</span>")



		// d3.select("#keyvaluehidden")
		// 	.attr("aria-live","polite")
		// 	.html("In " + areanmhc + " there have been " + dataAll[areacd] + " cases overall in the last 7 days.")


		// d3.select("#deathLabel").text("Deaths");
		//
		// d3.select("#legendVal0").text(dataAll[areacd]);
		// d3.select("#legendVal1").text(dataMar[areacd]);
		// d3.select("#legendVal2").text(dataApr[areacd]);
		// d3.select("#legendVal3").text(dataMay[areacd]);
		// d3.select("#legendVal4").text(dataJune[areacd]);
		//
		// d3.select("#legendx0").style("width", dataAll[areacd] + "px");
		// d3.select("#legendx1").style("width", dataMar[areacd] + "px");
		// d3.select("#legendx2").style("width", dataApr[areacd] + "px");
		// d3.select("#legendx3").style("width", dataMay[areacd] + "px");
		// d3.select("#legendx4").style("width", dataJune[areacd] + "px");
	}

	function setLegend() {

		layernames = ["All","Mar","Apr","May","June"];

		//d3.select("#keydiv").append("div").attr("id","deathLabel").text("").style("position","relative").style("left","136px").style("height","20px")

		// legend = d3.select("#keydiv")//.append('ul')
		// 						// 	.attr('class', 'key')
		// 							.selectAll('g')
		// 							.data(["Overall","March","April","May","June"])
		// 							.enter()
		// 							.append('div')
		// 							.attr('class', function(d, i) { return 'key-item key-' + i + ' b '+ d.replace(' ', '-').toLowerCase(); })
		//
		//
		// 						legend.append("input")
		// 								.style("float","left")
		// 								.attr("id",function(d,i){return "radio"+i})
		// 								.attr("class","input input--radio js-focusable")
		// 								.attr("type","radio")
		// 								.attr("name","layerchoice")
		// 								.attr("value", function(d,i){return layernames[i]})
		// 								.property("checked", function(d,i){if(i==0){return true}})
		// 								.on("click",repaintLayer)
		//
		// 						legend.append('label')
		// 						.attr('class','legendlabel').text(function(d,i) {
		// 							var value = parseFloat(d).toFixed(1);
		// 							return d;
		// 						})
		//
		// 						legend.append('label')
		// 						.attr('class','legendVal')
		// 						.attr("id",function(d,i){return "legendVal" + i})
		// 						.text("")
		// 						.attr("value", function(d,i){return layernames[i]})
		// 						.on("click",repaintLayer);
		//
		// 						legend.append('div')
		// 						.attr('class','legendx')
		// 						.attr("id",function(d,i){return "legendx" + i})
		// 						.style("width", "0px")
		// 						.style("height","20px")
		// 						.style("margin-left","7px")
		// 						.style("margin-top","10px")
		// 						.style("background-color","black")
		// 						.style("position","relative")
		// 						.style("float","left")
		// 						.style("background-color","#1b5f97")

	}

	function repaintLayer() {

		layername = d3.select(this).attr("value");

		if(layername == "All") {
			for (key in dataAll) {

			//	console.log(key);

				map.setFeatureState({
					source: 'msoa-centroids',
					sourceLayer: 'msoacentroids',
					id: key
				}, {
					casesPI: Math.sqrt(eval(dataAll[key])/Math.PI),
					cases: dataAll[key]

				});
			}


		} else if(layername == "Mar") {

			for (key in dataAll) {

			//	console.log(key);

				map.setFeatureState({
					source: 'msoa-centroids',
					sourceLayer: 'msoacentroids',
					id: key
				}, {
					casesPI: Math.sqrt(eval(dataMar[key])/Math.PI),
					cases: dataMar[key]
				});
			}

		} else if(layername == "Apr") {

			for (key in dataAll) {

			//	console.log(key);

				map.setFeatureState({
					source: 'msoa-centroids',
					sourceLayer: 'msoacentroids',
					id: key
				}, {
					casesPI: Math.sqrt(eval(dataApr[key])/Math.PI),
					cases: dataApr[key]
				});
			}

		} else if(layername == "May") {

			for (key in dataAll) {

			//	console.log(key);

				map.setFeatureState({
					source: 'msoa-centroids',
					sourceLayer: 'msoacentroids',
					id: key
				}, {
					casesPI: Math.sqrt(eval(dataMay[key])/Math.PI),
					cases: dataMay[key]
				});
			}

		} else if(layername == "June") {

			for (key in dataAll) {

			//	console.log(key);

				map.setFeatureState({
					source: 'msoa-centroids',
					sourceLayer: 'msoacentroids',
					id: key
				}, {
					casesPI: Math.sqrt(eval(dataJune[key])/Math.PI),
					cases: dataJune[key]
				});
			}

		}




	}

	function hideaxisVal() {
		d3
			.select("#keyvalue")
			.style("font-weight", "bold")
			.text("");


			d3.selectAll(".legendVal")
				.text("");

			d3.selectAll("#deathLabel")
				.text("");

			d3.selectAll(".legendx")
				.style("width","0px");

	}


	$(".search-control").click(function() {
		$(".search-control").val('');
	})

	d3.select(".search-control").on("keydown", function() {
	if(d3.event.keyCode === 13){
		event.preventDefault();
		event.stopPropagation();

		myValue=$(".search-control").val();


		getCodes(myValue);
		pymChild.sendHeight();

	}
})

function tog(v){return v?'addClass':'removeClass';}

$(document).on('input', '.clearable', function(){
		$(this)[tog(this.value)]('x');
}).on('mousemove', '.x', function( e ){
		$(this)[tog(this.offsetWidth-28 < e.clientX-this.getBoundingClientRect().left)]('onX');
}).on('touchstart click', '.onX', function( ev ){
		ev.preventDefault();
		$(this).removeClass('x onX').val('').change();
		enableMouseEvents();
		onLeave();
		hideaxisVal();
});

	$("#submitPost").click(function( event ) {

					event.preventDefault();
					event.stopPropagation();

					myValue=$(".search-control").val();


					getCodes(myValue);
					pymChild.sendHeight();
	});


	function getCodes(myPC)	{

		//first show the remove cross
		d3.select(".search-control").append("abbr").attr("class","postcode")



			// dataLayer.push({
			// 					 'event': 'geoLocate',
			// 					 'selected': 'postcode'
			// 				 })

			var myURIstring=encodeURI("https://api.postcodes.io/postcodes/"+myPC);
			$.support.cors = true;
			$.ajax({
				type: "GET",
				crossDomain: true,
				dataType: "jsonp",
				url: myURIstring,
				error: function (xhr, ajaxOptions, thrownError) {
					},
				success: function(data1){
					if(data1.status == 200 ){
						//$("#pcError").hide();
						lat =data1.result.latitude;
						lng = data1.result.longitude;
						successpc(lat,lng)
					} else {
						$(".search-control").val("Sorry, invalid postcode.");
					}
				}

			});

		}


	function successpc(lat,lng) {

		map.jumpTo({center:[lng,lat], zoom:12})
		point = map.project([lng,lat]);


		setTimeout(function(){

		var tilechecker = setInterval(function(){
			 features=null
			 features = map.queryRenderedFeatures(point,{layers: ['coronabound']});

			 if(features.length != 0){

				 setTimeout(function(){
		 			features = map.queryRenderedFeatures(point,{layers: ['coronabound']});

		 		 //onrender(),
		 		//map.setFilter("coronahover", ["==", "areacd", features[0].properties.areacd]);

				map.setFilter("coronahover", [
					"==",
					"areacd",
					features[0].properties.areacd
				]);

				map.setFilter("coronaboundhover", [
					"==",
					"areacd",
					features[0].properties.areacd
				]);
				//var features = map.queryRenderedFeatures(point);
				disableMouseEvents();
				setAxisVal(features[0].properties.areanm, features[0].properties.areanmhc, features[0].properties.areacd);
				//updatePercent(features[0]);
			},400);
		 		clearInterval(tilechecker);
		 	}
		 },500)
		},500);




	};

	function disableMouseEvents() {
			map.off("mousemove", "coronabound", onMove);
			map.off("mouseleave", "coronabound", onLeave);
	}

	function enableMouseEvents() {
			map.on("mousemove", "coronabound", onMove);
			map.on("click", "corona", onClick);
			map.on("mouseleave", "coronabound", onLeave);
	}



}
