const back = require('androidjs').back;
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const http = require('http');
const express = require('express');
const app = express();
const ygg = require('yggdrasil')({
	host: 'https://authserver.mojang.com'
});

app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*')
	next()
})
app.use(express.static('assets'))
app.listen(7080)

back.on('getInfo', function(data){
	fetch('https://api.wiresdev.ga/api/v2/random/minecraft?q='+data)
        .then(data11 => data11.json())
        .then(data1 => {
			http.get(data1.skin.skin, (res) => {
				const path = `${__dirname}/assets/skin.jpeg`; 
				const filePath = fs.createWriteStream(path);
				res.pipe(filePath);

				filePath.on('finish',() => {
					filePath.close();
					
					back.send('getInfo', JSON.stringify(data1));
				})
			})
		})
})

back.on('page', function(data){
	console.log(data)
})

back.on('ver', function(data){
	console.log('Version: '+data)
})

back.on('login', function(data){
	let info = JSON.parse(data)

	ygg.auth({
		agent: 'Minecraft',
		version: 1, //Agent version. Defaults to 1
		user: info.username, //Username
		pass: info.password, //Password
		requestUser: false
	}).then(
		(response) => {
			back.send('login', JSON.stringify(response))
		},
		(error) => {
			console.log(error)
			back.send('loginError', 'Wrong Username')
		}
	);
})