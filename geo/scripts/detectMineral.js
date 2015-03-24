var qASetupObj, questionsObj;

$('document').ready(function(){
	//console.log('starts...');
	qASetupObj = new QuestionAnswerSetup();
	qASetupObj.init();
	
	// load Questions
	questionsObj = new Questions();
	questionsObj.init();
});


var QuestionAnswerSetup = function() {
	this.currentQuestionNumber = 0;
	this.totalQuestionNumber = 0;
	this.answers = {};
}
QuestionAnswerSetup.prototype = {
	init: function(){
		// Page anchor clicks- stop scroll to top
		$(document.body).on('click', 'a', function(e){
			var href = $.trim($(this).attr('href'));
			if(href == '#'){
				e.preventDefault();
			}
		});
		this.accordionAnsClickAction();
		this.backNextButtonAction();
		
	},
	accordionAnsClickAction: function(){
		$('#answerAccordion').on('click', 'a input[type=radio]', function(e){ 
			//console.log('1')
			e.stopPropagation();
			$(this).parents('a').click();
		});
		
		$('#answerAccordion').on('click', 'a', function(e){ 
			//console.log('2')
			e.preventDefault();		// stop click on  radio button- if pressed
			$(this).find('input[type=radio]').prop("checked", true);
			
			var panel = $(this).parents('.panel');
			panel.siblings().removeClass('active');
			panel.addClass('active');
			
			
			if($(this).parents('.subAnswerAccordionPanel').length){
				// clicked on Sub-category
				setTimeout(function(){
								//console.log('clicked'); 
								$('.nextButton').click();3
							}, 200);
			}
		});
	},
	backNextButtonAction: function(){
		var scope = this;
		$(document.body).on('click', '.nextButton, .skipButton', function(){
			scope.currentQuestionNumber = parseInt($('#questionNumber').val()); 
			scope.selectAnswerFromNext(questionNumber);
			
			scope.totalQuestionNumber = parseInt($('#totalQuestionNumber').val());
			if(scope.currentQuestionNumber < scope.totalQuestionNumber-1){
				++scope.currentQuestionNumber;
				$('#questionNumber').val(scope.currentQuestionNumber);
				questionsObj.parseQuestionAnswers();
			}else{
				questionsObj.detectMineral();
			}
		});
		
		
		$('.backButton').click(function(){
			var questionNumber = parseInt($('#questionNumber').val());
			--questionNumber;
			$('#questionNumber').val(questionNumber);
			questionsObj.parseQuestionAnswers();
		});
	},
	selectAnswerFromNext: function(){
		var property = $('#property').val();
		var selectedAnswer = parseInt($("input[name=answerId]:checked").val());
		if(!selectedAnswer || isNaN(selectedAnswer) || selectedAnswer<0){
			selectedAnswer = 0;
		}
		this.answers[property] = selectedAnswer;
		
		// check if Answer has Sub-Answer
		var subAnswerAccordionPanel = $("input[name=answerId]:checked").parents(".panel").find(".subAnswerAccordionPanel");
		if(subAnswerAccordionPanel.length) {
			var selectedSubAnswer = parseInt($(".subAnswerAccordionPanel input[name=subAnswerId]:checked").val());
			if(!selectedSubAnswer || isNaN(selectedSubAnswer) || selectedSubAnswer<0){
				selectedSubAnswer = 0;
			}
			if(property=='color'){
				this.answers["color_subcategory"] = selectedSubAnswer;
			} else if(property=='streak'){
				this.answers["streak_subcategory"] = selectedSubAnswer;
			}
		}
		
		//console.log(this.answers);	// {color: 1, color_subcategory: 1, form_habit: 1, hardness: 5, streak: 3,...}
	}
}



