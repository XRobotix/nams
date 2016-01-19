var fs = require("fs");
var GENERATOR = {};
var appName = "";
var URL = "";

function log(obj)
{	 
	// console.log(obj);
}

function upcase(str)
{	
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateFromTempate(templateName,generateName,generatedType,toBeReplaced)
{
	fs.readFile('./templates/'+templateName+'.template', function (err1, data) {
	  	if (err1) throw err1;
	  	
	  	var result = data.toString();
	  	for (var i = 0; i < toBeReplaced.length; i++) {
		  	result = result.replace(new RegExp("##"+toBeReplaced[i].field+"##", "g"), toBeReplaced[i].value);
	  	};

		fs.writeFile( (generatedType == "" ? "./generated/"+appName+"/" : "./generated/"+appName+"/" + generatedType + "/") + generateName, result, function (err2) {
		  if (err2) throw err2;
		  log((generatedType == "" ? "./generated/"+appName+"/" : "./generated/"+appName+"/" + generatedType + "/") + generateName + ' saved!');
		});
	});
}

function generateApiFromTempate(templateName,generateName,generatedType,toBeReplaced)
{
	fs.readFile('./templates/'+templateName+'.template', function (err1, data) {
	  	if (err1) throw err1;
	  	
	  	var result = data.toString();
	  	for (var i = 0; i < toBeReplaced.length; i++) {
		  	result = result.replace(new RegExp("##"+toBeReplaced[i].field+"##", "g"), toBeReplaced[i].value);
	  	};

		fs.writeFile( (generatedType == "" ? "./generated/"+appName+"/" : "./generated/"+appName+"/server/api/" + generatedType + "/") + generateName, result, function (err2) {
		  if (err2) throw err2;
		  log((generatedType == "" ? "./generated/"+appName+"/" : "./generated/"+appName+"/server/api/" + generatedType + "/") + generateName + ' saved!');
		});
	});
}

var generateMenuDropdown = function(modelName)
{
	return "\
	  <li><a class='dropdown-button' data-ng-href='#/"+modelName+"' data-activates='dropdown_"+modelName+"' dropdown data-hover='true'>"+upcase(modelName)+"<i class='mdi-navigation-arrow-drop-down right'></i></a></li>\n\
	  <ul id='dropdown_"+modelName+"' class='dropdown-content'>\n\
	    <li><a data-ng-href='#/"+modelName+"'><i class='material-icons light-blue-text center'>dashboard</i></a></li>\n\
	    <li><a data-ng-href='#/"+modelName+"/all'><i class='material-icons light-blue-text center'>search</i></a></li>\n\
	    <li><a data-ng-href='#/"+modelName+"/new'><i class='material-icons light-blue-text center'>add</i></a></li>\n\
	    <li><a data-ng-href='#/report/"+modelName+"/'><i class='material-icons light-blue-text center'>description</i></a></li>\n\
	  </ul>\n"
}

var generateApp = function(models,url)
{
	var modelsInclude = "";
	var controllersInclude = "";
	var menuItems = "";
	var docReady = "";
		URL = url;
		modelsInclude += ",'" + appName + ".login'";
		controllersInclude += "<script src='./controllers/loginController.js'></script>\n";
		modelsInclude += ",'" + appName + ".report'";
		controllersInclude += "<script src='./controllers/reportController.js'></script>\n";
	
	var summaryArray = [];
	var summaryServices = [];


	for (var i = 0; i < models.length; i++) {
		modelsInclude += ",'" + appName + "." + models[i].name.toLowerCase() + "'";
		if (models[i].top)
			menuItems += generateMenuDropdown(models[i].name);
		controllersInclude += "<script src='./controllers/" + models[i].name.toLowerCase() + "Controller.js'></script>\n";
		generateController(models[i]);
		summaryArray.push("{title:'" + upcase(models[i].name) + " Records',color:'" + (models[i].color ? models[i].color : "green") + "',icon:'mdi-social-group-add',model:'" + models[i].name + "'},");
		summaryServices.push("homeService.getDashData('" + models[i].name + "',function(data){setDashData('" + models[i].name + "',data)});");
	};

	generateFromTempate("app","app.js","",
			[
				{field:"appName",value:appName},
				{field:"url",value:url},
				{field:"summaryArray",value:summaryArray.join("\n")},
				{field:"summaryServices",value:summaryServices.join("\n")},
				{field:"models",value:modelsInclude}
			]
		);

	generateApiFromTempate("apiController",upcase("log")+"Controller.js","controllers",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase("log")}
		]);

	generateApiFromTempate("apiModel",upcase("log")+".js","models",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase("log")},
			{field:"modelAttributes",value:""}
		]);

	generateApiFromTempate("apiUserController",upcase("user")+"Controller.js","controllers",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase("user")}
		]);

	generateApiFromTempate("apiUserModel",upcase("user")+".js","models",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase("user")}
		]);

	generateApiFromTempate("apiReportController",upcase("report")+"Controller.js","controllers",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase("report")}
		]);

	generateApiFromTempate("apiReportModel",upcase("report")+".js","models",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase("report")}
		]);

	generateFromTempate("index","index.html","",
			[
				{field:"appName",value:appName},
				{field:"controllersInclude",value:controllersInclude},
			]
		);

	generateFromTempate("homeView","homeView.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:"home"},
			{field:"modelNameTitle",value:upcase("home")},
			{field:"modelNameAs",value:"h"}
		]);	

	generateFromTempate("menuDirective","menuDirective.html","views/directives",
			[
				{field:"appName",value:appName},
				{field:"menuItems",value:menuItems}	
			]
		);

	generateFromTempate("tableDirective","tableDirective.html","views/directives",[]);

	generateFromTempate("bower","bower.json","",[{field:"appName",value:appName}]);
	generateFromTempate("package","package.json","",[{field:"appName",value:appName}]);
	generateLogin(appName);
	generateReport(appName,models);
}

