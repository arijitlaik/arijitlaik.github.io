var mineralListObj;

$('document').ready(function(){
	//console.log('starts...');
	mineralListObj = new MineralList();
	mineralListObj.init();
});

var MineralList = function() {
	this.questionData = {};
	this.mineralData = {};
	this.detectedArray = [];
	this.userAnswers = {};
}
MineralList.prototype = {
	init: function() {
		this.searchKey = $.trim($('#mineralSearch').val());
		
		this.questionData = questionData;	// imported from questionData.json
		this.mineralData = mineralData;		// imported from mineralData.json
		
		this.searchAction();
		this.parseMineralList();
	},
	searchAction: function(){
		var that = this;
		$('#mineralSearch').keyup(function(){
			that.searchKey = $.trim($(this).val());
			$('#mineralListBlock').empty();
			that.parseMineralList();
		});
		
		$('#removeSearchText').click(function(){
			// if there is search text clear & load
			if(that.searchKey){
				$('#mineralSearch').val('');
				that.searchKey = '';
				that.parseMineralList();
			}
		});
		
		$('#mineralListBlock').on('click', '#viewAllMineralItems', function(e){
			e.preventDefault();
			$('#removeSearchText').click();
		});
	},
	parseMineralList: function() {
		var that = this;
		var mineralId, mineralName;
		var mineralProps = {};
		var resultHtml = '';
		var mineralPropHtml = '';
		
		var counter = 0;
		$.each(this.mineralData.minerals, function(i, eachMineral){
			counter++;
			
			mineralId = eachMineral.id;
			mineralName = eachMineral.mineralName;		
			mineralProps = eachMineral.mineralProps;
			
			//console.log(that.searchKey);
			if(!that.searchKey || (that.searchKey && mineralName.toLowerCase().indexOf(that.searchKey.toLowerCase())===0) ){
				// either NOT-Searched or Searched-n-Matched
				
				var lastMainPropertyName = '';	// to get  Next-SubCategory-item
				var lastMainPropertyId = 0;
				mineralPropHtml = '<ul class="list-group">';
				
				$.each(mineralProps, function(eachKey, eachPropertyId){
					
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
											'<strong class="text-capitalize">'+eachKey.replace(/_/g,' ')+'</strong>'+
											'<span class="text-capitalize">'+propertyValue+'</span>'+
										'</li>';
					//console.log(eachKey+': '+propertyValue);
				});
				mineralPropHtml += '</ul>';
				
				var panelTheme = 'primary';
				resultHtml += '<div class="panel panel-'+panelTheme+'">'+
								'<div class="panel-heading text-capitalize">'+
									'<h4 class="panel-title"><a data-toggle="collapse" data-parent="#mineralListBlock" href="#mineralDataBody_'+counter+'" >'+mineralName+
										'<span class="glyphicon glyphicon-option-vertical pull-right" aria-hidden="true"></span>'+
									'</a></h4>'+
								'</div>'+
								'<div id="mineralDataBody_'+counter+'" class="panel-collapse collapse"><div class="panel-body">'+
									'<h4 class="text-'+panelTheme+'">Properties: </h4>'+
									mineralPropHtml+
								'</div></div>'+
							'</div>';
			}
		});
		
		if(!mineralPropHtml){
			// searched text dint match any mineral
			resultHtml = '<div class="alert alert-warning text-center" role="alert">'+
							'<h4>Oops! No match found. Please search again.</h4>'+
							'<p class="extraHeight20"></p>'+
							'<a href="#" id="viewAllMineralItems" class="btn btn-info btn-md">View All</a>'+
							'</div>';
		}
		
		$('#mineralListBlock').html(resultHtml);
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