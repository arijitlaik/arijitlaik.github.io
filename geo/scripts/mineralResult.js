var resultObj;

$('document').ready(function(){
	//console.log('starts...');
	resultObj = new Result();
	resultObj.init();
	resultObj.parseResults();
});

var Result = function() {
	this.questionData = {};
	this.detectedArray = [];
	this.userAnswers = {};
}
Result.prototype = {
	init: function() {
		this.questionData = questionData;		// imported from questionData.json
		//console.log(questionData);
		//console.log(questionData);
		var detectedResult = localStorage.getItem("detectedMaterials");
		if(detectedResult !== null) {
			// localstorage exists
			this.detectedArray = JSON.parse(detectedResult);
		}
		//console.log(this.detectedArray);	
		//[[1,"Pyrolusite",60,{"color":1,"color_subcategory":1,"form_habit":2,"hardness":3,"streak":1,"streak_subcategory":6,"set_of_cleavage":1,"fracture":1,"luster":7,"specific_gravity":3}],[5,"Psilomelane",10,{"color":1,"color_subcategory":3,"form_habit":6,"hardness":1,"streak":1,"streak_subcategory":6,"set_of_cleavage":6,"fracture":2,"luster":7,"specific_gravity":1}],[4,"Plagioclase",10,{"color":2,"color_subcategory":10,"form_habit":8,"hardness":1,"streak":10,"streak_subcategory":18,"set_of_cleavage":2,"fracture":1,"luster":8,"specific_gravity":1}],[2,"K-Feldspar",10,{"color":11,"color_subcategory":45,"form_habit":8,"hardness":1,"streak":10,"streak_subcategory":18,"set_of_cleavage":2,"fracture":1,"luster":1,"specific_gravity":1}]]
		
		var userAnswersJSON = localStorage.getItem("userAnswers");
		if(userAnswersJSON !== null) {
			// localstorage exists
			this.userAnswers = JSON.parse(userAnswersJSON);
		}
		//console.log(this.userAnswers);	
		//{"color":1,"color_subcategory":1,"form_habit":3,"hardness":3,"streak":5,"streak_subcategory":42,"set_of_cleavage":1,"fracture":1,"luster":6,"specific_gravity":3}
	},
	parseResults: function() {
		var that = this;
		var mineralId, mineralName, matchingPercentage;
		var mineralProps = {};
		var resultHtml = '';
		var mineralPropHtml = '';
		if(this.detectedArray.length==0){
			resultHtml += '<div class="alert alert-warning text-center" role="alert">'+
							'<h4>Oops! No match found. Please try again.</h4>'+
							'<p class="extraHeight20"></p>'+
							'<a href="detectMineral.html" class="btn btn-warning btn-lg">Detect Again <span class="glyphicon glyphicon-play"></span></a>'+
							'</div>';
		}else{
			$.each(this.detectedArray, function(i, mineralResult){
				
				mineralId = mineralResult[0];
				mineralName = mineralResult[1]; 
				matchingPercentage = mineralResult[2];
				mineralProps = mineralResult[3];
				
				var lastMainPropertyName = '';	// to get  Next-SubCategory-item
				var lastMainPropertyId = 0;
				mineralPropHtml = '<ul class="list-group">';
				$.each(mineralProps, function(eachKey, eachPropertyId){
					// check if Matched with user's answer
					var matchedAnswerFlag = that.matchUserAnswer(eachKey, eachPropertyId);
					var matchHtml = '';
					if(matchedAnswerFlag){
						matchHtml = '<span class="badge"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></span>';
					}
					
					// get Value from questionData
					var propertyValue = 0;
					if(eachKey.indexOf("subcategory")>-1){
						// mineral property is a subcategory of Color/Streak
						propertyValue = that.getMineralSubPropertyById(lastMainPropertyName, lastMainPropertyId, eachPropertyId);
						eachKey = ' &nbsp;';
					}else {
						propertyValue = that.getMineralPropertyById(eachKey, eachPropertyId);
						lastMainPropertyName = eachKey;
						lastMainPropertyId = eachPropertyId;
						
						eachKey += ':';
					}
					if(!propertyValue){
						propertyValue = '-';
					}
					
					mineralPropHtml += '<li class="list-group-item">'+
											matchHtml+
											'<strong class="text-capitalize">'+eachKey.replace(/_/g,' ')+'</strong>'+
											'<span class="text-capitalize">'+propertyValue+'</span>'+
										'</li>';
					//console.log(eachKey+': '+propertyValue);
				});
				mineralPropHtml += '</ul>';
				
				var panelTheme = 'default';
				switch(i){
					case 0: panelTheme = 'warning';
							break;
					case 1: panelTheme = 'primary';
							break;
					case 2: panelTheme = 'danger';
							break;
					case 3: panelTheme = 'success';
							break;
					case 4: panelTheme = 'info';
							break;
					default: panelTheme = 'warning';
							break;
				}
				resultHtml += '<div class="panel panel-'+(panelTheme=='warning'?'warningDeep':panelTheme)+'">'+
								'<div class="panel-heading text-capitalize">'+
									'<h4 class="panel-title"><a data-toggle="collapse" data-parent="#resultBlock" href="#mineralResult_'+i+'" >'+(i+1)+'. '+mineralName+
										'<span class="glyphicon glyphicon-option-vertical pull-right" aria-hidden="true"></span>'+
									'</a></h4>'+
								'</div>'+
								'<div class="panel-body">'+
									'<h4 class="text-'+panelTheme+'">Matching percentage: </h4>'+
									'<div class="progress">'+
										'<div class="progress-bar progress-bar-'+panelTheme+'  progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="10" aria-valuemax="100" style="width: '+matchingPercentage+'%;">'+matchingPercentage+'%</div>'+
									'</div>'+
								'</div>'+
								'<div id="mineralResult_'+i+'" class="panel-collapse collapse '+(i==0?'in':'')+'"><div class="panel-body">'+
									mineralPropHtml+
								'</div></div>'+
							'</div>';
									
			});
		}
		$('#resultBlock').html(resultHtml);
	},
	getMineralPropertyById: function(property, id){
		var propertyValue = 0;
		$.each(this.questionData.questions, function(i, eachQuestion){
			if(eachQuestion.property == property){
				$.each(eachQuestion.answers, function(j, eachAnswer){
					if(eachAnswer.id == id){
						propertyValue = eachAnswer.answer;
						return false;
					}
				});
				if(propertyValue)
					return false;
			}
		});
		
		return propertyValue;
	},
	matchUserAnswer: function(mineralProperty, propertyId){
		var matchFlag = false;
		$.each(this.userAnswers, function(eachKey, eachVal){
			if(eachKey == mineralProperty){
				if(eachVal == propertyId){
					matchFlag = true;
					return false;
				}
			}
		});
		
		return matchFlag;
	},
	getMineralSubPropertyById: function(property, id, subCategoryId){
		var subPropertyValue = 0;
		$.each(this.questionData.questions, function(i, eachQuestion){
			if(eachQuestion.property == property){
				$.each(eachQuestion.answers, function(j, eachAnswer){
					if(eachAnswer.id == id){
						$.each(eachAnswer.subAns, function(k, eachSubAnswer){
							if(subCategoryId = eachSubAnswer.id){
								subPropertyValue = eachSubAnswer.answer;
								return false;
							}
						});
					}
					if(subPropertyValue)
						return false;
				});
				if(subPropertyValue)
					return false;
			}
		});
		
		return subPropertyValue;
	}
}