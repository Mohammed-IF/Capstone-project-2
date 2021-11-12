/*
File to hold the important data like API keys, data base connections,
facebook authentication fields, port number

"exports" make this file exportable so that the fields in thus file 
can be used in other files

secret and facebook attributes to store the authentication details of facebook
*/


module.exports=
{
  host: 'localhost',
  database:'mongodb+srv://Mohammed_IF:M123456d@cluster0.xtkng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  https: true,
  port:5000,
  open: true,
  secretKey: 'abc123',
  facebook: 
  {
    clientID: '305914588041405',
    clientSecret: '1eb4130ee74bc7f86fa7ee636326f632',
    profileFields: ['emails', 'displayName'],
    callbackURL: 'https://localhost:5000/auth/facebook/callback',
    passReqToCallback: true,  //sending request to call back
  }
}