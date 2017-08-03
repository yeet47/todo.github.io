e = require('express');
bP = require('body-parser');
fs = require('fs')
nJ = require('nunjucks')

s = e()
s.use( bP.urlencoded( { extended: false } ) )

login = {yeet: 'teehee'}
data = { yeet: ['Troll', 'Watch WANO']}
acc = {yeet: {
  name: 'Yeet Teehee',
  avatar: 'https://image.spreadshirtmedia.com/image-server/v1/mp/compositions/P1001214668MPC1002119703/views/1,width=300,height=300,appearanceId=2,backgroundColor=E8E8E8,version=1485256808/yeet-t-shirts-men-s-t-shirt.jpg',
  disName: 'yeet47'
}}
secret = { yeet: 'alakazam' }
alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.!?'

function genSec() {
  s =''
  for (var i = 0; i < 50; i++) {
    randIndex = Math.floor(Math.random() * alphabet.length)
    s += alphabet.charAt(randIndex)
  }
  return s
}

function genUser (u) {
  t = fs.readFileSync(__dirname + '/html/account.html', 'utf-8')
  t = nJ.renderString( t, { u : u, list: data[u], acc: acc[u] } )
  return t
}

s.get('/user/:u', function (request, response) {
  u = request.params.u
  userSecret = request.query.secret

  if (login[u] == null) {
    response.redirect('/join')
  } else if (secret[u] != userSecret) {
    response.redirect('/login')
  } else {
    response.send(genUser(u))
  }
})

s.post('/add/:u', function(request, response) {
  u = request.params.u
  item = request.body.item
  userSecret = request.query.secret

  data[u].push(item)

  response.redirect('/user/' + u + '?secret=' + secret[u])
})

s.post('/remove/:u', function (request, response) {
  u = request.params.u
  index = request.body.index
  userSecret = request.query.secret

  data[u].splice(index, 1)
  if (userSecret != secret[u]) {
    //hacker
  }
  response.redirect('/user/' + u + '?secret=' + secret[u])
})

s.get('/login', function (request, response) {
  response.sendFile(__dirname + '/html/login.html')
})

s.get('/css/main.css', function (request, response) {
  response.sendFile(__dirname + '/css/main.css')
})

s.get('/css/favicon.ico', function (request, response) {
  response.sendFile(__dirname + '/css/favicon.ico')
})

s.post('/login', function (request, response) {
  u = request.body.username
  p = request.body.password

  if (login[u] == null){
    response.sendFile(__dirname + '/html/.wronglogin.html')
  }
  else if (login[u] != p) {
    response.sendFile(__dirname + '/html/wronglogin.html')
  }
  else {
    secret[u] = genSec()
    response.redirect('/user/' + u + '?secret=' + secret[u])
  }
})

s.get('/join', function (request, response) {
  response.sendFile(__dirname + '/html/join.html')
})

s.post('/join', function (request, response) {
  u = request.body.username
  p = request.body.password
  dN = request.body.disName

  if (login[u] != null) {
    response.sendFile(__dirname + '/html/wrongjoin.html')
  }
  else if (p.length < 6) {
    response.sendFile(__dirname + '/html/wrongjoin.html')
  } else {
    login[u] = p
    secret[u] = genSec()
    data[u] = []
    acc[u] = {
      name: u,
      avatar:'https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg',
      disName: dN
    }
    response.redirect('/user/' + u + '?secret=' + secret[u])
  }
})

s.listen(1111)