var generateLogin = function(appName) 
{
	generateFromTempate("loginController","loginController.js","controllers",[{field:"appName",value:appName}]);
	generateFromTempate("loginView","loginView.html","views",[]);
}

var generateReport = function(appName,models) 
{

	generateFromTempate("reportView","reportView.html","views",
		[
			{field:"appName",value:appName}
		]);	

	// generateFromTempate("reportView.findOne","reportView.findOne.html","views",
	// 	[
	// 		{field:"appName",value:appName}
	// 	]);

	generateFromTempate("reportView.findAll","reportView.findAll.html","views",
		[
			{field:"appName",value:appName}
		]);

	generateFromTempate("reportView.edit","reportView.edit.html","views",
		[
			{field:"appName",value:appName}
		]);

	generateFromTempate("reportView.new","reportView.new.html","views",
		[
			{field:"appName",value:appName}
		]);

	generateFromTempate("reportView.delete","reportView.delete.html","views",
		[
			{field:"appName",value:appName}
		]);

	generateFromTempate("reportController","reportController.js","controllers",
		[
			{field:"appName",value:appName},
			{field:"config",value:JSON.stringify(models)}
		]);
	
	generateFromTempate("reportView","reportView.html","views",[]);
}

var generateController = function(model)
{

	var headings = [];
	var modelDirectives = "";
	var apiFields = "";

	for (var i = 0; i < model.fields.length; i++) {
		if (model.fields[i].top)
		{	
			headings.push(model.fields[i].name);
			// apiFields += model.fields[i].name + ": {type: 'string'},\n";
		}
		if (model.fields[i].type == "fk")
		{
			modelDirectives += generateFkDirective(model.fields[i].name,model.name);
			apiFields += model.fields[i].name + ": {model: '" + upcase(model.fields[i].name) + "', via: '" + model.name + "'},\n";
		}
		if (model.fields[i].type == "file")
		{
			apiFields += model.fields[i].name + ": {type: 'array'},\n";
		}
		if (model.fields[i].type == "multiple")
		{
			modelDirectives += generateMultipleDirective(model.fields[i].name,model.name);
			apiFields += model.fields[i].name + ": {collection: '" + upcase(model.fields[i].name) + "', via: '" + model.name + "'},\n";
		}
	};

	generateFromTempate("controller",model.name+"Controller.js","controllers",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}, 
			{field:"modelHeadings",value:JSON.stringify(headings)},
			{field:"modelDirectives",value:modelDirectives}
		]);

	generateApiFromTempate("apiController",upcase(model.name)+"Controller.js","controllers",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name},
		]);

	generateApiFromTempate("apiModel",upcase(model.name)+".js","models",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name},
			{field:"modelAttributes",value:apiFields}
		]);
	
	generateFromTempate("view",model.name+"View.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}
		]);	

	generateFromTempate("view.findOne",model.name+"View.findOne.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}
		]);

	generateFromTempate("reportView.findOne",model.name+"ReportView.findOne.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}
		]);

	generateFromTempate("view.findAll",model.name+"View.findAll.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}
		]);

	generateFromTempate("view.edit",model.name+"View.edit.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}
		]);

	generateFromTempate("view.new",model.name+"View.new.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}
		]);

	generateFromTempate("view.delete",model.name+"View.delete.html","views",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]}
		]);

	generateForm(model);
	generateRecordView(model,headings);
}

