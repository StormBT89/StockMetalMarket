import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {

  res.render("index.ejs");
});

app.get("/zlato", async (req, res) => {
  
  const urlZlato = 'https://live-metal-prices.p.rapidapi.com/v1/latest/XAU,XAU_14K,XAU_18K,XAU_21K/' + 'USD';
  const options = {
    method: 'GET',
    url: urlZlato,
    headers: {
      'x-rapidapi-key': 'bb3da88764mshf081f4165d556fcp1b245cjsn049e1dc2a71d',
      'x-rapidapi-host': 'live-metal-prices.p.rapidapi.com'
    }
  
  };
  
  
  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.render("zlato.ejs",
                { contentZ: JSON.stringify(response.data.rates.XAU),
                  content14: JSON.stringify(response.data.rates.XAU_14K),
                  content18: JSON.stringify(response.data.rates.XAU_18K),
                  content21: JSON.stringify(response.data.rates.XAU_21K),
                }
    );
  } catch (error) {
    console.error(error);
  }

  
  
    
});

app.post("/peceTest", async (req, res) => {
  console.log(req.body.metal);
  console.log(req.body.currencies);
  
  const userMetal =req.body.metal;
  const userCurrency = req.body.currencies;
  console.log(userMetal);
  console.log(userCurrency);

  const url = 'https://live-metal-prices.p.rapidapi.com/v1/latest/' +  userMetal  +"," + userCurrency;
  console.log(url);

  const options = {
    method: 'GET',
    url: url,
    headers: {
      'x-rapidapi-key': 'bb3da88764mshf081f4165d556fcp1b245cjsn049e1dc2a71d',
      'x-rapidapi-host': 'live-metal-prices.p.rapidapi.com'
    }
    };
  
    
  try {
    const response = await axios.request(options);
    console.log(response.data);
    const valueCurr = JSON.stringify(response.data.rates[userCurrency]);
    const mValue = JSON.stringify(response.data.rates[userMetal]);
    console.log(valueCurr);
    console.log(mValue);

    const marketValue =  valueCurr * mValue ;
    res.render("prices.ejs",
                {  userMetal: userMetal,
                   userChoiceMetal: mValue,
                 //  userChoiceMetal: JSON.stringify(response.data.rates[userMetal]),
                  metalMarketValue: marketValue,

                }
    );
  } catch (error) {
    console.error(error);
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
