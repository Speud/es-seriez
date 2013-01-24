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

	var afficherLoader = function(){
		$(".recherche").show();
	};
	
	var supprimerLoader = function(){
		$(".recherche").hide();
	};

	var $serieStructure = $('.serieList li:first').clone();
	var $serieStructure2 = $('.serieList2 li:first').clone();

	$('#series .serieList li:first').hide();
	$('.serieList li:first').hide();
	$('.serieList2 li:first').hide();
	$('ul#season li:first').hide();
	$('ul.listEpisode li:first').hide();
	$('#agenda .ui-content li:first').hide();

	var countList;
	var $url;
	var $watch;
	var aMySeries = [];
	var aMySearch = [];

	var aJours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
	var aMois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

	var getSeries = function(){ 
		var $search = $('input[data-type=search]').val();
		$(".serieList").html("");
		if($search.length > 2) {
			afficherLoader();
			$.ajax({
					url: "http://api.betaseries.com/shows/search.json?key=" + $key + "&title=" + $search,
					dataType: 'jsonp',
					success: function(data){

						for(var i=0, current; current=data.root.shows[i++];){
							var $series = $serieStructure.clone();
							$series.find('.serieTitle').text(current.title).end().find('.serieUrl').attr('data-serie', current.url);
							$series.find('.noWatch').attr('id', current.url);

							aMySearch.push(current.url);

							if($.inArray( current.url, aMySeries ) !== -1) {	
								$series.find('.noWatch').attr('data-icon', 'eye-open').attr('class', 'eye-open noWatch ui-btn ui-btn-corner-all ui-btn-icon-notext ui-btn-up-f').attr('title', 'I watch').children().find('.ui-btn-text').text('I watch').end().find('.ui-icon').removeClass('ui-icon-eye-close').addClass('ui-icon-eye-open').end();
							}
							/* ajout de la liste à la scène */
							$series.hide().appendTo('.serieList').fadeIn('slow');
							supprimerLoader();
						}
					}
			});	/* fin d'ajax */
		} /* fin de la condition if */
	} /* fin de la fonction getSerie */

	var getOneSerie = function(e){
		e.preventDefault();
		var $srcSerie = $(this).find('a.serieUrl').attr('data-serie');
		afficherLoader();
		$.ajax({
				url: "http://api.betaseries.com/shows/display/" + $srcSerie + ".json?key=" + $key,
				dataType: 'jsonp',
			
				success: function(data){
						$url = data.root.show.url;

						$('#infoFiche h2').text(data.root.show.title);

						/* yeux */
						if($.inArray(data.root.show.url, aMySeries ) !== -1) {
							$('.noWatch').attr('data-icon', 'eye-open').attr('class', 'eye-open noWatch ui-btn ui-btn-corner-all ui-btn-icon-notext ui-btn-up-f').attr('title', 'I watch').children().find('.ui-btn-text').text('I watch').end().find('.ui-icon').removeClass('ui-icon-eye-close').addClass('ui-icon-eye-open').end();
						}
						$('.noWatch').attr('data-serie', data.root.show.url).attr('id', data.root.show.url);

						/* banner */
						if(data.root.show.banner === undefined) {
							$('#infoFiche figure').hide();
						} else {
							$('#infoFiche figure').show();
							$('.serieFiche img').attr('src', data.root.show.banner).attr('alt', data.root.show.title);
						}
						
						$('.text_statut').text(data.root.show.status);
						$('.text_duration').text(data.root.show.duration + 'min');
						
						if(data.root.show.network !== undefined) {
							$('.text_chaine').text(data.root.show.network);
						} else {
							$('.text_chaine').text('Aucune');
						}

						if(genre === '') {
							for(var i=0, genre; genre=data.root.show.genres[i++];){
								$('.text_genre').append(genre).append(' ');
							}
						} else {
							$('.text_genre').text('');
							for(var y=0, genre; genre=data.root.show.genres[y++];){
								$('.text_genre').append(genre).append(' ');
							}
						}

						if(data.root.show.description !== undefined) {
							$('.text_description').text(data.root.show.description);
						} else {
							$('.text_description').text('Aucune description pour cette série');
						}

						supprimerLoader();
					}	
		}); /* fin d' ajax */
		
		afficherLoader();
		$.ajax({
				url: "http://api.betaseries.com/shows/episodes/" + $srcSerie + ".json?key=" + $key,
				dataType: 'jsonp',
			
				success: function(data){
					var currentSaison;
					var $saisonStructure = $('ul#season li:first').clone();
					$('.listSaison').remove();
					$('.text_saison').text(data.root.seasons.length);

					for(var i=-1; currentSaison=data.root.seasons[++i];){
						var $saison = $saisonStructure.clone();
						$saison.find('.seasonNumber').text(currentSaison.number).end().find('.ui-li-count').text(currentSaison.episodes.length).end();
						$saison.hide().appendTo('ul#season').fadeIn('slow');
					}
					
					$('.listSaison').on('click', function(e){
						e.preventDefault();
							
							var $ulListEpisode = $(this).find('.listEpisode');
							var $episodeStructure = $('.listEpisode li:first').clone();
							var $numSaison = $(this).find('.seasonNumber').text() - 1;
								
								$.each(data.root.seasons[$numSaison].episodes, function(key, value){
									var $episode = $episodeStructure.clone();
									$episode.find('strong').text(value.episode).end().find('small').text(value.title).end().find('.noWatch').attr('id', value.number).end();
									$episode.hide().appendTo($ulListEpisode).fadeIn('slow');
									supprimerLoader();
								});
					}); /* fin de la fonction onclick pour lister les épisodes */

					$('.listEpisode').on('click', function(){
						return false;
					});

					supprimerLoader();	
				}	
		}); /* fin d'ajax */

	}; /* fin de la fonction getOneSerie */

	var getPlanning = function(){
			var episodeSemaine;
			afficherLoader();
			$.ajax({
					url: "http://api.betaseries.com/planning/general.json?key=" + $key,
					dataType: 'jsonp',
				
					success: function(data){
							var currentPlanning;
							var $planningStructure = $('#agenda .ui-content li:first').clone();

							if ($("#agendaList li").filter(":visible").size() === 0) {
								for(var i=-1; currentPlanning=data.root.planning[++i];){
									for (var n = 0; n < localStorage.length; n++) {
										if(aMySeries[n] === currentPlanning.url) {
											var $planning = $planningStructure.clone();
											var timestamp = currentPlanning.date;
											var englishDate = new Date(timestamp*1000); 
											var jour = aJours[englishDate.getDay()];
											var mois = aMois[englishDate.getMonth()];
											//var annee = englishDate.getFullYear();
											var jourNumber = englishDate.getDate();

											$planning.find('a').attr('data-serie', currentPlanning.url).attr('id', currentPlanning.url).end().find('h2').text(currentPlanning.show).end().find('strong').text(currentPlanning.number).end().find('.agendaEpisode small').text(currentPlanning.title).end().find('.agendaDate strong').text(jour + ' ' + jourNumber).end().find('.agendaDate em').text(mois).end();
											$planning.hide().appendTo('#agenda .ui-content ul').fadeIn('slow');
											episodeSemaine = 1;
											supprimerLoader();
										}
									}
								}
							} else {
								supprimerLoader();
								return false;
							}

							if(episodeSemaine !== 1 && $('.text_info1').size() === 0) {
									supprimerLoader();
									$('#agenda .ui-content').append('<p class="text_info1">Aucun épisode n\'est prévu pour la semaine</p>');
							}

							supprimerLoader();

							$('#agendaList li').on('click', getOneSerie);

					} /* fin de success */	
			}); /* fin d'ajax */
	}; /* fin de getPlanning */

	var addSerie=function(e){
		e.preventDefault();
			if (localStorage) {
				if($(this).attr('data-icon') === 'eye-close') {
					$(this).attr('data-icon', 'eye-open').attr('class', 'eye-open noWatch ui-btn ui-btn-corner-all ui-btn-icon-notext ui-btn-up-f').attr('title', 'I watch').children().find('.ui-btn-text').text('I watch').end().find('.ui-icon').removeClass('ui-icon-eye-close').addClass('ui-icon-eye-open').end();
					localStorage.setItem($url, '');
				 } else {
					$(this).attr('data-icon', 'eye-close').attr('class', 'eye-close noWatch ui-btn ui-btn-corner-all ui-btn-icon-notext ui-btn-up-f').attr('title', 'I don\'t watch').find('.ui-icon').removeClass('ui-icon-eye-open').addClass('ui-icon-eye-close').find('.ui-btn-text').text('I don\'t watchiii').end();
					localStorage.removeItem($url);
				} 
			} else {
				alert('Votre navigateur ne supporte pas le localStorage');
			}
	};

	var getMySeries = function(){
		countList = $(".serieList2 li").size();
				for (var n =-1; n < localStorage.length; ++n){
					afficherLoader();
					$.ajax({
								url: "http://api.betaseries.com/shows/search.json?key=" + $key + "&title=" + aMySeries[n],
								dataType: 'jsonp',	
								success: function(data){
									if(localStorage.length !== 0 && countList <= 1 || countList === 'undefined') {
										for(var i=-1, current; current=data.root.shows[++i];){
											var $series2 = $serieStructure2.clone();
											$series2.find('.serieTitle').text(current.title).end().find('.serieUrl').attr('data-serie', current.url);
											$series2.find('.noWatch').attr('id', current.url);

											aMySearch.push(current.url);

											if($.inArray( current.url, aMySeries ) !== -1) {	
												$series2.find('.noWatch').attr('data-icon', 'eye-open').attr('class', 'eye-open noWatch ui-btn ui-btn-corner-all ui-btn-icon-notext ui-btn-up-f').attr('title', 'I watch').children().find('.ui-btn-text').text('I watch').end().find('.ui-icon').removeClass('ui-icon-eye-close').addClass('ui-icon-eye-open').end();
												/* ajout de la liste à la scène */
												$series2.hide().appendTo('.serieList2').fadeIn('slow');
											}
										}	

									} else {
										supprimerLoader();
										return false;
									}

									supprimerLoader();
									
								} /* fin de success */
						});	/* fin d'ajax */
				} /* fin de la boucle for */
		
			if($('.text_info').size() === 0 && localStorage.length === 0) {
				supprimerLoader();
				$('#series .ui-content').append('<p class="text_info">Vous ne regardez actuellement aucune série</p>');
			} 			
	};

	
	$(function(){
		$('#recherche').live('keyup','input[data-type=search]', getSeries);
		//getSeries;
		//$('#recherche').bind('pageshow', getSeries);

		$('#series').bind('pageshow', function(){
			countList = $(".serieList2 li").filter(":visible").size();
		});

		$('input[data-type=search]').focus();
		//$('input[data-type=search]').on('keyup', getSeries);
		$('.serieList').on('click', 'li', getOneSerie);
		$('.serieList2').on('click', 'li', getOneSerie);
		$('a[href=#series]').on('click', getMySeries);
		//$('#agenda').bind('pageshow', getPlanning);
		$('a[href=#agenda]').on('click', getPlanning);

		$('a[data-icon=farefresh]').on('click', function(){
			location.reload();
		});
		
		$watch = $('.noWatch');
		$watch.on('click', addSerie);

		for (var i = 0; i < localStorage.length; i++){
			aMySeries.push(localStorage.key(i));
		}
	});

}( jQuery ) );