var generateForm = function(model)
{
	var formData = "";
	var groups = {};

	for (var i = 0; i < model.fields.length; i++) {
		groups[model.fields[i].group] = groups[model.fields[i].group] || [];
		groups[model.fields[i].group].push(model.fields[i]);
	};
	
	for (var key in groups) {
		formData += "<div class='col s4'>\n\
		<div class='card blue-grey lighten-5'>\n\
			<div class='card-content grey-text text-darken-4'>\n\
			  <span class='card-title'>" + key + "</span>\n";

		for (var i = 0; i < groups[key].length; i++) {
			formData += "<input-field >\n";

			 switch(groups[key][i].type) {
			    case "text":
			        formData += "<input id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='text' >\n";
					formData += "<label for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "email":
			        formData += "<input id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='email'  class='validate'>\n";
					formData += "<label for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "textarea":
			        formData += "<textarea id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' class='materialize-textarea'></textarea>\n";
					formData += "<label for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "calculated":
			        formData += "<input id='"+groups[key][i].name+"' ng-change='" + generateCalculatedFn(model.name[0] +  ".obj.",groups[key][i].fn) + "' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='text'>\n";
					formData += "<label for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "result":
			        formData += "<input id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='text' disabled>\n";
					formData += "<label for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "img":
			        formData += "<div class='row'>\n";
			        formData += "	<div class='col s2'>\n";
			        formData += "		<img materialboxed class='materialboxed responsive-img' width='100%' alt='No Photo' src='data:{{" + model.name[0] +  ".obj." + groups[key][i].name + ".filetype}};base64,{{" + model.name[0] +  ".obj." + groups[key][i].name + ".base64}}'>\n";
					formData += "	</div>\n";
			        formData += "	<div class='col s10'>\n";
					formData += "		<label style='position: inherit;' for='"+groups[key][i].name+"'>"+groups[key][i].name+"{{Date()}}</label> </br/>\n"
			        formData += "		<input id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='file' base-sixty-four-input>\n";
					formData += "	</div>\n";
					formData += "</div></input-field>\n";
			        break;
			    case "file":
			        formData += "<div class='row'>\n";
				    formData += "  <div class='col s8'>\n";
				    formData += "    <span>"+groups[key][i].name+"</span>\n";
				    formData += "    <input type='file' file-model='"+model.name[0]+".files' multiple>\n";
				    formData += "    <p ng-repeat='file in " + model.name[0] +  ".obj." + groups[key][i].name + "' >{{file.filename}} | {{file.type}} | <a href='"+URL+"/"+model.name+"/download?fd={{file.fd}}' target='_blank'>Download</a></p>\n";
				    formData += "  </div>\n";
				    formData += "  <div class='col s4'>\n";
				    formData += "    <button ng-click = '"+model.name[0]+".uploadFiles(\"" + groups[key][i].name + "\")'>Upload files</button>\n";
				    formData += "  </div>\n";
				    formData += "</div>\n</input-field>\n";
			        break;
			    case "date":
			        formData += "<input type='date' id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "'>\n";
					formData += "<label class='active' for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>";
			        break;
			    case "range":
			        formData += "<div style='margin-top:50px;' class='range-field' ng-init='" + model.name[0] +  ".obj." + groups[key][i].name + " = " + model.name[0] +  ".obj." + groups[key][i].name + "||0'><input id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='range' min='"+groups[key][i].min+"' max='"+groups[key][i].max+"' ></div>\n";
					formData += "<label class='active' for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "boolean":
			        formData += "<input id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='checkbox'>\n";
					formData += "<label for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "fk":
			        formData += generateFkForm(groups[key][i].name,model.name,groups[key][i].inlineCreate);
					formData += "<label class='active' for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "number":
			        formData += "<input id='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' type='number' >\n";;
					formData += "<label for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "multiple":
			        formData += generateMultipleForm(groups[key][i].name,model.name,groups[key][i].inlineCreate);
					formData += "<label class='active' for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label> \n </input-field>"
			        break;
			    case "radio":
			        formData += "<label style='position: inherit;' for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label><div class='row' id='"+groups[key][i].name+"'>\n";
			    	for (var option in groups[key][i].options) {
			        	formData += "<div class='col s2'>\n";
						formData += "<input type='radio' name='"+groups[key][i].name+"' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name  + "."+options+ "' id='"+groups[key][i].name+"-"+option+"' /><label for='"+groups[key][i].name+"-"+option+"'>" + groups[key][i].options[option] + "</label>\n";
						formData += "</div>\n";
					}
					formData += "\n</div></input-field>\n"
			        break;
			    case "select":
			    	if (groups[key][i].multiple)
			    	{
			        	// formData += "<select class='browser-default' multiple style='' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' material-select >\n"
					        formData += "<label style='position: inherit;' for='"+groups[key][i].name+"'>"+groups[key][i].name+"</label><div class='row' id='"+groups[key][i].name+"' ng-init='" + model.name[0] +  ".obj." + groups[key][i].name + "=" + model.name[0] +  ".obj." + groups[key][i].name + "||{}'>\n";
					    	for (var option in groups[key][i].options) {
					        	formData += "<div class='col s3'>\n";
								formData += "<input type='checkbox' ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "."+option+"' id='"+groups[key][i].name+"-"+option+"' /><label for='"+groups[key][i].name+"-"+option+"'>" + groups[key][i].options[option] + "</label>\n";
								formData += "</div>\n";
							}
							formData += "\n</div></input-field>\n"
			    	}
				    else
				    {	
			        	formData += "<select ng-model='" + model.name[0] +  ".obj." + groups[key][i].name + "' material-select >\n"
					    formData += "<option value='' disabled selected>"+groups[key][i].name+"</option>\n";
					        for (var option in groups[key][i].options) {
					        	formData += "<option value='" + option + "'>" + groups[key][i].options[option] + "</option>\n";
					        };
				        formData += "</select>\n";
						formData += "</input-field>"
				    }
			        break;
			    default:
			        formData += "";
			}
		}
		formData += "</div>\n\
			</div>\n\
		</div>\n"

    };

	generateFromTempate("form",model.name+"Form.html","views/directives",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model.name},
			{field:"modelNameTitle",value:upcase(model.name)},
			{field:"modelNameAs",value:model.name[0]},
			{field:"formData",value:formData}
		]);
}

