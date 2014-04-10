/* 
* @Author: sergiovilar
* @Date:   2014-03-16 20:56:37
* @Last Modified by:   sergiovilar
* @Last Modified time: 2014-04-10 08:50:27
*/

var patch_url = 'fpatch.levelupgames.com.br';

var http = require('http');
var fs = require('fs');
var url = require('url');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var arquivo = fs.readFileSync('patch2.txt', 'utf-8');
var arr = arquivo.split('\n');

var JSFtp = require("jsftp");

var ftp = new JSFtp({
  host: patch_url,
});

var downloading = 0;
var download_limit = 1;

var i = 0;
function baixaArquivo(){	

	try{

		if(i < arr.length){

			console.log(arr.length, i);

			if (arr[i].substring(0, 2) !== "//") {
	    	
				var nomeArquivo = arr[i].replace(arr[i].substring(0, 5), '');
				var file_url = 'ftp://'+patch_url+'/patch/' + nomeArquivo;
				
				if(!fs.existsSync('download/' + nomeArquivo)){								

					if(downloading < (download_limit - 1)){	

						downloading++;		  		

				  		downloadViaFTp(nomeArquivo, function(){
				  			downloading--;	
				  		});	  	

				  		i++;
				    	baixaArquivo();

				  	}else{

				  		downloading++;

				  		downloadViaFTp(nomeArquivo, function(){

				  			downloading--;	
							i++;
							baixaArquivo();	 

				  		});

				  	}			  						

				}else{

					console.log('O arquivo '+nomeArquivo+' já existe, indo para o próximo...');

					i++;
					baixaArquivo();
				}

			}else{			
				i++;
				baixaArquivo();
			}

		}	

	}catch(e){
		console.log(e);
	}	

}

function downloadViaFTp(nomeArquivo, callback){

	console.log('Baixando '+nomeArquivo+'...');

	ftp.get('patch/' + nomeArquivo, 'download/' + nomeArquivo, function(hadErr) {

		if (hadErr){
			console.error('There was an error retrieving the file.');
		}else{
			console.log('File copied successfully!');
		}	

		if(callback){
			callback();
		}		   	
		
	});	

}

baixaArquivo();