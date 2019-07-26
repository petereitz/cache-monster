// ---SETUP---
// config

// web request wrangling
const axios = require('axios');



// ---FUNCTIONS---
// grab a unix timestamp
var getNow = function() {
  return Math.floor(Date.now() / 1000);
};

// process an web request and return the response
var makeRequest = function(config){
  return new Promise((resolve, reject)=>{
    const self = this;
    try {
      // make the request
      axios(config)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    } catch(err) {
      reject(err);
    }
  });
}


// ---PUBLIC ITEMS---
class CACHE {
  constructor(requestConfig, resultEval, evalFailMessage, refreshTimeout=false){
    try{
      // props
      this.ready = false;
      this.requestConfig = requestConfig;
      this.refreshTimeout = refreshTimeout;
      this.data = false;
      this.evalFailMessage = evalFailMessage;

      // check that resultEval is actually a function and force true otherwise
      if (typeof resultEval === "function"){
        this.resultEval = resultEval;
      } else {
        this.resultEval = function(){return true};
      }

      // go
      this.fetchSource(this.requestConfig)
      .then(() => {})
      .catch(err => {throw new Error(err)})

      // timer
      if(this.refreshTimeout){
        const self = this
        setInterval(function(){
          self.fetchSource(self.requestConfig)
          .then(() => {})
          .catch(err => {throw new Error(err)})
        }, self.refreshTimeout);
      }

    }catch(err){
      throw new Error(err);
    }
  }

  fetchSource(){
    return new Promise((resolve, reject)=>{
      const self = this;
      try {
        makeRequest(self.requestConfig)
        .then(result => {
          
          if(self.resultEval(result)){
            if(self.data){
              delete self.data;
            }
            self.data = result;
            self.lastUpdate = getNow();
            self.ready = true;
          }else{
            console.log(self.evalFailMessage);
          }
          resolve();
        })
        .catch(err => reject(err))
      }catch(err){
        reject(err);
      }
    });
  }

}



// ---EXPORT---
module.exports = CACHE;