var generateMultipleForm = function(model,name,create)
{
	generateFromTempate("multipleDirective","multiple" + model + "" + name + "Directive.html","views/directives",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model}
		]);

	return "<div class='row' ng-controller='"+ model +"Controller.findAll as fkm_" + model[0] + "'><div multiple" + model + "" + name + "-form inline-create='"+create+"' save='save' create='fkm_"+model[0]+".create' headings='fkm_"+model[0]+".headings' selected='"+name[0]+".obj." + model + "' data='fkm_"+model[0]+".data' add='" + name[0] +  ".add" + "' remove='" + name[0] +  ".remove" + "' model='fkm_"+model[0]+".model'></div>\n</div>\n";
}

var generateFkForm = function(model,name,create)
{
	generateFromTempate("fkDirective","fk" + model + "" + name + "Directive.html","views/directives",
		[
			{field:"appName",value:appName},
			{field:"modelName",value:model},
			{field:"modelNameAs",value:model[0]}
		]);

	return "<div class='row' ng-controller='"+ model +"Controller.findAll as fk_" + model[0] + "'><div fk" + model + "" + name + "-form inline-create='"+create+"' save='save' create='fk_"+model[0]+".create' headings='fk_"+model[0]+".headings' data='fk_"+model[0]+".data' selected='"+name[0]+".obj." + model + "' ret='" + name[0] +  ".setReturnValue" + "' model='fk_"+model[0]+".model'></div>\n</div>\n";
}

