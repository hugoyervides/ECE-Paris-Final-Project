//Clase Usuario para manejar las cuentas locales en memoria
export class User {
    //Declaracion de variables para almacenar los datos del usuario en la estructura
    public username: string
    public email: string
    private password: string = ""
    
    //Constructor con parametros para el objeto
    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
      this.username = username
      this.email = email
      //Ver si la contrasenia esta en HASH!!
      if (!passwordHashed) {
        this.setPassword(password)
      } else this.password = password
    }
    //Funcion para regresar un objeto de tipo usuario con parametros 
    static fromDb(username: string, value: any): User {
        console.log(value) //DEBUG
        //Regresar el objeto de tipo usuario con los datos que llegaron a la funcion
        return new User(username, value.email, value.password)
    }
    //Funcion para cambiar la contrasenia de usuario dentro de la memoria local
    public setPassword(toSet: string): void {
       // Hash and set password
       this.password = toSet
    }
    //Funcion para regresar la contrasenia del usuario almacenado en memoria
    public getPassword(): string {
        return this.password
    }
    //Funcion para validar el password de usuario
    public validatePassword(toValidate: String): boolean {
        return this.password === toValidate
    }
}
export class UserHandler {
    public db: any
    constructor(db: any) {
      this.db = db
    }
  
    public get(username: string, callback: (err: Error | null, result: User | null) => void) {
      const collection = this.db.collection('users')
      // Find some documents
      collection.findOne({username: username}, function(err: any, result: any) {
        if (err) return callback(err, result)
        if (result)
          callback(err, User.fromDb(username, result))
        else
          callback(err, null)
      })
    }
    public save(user: User, callback: (err: Error | null) => void) {
        const collection = this.db.collection('users')
        // Insert some document
        collection.insertOne(
          user,
          function(err: any, result: any) {
            if(err)
              return callback(err)
            console.log("User inserted into the collection")
            callback(err)
        });
    }
    //Declaracion de la funcion para eliminar usuario
    public deleteUser(user:User, callback: (err: Error | null) => void) {
      //ELiminar el usuario
      const collection = this.db.collection('users')
      collection.deleteOne(user, function(err:any, result:any) {
        if (err) 
          return callback(err);
        console.log("1 document deleted");
        callback(err)
      });
    }
  }