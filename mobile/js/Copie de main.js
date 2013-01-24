/* ria.exos.flatland.be - Notes de cours en ligne pour le cours de RIA - Applications Internet Riches
 * JS Document - /i/js/main.js
 * coded by PRENOM NOM GROUPE
 * november 2012
 */
 
/*jshint nonstandard: true, browser: true, boss: true */
/*global jQuery */

( function ( $ ) {
	"use strict";

	var $key = 'fc1b81d4d45e';
	var $serieStructure = $('.serieList ul li:first').clone();
	$('.serieList ul li:first').hide();

	var $srcSerie = $('.serieUrl').data('data-serie');
			console.log($srcSerie);



	function getSeries(){ 

		$.ajax({
				url: "http://api.betaseries.com/shows/display/all.json?key=" + $key,
				jsonpCallback: "foo",
				dataType: 'jsonp',
			
				success: function(data){
				
				//console.log(data.root.shows);

					//for(var i=0; i<dataSize; i++){
					for(var i=0, current; current=data.root.shows[i++];){

						var $series = $serieStructure.clone();

						$series.find('.serieTitle').text(current.title).end().find('.serieUrl').attr('data-serie', current.url);
						//end().find('.serieUrl').attr('href', current.url);
						
						$series.appendTo('.serieList ul').fadeIn('slow');
						
						//$series.hide().appendTo('.ui-listview').fadeIn('slow');
						//console.log($series);
						//console.log(current.title);
					}
				}
		});
	}

	function getOneSerie(){

		$.ajax({
				url: "http://api.betaseries.com/shows/display/" + $srcSerie + ".json?key=" + $key,
				dataType: 'jsonp',
			
				success: function(data){
				
						$('#fiche h3').text(data.root.show.title);
						$('.desc').text(data.root.show.description);

						console.log(data.root.show.title);
						console.log(data.root.show.description);
					}	
		});
	}

	$(function(){

		//$('#series').on('load', getSeries());
		getSeries();

		$('.serieUrl').on('click', getOneSerie());

	});


}( jQuery ) );