var generateRecordView = function(model,headings)
{
	var groups = {};
	var resME = ""; // result multiple embedded Directive
	var res = ""; // result record view
	var resE = ""; // result embedded view

	
	for (var i = 0; i < model.fields.length; i++) {
		groups[model.fields[i].group] = groups[model.fields[i].group] || [];
		groups[model.fields[i].group].push(model.fields[i]);
	};

	resME += "<table><thead><tr>";
	for (var i = 0; i < headings.length; i++) {
		resME += "<td>"+headings[i]+"</td>";		
	};
	resME += "<td> </td>";		
	resME += "</tr></thead>";
	resME += "<tbody><tr ng-repeat='item in data'>";
	for (var i = 0; i < headings.length; i++) {
		resME += "<td>{{item['"+headings[i]+"']}}</td>";		
	};
	resME += "<td><a href='#/"+model.name+"/{{item.id}}'>View</a></td>";		
	resME += "</tr></tbody></table>";
	
	resE += "<ul class='collapsible popout' data-collapsible='accordion'>";
	
	for(var key in groups){
		res += "<div class='col s4'>\n\
		<div class='card blue-grey lighten-5'>\n\
			<div class='card-content grey-text text-darken-4'>\n\
			  <span class='card-title'>" + key + "</span>\n";


		resE += "<li><div class='collapsible-header'><i class='material-icons'>list</i> "+key+"</div><div class='collapsible-body'>";
	  	for (var i = 0; i < groups[key].length; i++) {

			switch(groups[key][i].type) {
			    case "text":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "textarea":
		  			res += "<p><b>" + groups[key][i].name + "</b>: <br/>{{" + model.name + "." + groups[key][i].name + "}}</p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: <br/>{{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "calculated":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "result":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "file":
		  			res += "<p><b>" + groups[key][i].name + "</b>:</p>\n";
		  			res += "<p ng-repeat='file in " + model.name +  "." + groups[key][i].name + "' >{{file.filename}} | {{file.type}} | <a href='"+URL+"/"+model.name+"/download?fd={{file.fd}}' target='_blank'>Download</a></p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>:</p>\n";
		  			resE += "<p ng-repeat='file in " + model.name +  "." + groups[key][i].name + "' >{{file.filename}} | {{file.type}} | <a href='"+URL+"/"+model.name+"/download?fd={{file.fd}}' target='_blank'>Download</a></p>\n";
			        break;
			    case "img":
		  			res += "<img materialboxed class='materialboxed responsive-img' width='10%' alt='No Photo' ng-src='data:{{" + model.name +  "." + groups[key][i].name + ".filetype}};base64,{{" + model.name +  "." + groups[key][i].name + ".base64}}'>\n";
		  			resE += "<img materialboxed class='materialboxed responsive-img' width='10%' alt='No Photo' ng-src='data:{{" + model.name +  "." + groups[key][i].name + ".filetype}};base64,{{" + model.name +  "." + groups[key][i].name + ".base64}}'>\n";
			        break;
			    case "date":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "range":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}<small>/"+groups[key][i].max+"</small></p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}<small>/"+groups[key][i].max+"</small></p>\n";
			        break;
			    case "boolean":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "fk":
		  			res += "<p><b>" + groups[key][i].name + "</b>: <a href='#/" + groups[key][i].name + "/{{" + model.name + "." + groups[key][i].name + ".id}}'>Goto " + groups[key][i].name + "</a></p>\n";
		  			res += "<div fk" +groups[key][i].name+"-embed-record " +groups[key][i].name+"='" + model.name + "." + groups[key][i].name + "'></div>\n";
			        break;
			    case "number":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
		  			resE += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "multiple":
		  			res += "<p><b>" + groups[key][i].name + "</b>:</p>\n";
		  			if (groups[key][i].chart)
		  			{
		  				console.log(groups[key][i].name,groups[key][i].chart)
		  				res += "<div fkm" +groups[key][i].name+"-multiple-embed-record data='" + model.name + "." + groups[key][i].name + "' chart='true' labels='fnl(" + model.name + "." + groups[key][i].name + ",\"" + groups[key][i].chart.label + "\")' values='fnv(" + model.name + "." + groups[key][i].name + ",\"" + groups[key][i].chart.value + "\")'></div>\n";
		  			}
		  			else
		  				res += "<div fkm" +groups[key][i].name+"-multiple-embed-record data='" + model.name + "." + groups[key][i].name + "'></div>\n";
			        break;
			    case "radio":
		  			res += "<p><b>" + groups[key][i].name + "</b>: {{" + model.name + "." + groups[key][i].name + "}}</p>\n";
			        break;
			    case "select":
			    	if (groups[key][i].multiple)
			    	{
		  				res += "<p><b>" + groups[key][i].name + "</b>:</p>\n";
			    		res += "<div class='chip' ng-repeat='(key,value) in "+ model.name + "." + groups[key][i].name + "' ng-show='value'>\n";
						res += "{{key}}";
						res += "</div>"
			    	}
			    	else
			    	{
		  				res += "<p><b>" + groups[key][i].name + "</b>: {{" + JSON.stringify(groups[key][i].options) + "[" + model.name + "." + groups[key][i].name + "]}}</p>\n";
			    	}
			        break;
			    default:
			        res += "";
			}
		};
		resE += "</div></li>";

	  	res += "			</div>\n\
			<div class='card-action'>\n\
			</div>\n\
		</div>\n\
	</div>\n"
    }
	resE += "</ul>";

	generateFromTempate("recordDirective",model.name + "Record.html","views/directives",
	[
		{field:"recordView",value:res},
		{field:"modelName",value:model.name},
		{field:"modelNameTitle",value:upcase(model.name)},
		{field:"modelNameAs",value:model.name[0]}
	]);
	generateFromTempate("recordEmbedDirective",model.name + "RecordEmbed.html","views/directives",
	[
		{field:"recordEmbedView",value:resE},
		{field:"modelName",value:model.name},
		{field:"modelNameTitle",value:upcase(model.name)},
		{field:"modelNameAs",value:model.name[0]}
	]);

	generateFromTempate("recordMultipleEmbedDirective",model.name + "RecordMultipleEmbed.html","views/directives",
	[
		{field:"recordEmbedMultipleView",value:resME},
		{field:"modelName",value:model.name},
		{field:"modelNameTitle",value:upcase(model.name)},
		{field:"modelNameAs",value:model.name[0]}
	]);
}

