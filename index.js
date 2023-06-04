const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp-273.15);
  temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min-273.15);
  temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max-273.15);
  temperature = temperature.replace("{%location%}",orgVal.name);
  temperature = temperature.replace("{%country%}",orgVal.sys.country);
  temperature= temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
  return temperature;
}


const server = http.createServer((req, res) => {

 if(req.url == "/"){
    requests("https://api.openweathermap.org/data/2.5/weather?q=Sunabeda&appid=8c58db71f91303a45d252bf8762de71a")


    .on('data',  (chunk) => {
      // const objData =JSON.parse(chunk);
      // const arrData =[objData];
      const arrData=[JSON.parse(chunk)];
      // console.log(arrData[0].main.temp);
      
      // const realTimeData = arrData.map((val) =>{
      //   replaceVal(homeFile, val);

         // console.log(val.main);
      // }).join("");
      // .join is to convert it into string
      const realTimeData = arrData.map(val =>replaceVal(homeFile,val)).join("");

      res.write(realTimeData);
    })


    .on('end', (err) => {
      if (err) return console.log('connection closed due to errors', err);
   
      // console.log('end');
      res.end();
    });
 }


 else{
  res.end("404 File Not Found");
 }
})

server.listen(8000, "127.0.0.1");