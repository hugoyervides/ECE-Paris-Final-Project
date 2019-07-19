import express = require('express')
import session = require('express-session')
import ConnectMongo = require('connect-mongo')
import { UserHandler, User } from './user'
import { Metric, MetricsHandler} from './metrics'

//Declarcion de variables constantes
const mongodb = require('mongodb')
const MongoStore = ConnectMongo(session) //Declaracion de la conexion con MongoDB
const MongoClient = mongodb.MongoClient // Create a new MongoClient
const app = express() //Decirle a NodeJS usar Express
const port: string = process.env.PORT || '8080' //DEFINIR PUERTO!!
const path = require('path')
var bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Configurar los views para el front end
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))
//Configuracion de la app para usar la ruta de usuarios
//Inciar la base de datos
var db: any
var dbUser: any

//Conectarse a la base de datos
MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if(err) throw err
  db = client.db('mydb')
  dbUser = new UserHandler(db)
});

//Configuracion de la app para usar sessiones
app.use(session({
  secret: 'user session',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: 'mongodb://localhost/mydb' })
}))

//Declaracion de las rutas para login y registro

const authRouter = express.Router()
authRouter.get('/login', function (req: any, res: any) {
  res.render('login')
})

authRouter.get('/signup', function (req: any, res: any) {
  res.render('signup')
})

authRouter.get('/logout', function (req: any, res: any) {
  if (req.session.loggedIn) {
    delete req.session.loggedIn
    delete req.session.user
  }
  res.redirect('/login')
})
//Ruta LOGIN con datos POST
authRouter.post('/login', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result === null || !result.validatePassword(req.body.password)) {
      console.log('login')
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})
//Ruta para el registro con datos POST
authRouter.post('/signup', function(req: any, res: any, next:any){
  //Obtener los datos POST para conseguir los datos del usuario y crear un nuevo usuario
  var newUser: User = new User(req.body.username, req.body.email, req.body.password)
  //metemos el usuario en la base de datos
  dbUser.save(newUser, function (err: Error | null){
    if (err) next(err)
    //Desplegar log de succes
    console.log('User Reg Success')
    res.redirect('/logout')
  })
})

app.use(authRouter)
//Declaracion de la ruta principal

const userRouter = express.Router()
userRouter.post('/', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result) {
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("user persisted")
      })
    }
  })
})
//Declaracion de la ruta con usuario
userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result: User | null) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result).username
  })
})
//Declarar la ruta para eliminar usuario
userRouter.delete('/delete', (req: any, res:any, next: any) => {
  //Cargar la base de datos
  dbUser.deleteUser(req.parms, function(err: Error | null, result: any){
    if(err) next(err)
    else{
      res.status(200).json(result)
    }
  })
})
app.use(userRouter)
//Declaracion de la ruta para las metricas
const metricsRouter = express.Router()
//Ruta para consguir las metricas
metricsRouter.get('/metrics/:user', (req: any, res:any, next:any)=>{
  var userMetrics = new MetricsHandler(db)
  userMetrics.findDocument( {'username.username' : req.params.user },(err: any, result: any) => {
    if (err)
      return res.status(500).json({error: err, result: result});
    res.status(201).json(result)
  })
})
//Ruta para insertar informacion en la base de datos MongoDB
metricsRouter.post('/metrics', (req: any, res: any) => {
  if(req.body){
    var outJSON=req.body
    outJSON['username']=req.session.user
    new MetricsHandler(db).save(outJSON, (err: any, result: any) => {
      if (err)
        return res.status(500).json({error: err, result: result});
      res.status(201).json({error: err, result: true})
    })
  }else{
    return res.status(400).json({error: 'Wrong request parameter',});
  }
})
//Ruta para eliminar las metricas de un usuario
metricsRouter.delete('/metrics', (req: any, res:any) => {
  console.log("SESIONSADNSAKJDAS")
  console.log( req.session.user)
  new MetricsHandler(db).deleteDocument({username: req.session.user}, (err:any, result:any) => {
  if (err)
    return res.status(500).json({error: err, result: result});
  res.status(201).json({error: err, result: true})
  })
})
//Agregar las rutas a la app
app.use(metricsRouter)

//Funcion para ver si esta logeado el usuario
const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}
app.get('/', authCheck, (req: any, res: any) => {
  res.render('metrics.ejs', {name: req.session.user.username})
})
//Configuracion de puerto en la APP
app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  //Confirmar puerto en consola <3
  console.log(`server is listening on port ${port}`)
})