var generateMultipleDirective = function(model,name)
{  
	return ".directive('multiple" + model + "" + name + "Form', function() {\n\
			    return {\n\
			        scope: {\n\
			            'headings' : '=headings',\n\
			            'data' : '=data',\n\
			            'inlineCreate' : '=inlineCreate',\n\
			            'create' : '=create',\n\
			            'model' : '=model',\n\
			            'add' : '=add',\n\
			            'remove' : '=remove',\n\
			            'save' : '=save',\n\
			            'selected' : '=selected'\n\
			        },\n\
			        templateUrl : 'views/directives/multiple" + model + "" + name + "Directive.html'//,\n\
			        //link: function($scope, elem, attr, ctrl) {\n\
			        //    console.debug($scope);\n\
			        //    var textField = $('input', elem).attr('ng-model', 'result');\n\
			            // $compile(textField)($scope.$parent);\n\
			        //}\n\
			    };\n\
			})\n";
}

var generateCalculatedFn = function(modelCtl,fn)
{  
	return fn.join(" ").replace(new RegExp("##ctl##", "g"), modelCtl);
}

var generateFkDirective = function(model,name)
{  
	return ".directive('fk" + model + "" + name + "Form', function() {\n\
		    return {\n\
		        scope: {\n\
		            'headings' : '=headings',\n\
			        'inlineCreate' : '=inlineCreate',\n\
			        'create' : '=create',\n\
		            'data' : '=data',\n\
		            'model' : '=model',\n\
		            'ret' : '=ret',\n\
			        'save' : '=save',\n\
		            'selected' : '=selected'\n\
		        },\n\
		        templateUrl : 'views/directives/fk" + model + "" + name + "Directive.html',\n\
		        link: function($scope, elem, attr, ctrl) {\n\
		            console.debug($scope);\n\
		            var textField = $('input', elem).attr('ng-model', 'result');\n\
		            // $compile(textField)($scope.$parent);\n\
		        }\n\
		    };\n\
		})\n";
}

module.exports = {

	generate : function(conf)
	{
		appName = conf.name || "myGeneratedApp";

		try {fs.mkdirSync("./generated");} catch (e){}
		try {fs.mkdirSync("./generated/"+appName);} catch (e){}
		try {fs.mkdirSync("./generated/"+appName+"/controllers");} catch (e){}
		try {fs.mkdirSync("./generated/"+appName+"/server");} catch (e){}
		try {fs.mkdirSync("./generated/"+appName+"/server/api");} catch (e){}
		try {fs.mkdirSync("./generated/"+appName+"/server/api/controllers");} catch (e){}
		try {fs.mkdirSync("./generated/"+appName+"/server/api/models");} catch (e){}
		try {fs.mkdirSync("./generated/"+appName+"/views");} catch (e){}
		try {fs.mkdirSync("./generated/"+appName+"/views/directives");} catch (e){}

		generateApp(conf.models, conf.url || "http://localhost:1337");
	}

}