var Questions = function() {
	this.questionData = {};
	this.mineralData = {};
	this.currentQuestionNumber = 0;
	this.totalQuestionNumber = 0;
	this.currentQuestionData = {};
}
Questions.prototype = {
	init: function(){
		/* if(localStorage.getItem("detectedMaterials") !== null){
			localStorage.removeItem("detectedMaterials");
		} */
		if(localStorage.getItem("userAnswers") !== null){
			localStorage.removeItem("userAnswers");
		}
		
		this.questionData = questionData;	// imported from questionData.json
		this.mineralData = mineralData;		// imported from mineralData.json
		this.totalQuestionNumber = this.questionData.questions.length;
		$('#totalQuestionNumber').val(this.totalQuestionNumber);
		this.parseQuestionAnswers();
	},
	// parse Question Answers
	parseQuestionAnswers: function(){
		this.currentQuestionNumber = parseInt($('#questionNumber').val());
		
		// scroll to top
		$(document.body).scrollTop(0);
		this.calculateProgressbar(-1);
		
		this.currentQuestionData = this.questionData.questions[this.currentQuestionNumber];
		
		// Question & property Set
		$('#QuestionText').text( (this.currentQuestionNumber+1)+'. '+this.currentQuestionData.questionText);
		$('#property').val(this.currentQuestionData.property);
		// Answers
		var answerHtml = '';
		var subAnswerHtml = '';
		var buttonsHtml = 	'<a href="#" class="btn btn-info btn-md mayBeButton nextButton">May be <span class="glyphicon glyphicon-step-forward"></span></a>'+
							'<a href="#" class="btn btn-warning btn-md nextButton">Yes, sure <span class="glyphicon glyphicon-chevron-right"></span></a>';
		$.each(this.currentQuestionData.answers, function(i, eachAnswer){
			// check subAns availability
			if(eachAnswer.subAns.length) {
				subAnswerHtml = '<div class="subAnswerAccordionPanel" id="answerAccordion_'+i+'">';
				// if available- then make a sub-accordion
				$.each(eachAnswer.subAns, function(j, eachSubAnswer){
					subAnswerHtml += '<div class="panel panel-default"><div class="panel-heading">'+
									'<h4 class="panel-title"><a data-parent="#answerAccordion_'+i+'" >'+
										'<label><input type="radio" name="subAnswerId" value="'+eachSubAnswer.id+'">'+
											eachSubAnswer.answer+
										'</label>'+
									'</a></h4></div>'+
								'</div>';
								
				});				
				subAnswerHtml += '</div>';
			}
			
				
			answerHtml += '<div class="panel panel-default"><div class="panel-heading">'+
						'<h4 class="panel-title"><a data-toggle="collapse" data-parent="#answerAccordion" href="#collapseAnswer_'+i+'">'+
							'<label><input type="radio" name="answerId" value="'+eachAnswer.id+'">'+
								eachAnswer.answer+
							'</label>'+
							(subAnswerHtml==''? '' : '<span class="glyphicon glyphicon-option-vertical pull-right" aria-hidden="true"></span>')+
						'</a></h4></div>'+
						'<div id="collapseAnswer_'+i+'" class="panel-collapse collapse"><div class="panel-body">'+
							'<p class="text-right">'+
								subAnswerHtml+
								(subAnswerHtml==''?buttonsHtml:'')+
							'</p>'+
						'</div></div>'+
					'</div>';
		});
		
		$('#answerAccordion').html(answerHtml);
		
		$('.backButton').attr('disabled', false);
		if(this.currentQuestionNumber==0){
			$('.backButton').attr('disabled', true);
		}
		
	},
	// show Progress-bar ()
	calculateProgressbar: function(progress){
		var progressText = progress;
		if(progress == 100){
		
		}else{
			progress = 0;
			//console.log(this.currentQuestionNumber);
			if(this.currentQuestionNumber ==0){
				progressText = 0;	// first Question
				progress = 18;
			} else if(this.currentQuestionNumber+1 ==this.totalQuestionNumber){
				progress = 99;	// last question
				progressText = progress;
			} else {
				progress = Math.ceil((100*(this.currentQuestionNumber+1))/this.totalQuestionNumber);
				progressText = progress;
			}
			progress = progress<18? 18:progress;
		}
		$('.progress-bar').text(progressText+'%').css('width', progress+'%');
	},
	detectMineral: function(){
		// scroll to top
		$(document.body).scrollTop(0);
		questionsObj.calculateProgressbar(100);
		$('#loader').show();
		
		// parse User answers for detection
		//console.log(qASetupObj.answers);	// {color: 1, color_subcategory: 1, form_habit: 1, hardness: 5, streak: 3,...}
		var userAnswers = qASetupObj.answers;
		localStorage.setItem("userAnswers",JSON.stringify(userAnswers));
		
		// match Mineral
		var matchPropCount;
		var mineralprops = [];
		var matchedArray = [];
		var detectedArray = [];
		$.each(this.mineralData.minerals, function(i, eachMineral){
			//console.log(eachMineral);
			mineralprops = eachMineral.mineralProps;
			matchPropCount = 0;
			$.each(mineralprops, function(eachKey, eachPropertyValue){
				if(eachPropertyValue == userAnswers[eachKey]){
					matchPropCount++;
				}
			});
			
			var matchPercentage = Math.ceil(matchPropCount*100/Object.keys(mineralprops).length);
			//console.log(matchPercentage);
			//console.log("------------");
			if(matchPercentage != 0){
				matchedArray.push([eachMineral.id,  eachMineral.mineralName, matchPercentage, eachMineral.mineralProps]);
			}
		});
		//console.log(matchedArray);
		
		detectedArray = matchedArray.sort(this.compareMatchPercentage);
		detectedArray = detectedArray.reverse();
		detectedArray = detectedArray.slice(0,5);
		//console.log(detectedArray);		// [[1,"Pyrolusite",60, []],[5,"Psilomelane",20, []],[4,"Plagioclase",10, []]]
		
		localStorage.setItem("detectedMaterials",JSON.stringify(detectedArray));
		setTimeout(function(){window.location.replace("mineralResult.html")}, 500);
	},
	compareMatchPercentage: function(a, b){
			if (a[2] < b[2]) return -1;		// matchPercentage is at [2] position
			if (a[2] > b[2]) return 1;
			return 0;
	}
}